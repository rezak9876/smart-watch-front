import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/layout/AppLayout";
import { CaregiverForm, CaregiverFormData } from "@/components/caregivers/CaregiverForm";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/base/Button";

export default function CaregiverEdit() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [caregiver, setCaregiver] = useState<CaregiverFormData | null>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (id) {
      loadCaregiver();
    }
  }, [id]);

  const loadCaregiver = async () => {
    try {
      const data = await api.caregivers.show(id!);
      setCaregiver(data);
    } catch (error) {
      toast.error(t("common.error"));
      navigate("/caregivers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: CaregiverFormData) => {
    setIsSaving(true);
    try {
      await api.caregivers.update(id!, data);
      toast.success(isRTL ? "مراقب بروزرسانی شد" : "Caregiver updated");
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
            <h1 className="text-3xl font-bold">
              {isRTL ? "ویرایش مراقب" : "Edit Caregiver"}
            </h1>
            <p className="text-muted-foreground">
              {isRTL ? "اطلاعات مراقب را ویرایش کنید" : "Edit caregiver information"}
            </p>
          </div>
        </div>

        <CaregiverForm
          initialData={caregiver || undefined}
          isLoading={isLoading}
          isSaving={isSaving}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/caregivers")}
        />
      </div>
    </AppLayout>
  );
}
