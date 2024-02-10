"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { GetUserBids } from "@/app/api/bids/UserBids/UserBids";

export default function LotBids(id) {
  const [bids, setBids] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>();

  useEffect(() => {
    const socket = io("http://localhost:3001");
    const storedSelectedUser = Cookies.get("selectedUser");

    if (storedSelectedUser) {
      setSelectedUser(storedSelectedUser);
    }

    fetch(`/api/bids?lotId=${id}`)
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
