"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LotBids from "@/components/bids/LotBids";
import { useUser } from "@/contexts/UserContext";
import { AuctionLot } from "@prisma/client";
import { PopoverClose } from "@radix-ui/react-popover";

interface LotDetailsProps {
  auctionLot: AuctionLot;
  children?: ReactNode;
}

export default function LotDetails(props: LotDetailsProps) {
  const { auctionLot, children } = props;
  const { id, naming, objectClassifier, lotStatus, lotLogoUrl, startPrice } =
    auctionLot;
  const [bidAmount, setBidAmount] = useState<string>("");
  const { selectedUser } = useUser();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/bids?lotId=${id}&username=${selectedUser}&bidAmount=${bidAmount}`,
        {
          method: "POST",
          cache: "no-store",
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error submitting bid:", error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full h-fit">
        <DialogHeader className="flex space-y-3">
          <DialogTitle className="flex border px-2 rounded py-1 bg-muted justify-between text-muted-foreground text-sm font-medium">
            Деталі лоту
            <hr />
            {lotStatus === "ACTIVE"
              ? "Активний"
              : lotStatus === "SOLD"
              ? "Продано"
              : "Відмінено"}
          </DialogTitle>
          <div className="flex w-full items-start justify-between space-x-3">
            <Image
              src={lotLogoUrl}
              width={200}
              height={200}
              alt="Lot Logo"
              className="bg-slate-50 rounded-md"
            />
            <div className="flex flex-col border-l p-4 h-full">
              <article className="flex border w-full px-2 rounded py-1 bg-muted text-muted-foreground text-sm font-medium">
                Категорія: {objectClassifier}
              </article>
              <div>
                <Label className="w-full">Назва: {naming}</Label>
              </div>
              <div>
                <Label className="w-full">Стартова ціна: {startPrice}</Label>
              </div>
            </div>
          </div>
        </DialogHeader>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              Зробити ставку
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="center">
            <form
              onSubmit={handleSubmit}
              className="w-full space-y-4 flex flex-col"
            >
              <Input
                placeholder="Ваша ціна"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <PopoverClose type="submit" className="w-full border rounded-md">
                Поставити
              </PopoverClose>
            </form>
          </PopoverContent>
        </Popover>
        <div className="flex w-full overflow-auto border rounded-md max-h-60 pb-2">
          <LotBids id={id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
