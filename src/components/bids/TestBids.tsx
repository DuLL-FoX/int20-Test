"use client";

import React, { useEffect, useState } from 'react';
import {
    initSocketConnection,
    connectSocket,
    disconnectSocket,
    subscribeToBidUpdates,
    unsubscribeFromBidUpdates,
} from '@/lib/socketClient';

export default function TestBids() {
    const [bids, setBids] = useState<any[]>([]);

    useEffect(() => {
        initSocketConnection();
        connectSocket();

        fetch('/api/bids?lotId=1')
            .then((response) => response.json())
            .then((data) => setBids(data));

        const handleNewBid = (newBid: any) => {
            console.log(newBid);
            setBids((prevBids) => [...prevBids, newBid]);
        };

        subscribeToBidUpdates(handleNewBid);

        return () => {
            unsubscribeFromBidUpdates();
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
