import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { MessageSquare, ThumbsUp, Flag, Quote, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ForumThreadProps {
  threadId: string;
}

const ForumThread = ({ threadId }: ForumThreadProps) => {
  const { threads, addThreadReply, likeThread } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const [replyContent, setReplyContent] = useState("");
  const [quotedReply, setQuotedReply] = useState<{
    authorId: string;
    content: string;
  } | null>(null);

  const thread = threads.find((t) => t.id === threadId);
  if (!thread) return null;

  const handleReply = () => {
    if (!currentUser || !replyContent.trim()) return;
    addThreadReply(threadId, {
      authorId: currentUser.id,
      content: replyContent,
      timestamp: new Date().toISOString(),
      quotedReply,
    });
    setReplyContent("");
    setQuotedReply(null);
  };

  const handleQuote = (authorId: string, content: string) => {
    setQuotedReply({ authorId, content });
    setReplyContent(`@${authorId} `);
  };

  const handleLike = () => {
    if (!currentUser) return;
    likeThread(threadId, currentUser.id);
  };

  return (
    <Card className="w-full bg-white/10 backdrop-blur-lg border-none text-white">
      <div className="p-6 space-y-6">
        {/* Thread Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${thread.authorId}`}
              />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{thread.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Link
                  to={`/profile/${thread.authorId}`}
                  className="text-sm text-gray-400 hover:underline"
                >
                  {thread.authorId}
                </Link>
                <span className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(thread.timestamp), {
                    addSuffix: true,
                  })}
                </span>
                <Badge variant="secondary">{thread.category}</Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Flag className="h-4 w-4" />
          </Button>
        </div>

        {/* Thread Content */}
        <div className="text-gray-300 whitespace-pre-wrap">
          {thread.content}
        </div>

        {/* Thread Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleLike}
          >
            <ThumbsUp
              className={`h-4 w-4 ${thread.likes.includes(currentUser?.id || "") ? "fill-current text-primary" : ""}`}
            />
            <span>{thread.likes.length}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>{thread.replies.length}</span>
          </Button>
        </div>

        {/* Replies */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Replies</h3>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {thread.replies.map((reply) => (
                <Card key={reply.id} className="p-4 bg-white/5">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.authorId}`}
                      />
                      <AvatarFallback>AU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{reply.authorId}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleQuote(reply.authorId, reply.content)
                            }
                          >
                            <Quote className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-gray-400">
                            {formatDistanceToNow(new Date(reply.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                      {reply.quotedReply && (
                        <div className="mt-2 p-3 bg-white/5 rounded-lg">
                          <p className="text-sm text-gray-400">
                            @{reply.quotedReply.authorId} wrote:
                          </p>
                          <p className="text-sm mt-1">
                            {reply.quotedReply.content}
                          </p>
                        </div>
                      )}
                      <p className="mt-2 text-gray-300">{reply.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Reply Input */}
          <div className="space-y-4">
            {quotedReply && (
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-400">
                    Replying to @{quotedReply.authorId}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuotedReply(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm">{quotedReply.content}</p>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleReply()}
                className="flex-1"
              />
              <Button onClick={handleReply} disabled={!replyContent.trim()}>
                Reply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ForumThread;
