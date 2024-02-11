"use client";

import React, { useEffect, useState, useRef } from "react";
import { initSocketConnection, connectSocket, disconnectSocket, subscribeToBidUpdates, unsubscribeFromBidUpdates } from "@/lib/socketClient";
import { useUser } from "@/contexts/UserContext";

export default function LotBids({ id }: { id: number }) {
    const [bids, setBids] = useState<any[]>([]);
    const { selectedUser, setSelectedUser } = useUser();
    const hasSubscribedToBidsRef = useRef(false);

    useEffect(() => {
        initSocketConnection();
        connectSocket();

        fetch(`/api/bids?lotId=${id}`)
            .then((response) => response.json())
            .then((data) => setBids(data))
            .catch((error) => console.error('Failed to load bids:', error));

        if (!hasSubscribedToBidsRef.current) {
            const handleNewBid = (newBid: any) => {
                console.log(`New bid:`, newBid);
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
    }, [id, selectedUser]);

    return (
        <div>
            <h1>LotBids for Lot ID: {id}</h1>
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
