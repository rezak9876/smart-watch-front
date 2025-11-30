import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";
import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { Plus, Edit, Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Caregiver {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  role: "doctor" | "nurse" | "family";
}

export default function Caregivers() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "fa";

  useEffect(() => {
    loadCaregivers();
  }, []);

  const loadCaregivers = async () => {
    try {
      const data = await api.caregivers.index();
      setCaregivers(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.caregivers.destroy(id);
      setCaregivers(caregivers.filter((c) => c.id !== id));
      toast.success(isRTL ? "مراقب حذف شد" : "Caregiver deleted");
      setDeleteId(null);
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const getRoleLabel = (role: string) => {
    return t(`caregivers.${role}`);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-health-excellent/10 text-health-excellent";
      case "nurse":
        return "bg-health-good/10 text-health-good";
      case "family":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("caregivers.title")}</h1>
            <p className="text-muted-foreground">
              {isRTL ? "مدیریت مراقبین" : "Manage caregivers"}
            </p>
          </div>
          <Button
            onClick={() => navigate("/caregivers/create")}
            className="gap-2"
          >
            <Plus size={18} />
            {t("caregivers.addCaregiver")}
          </Button>
        </div>

        {caregivers.length === 0 ? (
          <Card variant="elevated" padding="lg">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {isRTL
                  ? "هنوز مراقبی اضافه نشده است"
                  : "No caregivers added yet"}
              </p>
              <Button
                onClick={() => navigate("/caregivers/create")}
                variant="outline"
              >
                <Plus size={18} className={isRTL ? "ms-2" : "me-2"} />
                {t("caregivers.addCaregiver")}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {caregivers.map((caregiver) => (
              <Card
                key={caregiver.id}
                variant="elevated"
                padding="default"
                className="group hover:scale-105 transition-transform"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {caregiver.firstName} {caregiver.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground" dir="ltr">
                        {caregiver.mobile}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleBadgeColor(
                        caregiver.role
                      )}`}
                    >
                      {getRoleLabel(caregiver.role)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/chat/${caregiver.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                    >
                      <MessageCircle size={16} />
                      {t("caregivers.chat")}
                    </Button>
                    <Button
                      onClick={() => navigate(`/caregivers/edit/${caregiver.id}`)}
                      variant="ghost"
                      size="icon"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      onClick={() => setDeleteId(caregiver.id)}
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteId && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card variant="elevated" padding="lg" className="max-w-md w-full">
              <h3 className="text-xl font-semibold mb-2">
                {t("caregivers.confirmDelete")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isRTL
                  ? "این عمل قابل بازگشت نیست."
                  : "This action cannot be undone."}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setDeleteId(null)}
                  variant="outline"
                  className="flex-1"
                >
                  {t("caregivers.cancel")}
                </Button>
                <Button
                  onClick={() => deleteId && handleDelete(deleteId)}
                  variant="destructive"
                  className="flex-1"
                >
                  {t("caregivers.delete")}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
