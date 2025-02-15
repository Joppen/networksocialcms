import React from "react";
import { Card } from "./card";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "😉",
      "😌",
    ],
  },
  {
    name: "Gestures",
    emojis: [
      "👍",
      "👎",
      "👌",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "👊",
      "✊",
      "🤛",
      "🤜",
      "🤝",
    ],
  },
  {
    name: "Hearts",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💕",
      "💞",
      "💓",
    ],
  },
];

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  return (
    <Card className="w-64 p-2 bg-white">
      <div className="space-y-2">
        {EMOJI_CATEGORIES.map((category) => (
          <div key={category.name}>
            <h3 className="text-xs font-medium text-gray-500 mb-1">
              {category.name}
            </h3>
            <div className="grid grid-cols-6 gap-1">
              {category.emojis.map((emoji) => (
                <button
                  key={emoji}
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => onEmojiSelect(emoji)}
                >
                  <span className="text-lg">{emoji}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
