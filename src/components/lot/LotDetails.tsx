"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuctionLot } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { FormEvent, useState } from "react";
import LotBids from "../bids/LotBids";

type LotDetaisProps = {
  auctionLot: AuctionLot;
  children: React.ReactNode;
};

export default function LotDetails({
  auctionLot: {
    id,
    naming,
    objectClassifier,
    lotStatus,
    lotLogoUrl,
    startPrice,
    userId,
  },
  children,
}: LotDetaisProps) {
  const [bidAmount, setBidAmount] = useState("");


  

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch(
      `/api/bids?lotId=${id}&userId=${userId}&bidAmount=${bidAmount}`,
      {
        method: "POST",
        cache: "no-store",
      }
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent className="max-w-sm ">
        <DialogHeader>
          <DialogTitle className="flex space-x-3 items-center justify-center">
            <h4>Деталі лоту</h4>
            <p className="border px-2 rounded py-1 bg-muted text-muted-foreground text-sm font-medium">
              {lotStatus === "ACTIVE"
                ? "Активний"
                : lotStatus === "SOLD"
                ? "Продано"
                : "Відмінено"}
            </p>
          </DialogTitle>
          <DialogDescription className="flex w-full items-center space-x-3">
            <Image
              src={lotLogoUrl}
              width={200}
              height={200}
              alt="logo url"
              className="bg-slate-50 rounded-md"
            />
            <p className="border px-2 rounded py-1 bg-muted items-end justify-end text-muted-foreground text-base font-semibold">
              Категорія: {objectClassifier}
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center w-full">
          <div className="flex flex-col items-center justify-start space-y-2">
            <Label htmlFor="" className="w-full">
              Назва: {naming}
            </Label>
          </div>
        </div>
        <div className="flex items-center w-full">
          <Label htmlFor="" className="w-full">
            Стартова ціна: {startPrice}
          </Label>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              Зробити ставку
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <form onSubmit={handleSubmit}>
              <Input
                placeholder="Ваша ціна"
                type="number"
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <Button type="submit" variant="outline" className="w-full">
                Поставити
              </Button>
            </form>
          </PopoverContent>
        </Popover>

        <div className="flex items-center w-full">
          <LotBids id={id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
