import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";
import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { Bell, CheckCircle, AlertTriangle, Heart, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Notification {
  id: string;
  type: "fall" | "response" | "follow_up" | "high_heart_rate" | "medication_reminder";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.notifications.index();
      setNotifications(data);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "fall":
        return <AlertTriangle className="w-5 h-5" />;
      case "high_heart_rate":
        return <Heart className="w-5 h-5" />;
      case "follow_up":
        return <UserCheck className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return "border-border";
    switch (type) {
      case "fall":
      case "high_heart_rate":
        return "border-health-critical/50 bg-health-critical/5";
      case "response":
        return "border-health-good/50 bg-health-good/5";
      case "follow_up":
        return "border-primary/50 bg-primary/5";
      default:
        return "border-border";
    }
  };

  if (isLoading) {
    return (
      <AppLayout requireAuth requireWatch>
        <div className="space-y-6">
          <Skeleton height={36} width={200} />
          <Skeleton height={20} width={150} />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={100} />
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout requireAuth requireWatch>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("notifications.title")}</h1>
          <p className="text-muted-foreground">
            {isRTL ? "اعلان‌های شما" : "Your notifications"}
          </p>
        </div>

        {notifications.length === 0 ? (
          <Card variant="elevated" padding="lg">
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isRTL ? "هیچ اعلانی وجود ندارد" : "No notifications"}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                variant="flat"
                padding="default"
                className={cn(
                  "border-2 transition-all cursor-pointer hover:shadow-md",
                  getNotificationColor(notification.type, notification.isRead),
                  !notification.isRead && "animate-scale-in"
                )}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-full",
                      notification.type === "fall" || notification.type === "high_heart_rate"
                        ? "bg-health-critical/10 text-health-critical"
                        : notification.type === "response"
                        ? "bg-health-good/10 text-health-good"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.isRead && (
                        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleString(
                          isRTL ? "fa-IR" : "en-US"
                        )}
                      </p>
                      {notification.actionRequired && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            {t("notifications.yes")}
                          </Button>
                          <Button size="sm" variant="outline">
                            {t("notifications.no")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {notification.isRead && (
                    <CheckCircle className="w-5 h-5 text-health-good" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
