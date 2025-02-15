import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Profile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  email: string;
  interests: string[];
  friends: string[];
  photos: Array<{
    id: string;
    url: string;
    caption: string;
  }>;
  guestbookEntries: Array<{
    id: string;
    authorId: string;
    content: string;
    timestamp: string;
  }>;
}

interface Store {
  profiles: Profile[];
  messages: Array<{
    id: string;
    text: string;
    userId: string;
    username: string;
  }>;
  users: any[];
  blogPosts: any[];
  events: any[];
  groups: any[];
  threads: any[];
  categories: any[];
  latestUpdates: any[];
  settings: {
    features: {
      emailNotifications: boolean;
      pushNotifications: boolean;
      publicProfile: boolean;
      showOnlineStatus: boolean;
      liveMessages: boolean;
      guestPosts: boolean;
    };
    appearance: {
      primaryColor: string;
      secondaryColor: string;
    };
  };
  chats: any[];
  chatMessages: any[];
  isPremium: boolean;
  addProfile: (userId: string) => void;
  addFriend: (profileId: string, friendId: string) => void;
  removeFriend: (profileId: string, friendId: string) => void;
  addPhoto: (
    profileId: string,
    photo: { url: string; caption: string },
  ) => void;
  removePhoto: (profileId: string, photoId: string) => void;
  addGuestbookEntry: (
    profileId: string,
    entry: { authorId: string; content: string; timestamp: string },
  ) => void;
  removeGuestbookEntry: (profileId: string, entryId: string) => void;
  updateProfile: (userId: string, updates: Partial<Profile>) => void;
  createChat: (participants: string[]) => string;
  sendChatMessage: (message: any) => void;
  addMessage: (message: {
    text: string;
    userId: string;
    username: string;
  }) => void;
  setIsPremium: (isPremium: boolean) => void;
}

export const useStore = create<Store>(
  persist(
    (set) => ({
      profiles: [],
      messages: [
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
      ],
      users: [],
      blogPosts: [],
      events: [],
      groups: [],
      threads: [],
      categories: [],
      latestUpdates: [],
      settings: {
        features: {
          emailNotifications: true,
          pushNotifications: true,
          publicProfile: true,
          showOnlineStatus: true,
          liveMessages: true,
          guestPosts: false,
        },
        appearance: {
          primaryColor: "#2A2D43",
          secondaryColor: "#FF71CE",
        },
      },
      chats: [],
      chatMessages: [],
      isPremium: false,
      addProfile: (userId) =>
        set((state) => ({
          profiles: [
            ...state.profiles,
            {
              id: userId,
              userId,
              name: "Anonymous User",
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
              bio: "Welcome to my profile!",
              location: "Somewhere",
              website: "",
              email: "",
              interests: ["Social Media", "Technology"],
              friends: [],
              photos: [],
              guestbookEntries: [],
            },
          ],
        })),
      addFriend: (profileId, friendId) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === profileId
              ? { ...p, friends: [...p.friends, friendId] }
              : p,
          ),
        })),
      removeFriend: (profileId, friendId) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === profileId
              ? { ...p, friends: p.friends.filter((id) => id !== friendId) }
              : p,
          ),
        })),
      addPhoto: (profileId, photo) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === profileId
              ? {
                  ...p,
                  photos: [
                    ...p.photos,
                    { ...photo, id: Math.random().toString() },
                  ],
                }
              : p,
          ),
        })),
      removePhoto: (profileId, photoId) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === profileId
              ? {
                  ...p,
                  photos: p.photos.filter((photo) => photo.id !== photoId),
                }
              : p,
          ),
        })),
      addGuestbookEntry: (profileId, entry) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === profileId
              ? {
                  ...p,
                  guestbookEntries: [
                    ...p.guestbookEntries,
                    { ...entry, id: Math.random().toString() },
                  ],
                }
              : p,
          ),
        })),
      removeGuestbookEntry: (profileId, entryId) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === profileId
              ? {
                  ...p,
                  guestbookEntries: p.guestbookEntries.filter(
                    (entry) => entry.id !== entryId,
                  ),
                }
              : p,
          ),
        })),
      updateProfile: (userId, updates) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.userId === userId ? { ...p, ...updates } : p,
          ),
        })),
      createChat: (participants) => {
        const chatId = Math.random().toString();
        set((state) => ({
          chats: [...state.chats, { id: chatId, participants }],
          chatMessages: [...(state.chatMessages || [])],
        }));
        return chatId;
      },
      sendChatMessage: (message) => {
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            { ...message, id: Math.random().toString() },
          ],
        }));
      },
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { ...message, id: Math.random().toString() },
          ],
        })),
      setIsPremium: (isPremium) => set({ isPremium }),
    }),
    {
      name: "store",
      skipHydration: true, // Important: Skip hydration to prevent state conflicts
    },
  ),
);
