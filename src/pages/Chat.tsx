import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/base/Button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
} from "@chatscope/chat-ui-kit-react";

interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
}

export default function Chat() {
  const { caregiverId } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "fa";
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (caregiverId) {
      loadMessages();
    }
  }, [caregiverId]);

  const loadMessages = async () => {
    try {
      const data = await api.messages.index(caregiverId!);
      setMessages(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      senderId: user!.id,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);

    try {
      await api.messages.store({
        caregiverId,
        text,
      });
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  if (isLoading) {
    return (
      <AppLayout requireAuth requireWatch>
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton height={60} />
          <Skeleton height={500} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout requireAuth requireWatch>
      <div className="max-w-4xl mx-auto" style={{ height: "calc(100vh - 12rem)" }}>
        <MainContainer>
          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Back>
                <Button variant="ghost" size="icon" onClick={() => navigate("/caregivers")}>
                  <BackIcon size={20} />
                </Button>
              </ConversationHeader.Back>
              <Avatar src="/placeholder.svg" name="Caregiver" />
              <ConversationHeader.Content
                userName={t("chat.title")}
                info={isRTL ? "آنلاین" : "Online"}
              />
            </ConversationHeader>

            <MessageList>
              {messages.length === 0 ? (
                <MessageList.Content
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%",
                    textAlign: "center",
                    fontSize: "1rem",
                  }}
                >
                  {isRTL ? "هنوز پیامی ارسال نشده است" : "No messages yet"}
                </MessageList.Content>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.senderId === "user" || message.senderId === user?.id;
                  return (
                    <Message
                      key={message.id}
                      model={{
                        message: message.text,
                        sentTime: message.timestamp,
                        sender: isOwnMessage ? "You" : "Other",
                        direction: isOwnMessage ? "outgoing" : "incoming",
                        position: "single",
                      }}
                    >
                      <Message.Footer
                        sentTime={new Date(message.timestamp).toLocaleTimeString(
                          isRTL ? "fa-IR" : "en-US",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      />
                    </Message>
                  );
                })
              )}
            </MessageList>

            <MessageInput
              placeholder={t("chat.typingPlaceholder")}
              onSend={handleSend}
              attachButton={false}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </AppLayout>
  );
}
