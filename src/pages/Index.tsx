import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Watch, Heart, Shield, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/10 to-primary/5 p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl w-full text-center space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-elevated mb-4 animate-pulse-soft">
            <Watch className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-primary to-primary-glow bg-clip-text text-transparent">
            {isRTL ? "سلامت نگهبان" : "Health Guardian"}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {isRTL
              ? "سیستم نظارت بر سلامت سالمندان با ساعت هوشمند"
              : "Elderly Health Monitoring System with Smart Watch"}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-card border-2 border-border rounded-xl p-6 space-y-3 hover:shadow-elevated transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-health-good/10 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-health-good" />
            </div>
            <h3 className="font-semibold">
              {isRTL ? "نظارت 24/7" : "24/7 Monitoring"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRTL
                ? "پایش مداوم ضربان قلب و اکسیژن خون"
                : "Continuous heart rate and blood oxygen monitoring"}
            </p>
          </div>

          <div className="bg-card border-2 border-border rounded-xl p-6 space-y-3 hover:shadow-elevated transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-health-warning/10 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-health-warning" />
            </div>
            <h3 className="font-semibold">
              {isRTL ? "تشخیص سقوط" : "Fall Detection"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRTL
                ? "هشدار فوری به مراقبین در هنگام سقوط"
                : "Instant alerts to caregivers upon fall"}
            </p>
          </div>

          <div className="bg-card border-2 border-border rounded-xl p-6 space-y-3 hover:shadow-elevated transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">
              {isRTL ? "مدیریت مراقبین" : "Caregiver Management"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRTL
                ? "ارتباط آسان با پزشک، پرستار و خانواده"
                : "Easy connection with doctors, nurses, and family"}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            variant="health"
            className="text-lg px-12 h-14"
          >
            {isRTL ? "شروع کنید" : "Get Started"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {isRTL
              ? "رایگان برای همیشه • بدون نیاز به کارت اعتباری"
              : "Free forever • No credit card required"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
