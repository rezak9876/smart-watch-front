import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Card } from "@/components/base/Card";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Phone } from "lucide-react";

export default function Auth() {
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+98");
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<"login" | "register" | null>(
    null
  );
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  const validateMobile = (num: string): boolean => {
    const mobileRegex = /^9[0-9]{9}$/;
    return mobileRegex.test(num);
  };

  const handleSubmit = async (type: "login" | "register") => {
    if (!validateMobile(mobile)) {
      toast.error(t("auth.invalidMobile"));
      return;
    }

    setIsLoading(true);
    setActionType(type);

    try {
      const response = await api.auth.sendOtp(countryCode + mobile);
      if (response.success) {
        toast.success(
          isRTL ? "کد تایید ارسال شد" : "Verification code sent"
        );
        navigate("/otp", {
          state: { mobile: countryCode + mobile, actionType: type },
        });
      }
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card
          variant="elevated"
          className="w-full max-w-md animate-scale-in"
          padding="lg"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{t("auth.title")}</h1>
            <p className="text-muted-foreground">
              {isRTL
                ? "شماره موبایل"
                : "Enter your mobile number to login or register"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-2">
              
              <Input
                type="tel"
                placeholder={t("auth.mobileNumberPlaceholder")}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                className="flex-1"
                dir="ltr"
              />
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-11 px-3 rounded-lg border-2 border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="+98">🇮🇷 +98</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleSubmit("login")}
                disabled={isLoading || !mobile}
                variant="outline"
                size="lg"
              >
                {isLoading && actionType === "login"
                  ? t("common.loading")
                  : t("auth.login")}
              </Button>
              <Button
                onClick={() => handleSubmit("register")}
                disabled={isLoading || !mobile}
                size="lg"
              >
                {isLoading && actionType === "register"
                  ? t("common.loading")
                  : t("auth.register")}
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <button
              onClick={() => {
                i18n.changeLanguage(i18n.language === "fa" ? "en" : "fa");
                document.dir = i18n.language === "fa" ? "rtl" : "ltr";
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isRTL ? "English" : "فارسی"}
            </button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
