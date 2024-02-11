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
import Cookies from "js-cookie";
import { Button } from "../ui/button";

interface ChatMessage {
  id: number;
  messageText: string;
  auctionSlug: string;
  userId: number;
  chatId: number;
  username: string;
}

interface ChatProps {
  auctionSlug: string;
}

export default function Chat({ auctionSlug }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const { selectedUser } = useUser();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const addMessage = useCallback((newMessage: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  const hasSubscribedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    Cookies.set("auctionSlug", auctionSlug);

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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
    <div className="flex flex-col w-60 max-h-80 space-y-3">
      <div
        ref={chatContainerRef}
        className="flex flex-col bottom-0 mt-auto justify-start align-bottom border h-60 overflow-auto overflow-y-scroll scroll-smooth rounded-md"
      >
        {messages.map((message) => (
          <p
            key={message.id}
          >{`${message.username}: ${message.messageText}`}</p>
        ))}
        {messages.length === 0 && (
          <p>Тут відображатимуться повідомлення до аукціону</p>
        )}
      </div>
      <Input
        className="rounded-md w-full"
        type="text"
        value={input}
        onChange={handleInputChange}
      />
      <Button onClick={handleSend}>Відправити</Button>
    </div>
  );
}
