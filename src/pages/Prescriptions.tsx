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

interface PrescriptionItem {
  medication_id: string;
  medication_name: string;
  cycle_hours: number;
  total_count?: number;
  remaining_count?: number;
}

interface Prescription {
  id: string;
  created_at: string;
  items: PrescriptionItem[];
}

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { ability } = useAbilityStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "fa";
  const canEdit = ability.can("manage", "Prescription") || user?.role === "doctor";

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      const data = await api.prescriptions.index();
      setPrescriptions(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.prescriptions.destroy(deleteId);
      setPrescriptions(prescriptions.filter((p) => p.id !== deleteId));
      toast.success(isRTL ? "نسخه حذف شد" : "Prescription deleted");
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
          <Skeleton height={120} count={3} className="mb-4" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout requireAuth requireWatch>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {isRTL ? "نسخه‌ها" : "Prescriptions"}
            </h1>
            <p className="text-muted-foreground">
              {canEdit
                ? isRTL ? "مدیریت نسخه‌های بیمار" : "Manage patient prescriptions"
                : isRTL ? "مشاهده نسخه‌های تجویز شده" : "View prescribed medications"}
            </p>
          </div>
          {canEdit && (
            <Button onClick={() => navigate("/prescriptions/create")} className="gap-2">
              <Plus size={18} />
              {isRTL ? "نسخه جدید" : "New Prescription"}
            </Button>
          )}
        </div>

        {!canEdit && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-muted-foreground text-sm">
            <Lock size={16} />
            <span>{t("medications.doctorOnly")}</span>
          </div>
        )}

        {prescriptions.length === 0 ? (
          <Card variant="elevated" padding="lg">
            <div className="text-center py-8">
              <Pill className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {isRTL ? "هنوز نسخه‌ای ثبت نشده است" : "No prescriptions yet"}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <Card key={prescription.id} variant="elevated" padding="default">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(prescription.created_at).toLocaleDateString(
                        isRTL ? "fa-IR" : "en-US"
                      )}
                    </span>
                    {canEdit && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/prescriptions/edit/${prescription.id}`)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteId(prescription.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {prescription.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.medication_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {isRTL
                              ? `هر ${item.cycle_hours} ساعت`
                              : `Every ${item.cycle_hours} hours`}
                            {item.total_count && (
                              <span>
                                {" • "}
                                {isRTL
                                  ? `${item.remaining_count || item.total_count} از ${item.total_count} باقی‌مانده`
                                  : `${item.remaining_count || item.total_count}/${item.total_count} remaining`}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
              {isRTL ? "حذف نسخه" : "Delete Prescription"}
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
