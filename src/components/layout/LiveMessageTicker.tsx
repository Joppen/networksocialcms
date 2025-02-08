import React, { useState, useEffect } from "react";
import { useUserStore } from "@/lib/store";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  userId: string;
  username: string;
}

const defaultMessages: Message[] = [
  {
    id: "1",
    text: "Just posted a new blog about AI!",
    userId: "user1",
    username: "TechGuru",
  },
  {
    id: "2",
    text: "Check out my new photo gallery",
    userId: "user2",
    username: "ArtLover",
  },
  {
    id: "3",
    text: "Anyone up for gaming tonight?",
    userId: "user3",
    username: "GameMaster",
  },
];

const LiveMessageTicker = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const messages = useUserStore((state) => state.messages);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="h-8 bg-[#2A2D43] border-t border-white/10 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessageIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full flex items-center justify-center text-white/80 text-sm"
        >
          <Link
            to={`/profile/${messages[currentMessageIndex].userId}`}
            className="hover:text-white hover:underline"
          >
            {messages[currentMessageIndex].username}
          </Link>
          <span className="mx-2">{messages[currentMessageIndex].text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LiveMessageTicker;
