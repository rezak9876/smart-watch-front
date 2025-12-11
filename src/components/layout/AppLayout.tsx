import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  Pill,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  FileText,
  Activity,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Settings,
} from "lucide-react";
import { Button } from "@/components/base/Button";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireWatch?: boolean;
}

export const AppLayout = ({
  children,
  requireAuth = false,
  requireWatch = false,
}: AppLayoutProps) => {
  const { isAuthenticated, user, logout, setupStatus } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [medicationGroupOpen, setMedicationGroupOpen] = useState(false);
  const isRTL = i18n.language === "fa";

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate("/auth");
    }
    if (requireWatch && !setupStatus.watch_paired) {
      navigate("/watch-pairing");
    }
  }, [requireAuth, requireWatch, isAuthenticated, setupStatus, navigate]);

  // Check if any medication-related route is active
  useEffect(() => {
    const medicationPaths = ["/medications", "/prescriptions", "/consumptions"];
    if (medicationPaths.some(path => location.pathname.startsWith(path))) {
      setMedicationGroupOpen(true);
    }
  }, [location.pathname]);

  const mainNavigation = [
    { name: t("dashboard.title"), icon: LayoutDashboard, path: "/dashboard" },
    { name: t("caregivers.title"), icon: Users, path: "/caregivers" },
    { name: t("notifications.title"), icon: Bell, path: "/notifications" },
    { name: t("profile.title"), icon: User, path: "/profile" },
  ];

  const medicationNavigation = [
    { name: t("medications.title"), icon: Pill, path: "/medications" },
    { name: isRTL ? "نسخه‌ها" : "Prescriptions", icon: FileText, path: "/prescriptions" },
    { name: isRTL ? "مصرف دارو" : "Consumption", icon: Activity, path: "/consumptions" },
  ];

  const testNavigation = [
    { name: isRTL ? "تست اعلان‌ها" : "Test Notifications", icon: Bell, path: "/test-notifications" },
    { name: isRTL ? "تنظیمات موقت" : "Temp Settings", icon: Settings, path: "/temp-settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  const isMedicationGroupActive = medicationNavigation.some(item => isActive(item.path));

  const NavItem = ({ item, onClick }: { item: typeof mainNavigation[0]; onClick?: () => void }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => {
          navigate(item.path);
          onClick?.();
        }}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-start",
          isActive(item.path)
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent"
        )}
      >
        <Icon size={20} />
        <span>{item.name}</span>
      </button>
    );
  };

  const MedicationGroup = ({ onItemClick }: { onItemClick?: () => void }) => (
    <Collapsible open={medicationGroupOpen} onOpenChange={setMedicationGroupOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-start",
            isMedicationGroupActive ? "bg-primary/10 text-primary" : "hover:bg-accent"
          )}
        >
          <div className="flex items-center gap-3">
            <FlaskConical size={20} />
            <span>{isRTL ? "دارو و درمان" : "Medication & Treatment"}</span>
          </div>
          {medicationGroupOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ps-4 space-y-1 mt-1">
        {medicationNavigation.map((item) => (
          <NavItem key={item.path} item={item} onClick={onItemClick} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Mobile Header */}
      {isAuthenticated && (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">سلامت نگهبان</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </header>
      )}

      {/* Mobile Menu Overlay */}
      {menuOpen && isAuthenticated && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <nav
            className="fixed inset-y-0 start-0 w-64 bg-card border-e border-border p-4 shadow-elevated overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              {mainNavigation.map((item) => (
                <NavItem key={item.path} item={item} onClick={() => setMenuOpen(false)} />
              ))}
              
              <MedicationGroup onItemClick={() => setMenuOpen(false)} />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-destructive hover:text-destructive-foreground text-start"
              >
                <LogOut size={20} />
                <span>{t("common.logout")}</span>
              </button>

              {/* Test Section */}
              <div className="pt-4 mt-4 border-t border-border">
                <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase">
                  {isRTL ? "تست و توسعه" : "Testing & Dev"}
                </p>
                {testNavigation.map((item) => (
                  <NavItem key={item.path} item={item} onClick={() => setMenuOpen(false)} />
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}

      <div className="flex h-full">
        {/* Desktop Sidebar */}
        {isAuthenticated && (
          <aside className="hidden md:flex w-64 flex-col border-e border-border bg-card">
            <div className="p-6 border-b border-border">
              <h1 className="text-xl font-bold">سلامت نگهبان</h1>
              {user && (
                <p className="text-sm text-muted-foreground mt-1">
                  {user.firstName || user.mobile}
                </p>
              )}
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {mainNavigation.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
              
              <MedicationGroup />

              {/* Test Section */}
              <div className="pt-4 mt-4 border-t border-border">
                <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase">
                  {isRTL ? "تست و توسعه" : "Testing & Dev"}
                </p>
                {testNavigation.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
            </nav>
            <div className="p-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut size={18} className={isRTL ? "ms-2" : "me-2"} />
                {t("common.logout")}
              </Button>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};