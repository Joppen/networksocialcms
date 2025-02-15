import { supabase } from "./supabase";

export const api = {
  // Users
  users: {
    getAll: async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      return data;
    },
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from("users").delete().eq("id", id);
      if (error) throw error;
    },
  },

  // Profiles
  profiles: {
    getAll: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      return data;
    },
  },

  // Blog Posts
  blogPosts: {
    getAll: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, blog_comments(*), blog_likes(*)");
      if (error) throw error;
      return data;
    },
    create: async (post: any) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert(post)
        .select();
      if (error) throw error;
      return data[0];
    },
    delete: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    like: async (postId: string, userId: string) => {
      const { error } = await supabase
        .from("blog_likes")
        .insert({ post_id: postId, user_id: userId });
      if (error) throw error;
    },
    unlike: async (postId: string, userId: string) => {
      const { error } = await supabase
        .from("blog_likes")
        .delete()
        .match({ post_id: postId, user_id: userId });
      if (error) throw error;
    },
    comment: async (comment: any) => {
      const { data, error } = await supabase
        .from("blog_comments")
        .insert(comment)
        .select();
      if (error) throw error;
      return data[0];
    },
  },

  // Messages
  messages: {
    getAll: async () => {
      const { data, error } = await supabase.from("messages").select("*");
      if (error) throw error;
      return data;
    },
    create: async (message: any) => {
      const { data, error } = await supabase
        .from("messages")
        .insert(message)
        .select();
      if (error) throw error;
      return data[0];
    },
  },

  // Chats
  chats: {
    getAll: async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("*, chat_messages(*)");
      if (error) throw error;
      return data;
    },
    create: async (chat: any) => {
      const { data, error } = await supabase
        .from("chats")
        .insert(chat)
        .select();
      if (error) throw error;
      return data[0];
    },
    sendMessage: async (message: any) => {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert(message)
        .select();
      if (error) throw error;
      return data[0];
    },
  },

  // Photos
  photos: {
    getAll: async () => {
      const { data, error } = await supabase.from("photos").select("*");
      if (error) throw error;
      return data;
    },
    create: async (photo: any) => {
      const { data, error } = await supabase
        .from("photos")
        .insert(photo)
        .select();
      if (error) throw error;
      return data[0];
    },
    delete: async (id: string) => {
      const { error } = await supabase.from("photos").delete().eq("id", id);
      if (error) throw error;
    },
  },

  // Guestbook
  guestbook: {
    getEntries: async (profileId: string) => {
      const { data, error } = await supabase
        .from("guestbook_entries")
        .select("*")
        .eq("profile_id", profileId);
      if (error) throw error;
      return data;
    },
    create: async (entry: any) => {
      const { data, error } = await supabase
        .from("guestbook_entries")
        .insert(entry)
        .select();
      if (error) throw error;
      return data[0];
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from("guestbook_entries")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
  },
};
