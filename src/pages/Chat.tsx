import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Card } from "@/components/base/Card";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { Send, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
}

export default function Chat() {
  const { caregiverId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "fa";

  useEffect(() => {
    if (caregiverId) {
      loadMessages();
    }
  }, [caregiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await api.messages.index(caregiverId!);
      setMessages(data);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      senderId: user!.id,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    try {
      await api.messages.store({
        caregiverId,
        text: inputText,
      });
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

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
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/caregivers")}
          >
            <BackIcon size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t("chat.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {isRTL ? "آنلاین" : "Online"}
            </p>
          </div>
        </div>

        <Card variant="elevated" padding="none" className="h-[calc(100vh-16rem)]">
          <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {isRTL
                    ? "هنوز پیامی ارسال نشده است"
                    : "No messages yet"}
                </div>
              ) : (
                <>
                  {messages.map((message) => {
                    const isOwnMessage = message.senderId === user!.id;
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          isOwnMessage ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                            isOwnMessage
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="text-sm break-words">{message.text}</p>
                          <p
                            className={cn(
                              "text-xs mt-1",
                              isOwnMessage
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            )}
                          >
                            {new Date(message.timestamp).toLocaleTimeString(
                              isRTL ? "fa-IR" : "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder={t("chat.typingPlaceholder")}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  size="icon"
                  className="shrink-0"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
