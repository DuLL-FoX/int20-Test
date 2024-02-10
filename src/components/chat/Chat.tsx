'use client';

import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
    initSocketConnection,
    connectSocket,
    disconnectSocket,
    subscribeToChatUpdates,
    unsubscribeFromChatUpdates
} from '@/lib/socketClient';
import { useUser } from '@/contexts/UserContext';

interface ChatMessage {
    id: number;
    messageText: string;
    auctionId: number;
    userId: number;
    chatId: number;
}

interface ChatProps {
    chatId: number;
}

export default function Chat({ chatId }: ChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState<string>('');
    const { selectedUser } = useUser();

    const addMessage = useCallback((newMessage: ChatMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    }, []);

    const hasSubscribedRef = useRef(false);

    useEffect(() => {
        let isMounted = true;

        const initChat = async () => {
            if (!isMounted || hasSubscribedRef.current) return;

            try {
                const res = await fetch(`/api/chat/message?chatId=${chatId}`);
                const data: ChatMessage[] = await res.json();
                setMessages(data);
            } catch (error) {
                console.error('Failed to load messages:', error);
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
    }, [chatId, addMessage]);

    const handleSend = async () => {
        if (input.trim()) {
            const queryString = `?username=${selectedUser}&chatId=${chatId}`;

            await fetch(`/api/chat/message${queryString}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatMessage: input }),
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
                {messages.map((message) => (
                    <p key={message.id}>{`${selectedUser || 'Unknown'}: ${message.messageText}`}</p>
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
