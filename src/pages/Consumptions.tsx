import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuthStore } from "@/store/authStore";
import { useAbilityStore } from "@/store/abilityStore";
import { api } from "@/lib/api";
import { Check, X, Clock, Calendar, History, BarChart3, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ScheduleItem {
  id: string;
  prescription_item_id: string;
  medication_name: string;
  scheduled_time: string;
  status: "pending" | "consumed" | "missed";
  consumed_at?: string;
}

interface ConsumptionHistory {
  id: string;
  medication_name: string;
  scheduled_time: string;
  consumed_at?: string;
  status: "consumed" | "missed";
}

export default function Consumptions() {
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([]);
  const [history, setHistory] = useState<ConsumptionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editItem, setEditItem] = useState<ConsumptionHistory | null>(null);
  const [editTime, setEditTime] = useState("");
  const { user } = useAuthStore();
  const { ability } = useAbilityStore();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  const canEdit = ability.can("manage", "Consumption") || user?.role !== "doctor";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const [scheduleData, historyData] = await Promise.all([
        api.consumptions.getSchedule(today),
        api.consumptions.index(),
      ]);
      setTodaySchedule(scheduleData);
      setHistory(historyData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsume = async (id: string) => {
    if (!canEdit) return;
    try {
      await api.consumptions.store({ schedule_id: id, consumed_at: new Date().toISOString() });
      setTodaySchedule(
        todaySchedule.map((item) =>
          item.id === id ? { ...item, status: "consumed", consumed_at: new Date().toISOString() } : item
        )
      );
      toast.success(isRTL ? "مصرف ثبت شد" : "Consumption recorded");
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleLateConsume = async (id: string) => {
    if (!canEdit) return;
    const time = prompt(isRTL ? "ساعت مصرف را وارد کنید (مثلاً 14:30)" : "Enter consumption time (e.g. 14:30)");
    if (!time) return;
    
    try {
      const [hours, minutes] = time.split(":");
      const consumedAt = new Date();
      consumedAt.setHours(parseInt(hours), parseInt(minutes));
      
      await api.consumptions.store({ schedule_id: id, consumed_at: consumedAt.toISOString() });
      setTodaySchedule(
        todaySchedule.map((item) =>
          item.id === id ? { ...item, status: "consumed", consumed_at: consumedAt.toISOString() } : item
        )
      );
      toast.success(isRTL ? "مصرف ثبت شد" : "Consumption recorded");
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleEditHistory = async () => {
    if (!editItem || !editTime) return;
    try {
      await api.consumptions.update(editItem.id, { consumed_at: editTime });
      setHistory(
        history.map((item) =>
          item.id === editItem.id ? { ...item, consumed_at: editTime, status: "consumed" } : item
        )
      );
      toast.success(isRTL ? "تاریخچه به‌روزرسانی شد" : "History updated");
      setEditItem(null);
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const calendarEvents = history.map((item) => ({
    id: item.id,
    title: item.medication_name,
    start: item.consumed_at || item.scheduled_time,
    backgroundColor: item.status === "consumed" ? "hsl(var(--health-good))" : "hsl(var(--health-critical))",
    borderColor: "transparent",
  }));

  if (isLoading) {
    return (
      <AppLayout requireAuth requireWatch>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton height={40} width={200} />
          <Skeleton height={48} />
          <Skeleton height={300} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout requireAuth requireWatch>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isRTL ? "مصرف دارو" : "Medication Consumption"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? "ثبت و پیگیری مصرف داروها" : "Track and record medication consumption"}
          </p>
        </div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="today" className="gap-2">
              <Clock size={16} />
              {isRTL ? "امروز" : "Today"}
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History size={16} />
              {isRTL ? "تاریخچه" : "History"}
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar size={16} />
              {isRTL ? "تقویم" : "Calendar"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-6">
            {todaySchedule.length === 0 ? (
              <Card variant="elevated" padding="lg">
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {isRTL ? "برنامه مصرفی برای امروز وجود ندارد" : "No scheduled medications for today"}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {todaySchedule.map((item) => (
                  <Card
                    key={item.id}
                    variant="elevated"
                    padding="default"
                    className={cn(
                      "transition-all",
                      item.status === "consumed" && "opacity-60",
                      item.status === "missed" && "border-destructive/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            item.status === "consumed" && "bg-health-good/10 text-health-good",
                            item.status === "missed" && "bg-health-critical/10 text-health-critical",
                            item.status === "pending" && "bg-primary/10 text-primary"
                          )}
                        >
                          {item.status === "consumed" ? (
                            <Check size={24} />
                          ) : item.status === "missed" ? (
                            <X size={24} />
                          ) : (
                            <Clock size={24} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{item.medication_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.scheduled_time).toLocaleTimeString(
                              isRTL ? "fa-IR" : "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                            {item.consumed_at && (
                              <span className="text-health-good ms-2">
                                ✓{" "}
                                {new Date(item.consumed_at).toLocaleTimeString(
                                  isRTL ? "fa-IR" : "en-US",
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {canEdit && item.status !== "consumed" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleConsume(item.id)}>
                            {isRTL ? "مصرف کردم" : "Consumed"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLateConsume(item.id)}
                          >
                            {isRTL ? "دیرتر خوردم" : "Late"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {history.length === 0 ? (
              <Card variant="elevated" padding="lg">
                <div className="text-center py-8">
                  <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {isRTL ? "تاریخچه‌ای وجود ندارد" : "No history yet"}
                  </p>
                </div>
              </Card>
            ) : (
              <Card variant="elevated" padding="none">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-start p-4 text-sm font-medium text-muted-foreground">
                          {isRTL ? "دارو" : "Medication"}
                        </th>
                        <th className="text-start p-4 text-sm font-medium text-muted-foreground">
                          {isRTL ? "زمان برنامه" : "Scheduled"}
                        </th>
                        <th className="text-start p-4 text-sm font-medium text-muted-foreground">
                          {isRTL ? "وضعیت" : "Status"}
                        </th>
                        {canEdit && (
                          <th className="text-start p-4 text-sm font-medium text-muted-foreground">
                            {isRTL ? "عملیات" : "Actions"}
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id} className="border-b border-border last:border-0">
                          <td className="p-4 font-medium">{item.medication_name}</td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(item.scheduled_time).toLocaleString(isRTL ? "fa-IR" : "en-US")}
                          </td>
                          <td className="p-4">
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                item.status === "consumed"
                                  ? "bg-health-good/10 text-health-good"
                                  : "bg-health-critical/10 text-health-critical"
                              )}
                            >
                              {item.status === "consumed"
                                ? isRTL ? "مصرف شده" : "Consumed"
                                : isRTL ? "از دست رفته" : "Missed"}
                            </span>
                          </td>
                          {canEdit && (
                            <td className="p-4">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditItem(item);
                                  setEditTime(item.consumed_at || new Date().toISOString().slice(0, 16));
                                }}
                              >
                                <Edit2 size={16} />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <Card variant="elevated" padding="default" className="overflow-hidden">
              <div className="calendar-wrapper [&_.fc]:text-xs sm:[&_.fc]:text-sm [&_.fc-toolbar]:flex-col [&_.fc-toolbar]:gap-2 sm:[&_.fc-toolbar]:flex-row [&_.fc-toolbar-title]:text-sm sm:[&_.fc-toolbar-title]:text-base [&_.fc-button]:text-xs [&_.fc-button]:px-2 [&_.fc-button]:py-1 sm:[&_.fc-button]:px-3 sm:[&_.fc-button]:py-2 [&_.fc-header-toolbar]:mb-2 sm:[&_.fc-header-toolbar]:mb-4 [&_.fc-col-header-cell]:text-xs sm:[&_.fc-col-header-cell]:text-sm [&_.fc-daygrid-day-number]:text-xs sm:[&_.fc-daygrid-day-number]:text-sm">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin]}
                  initialView="dayGridMonth"
                  events={calendarEvents}
                  headerToolbar={{
                    left: "prev,next",
                    center: "title",
                    right: "today",
                  }}
                  locale={isRTL ? "fa" : "en"}
                  direction={isRTL ? "rtl" : "ltr"}
                  height="auto"
                  contentHeight="auto"
                  aspectRatio={1.2}
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isRTL ? "ویرایش تاریخچه" : "Edit History"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              {isRTL ? "زمان مصرف" : "Consumption Time"}
            </label>
            <input
              type="datetime-local"
              className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleEditHistory}>{t("profile.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
