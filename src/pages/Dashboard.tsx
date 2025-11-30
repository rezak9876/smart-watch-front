import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/base/Card";
import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { Heart, Droplets, Battery, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";
import { useAuthStore } from "@/store/authStore";

interface HealthData {
  heartRate: { value: number; status: string };
  bloodOxygen: { value: number; status: string };
  battery: { value: number; status: string };
  gps: { status: string };
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, completeTour } = useAuthStore();
  const [runTour, setRunTour] = useState(!user?.hasCompletedTour);
  const isRTL = i18n.language === "fa";

  useEffect(() => {
    loadHealthData();
    const interval = setInterval(loadHealthData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadHealthData = async () => {
    try {
      const data = await api.health.index();
      setHealthData(data);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "health-excellent";
      case "good":
        return "health-good";
      case "warning":
        return "health-warning";
      case "critical":
        return "health-critical";
      default:
        return "muted";
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`dashboard.status${status.charAt(0).toUpperCase() + status.slice(1)}`);
  };

  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">{t("tour.welcome")}</h2>
          <p>{t("tour.welcomeDesc")}</p>
        </div>
      ),
      placement: "center",
    },
    {
      target: ".health-cards",
      content: (
        <div>
          <h3 className="font-semibold mb-2">{t("tour.dashboardStep")}</h3>
          <p>{t("tour.dashboardDesc")}</p>
        </div>
      ),
    },
    {
      target: "nav",
      content: (
        <div>
          <h3 className="font-semibold mb-2">{t("tour.menuStep")}</h3>
          <p>{t("tour.menuDesc")}</p>
        </div>
      ),
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      completeTour();
      setRunTour(false);
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
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: "hsl(var(--primary))",
            textColor: "hsl(var(--foreground))",
            backgroundColor: "hsl(var(--card))",
            zIndex: 1000,
          },
        }}
        locale={{
          back: t("common.back"),
          close: t("common.done"),
          last: t("common.done"),
          next: t("common.next"),
          skip: t("common.skip"),
        }}
      />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground">
            {isRTL
              ? "وضعیت سلامتی در یک نگاه"
              : "Health status at a glance"}
          </p>
        </div>

        <div className="health-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Heart Rate Card */}
          <Card variant="elevated" padding="default" className="group hover:scale-105 transition-transform">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    `bg-${getStatusColor(healthData?.heartRate.status || "good")}/10`
                  )}
                >
                  <Heart
                    className={cn(
                      "w-6 h-6",
                      `text-${getStatusColor(healthData?.heartRate.status || "good")}`
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    `bg-${getStatusColor(healthData?.heartRate.status || "good")}/10`,
                    `text-${getStatusColor(healthData?.heartRate.status || "good")}`
                  )}
                >
                  {getStatusLabel(healthData?.heartRate.status || "good")}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("dashboard.heartRate")}
                </h3>
                <p className="text-3xl font-bold">
                  {healthData?.heartRate.value}
                  <span className="text-sm text-muted-foreground ms-1">
                    {t("dashboard.bpm")}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Blood Oxygen Card */}
          <Card variant="elevated" padding="default" className="group hover:scale-105 transition-transform">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    `bg-${getStatusColor(healthData?.bloodOxygen.status || "excellent")}/10`
                  )}
                >
                  <Droplets
                    className={cn(
                      "w-6 h-6",
                      `text-${getStatusColor(healthData?.bloodOxygen.status || "excellent")}`
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    `bg-${getStatusColor(healthData?.bloodOxygen.status || "excellent")}/10`,
                    `text-${getStatusColor(healthData?.bloodOxygen.status || "excellent")}`
                  )}
                >
                  {getStatusLabel(healthData?.bloodOxygen.status || "excellent")}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("dashboard.bloodOxygen")}
                </h3>
                <p className="text-3xl font-bold">
                  {healthData?.bloodOxygen.value}
                  <span className="text-sm text-muted-foreground ms-1">%</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Battery Card */}
          <Card variant="elevated" padding="default" className="group hover:scale-105 transition-transform">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    `bg-${getStatusColor(healthData?.battery.status || "good")}/10`
                  )}
                >
                  <Battery
                    className={cn(
                      "w-6 h-6",
                      `text-${getStatusColor(healthData?.battery.status || "good")}`
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    `bg-${getStatusColor(healthData?.battery.status || "good")}/10`,
                    `text-${getStatusColor(healthData?.battery.status || "good")}`
                  )}
                >
                  {getStatusLabel(healthData?.battery.status || "good")}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("dashboard.battery")}
                </h3>
                <p className="text-3xl font-bold">
                  {healthData?.battery.value}
                  <span className="text-sm text-muted-foreground ms-1">%</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* GPS Card */}
          <Card variant="elevated" padding="default" className="group hover:scale-105 transition-transform">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    `bg-${healthData?.gps.status === "active" ? "health-good" : "muted"}/10`
                  )}
                >
                  <MapPin
                    className={cn(
                      "w-6 h-6",
                      `text-${healthData?.gps.status === "active" ? "health-good" : "muted"}`
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    healthData?.gps.status === "active"
                      ? "bg-health-good/10 text-health-good"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {healthData?.gps.status === "active"
                    ? t("dashboard.active")
                    : t("dashboard.inactive")}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("dashboard.gps")}
                </h3>
                <p className="text-2xl font-bold">
                  {healthData?.gps.status === "active"
                    ? t("dashboard.active")
                    : t("dashboard.inactive")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
