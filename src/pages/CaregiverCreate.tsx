import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/layout/AppLayout";
import { CaregiverForm, CaregiverFormData } from "@/components/caregivers/CaregiverForm";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/base/Button";

export default function CaregiverCreate() {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const handleSubmit = async (data: CaregiverFormData) => {
    setIsSaving(true);
    try {
      await api.caregivers.store(data);
      toast.success(isRTL ? "مراقب اضافه شد" : "Caregiver added");
      navigate("/caregivers");
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout requireAuth requireWatch>
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/caregivers")}
          >
            <BackIcon size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t("caregivers.addCaregiver")}</h1>
            <p className="text-muted-foreground">
              {isRTL ? "اطلاعات مراقب جدید را وارد کنید" : "Enter new caregiver information"}
            </p>
          </div>
        </div>

        <CaregiverForm
          isSaving={isSaving}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/caregivers")}
        />
      </div>
    </AppLayout>
  );
}
