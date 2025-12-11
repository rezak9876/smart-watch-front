import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Card } from "@/components/base/Card";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { User, Camera } from "lucide-react";

export default function Profile() {
  const { user, updateUser, setupStatus, updateSetupStatus, getNextSetupStep } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(!setupStatus.profile_completed);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const isRTL = i18n.language === "fa";
  const isSetupMode = !setupStatus.profile_completed;

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error(isRTL ? "نام و نام خانوادگی الزامی است" : "First name and last name are required");
      return;
    }

    setIsLoading(true);
    try {
      await api.users.update(user!.id, formData);
      updateUser(formData);
      
      if (isSetupMode) {
        updateSetupStatus({ profile_completed: true });
        toast.success(isRTL ? "پروفایل تکمیل شد" : "Profile completed");
        navigate(getNextSetupStep());
      } else {
        toast.success(isRTL ? "تغییرات ذخیره شد" : "Changes saved");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout requireAuth>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("profile.title")}</h1>
          <p className="text-muted-foreground">
            {isSetupMode
              ? isRTL ? "لطفاً اطلاعات خود را تکمیل کنید" : "Please complete your information"
              : isRTL ? "مدیریت اطلاعات شخصی" : "Manage your personal information"}
          </p>
        </div>

        {isSetupMode && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary text-sm">
            <span className="font-medium">
              {isRTL ? "مرحله ۱ از ۳: تکمیل پروفایل" : "Step 1 of 3: Complete Profile"}
            </span>
          </div>
        )}

        <Card variant="elevated" padding="lg">
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <button className="absolute bottom-0 end-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                  <Camera size={16} />
                </button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{user?.mobile}</p>
            </div>

            <div className="space-y-4">
              <Input
                label={t("profile.firstName")}
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={!isEditing && !isSetupMode}
                required
              />

              <Input
                label={t("profile.lastName")}
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={!isEditing && !isSetupMode}
                required
              />
            </div>

            <div className="flex gap-3">
              {isEditing || isSetupMode ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading
                      ? t("common.loading")
                      : isSetupMode
                        ? isRTL ? "ادامه" : "Continue"
                        : t("profile.save")}
                  </Button>
                  {!isSetupMode && (
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          firstName: user?.firstName || "",
                          lastName: user?.lastName || "",
                        });
                      }}
                      variant="outline"
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {t("common.cancel")}
                    </Button>
                  )}
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  {t("profile.editProfile")}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
