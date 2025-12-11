import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "sonner";
import {
  AlertTriangle,
  Heart,
  Droplets,
  Battery,
  MapPin,
  Bell,
  UserCheck,
  Clock,
} from "lucide-react";
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

type NotificationType = "fall" | "heart_rate" | "blood_oxygen" | "battery" | "gps" | "response" | "no_response" | "followup";

interface NotificationConfig {
  type: NotificationType;
  icon: React.ReactNode;
  color: string;
  title: { fa: string; en: string };
  message: { fa: string; en: string };
  actions?: { fa: string; en: string }[];
}

const notificationConfigs: NotificationConfig[] = [
  {
    type: "fall",
    icon: <AlertTriangle size={24} />,
    color: "text-health-critical",
    title: { fa: "سقوط", en: "Fall Detected" },
    message: { fa: "آیا زمین خوردید؟", en: "Did you fall?" },
    actions: [
      { fa: "بله", en: "Yes" },
      { fa: "خیر", en: "No" },
    ],
  },
  {
    type: "heart_rate",
    icon: <Heart size={24} />,
    color: "text-health-critical",
    title: { fa: "ضربان قلب بالا", en: "High Heart Rate" },
    message: { fa: "ضربان قلب به ۱۲۰ رسیده است", en: "Heart rate has reached 120 BPM" },
  },
  {
    type: "blood_oxygen",
    icon: <Droplets size={24} />,
    color: "text-health-warning",
    title: { fa: "اکسیژن خون پایین", en: "Low Blood Oxygen" },
    message: { fa: "اکسیژن خون به ۹۲٪ رسیده است", en: "Blood oxygen has dropped to 92%" },
  },
  {
    type: "battery",
    icon: <Battery size={24} />,
    color: "text-health-warning",
    title: { fa: "باتری کم", en: "Low Battery" },
    message: { fa: "باتری ساعت ۱۵٪ است", en: "Watch battery is at 15%" },
  },
  {
    type: "gps",
    icon: <MapPin size={24} />,
    color: "text-health-warning",
    title: { fa: "خروج از محدوده", en: "Out of Range" },
    message: { fa: "کاربر از محدوده امن خارج شده است", en: "User has left the safe zone" },
  },
  {
    type: "response",
    icon: <UserCheck size={24} />,
    color: "text-health-good",
    title: { fa: "پاسخ کاربر", en: "User Response" },
    message: { fa: "کاربر پاسخ داد: من حالم خوب است", en: "User responded: I am fine" },
  },
  {
    type: "no_response",
    icon: <Clock size={24} />,
    color: "text-health-critical",
    title: { fa: "عدم پاسخ", en: "No Response" },
    message: { fa: "کاربر به اعلان سقوط پاسخ نداده است", en: "User has not responded to fall notification" },
  },
  {
    type: "followup",
    icon: <Bell size={24} />,
    color: "text-primary",
    title: { fa: "پیگیری", en: "Follow-up" },
    message: { fa: "دکتر احمدی پیگیری کرد", en: "Dr. Ahmadi followed up" },
  },
];

export default function TestNotifications() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  const [activeNotification, setActiveNotification] = useState<NotificationConfig | null>(null);

  const showNotification = (config: NotificationConfig) => {
    if (config.actions) {
      setActiveNotification(config);
    } else {
      toast(
        <div className="flex items-center gap-3">
          <div className={config.color}>{config.icon}</div>
          <div>
            <p className="font-semibold">{isRTL ? config.title.fa : config.title.en}</p>
            <p className="text-sm text-muted-foreground">
              {isRTL ? config.message.fa : config.message.en}
            </p>
          </div>
        </div>,
        {
          duration: 5000,
        }
      );
    }
  };

  const handleAction = (action: string) => {
    toast.success(isRTL ? `پاسخ شما: ${action}` : `Your response: ${action}`);
    setActiveNotification(null);
  };

  return (
    <AppLayout requireAuth>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isRTL ? "تست اعلان‌ها" : "Test Notifications"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL
              ? "برای تست هر نوع اعلان روی دکمه مربوطه کلیک کنید"
              : "Click on each button to test different notification types"}
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notificationConfigs.map((config) => (
              <Button
                key={config.type}
                variant="outline"
                className="h-auto py-4 justify-start gap-4"
                onClick={() => showNotification(config)}
              >
                <div className={config.color}>{config.icon}</div>
                <div className="text-start">
                  <p className="font-semibold">{isRTL ? config.title.fa : config.title.en}</p>
                  <p className="text-xs text-muted-foreground">
                    {isRTL ? config.message.fa : config.message.en}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </Card>

        <Card variant="flat" padding="default">
          <p className="text-sm text-muted-foreground">
            {isRTL
              ? "توجه: این صفحه فقط برای تست اعلان‌ها است. در نسخه نهایی، اعلان‌ها از سرور ارسال می‌شوند."
              : "Note: This page is for testing notifications only. In production, notifications will be sent from the server."}
          </p>
        </Card>
      </div>

      <AlertDialog open={!!activeNotification} onOpenChange={() => setActiveNotification(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={activeNotification?.color}>{activeNotification?.icon}</div>
              <AlertDialogTitle>
                {isRTL ? activeNotification?.title.fa : activeNotification?.title.en}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {isRTL ? activeNotification?.message.fa : activeNotification?.message.en}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {activeNotification?.actions?.map((action, idx) => (
              <AlertDialogAction
                key={idx}
                onClick={() => handleAction(isRTL ? action.fa : action.en)}
                className={idx === 0 ? "bg-destructive text-destructive-foreground" : ""}
              >
                {isRTL ? action.fa : action.en}
              </AlertDialogAction>
            ))}
            <AlertDialogCancel>{isRTL ? "بستن" : "Close"}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
