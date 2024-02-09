"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function TestBids() {
  const [bids, setBids] = useState<any[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    fetch("/api/bids?lotId=1")
      .then((response) => response.json())
      .then((data) => setBids(data));

    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    socket.on("bidUpdate", (newBid) => {
      console.log(newBid);
      setBids((prevBids) => [...prevBids, newBid]);
    });

    // Clean up the effect
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>TestBids</h1>
      <ul>
        {bids.map((bid, index) => (
          <li key={index}>
            <p> {JSON.stringify(bid)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
