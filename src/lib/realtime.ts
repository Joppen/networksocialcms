import { supabase } from "./supabase";

export const setupRealtimeSubscriptions = () => {
  // Users
  supabase
    .channel("users")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "users" },
      (payload) => {
        console.log("Users change received!", payload);
      },
    )
    .subscribe();

  // Profiles
  supabase
    .channel("profiles")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "profiles" },
      (payload) => {
        console.log("Profiles change received!", payload);
      },
    )
    .subscribe();

  // Blog Posts
  supabase
    .channel("blog_posts")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "blog_posts" },
      (payload) => {
        console.log("Blog posts change received!", payload);
      },
    )
    .subscribe();

  // Messages
  supabase
    .channel("messages")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages" },
      (payload) => {
        console.log("Messages change received!", payload);
      },
    )
    .subscribe();

  // Chats
  supabase
    .channel("chats")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "chats" },
      (payload) => {
        console.log("Chats change received!", payload);
      },
    )
    .subscribe();
};
