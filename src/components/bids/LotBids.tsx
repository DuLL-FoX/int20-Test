"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  initSocketConnection,
  connectSocket,
  disconnectSocket,
  subscribeToBidUpdates,
  unsubscribeFromBidUpdates,
} from "@/lib/socketClient";
import { useUser } from "@/contexts/UserContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatMoney } from "@/lib/utils";

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
      .catch((error) => console.error("Failed to load bids:", error));

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
    <Table>
      <TableCaption>Список всіх ставок на даних лот</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Користувач</TableHead>
          <TableHead>Час</TableHead>
          <TableHead >Ставка</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bids.map((bid, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{bid.user.username}</TableCell>
            <TableCell>{formatDate(bid.createdAt)}</TableCell>
            <TableCell>{formatMoney(bid.bidAmount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Кількість ставок</TableCell>
          <TableCell >{bids.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
