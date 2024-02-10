"use client";

import React, { useEffect, useState, useRef } from 'react';
import {
    initSocketConnection,
    connectSocket,
    disconnectSocket,
    subscribeToBidUpdates,
    unsubscribeFromBidUpdates,
} from '@/lib/socketClient';

export default function TestBids() {
    const [bids, setBids] = useState<any[]>([]);
    const hasSubscribedToBidsRef = useRef(false); // useRef to track subscription status

    useEffect(() => {
        initSocketConnection();
        connectSocket();

        fetch('/api/bids?lotId=1')
            .then((response) => response.json())
            .then((data) => setBids(data))
            .catch((error) => console.error('Failed to load bids:', error));

        if (!hasSubscribedToBidsRef.current) {
            const handleNewBid = (newBid: any) => {
                console.log(newBid);
                setBids((prevBids) => [...prevBids, newBid]);
            };

            subscribeToBidUpdates(handleNewBid);
            hasSubscribedToBidsRef.current = true;
        }

        return () => {
            if (hasSubscribedToBidsRef.current) {
                unsubscribeFromBidUpdates();
                hasSubscribedToBidsRef.current = false;
            }
            disconnectSocket();
        };
    }, []);

    return (
        <div>
            <h1>TestBids</h1>
            <ul>
                {bids.map((bid, index) => (
                    <li key={index}>
                        <p>{JSON.stringify(bid)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
