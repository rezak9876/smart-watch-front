import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Card } from "@/components/base/Card";
import { toast } from "sonner";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export interface CaregiverFormData {
  firstName: string;
  lastName: string;
  mobile: string;
  role: "doctor" | "nurse" | "family";
}

interface CaregiverFormProps {
  initialData?: CaregiverFormData;
  isLoading?: boolean;
  isSaving?: boolean;
  onSubmit: (data: CaregiverFormData) => Promise<void>;
  onCancel: () => void;
}

export const CaregiverForm = ({
  initialData,
  isLoading = false,
  isSaving = false,
  onSubmit,
  onCancel,
}: CaregiverFormProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  const [firstName, setFirstName] = useState(initialData?.firstName || "");
  const [lastName, setLastName] = useState(initialData?.lastName || "");
  const [mobile, setMobile] = useState(initialData?.mobile || "");
  const [role, setRole] = useState<"doctor" | "nurse" | "family">(
    initialData?.role || "family"
  );

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setMobile(initialData.mobile);
      setRole(initialData.role);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error(isRTL ? "لطفا نام و نام خانوادگی را وارد کنید" : "Please enter first and last name");
      return;
    }
    if (!mobile) {
      toast.error(isRTL ? "لطفا شماره موبایل را وارد کنید" : "Please enter mobile number");
      return;
    }

    await onSubmit({ firstName, lastName, mobile, role });
  };

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="space-y-6">
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Skeleton height={50} />
          <div className="flex gap-3">
            <Skeleton height={45} containerClassName="flex-1" />
            <Skeleton height={45} containerClassName="flex-1" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg">
      <div className="space-y-6">
        <Input
          label={t("profile.firstName")}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={isRTL ? "نام" : "First Name"}
        />

        <Input
          label={t("profile.lastName")}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder={isRTL ? "نام خانوادگی" : "Last Name"}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {isRTL ? "شماره موبایل" : "Mobile Number"}
          </label>
          <div dir="ltr">
            <PhoneInput
              international
              defaultCountry="IR"
              value={mobile}
              onChange={(value) => setMobile(value || "")}
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm [&_.PhoneInputCountry]:me-2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {isRTL ? "نقش" : "Role"}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["doctor", "nurse", "family"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  role === r
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {t(`caregivers.${r}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            {t("caregivers.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            size="lg"
            className="flex-1"
          >
            {isSaving ? t("common.loading") : t("profile.save")}
          </Button>
        </div>
      </div>
    </Card>
  );
};
