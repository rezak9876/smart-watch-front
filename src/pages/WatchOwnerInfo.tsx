import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Card } from "@/components/base/Card";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Plus, X } from "lucide-react";

interface Illness {
  id: string;
  name: string;
  description: string;
}

export default function WatchOwnerInfo() {
  const [birthYear, setBirthYear] = useState("");
  const [illnesses, setIllnesses] = useState<Illness[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  const addIllness = () => {
    setIllnesses([
      ...illnesses,
      { id: Date.now().toString(), name: "", description: "" },
    ]);
  };

  const removeIllness = (id: string) => {
    setIllnesses(illnesses.filter((illness) => illness.id !== id));
  };

  const updateIllness = (id: string, field: "name" | "description", value: string) => {
    setIllnesses(
      illnesses.map((illness) =>
        illness.id === id ? { ...illness, [field]: value } : illness
      )
    );
  };

  const handleSave = async () => {
    if (!birthYear) {
      toast.error(t("auth.requiredField"));
      return;
    }

    setIsLoading(true);
    try {
      for (const illness of illnesses) {
        if (illness.name) {
          await api.illnesses.store(illness);
        }
      }
      toast.success(isRTL ? "اطلاعات ذخیره شد" : "Information saved");
      navigate("/dashboard");
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout requireAuth requireWatch>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("watchOwner.title")}</h1>
          <p className="text-muted-foreground">
            {isRTL
              ? "اطلاعات مالک ساعت را وارد کنید"
              : "Enter watch owner information"}
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          <div className="space-y-6">
            <Input
              type="number"
              label={t("watchOwner.birthYear")}
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="1350"
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t("watchOwner.illnesses")}</h3>
                <Button
                  onClick={addIllness}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Plus size={16} />
                  {t("watchOwner.addIllness")}
                </Button>
              </div>

              {illnesses.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {isRTL
                    ? "هنوز بیماری‌ای اضافه نشده است"
                    : "No illnesses added yet"}
                </p>
              )}

              <div className="space-y-4">
                {illnesses.map((illness) => (
                  <Card key={illness.id} variant="flat" padding="default">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <Input
                            placeholder={t("watchOwner.illnessName")}
                            value={illness.name}
                            onChange={(e) =>
                              updateIllness(illness.id, "name", e.target.value)
                            }
                          />
                          <Input
                            placeholder={t("watchOwner.illnessDescription")}
                            value={illness.description}
                            onChange={(e) =>
                              updateIllness(illness.id, "description", e.target.value)
                            }
                          />
                        </div>
                        <Button
                          onClick={() => removeIllness(illness.id)}
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <X size={18} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={isLoading || !birthYear}
              size="lg"
              className="w-full"
            >
              {isLoading ? t("common.loading") : t("profile.save")}
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
