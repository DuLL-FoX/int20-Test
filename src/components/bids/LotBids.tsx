"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

export default function LotBids(id) {
  const [bids, setBids] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>();

  useEffect(() => {
    const socket = io("http://localhost:3001");
    const storedSelectedUser = Cookies.get("selectedUser");

    fetch("/api/bids?lotId=1")
      .then((response) => response.json())
      .then((data) => setBids(data));

    fetch(`/api/bids?lotId=${id}`)
      .then((response) => response.json())
      .then((data) => setBids(data));

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
