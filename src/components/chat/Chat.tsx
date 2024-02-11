"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  initSocketConnection,
  connectSocket,
  disconnectSocket,
  subscribeToChatUpdates,
  unsubscribeFromChatUpdates,
} from "@/lib/socketClient";
import { useUser } from "@/contexts/UserContext";
import { Input } from "../ui/input";

interface ChatMessage {
  id: number;
  messageText: string;
  auctionSlug: string;
  userId: number;
  chatId: number;
}

interface ChatProps {
  auctionSlug: string;
}

export default function Chat({ auctionSlug }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const { selectedUser } = useUser();

  const addMessage = useCallback((newMessage: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  const hasSubscribedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const initChat = async () => {
      if (!isMounted && hasSubscribedRef.current) return;

      try {
        const res = await fetch(`/api/chat/message?auctionSlug=${auctionSlug}`);
        const data: ChatMessage[] = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error("Fetched data is not an array:", data);
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      }

      initSocketConnection();
      connectSocket();
      if (!hasSubscribedRef.current) {
        subscribeToChatUpdates(addMessage);
        hasSubscribedRef.current = true;
      }
    };

    initChat();

    return () => {
      isMounted = false;
      if (hasSubscribedRef.current) {
        unsubscribeFromChatUpdates();
        hasSubscribedRef.current = false;
      }
      disconnectSocket();
    };
  }, [auctionSlug, addMessage]);

  const handleSend = async () => {
    if (input.trim()) {
      const queryString = `?username=${selectedUser}&auctionSlug=${auctionSlug}`;

      await fetch(`/api/chat/message${queryString}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatMessage: input }),
      });
      setInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col max-w-3xl max-h-60 space-y-3">
      <div className="flex flex-col justify-start align-bottom border h-32 overflow-auto rounded-md">
        {messages.map((message) => (
          <p key={message.id}>{`${selectedUser}: ${message.messageText}`}</p>
        ))}
      </div>
      <Input
        className="rounded-md w-full"
        type="text"
        value={input}
        onChange={handleInputChange}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
