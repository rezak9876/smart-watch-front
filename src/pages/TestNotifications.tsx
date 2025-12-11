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
  Stethoscope,
  Users,
  User,
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
type RecipientType = "elder" | "doctor" | "caregiver";

interface NotificationConfig {
  type: NotificationType;
  icon: React.ReactNode;
  color: string;
  title: { fa: string; en: string };
  message: { fa: string; en: string };
  actions?: { fa: string; en: string }[];
}

const elderNotifications: NotificationConfig[] = [
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
    message: { fa: "ضربان قلب شما به ۱۲۰ رسیده است. آیا حالتان خوب است؟", en: "Your heart rate has reached 120 BPM. Are you okay?" },
    actions: [
      { fa: "خوبم", en: "I'm fine" },
      { fa: "کمک می‌خواهم", en: "Need help" },
    ],
  },
  {
    type: "blood_oxygen",
    icon: <Droplets size={24} />,
    color: "text-health-warning",
    title: { fa: "اکسیژن خون پایین", en: "Low Blood Oxygen" },
    message: { fa: "اکسیژن خون شما به ۹۲٪ رسیده است", en: "Your blood oxygen has dropped to 92%" },
  },
  {
    type: "battery",
    icon: <Battery size={24} />,
    color: "text-health-warning",
    title: { fa: "باتری کم", en: "Low Battery" },
    message: { fa: "باتری ساعت شما ۱۵٪ است. لطفا شارژ کنید.", en: "Your watch battery is at 15%. Please charge it." },
  },
];

const doctorNotifications: NotificationConfig[] = [
  {
    type: "fall",
    icon: <AlertTriangle size={24} />,
    color: "text-health-critical",
    title: { fa: "سقوط بیمار", en: "Patient Fall" },
    message: { fa: "بیمار علی احمدی سقوط کرده و هنوز پاسخ نداده است", en: "Patient Ali Ahmadi has fallen and hasn't responded yet" },
    actions: [
      { fa: "پیگیری می‌کنم", en: "I'll follow up" },
    ],
  },
  {
    type: "heart_rate",
    icon: <Heart size={24} />,
    color: "text-health-critical",
    title: { fa: "ضربان قلب خطرناک", en: "Dangerous Heart Rate" },
    message: { fa: "ضربان قلب بیمار علی احمدی به ۱۵۰ رسیده است", en: "Patient Ali Ahmadi's heart rate has reached 150 BPM" },
  },
  {
    type: "response",
    icon: <UserCheck size={24} />,
    color: "text-health-good",
    title: { fa: "پاسخ بیمار", en: "Patient Response" },
    message: { fa: "بیمار علی احمدی پاسخ داد: خوبم، زمین نخوردم", en: "Patient Ali Ahmadi responded: I'm fine, didn't fall" },
  },
  {
    type: "no_response",
    icon: <Clock size={24} />,
    color: "text-health-critical",
    title: { fa: "عدم پاسخ بیمار", en: "No Patient Response" },
    message: { fa: "بیمار علی احمدی به اعلان سقوط پاسخ نداده است (۵ دقیقه)", en: "Patient Ali Ahmadi hasn't responded to fall alert (5 min)" },
    actions: [
      { fa: "تماس می‌گیرم", en: "I'll call" },
      { fa: "اورژانس", en: "Emergency" },
    ],
  },
];

const caregiverNotifications: NotificationConfig[] = [
  {
    type: "fall",
    icon: <AlertTriangle size={24} />,
    color: "text-health-critical",
    title: { fa: "سقوط سالمند", en: "Elder Fall" },
    message: { fa: "پدربزرگ سقوط کرده و هنوز پاسخ نداده است", en: "Grandfather has fallen and hasn't responded yet" },
    actions: [
      { fa: "پیگیری می‌کنم", en: "I'll follow up" },
    ],
  },
  {
    type: "gps",
    icon: <MapPin size={24} />,
    color: "text-health-warning",
    title: { fa: "خروج از محدوده امن", en: "Left Safe Zone" },
    message: { fa: "پدربزرگ از محدوده خانه خارج شده است", en: "Grandfather has left the home area" },
  },
  {
    type: "followup",
    icon: <Bell size={24} />,
    color: "text-primary",
    title: { fa: "پیگیری دکتر", en: "Doctor Follow-up" },
    message: { fa: "دکتر رضایی وضعیت پدربزرگ را پیگیری کرد", en: "Dr. Rezaei followed up on grandfather's condition" },
  },
  {
    type: "battery",
    icon: <Battery size={24} />,
    color: "text-health-warning",
    title: { fa: "باتری کم ساعت", en: "Watch Low Battery" },
    message: { fa: "باتری ساعت پدربزرگ ۱۰٪ است", en: "Grandfather's watch battery is at 10%" },
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

  const NotificationGroup = ({
    title,
    icon,
    notifications,
    bgColor,
  }: {
    title: string;
    icon: React.ReactNode;
    notifications: NotificationConfig[];
    bgColor: string;
  }) => (
    <Card variant="elevated" padding="lg" className="space-y-4">
      <div className={`flex items-center gap-3 p-3 rounded-xl ${bgColor}`}>
        {icon}
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {notifications.map((config) => (
          <Button
            key={config.type}
            variant="outline"
            className="h-auto py-3 justify-start gap-3 text-start"
            onClick={() => showNotification(config)}
          >
            <div className={config.color}>{config.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{isRTL ? config.title.fa : config.title.en}</p>
              <p className="text-xs text-muted-foreground truncate">
                {isRTL ? config.message.fa : config.message.en}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
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

        <NotificationGroup
          title={isRTL ? "اعلان‌های سالمند (صاحب ساعت)" : "Elder Notifications (Watch Owner)"}
          icon={<User size={20} />}
          notifications={elderNotifications}
          bgColor="bg-blue-500/10 text-blue-600"
        />

        <NotificationGroup
          title={isRTL ? "اعلان‌های پزشک" : "Doctor Notifications"}
          icon={<Stethoscope size={20} />}
          notifications={doctorNotifications}
          bgColor="bg-green-500/10 text-green-600"
        />

        <NotificationGroup
          title={isRTL ? "اعلان‌های مراقب" : "Caregiver Notifications"}
          icon={<Users size={20} />}
          notifications={caregiverNotifications}
          bgColor="bg-purple-500/10 text-purple-600"
        />

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
