import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Sparkles } from "lucide-react";

export function BuyLiveMessage() {
  const { setIsPremium } = useStore();

  const handleSubscribe = () => {
    // In a real app, this would integrate with a payment processor
    setIsPremium(true);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-white hover:text-white/90">
          <Sparkles className="mr-2 h-4 w-4" />
          Buy Live Message
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Premium</DialogTitle>
          <DialogDescription>
            Get your messages featured in the live message ticker!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg bg-secondary p-4">
            <h3 className="font-semibold">Premium Features:</h3>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Display your messages in the live ticker</li>
              <li>Customize message appearance</li>
              <li>Priority message placement</li>
              <li>Extended message duration</li>
            </ul>
          </div>
          <Button onClick={handleSubscribe} className="w-full">
            Subscribe Now - $4.99/month
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
