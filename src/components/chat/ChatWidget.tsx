import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import {
  MessageCircle,
  Send,
  Image as ImageIcon,
  Smile,
  X,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatWidgetProps {
  chatId: string;
  isOpen?: boolean;
  isMinimized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  style?: React.CSSProperties;
}

const ChatWidget = ({
  chatId,
  isOpen = true,
  isMinimized = false,
  onClose = () => {},
  onMinimize = () => {},
  style = {},
}: ChatWidgetProps) => {
  const {
    chats = [],
    chatMessages = [],
    sendChatMessage,
    profiles = [],
  } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chat = chats.find((c) => c.id === chatId);
  const messages = (chatMessages || []).filter((m) => m.chatId === chatId);

  const otherParticipantId = chat?.participants.find(
    (id) => id !== currentUser?.id,
  );
  const otherParticipant = profiles.find(
    (p) => p.userId === otherParticipantId,
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          chat_id: chatId,
          sender_id: currentUser.id,
          content: newMessage,
          type: "text",
        })
        .select()
        .single();

      if (error) throw error;

      sendChatMessage({
        id: data.id,
        chatId,
        senderId: currentUser.id,
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: "text",
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    // In a real app, upload to a server first
    const reader = new FileReader();
    reader.onloadend = () => {
      sendChatMessage({
        chatId,
        senderId: currentUser.id,
        content: reader.result as string,
        timestamp: new Date().toISOString(),
        type: "image",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleEmojiSelect = (emoji: string) => {
    if (!currentUser) return;
    sendChatMessage({
      chatId,
      senderId: currentUser.id,
      content: emoji,
      timestamp: new Date().toISOString(),
      type: "emoji",
    });
    setShowEmojiPicker(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 z-50"
          style={style}
        >
          <Card className="w-[360px] bg-white shadow-lg">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <Link
                  to={`/profile/${otherParticipant?.userId}`}
                  className="font-semibold hover:underline"
                >
                  {otherParticipant?.name || "Chat"}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMinimize}
                  className="text-primary-foreground hover:text-primary-foreground/80"
                >
                  {isMinimized ? (
                    <Maximize2 size={16} />
                  ) : (
                    <Minimize2 size={16} />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-primary-foreground hover:text-primary-foreground/80"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Messages Area */}
                  <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
                    <div className="flex flex-col gap-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex flex-col ${message.senderId === currentUser?.id ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${message.senderId === currentUser?.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                          >
                            {message.type === "text" && (
                              <p className="text-sm">{message.content}</p>
                            )}
                            {message.type === "image" && (
                              <img
                                src={message.content}
                                alt="Shared image"
                                className="max-w-full rounded"
                              />
                            )}
                            {message.type === "emoji" && (
                              <span className="text-2xl">
                                {message.content}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className="flex-1"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon size={20} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <Smile size={20} />
                      </Button>
                      <Button onClick={handleSendMessage}>
                        <Send size={20} />
                      </Button>
                    </div>
                    {showEmojiPicker && (
                      <div className="absolute bottom-full mb-2 right-0">
                        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWidget;
