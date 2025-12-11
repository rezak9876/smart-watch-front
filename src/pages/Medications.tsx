import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuthStore } from "@/store/authStore";
import { useAbilityStore } from "@/store/abilityStore";
import { api } from "@/lib/api";
import { Plus, Edit2, Trash2, Lock, Pill } from "lucide-react";
import { toast } from "sonner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Medication {
  id: string;
  name: string;
  description: string;
}

export default function Medications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { ability } = useAbilityStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "fa";
  const canEdit = ability.can("manage", "Medication") || user?.role === "doctor";

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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.medications.destroy(deleteId);
      setMedications(medications.filter((med) => med.id !== deleteId));
      toast.success(isRTL ? "دارو حذف شد" : "Medication deleted");
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <AppLayout requireAuth requireWatch>
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton height={40} width={200} />
          <Skeleton height={80} count={3} className="mb-4" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout requireAuth requireWatch>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("medications.title")}</h1>
            <p className="text-muted-foreground">
              {canEdit
                ? isRTL ? "مدیریت داروها" : "Manage medications"
                : t("medications.viewOnly")}
            </p>
          </div>
          {canEdit && (
            <Button onClick={() => navigate("/medications/create")} className="gap-2">
              <Plus size={18} />
              {t("medications.addMedication")}
            </Button>
          )}
        </div>

        {!canEdit && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-muted-foreground text-sm">
            <Lock size={16} />
            <span>{t("medications.doctorOnly")}</span>
          </div>
        )}

        {medications.length === 0 ? (
          <Card variant="elevated" padding="lg">
            <div className="text-center py-8">
              <Pill className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {isRTL ? "هنوز دارویی اضافه نشده است" : "No medications added yet"}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {medications.map((medication) => (
              <Card key={medication.id} variant="elevated" padding="default">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{medication.name}</p>
                    {medication.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {medication.description}
                      </p>
                    )}
                  </div>
                  {canEdit && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/medications/edit/${medication.id}`)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(medication.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? "حذف دارو" : "Delete Medication"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL
                ? "آیا مطمئن هستید؟ این عمل قابل بازگشت نیست."
                : "Are you sure? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
