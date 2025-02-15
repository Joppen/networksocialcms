import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const LiveMessageTicker = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const messages = useStore((state) => state.messages);

  useEffect(() => {
    if (messages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [messages.length]);

  if (messages.length === 0) return null;

  const currentMessage = messages[currentMessageIndex];

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
          <div className="flex items-center gap-2">
            <Link
              to={`/profile/${currentMessage.userId}`}
              className="hover:text-white hover:underline"
            >
              {currentMessage.username}
            </Link>
            <span>{currentMessage.text}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LiveMessageTicker;
