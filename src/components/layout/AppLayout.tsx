import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  Pill,
  Bell,
  MessageCircle,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/base/Button";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isRTL = i18n.language === "fa";

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate("/auth");
    }
    if (requireWatch && !user?.hasWatch) {
      navigate("/watch-pairing");
    }
  }, [requireAuth, requireWatch, isAuthenticated, user, navigate]);

  const navigation = [
    { name: t("dashboard.title"), icon: LayoutDashboard, path: "/dashboard" },
    { name: t("caregivers.title"), icon: Users, path: "/caregivers" },
    { name: t("medications.title"), icon: Pill, path: "/medications" },
    { name: t("notifications.title"), icon: Bell, path: "/notifications" },
    { name: t("chat.title"), icon: MessageCircle, path: "/chat" },
    { name: t("profile.title"), icon: User, path: "/profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Mobile Header */}
      {isAuthenticated && (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">نگهبان سلامت</h1>
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
          <nav className="fixed inset-y-0 start-0 w-64 bg-card border-e border-border p-4 shadow-elevated">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMenuOpen(false);
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
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-destructive hover:text-destructive-foreground text-start"
              >
                <LogOut size={20} />
                <span>{t("common.logout")}</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      <div className="flex h-full">
        {/* Desktop Sidebar */}
        {isAuthenticated && (
          <aside className="hidden md:flex w-64 flex-col border-e border-border bg-card">
            <div className="p-6 border-b border-border">
              <h1 className="text-xl font-bold">نگهبان سلامت</h1>
              {user && (
                <p className="text-sm text-muted-foreground mt-1">
                  {user.firstName || user.mobile}
                </p>
              )}
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
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
              })}
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
