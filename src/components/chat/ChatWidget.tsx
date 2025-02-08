import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Send,
  Image,
  Smile,
  X,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface ChatWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
  messages?: Message[];
  currentUser?: string;
}

const ChatWidget = ({
  isOpen = true,
  onClose = () => {},
  messages: initialMessages = [
    {
      id: "1",
      sender: "John Doe",
      content: "Hey there! How are you?",
      timestamp: "2:30 PM",
    },
    {
      id: "2",
      sender: "Current User",
      content: "I'm doing great, thanks for asking!",
      timestamp: "2:31 PM",
    },
  ],
  currentUser = "Current User",
}: ChatWidgetProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: currentUser,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="w-[360px] bg-white shadow-lg">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <span className="font-semibold">Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
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
                  <ScrollArea className="h-[400px] p-4">
                    <div className="flex flex-col gap-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex flex-col ${message.sender === currentUser ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${message.sender === currentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {message.timestamp}
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
                      <Button variant="ghost" size="icon">
                        <Image size={20} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Smile size={20} />
                      </Button>
                      <Button onClick={handleSendMessage}>
                        <Send size={20} />
                      </Button>
                    </div>
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
