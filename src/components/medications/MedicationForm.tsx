import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Card } from "@/components/base/Card";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface MedicationFormProps {
  medicationId?: string;
  isEdit?: boolean;
}

export function MedicationForm({ medicationId, isEdit = false }: MedicationFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "fa";
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (isEdit && medicationId) {
      loadMedication();
    }
  }, [medicationId, isEdit]);

  const loadMedication = async () => {
    try {
      const data = await api.medications.show(medicationId!);
      setName(data.name);
      setDescription(data.description || "");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(isRTL ? "نام دارو الزامی است" : "Medication name is required");
      return;
    }

    setIsSaving(true);
    try {
      if (isEdit && medicationId) {
        await api.medications.update(medicationId, { name, description });
        toast.success(isRTL ? "دارو به‌روزرسانی شد" : "Medication updated");
      } else {
        await api.medications.store({ name, description });
        toast.success(isRTL ? "دارو اضافه شد" : "Medication added");
      }
      navigate("/medications");
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton height={40} width={200} />
        <Card variant="elevated" padding="lg">
          <div className="space-y-4">
            <Skeleton height={48} />
            <Skeleton height={96} />
            <Skeleton height={48} />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/medications")}>
          <BackIcon size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit
              ? isRTL ? "ویرایش دارو" : "Edit Medication"
              : isRTL ? "افزودن دارو" : "Add Medication"}
          </h1>
        </div>
      </div>

      <Card variant="elevated" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("medications.medicationName")} *
              </label>
              <Input
                placeholder={t("medications.medicationName")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("medications.description")}
              </label>
              <textarea
                className="w-full min-h-[100px] px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder={t("medications.description")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/medications")}
              className="flex-1"
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving ? t("common.loading") : t("profile.save")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
