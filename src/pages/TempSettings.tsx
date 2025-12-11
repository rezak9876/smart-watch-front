import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/base/Card";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuthStore } from "@/store/authStore";
import { useAbilityStore } from "@/store/abilityStore";
import { getRolePermissions, Permission, Subjects, Actions } from "@/lib/ability";
import { Check, User, Stethoscope, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type RoleType = "doctor" | "elder" | "caregiver" | "custom";

interface PermissionOption {
  action: Actions;
  subject: Subjects;
  label: { fa: string; en: string };
}

const allPermissions: PermissionOption[] = [
  { action: "read", subject: "Medication", label: { fa: "مشاهده داروها", en: "View Medications" } },
  { action: "manage", subject: "Medication", label: { fa: "مدیریت داروها", en: "Manage Medications" } },
  { action: "read", subject: "Prescription", label: { fa: "مشاهده نسخه‌ها", en: "View Prescriptions" } },
  { action: "manage", subject: "Prescription", label: { fa: "مدیریت نسخه‌ها", en: "Manage Prescriptions" } },
  { action: "read", subject: "Consumption", label: { fa: "مشاهده مصرف دارو", en: "View Consumption" } },
  { action: "manage", subject: "Consumption", label: { fa: "ثبت مصرف دارو", en: "Manage Consumption" } },
  { action: "read", subject: "Notification", label: { fa: "مشاهده اعلان‌ها", en: "View Notifications" } },
  { action: "manage", subject: "Notification", label: { fa: "مدیریت اعلان‌ها", en: "Manage Notifications" } },
  { action: "read", subject: "Caregiver", label: { fa: "مشاهده مراقبین", en: "View Caregivers" } },
  { action: "manage", subject: "Caregiver", label: { fa: "مدیریت مراقبین", en: "Manage Caregivers" } },
  { action: "read", subject: "WatchOwnerInfo", label: { fa: "مشاهده اطلاعات مالک", en: "View Owner Info" } },
  { action: "manage", subject: "WatchOwnerInfo", label: { fa: "مدیریت اطلاعات مالک", en: "Manage Owner Info" } },
];

const getPermissionKey = (perm: Permission) => `${perm.action}:${perm.subject}`;

export default function TempSettings() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  const { setupStatus, updateSetupStatus, user } = useAuthStore();
  const { setPermissions } = useAbilityStore();

  const [selectedRole, setSelectedRole] = useState<RoleType>(
    (user?.role as RoleType) || "elder"
  );
  const [customPermissions, setCustomPermissions] = useState<Permission[]>([]);
  const [localSetupStatus, setLocalSetupStatus] = useState(setupStatus);

  useEffect(() => {
    setLocalSetupStatus(setupStatus);
  }, [setupStatus]);

  const roles: { key: RoleType; label: { fa: string; en: string }; icon: React.ReactNode }[] = [
    { key: "doctor", label: { fa: "پزشک", en: "Doctor" }, icon: <Stethoscope size={20} /> },
    { key: "elder", label: { fa: "سالمند (صاحب ساعت)", en: "Watch Owner (Elder)" }, icon: <User size={20} /> },
    { key: "caregiver", label: { fa: "مراقب", en: "Caregiver" }, icon: <Users size={20} /> },
    { key: "custom", label: { fa: "سفارشی", en: "Custom" }, icon: <Settings size={20} /> },
  ];

  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    if (role !== "custom") {
      const permissions = getRolePermissions(role === "caregiver" ? "family" : role);
      setPermissions(permissions);
      toast.success(isRTL ? `نقش به ${roles.find(r => r.key === role)?.label.fa} تغییر کرد` : `Role changed to ${role}`);
    } else {
      setCustomPermissions([]);
      setPermissions([]);
    }
  };

  const isPermissionSelected = (perm: PermissionOption) => {
    return customPermissions.some(
      p => p.action === perm.action && p.subject === perm.subject
    );
  };

  const togglePermission = (perm: PermissionOption) => {
    const exists = isPermissionSelected(perm);
    let newPermissions: Permission[];
    
    if (exists) {
      newPermissions = customPermissions.filter(
        p => !(p.action === perm.action && p.subject === perm.subject)
      );
    } else {
      newPermissions = [...customPermissions, { action: perm.action, subject: perm.subject }];
    }
    
    setCustomPermissions(newPermissions);
    setPermissions(newPermissions);
  };

  const handleSetupStatusChange = (key: keyof typeof setupStatus, value: boolean) => {
    const newStatus = { ...localSetupStatus, [key]: value };
    setLocalSetupStatus(newStatus);
    updateSetupStatus(newStatus);
    toast.success(isRTL ? "وضعیت به‌روزرسانی شد" : "Status updated");
  };

  const setupStatusItems: { key: keyof typeof setupStatus; label: { fa: string; en: string } }[] = [
    { key: "profile_completed", label: { fa: "پروفایل تکمیل شده", en: "Profile Completed" } },
    { key: "watch_paired", label: { fa: "ساعت متصل شده", en: "Watch Paired" } },
    { key: "owner_info_completed", label: { fa: "اطلاعات مالک ساعت تکمیل شده", en: "Owner Info Completed" } },
    { key: "medications_set", label: { fa: "داروها ثبت شده", en: "Medications Set" } },
  ];

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isRTL ? "تنظیمات موقت" : "Temporary Settings"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL
              ? "این صفحه برای تست و توسعه است. تنظیمات را تغییر دهید تا سایت را در حالت‌های مختلف ببینید."
              : "This page is for testing and development. Change settings to view the site in different states."}
          </p>
        </div>

        {/* Role Selection */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-lg font-semibold mb-4">
            {isRTL ? "انتخاب نقش" : "Select Role"}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => handleRoleChange(role.key)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-start",
                  selectedRole === role.key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                {role.icon}
                <span className="font-medium">{isRTL ? role.label.fa : role.label.en}</span>
                {selectedRole === role.key && (
                  <Check size={16} className="ms-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Custom Permissions */}
          {selectedRole === "custom" && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-medium mb-4">
                {isRTL ? "دسترسی‌های سفارشی" : "Custom Permissions"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allPermissions.map((perm, idx) => (
                  <label
                    key={idx}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      isPermissionSelected(perm)
                        ? "bg-primary/10"
                        : "bg-muted/30 hover:bg-muted/50"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isPermissionSelected(perm)}
                      onChange={() => togglePermission(perm)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm">
                      {isRTL ? perm.label.fa : perm.label.en}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Setup Status */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-lg font-semibold mb-4">
            {isRTL ? "وضعیت مراحل راه‌اندازی" : "Setup Stage Status"}
          </h2>
          <div className="space-y-3">
            {setupStatusItems.map((item) => (
              <label
                key={item.key}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors border",
                  localSetupStatus[item.key]
                    ? "bg-health-good/10 border-health-good/30"
                    : "bg-muted/30 border-border"
                )}
              >
                <span className="font-medium">
                  {isRTL ? item.label.fa : item.label.en}
                </span>
                <input
                  type="checkbox"
                  checked={localSetupStatus[item.key]}
                  onChange={(e) => handleSetupStatusChange(item.key, e.target.checked)}
                  className="w-5 h-5 rounded border-border text-health-good focus:ring-health-good"
                />
              </label>
            ))}
          </div>
        </Card>

        <Card variant="flat" padding="default">
          <p className="text-sm text-muted-foreground">
            {isRTL
              ? "توجه: این تنظیمات فقط در session فعلی اعمال می‌شوند و با refresh صفحه ریست می‌شوند."
              : "Note: These settings only apply to the current session and will reset on page refresh."}
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}