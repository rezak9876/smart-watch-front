import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Card } from "@/components/base/Card";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Plus, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface PrescriptionItem {
  id: string;
  medication_id: string;
  cycle_hours: number;
  total_count?: number;
}

interface Medication {
  id: string;
  name: string;
}

interface PrescriptionFormProps {
  prescriptionId?: string;
  isEdit?: boolean;
}

export function PrescriptionForm({ prescriptionId, isEdit = false }: PrescriptionFormProps) {
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "fa";
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    loadData();
  }, [prescriptionId, isEdit]);

  const loadData = async () => {
    try {
      const medsData = await api.medications.index();
      setMedications(medsData);
      
      if (isEdit && prescriptionId) {
        const prescription = await api.prescriptions.show(prescriptionId);
        setItems(prescription.items || []);
      } else {
        setItems([{ id: Date.now().toString(), medication_id: "", cycle_hours: 8 }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), medication_id: "", cycle_hours: 8 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof PrescriptionItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validItems = items.filter((item) => item.medication_id && item.cycle_hours > 0);
    if (validItems.length === 0) {
      toast.error(isRTL ? "حداقل یک دارو اضافه کنید" : "Add at least one medication");
      return;
    }

    setIsSaving(true);
    try {
      if (isEdit && prescriptionId) {
        await api.prescriptions.update(prescriptionId, { items: validItems });
        toast.success(isRTL ? "نسخه به‌روزرسانی شد" : "Prescription updated");
      } else {
        await api.prescriptions.store({ items: validItems });
        toast.success(isRTL ? "نسخه ثبت شد" : "Prescription created");
      }
      navigate("/prescriptions");
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
            <Skeleton height={80} />
            <Skeleton height={80} />
            <Skeleton height={48} />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/prescriptions")}>
          <BackIcon size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit
              ? isRTL ? "ویرایش نسخه" : "Edit Prescription"
              : isRTL ? "ثبت نسخه جدید" : "New Prescription"}
          </h1>
        </div>
      </div>

      <Card variant="elevated" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {isRTL ? "داروهای نسخه" : "Prescription Items"}
            </h3>
            <Button type="button" onClick={addItem} variant="outline" size="sm" className="gap-2">
              <Plus size={16} />
              {isRTL ? "افزودن دارو" : "Add Medication"}
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <Card key={item.id} variant="flat" padding="default">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {isRTL ? `دارو ${index + 1}` : `Medication ${index + 1}`}
                    </span>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <X size={18} />
                      </Button>
                    )}
                  </div>

                  <select
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={item.medication_id}
                    onChange={(e) => updateItem(item.id, "medication_id", e.target.value)}
                    required
                  >
                    <option value="">{isRTL ? "انتخاب دارو..." : "Select medication..."}</option>
                    {medications.map((med) => (
                      <option key={med.id} value={med.id}>
                        {med.name}
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        {isRTL ? "هر چند ساعت؟" : "Every X hours"}
                      </label>
                      <Input
                        type="number"
                        min={1}
                        placeholder={isRTL ? "مثلاً 8" : "e.g. 8"}
                        value={item.cycle_hours || ""}
                        onChange={(e) => updateItem(item.id, "cycle_hours", parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        {isRTL ? "تعداد کل (اختیاری)" : "Total count (optional)"}
                      </label>
                      <Input
                        type="number"
                        min={1}
                        placeholder={isRTL ? "مثلاً 30" : "e.g. 30"}
                        value={item.total_count || ""}
                        onChange={(e) => updateItem(item.id, "total_count", parseInt(e.target.value) || undefined)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/prescriptions")}
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
