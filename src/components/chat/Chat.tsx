'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
    initSocketConnection,
    connectSocket,
    disconnectSocket,
    subscribeToChatUpdates,
    unsubscribeFromChatUpdates,
} from '@/lib/socketClient';

interface ChatMessage {
    messageText: string;
}

interface ChatProps {
    chatId: number;
}

export default function Chat({ chatId }: ChatProps) {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>('');

    const addMessage = useCallback((newMessage: { id: number; messageText: string; auctionId: number; userId: number; chatId: number; }) => {
        setMessages((prevMessages) => [...prevMessages, newMessage.messageText]);
    }, []);

    useEffect(() => {
        const initChat = async () => {
            try {
                const res = await fetch(`/api/chat/message?chatId=${chatId}`);
                const data: ChatMessage[] = await res.json();
                setMessages(data.map((msg) => msg.messageText));
            } catch (error) {
                console.error("Failed to load messages:", error);
            }

            initSocketConnection();
            connectSocket();
            subscribeToChatUpdates(addMessage);

            return () => {
                unsubscribeFromChatUpdates();
                disconnectSocket();
            };
        };

        initChat();
    }, [chatId, addMessage]);

    const handleSend = async () => {
        if (input.trim()) {
            await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatMessage: input, chatId }),
            });
            setInput('');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
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
                onChange={handleInputChange}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}
