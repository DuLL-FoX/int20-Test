"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Chat({
  chatId,
  auctionId,
}: {
  chatId: number;
  auctionId: number;
}) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState("");
  useEffect(() => {
    fetch(`/api/chat?auctionId=${auctionId}`, {
      method: "POST",
    });

    fetch(`/api/chat/message?chatId=${chatId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.map((msg: any) => msg.messageText)))
      .catch((error) => console.error("Failed to load messages:", error));

    const username = Cookies.get("selectedUser");
    setUser(username as string);
  }, [chatId]);

  const handleSend = async () => {
    if (input) {
      await fetch(`/api/chat/message?${user}`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatMessage: input, chatId }),
      });
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
