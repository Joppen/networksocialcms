import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { ThumbsUp, MessageCircle, Share2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BlogSectionProps {
  userId?: string;
}

const BlogSection = ({ userId }: BlogSectionProps) => {
  const {
    blogPosts,
    addBlogPost,
    likeBlogPost,
    unlikeBlogPost,
    addBlogComment,
    deleteBlogPost,
  } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const userPosts = userId
    ? blogPosts.filter((post) => post.authorId === userId)
    : blogPosts;

  const handleDelete = (postId: string) => {
    if (!currentUser) return;
    deleteBlogPost(postId);
  };

  const handleLike = (postId: string) => {
    if (!currentUser) return;
    const post = blogPosts.find((p) => p.id === postId);
    if (!post) return;

    if (post.likes.includes(currentUser.id)) {
      unlikeBlogPost(postId, currentUser.id);
    } else {
      likeBlogPost(postId, currentUser.id);
    }
  };

  const handleComment = (postId: string) => {
    if (!commentText[postId]?.trim() || !currentUser) return;
    addBlogComment(postId, {
      authorId: currentUser.id,
      content: commentText[postId],
      timestamp: new Date().toISOString(),
    });
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleShare = async (post: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title || "Check out this post!",
          text: post.content,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(
        `${post.content}\n\n${window.location.href}`,
      );
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="w-full space-y-6 bg-white p-6 rounded-lg">
      <div className="space-y-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
        {!userId && currentUser && (
          <Card className="bg-white">
            <CardContent className="pt-4">
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px] mb-4"
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (!newPost.trim() || !currentUser) return;
                    addBlogPost({
                      authorId: currentUser.id,
                      content: newPost,
                      timestamp: new Date().toISOString(),
                    });
                    setNewPost("");
                  }}
                  disabled={!newPost.trim()}
                >
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        {userPosts.map((post) => (
          <Card key={post.id} className="w-full">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorId}`}
                  />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">
                    <Link
                      to={`/profile/${post.authorId}`}
                      className="hover:underline"
                    >
                      {post.authorId}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {post.timestamp
                      ? formatDistanceToNow(new Date(post.timestamp), {
                          addSuffix: true,
                        })
                      : "Just now"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                {post.content}
              </p>
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => handleLike(post.id)}
                >
                  <ThumbsUp
                    className={`h-4 w-4 ${post.likes.includes(currentUser?.id || "") ? "fill-current text-blue-500" : ""}`}
                  />
                  <span>{post.likes.length}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() =>
                    setShowComments((prev) => ({
                      ...prev,
                      [post.id]: !prev[post.id],
                    }))
                  }
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments.length}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => handleShare(post)}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
                {currentUser?.id === post.authorId && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>

              {showComments[post.id] && (
                <div className="mt-4 space-y-4">
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start space-x-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorId}`}
                        />
                        <AvatarFallback>AU</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="font-medium text-sm">
                            {comment.authorId}
                          </p>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {comment.timestamp
                            ? formatDistanceToNow(new Date(comment.timestamp), {
                                addSuffix: true,
                              })
                            : "Just now"}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 mt-2">
                    <Textarea
                      placeholder="Write a comment..."
                      value={commentText[post.id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      className="min-h-[60px]"
                    />
                    <Button
                      size="icon"
                      onClick={() => handleComment(post.id)}
                      disabled={!commentText[post.id]?.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
