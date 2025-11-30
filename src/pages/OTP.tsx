import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { AppLayout } from "@/components/layout/AppLayout";
import { ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OTP() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { login } = useAuthStore();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isRTL = i18n.language === "fa";

  const mobile = location.state?.mobile;
  const actionType = location.state?.actionType;

  useEffect(() => {
    if (!mobile || !actionType) {
      navigate("/auth");
    }
  }, [mobile, actionType, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = code.join("");
    if (otpCode.length !== 6) {
      toast.error(t("otp.invalidCode"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.auth.verifyOtp(mobile, otpCode);
      if (response.success) {
        const user = {
          id: Date.now().toString(),
          mobile,
          role: "elder" as const,
          hasCompletedTour: false,
          hasWatch: false,
        };
        login(user);

        if (actionType === "register" || response.isNewUser) {
          navigate("/watch-pairing");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error(t("otp.invalidCode"));
      }
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    try {
      await api.auth.sendOtp(mobile);
      setCountdown(60);
      toast.success(isRTL ? "کد مجدد ارسال شد" : "Code resent");
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card
          variant="elevated"
          className="w-full max-w-md animate-scale-in"
          padding="lg"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/auth")}
            className="mb-4"
          >
            <BackIcon size={18} className={isRTL ? "ms-2" : "me-2"} />
            {t("common.back")}
          </Button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{t("otp.title")}</h1>
            <p className="text-muted-foreground">
              {t("otp.description", { mobile })}
            </p>
          </div>

          <div className="space-y-6">
            <div
              className={cn(
                "flex gap-2 justify-center",
                isRTL && "flex-row-reverse"
              )}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                />
              ))}
            </div>

            <Button
              onClick={handleVerify}
              disabled={isLoading || code.some((d) => !d)}
              size="lg"
              className="w-full"
            >
              {isLoading ? t("common.loading") : t("otp.verify")}
            </Button>

            <div className="text-center">
              <button
                onClick={handleResend}
                disabled={countdown > 0}
                className={cn(
                  "text-sm transition-colors",
                  countdown > 0
                    ? "text-muted-foreground cursor-not-allowed"
                    : "text-primary hover:underline"
                )}
              >
                {t("otp.resend")}
                {countdown > 0 && ` (${countdown})`}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
