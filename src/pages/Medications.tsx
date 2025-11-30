import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Card } from "@/components/base/Card";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { Plus, X, Lock } from "lucide-react";
import { toast } from "sonner";

interface Medication {
  id: string;
  name: string;
  cycle: string;
  description: string;
}

export default function Medications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  const canEdit = user?.role === "doctor";

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const data = await api.medications.index();
      setMedications(data);
    } finally {
      setIsLoading(false);
    }
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      { id: Date.now().toString(), name: "", cycle: "", description: "" },
    ]);
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const updateMedication = (
    id: string,
    field: "name" | "cycle" | "description",
    value: string
  ) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const handleSave = async () => {
    if (!canEdit) return;

    setIsSaving(true);
    try {
      for (const medication of medications) {
        if (medication.name) {
          if (medication.id.startsWith(Date.now().toString().slice(0, 10))) {
            await api.medications.store(medication);
          } else {
            await api.medications.update(medication.id, medication);
          }
        }
      }
      toast.success(isRTL ? "داروها ذخیره شدند" : "Medications saved");
      await loadMedications();
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout requireAuth requireWatch>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse-soft text-muted-foreground">
            {t("common.loading")}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout requireAuth requireWatch>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("medications.title")}</h1>
          <p className="text-muted-foreground">
            {canEdit
              ? isRTL
                ? "مدیریت داروهای مالک ساعت"
                : "Manage watch owner medications"
              : t("medications.viewOnly")}
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          <div className="space-y-6">
            {!canEdit && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-muted-foreground text-sm">
                <Lock size={16} />
                <span>{t("medications.doctorOnly")}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {isRTL ? "لیست داروها" : "Medications List"}
                </h3>
                {canEdit && (
                  <Button
                    onClick={addMedication}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Plus size={16} />
                    {t("medications.addMedication")}
                  </Button>
                )}
              </div>

              {medications.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {isRTL
                    ? "هنوز دارویی اضافه نشده است"
                    : "No medications added yet"}
                </p>
              )}

              <div className="space-y-4">
                {medications.map((medication) => (
                  <Card key={medication.id} variant="flat" padding="default">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <Input
                            placeholder={t("medications.medicationName")}
                            value={medication.name}
                            onChange={(e) =>
                              updateMedication(
                                medication.id,
                                "name",
                                e.target.value
                              )
                            }
                            disabled={!canEdit}
                          />
                          <Input
                            type="number"
                            placeholder={t("medications.cycle")}
                            value={medication.cycle}
                            onChange={(e) =>
                              updateMedication(
                                medication.id,
                                "cycle",
                                e.target.value
                              )
                            }
                            disabled={!canEdit}
                          />
                          <Input
                            placeholder={t("medications.description")}
                            value={medication.description}
                            onChange={(e) =>
                              updateMedication(
                                medication.id,
                                "description",
                                e.target.value
                              )
                            }
                            disabled={!canEdit}
                          />
                        </div>
                        {canEdit && (
                          <Button
                            onClick={() => removeMedication(medication.id)}
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <X size={18} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {canEdit && (
              <Button
                onClick={handleSave}
                disabled={isSaving || medications.length === 0}
                size="lg"
                className="w-full"
              >
                {isSaving ? t("common.loading") : t("profile.save")}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
