import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { AppLayout } from "@/components/layout/AppLayout";
import { Watch, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WatchPairingConfirm() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { sessionToken, updateSetupStatus, setupStatus } = useAuthStore();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isRTL = i18n.language === "fa";

  useEffect(() => {
    if (!sessionToken) {
      navigate("/watch-pairing");
    }
  }, [sessionToken, navigate]);

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

  const handleConfirm = async () => {
    const watchCode = code.join("");
    if (watchCode.length !== 6) {
      toast.error(isRTL ? "کد باید ۶ رقم باشد" : "Code must be 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.watches.confirmPairing(sessionToken!, watchCode);
      if (response.success) {
        updateSetupStatus({ watch_paired: true });
        toast.success(isRTL ? "ساعت با موفقیت متصل شد" : "Watch paired successfully");
        navigate("/watch-owner-info");
      } else {
        toast.error(isRTL ? "کد نادرست است" : "Invalid code");
      }
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <AppLayout requireAuth>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card
          variant="health"
          className="w-full max-w-md animate-scale-in"
          padding="lg"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/watch-pairing")}
            className="mb-4"
          >
            <BackIcon size={18} className={isRTL ? "ms-2" : "me-2"} />
            {t("common.back")}
          </Button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Watch className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {isRTL ? "تأیید اتصال ساعت" : "Confirm Watch Pairing"}
            </h1>
            <p className="text-muted-foreground">
              {isRTL
                ? "کد ۶ رقمی که روی ساعت نمایش داده شده را وارد کنید"
                : "Enter the 6-digit code shown on your watch"}
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
              onClick={handleConfirm}
              disabled={isLoading || code.some((d) => !d)}
              size="lg"
              className="w-full"
            >
              {isLoading ? t("common.loading") : t("otp.verify")}
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
