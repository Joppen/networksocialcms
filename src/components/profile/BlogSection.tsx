import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  likes: number;
  comments: number;
}

interface BlogSectionProps {
  posts?: BlogPost[];
}

const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "My First Blog Post",
    content:
      "This is a sample blog post about my journey in web development...",
    author: {
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    date: "2024-03-20",
    likes: 42,
    comments: 12,
  },
  {
    id: "2",
    title: "Learning React and TypeScript",
    content: "Today I learned about React hooks and TypeScript interfaces...",
    author: {
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
    date: "2024-03-19",
    likes: 38,
    comments: 8,
  },
];

const BlogSection: React.FC<BlogSectionProps> = ({ posts = defaultPosts }) => {
  return (
    <div className="w-full space-y-6 bg-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
        <Button variant="outline">New Post</Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="w-full">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <img src={post.author.avatar} alt={post.author.name} />
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription>
                    {post.author.name} • {post.date}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
