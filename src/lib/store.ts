import { create } from "zustand";

interface UserStore {
  isPremium: boolean;
  setIsPremium: (isPremium: boolean) => void;
  messages: Array<{
    id: string;
    text: string;
    userId: string;
    username: string;
  }>;
  addMessage: (message: {
    text: string;
    userId: string;
    username: string;
  }) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  isPremium: false,
  setIsPremium: (isPremium) => set({ isPremium }),
  messages: [
    {
      id: "1",
      text: "Just posted a new blog about AI!",
      userId: "user1",
      username: "TechGuru",
    },
  ],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id: Math.random().toString() },
      ],
    })),
}));
