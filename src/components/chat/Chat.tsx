'use client';

import React, { useState, useEffect } from 'react';

export default function Chat({ chatId }: { chatId: number }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch(`/api/chat/message?chatId=${chatId}`)
        .then((res) => res.json())
        .then((data) => setMessages(data.map((msg: any) => msg.messageText)))
        .catch((error) => console.error("Failed to load messages:", error));
  }, [chatId]);

  const handleSend = async () => {
    if (input) {
      await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatMessage: input, chatId }),
      });
      setMessages([...messages, input]);
      setInput('');
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
