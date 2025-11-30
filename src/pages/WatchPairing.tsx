import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { AppLayout } from "@/components/layout/AppLayout";
import { Watch, RefreshCw } from "lucide-react";

export default function WatchPairing() {
  const [pairingCode, setPairingCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { pairWatch } = useAuthStore();
  const isRTL = i18n.language === "fa";

  useEffect(() => {
    generateCode();
  }, []);

  const generateCode = async () => {
    try {
      const response = await api.watches.generateCode();
      setPairingCode(response.code);
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handlePair = async () => {
    setIsLoading(true);
    try {
      const response = await api.watches.pair(pairingCode);
      if (response.success) {
        pairWatch();
        toast.success(isRTL ? "ساعت با موفقیت متصل شد" : "Watch paired successfully");
        navigate("/watch-owner-info");
      }
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout requireAuth>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card
          variant="health"
          className="w-full max-w-md animate-scale-in"
          padding="lg"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Watch className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {t("watchPairing.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("watchPairing.description")}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-background/50 rounded-xl p-8 text-center">
              <div className="text-5xl font-bold tracking-wider text-primary mb-2">
                {pairingCode}
              </div>
              <p className="text-sm text-muted-foreground">
                {isRTL ? "کد اتصال" : "Pairing Code"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={generateCode}
                variant="outline"
                disabled={isLoading}
              >
                <RefreshCw size={18} className={isRTL ? "ms-2" : "me-2"} />
                {t("watchPairing.regenerate")}
              </Button>
              <Button onClick={handlePair} disabled={isLoading}>
                {isLoading ? t("common.loading") : t("watchPairing.codeEntered")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
