import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/base/Card";
import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { Heart, Droplets, Battery, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";
import { useAuthStore } from "@/store/authStore";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface HealthData {
  heartRate: { value: number; status: string };
  bloodOxygen: { value: number; status: string };
  battery: { value: number; status: string };
  gps: { status: string };
}

const statusColorMap: Record<string, string> = {
  excellent: "text-health-good bg-health-good/10",
  good: "text-health-good bg-health-good/10",
  warning: "text-health-warning bg-health-warning/10",
  critical: "text-health-critical bg-health-critical/10",
  active: "text-health-good bg-health-good/10",
  inactive: "text-muted-foreground bg-muted",
};

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

  const healthCards = [
    {
      key: "heartRate",
      icon: Heart,
      label: t("dashboard.heartRate"),
      value: healthData?.heartRate.value,
      unit: t("dashboard.bpm"),
      status: healthData?.heartRate.status || "good",
    },
    {
      key: "bloodOxygen",
      icon: Droplets,
      label: t("dashboard.bloodOxygen"),
      value: healthData?.bloodOxygen.value,
      unit: "%",
      status: healthData?.bloodOxygen.status || "excellent",
    },
    {
      key: "battery",
      icon: Battery,
      label: t("dashboard.battery"),
      value: healthData?.battery.value,
      unit: "%",
      status: healthData?.battery.status || "good",
    },
    {
      key: "gps",
      icon: MapPin,
      label: t("dashboard.gps"),
      value: healthData?.gps.status === "active" ? t("dashboard.active") : t("dashboard.inactive"),
      unit: "",
      status: healthData?.gps.status || "inactive",
    },
  ];

  if (isLoading) {
    return (
      <AppLayout requireAuth requireWatch>
        <div className="space-y-6">
          <div>
            <Skeleton height={36} width={200} />
            <Skeleton height={20} width={300} className="mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={160} className="rounded-xl" />
            ))}
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
            {isRTL ? "وضعیت سلامتی در یک نگاه" : "Health status at a glance"}
          </p>
        </div>

        <div className="health-cards grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {healthCards.map((card) => {
            const Icon = card.icon;
            const colorClasses = statusColorMap[card.status] || statusColorMap.inactive;
            const [textColor, bgColor] = colorClasses.split(" ");

            return (
              <Card
                key={card.key}
                variant="elevated"
                padding="default"
                className="group hover:scale-[1.02] transition-transform border border-border"
              >
                <CardContent className="p-0">
                  {/* Mobile Layout */}
                  <div className="flex flex-col items-center text-center space-y-2 md:hidden p-2">
                    <div className={cn("p-2.5 rounded-xl", bgColor)}>
                      <Icon className={cn("w-5 h-5", textColor)} />
                    </div>
                    <h3 className="text-xs font-medium text-muted-foreground">
                      {card.label}
                    </h3>
                    <p className="text-xl font-bold leading-tight">
                      {card.value}
                      {card.unit && (
                        <span className="text-[10px] text-muted-foreground ms-0.5">{card.unit}</span>
                      )}
                    </p>
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", colorClasses)}>
                      {getStatusLabel(card.status)}
                    </span>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:block space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={cn("p-3 rounded-xl", bgColor)}>
                        <Icon className={cn("w-6 h-6", textColor)} />
                      </div>
                      <span className={cn("text-xs font-medium px-2 py-1 rounded-full", colorClasses)}>
                        {getStatusLabel(card.status)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        {card.label}
                      </h3>
                      <p className="text-3xl font-bold">
                        {card.value}
                        {card.unit && (
                          <span className="text-sm text-muted-foreground ms-1">{card.unit}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
