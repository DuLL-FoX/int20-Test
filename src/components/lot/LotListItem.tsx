"use client";

import { AuctionLot } from "@prisma/client";
import { Banknote, Briefcase, Clock, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { formatDate, formatMoney } from "@/lib/utils";
import logoPlaceholder from "@/assets/building-2.svg";
import { useTheme } from "next-themes";

type LotListItemProps = {
  auctionLot: AuctionLot;
};

export default function AuctionListItem({
  auctionLot: {
    naming,
    objectClassifier,
    lotStatus,
    createdAt,
    lotLogoUrl,
    startPrice,
  },
}: LotListItemProps) {
  const { theme } = useTheme();

  return (
    <article className="flex md:min-h-full gap-3 rounded-xl border p-4 hover:bg-muted/60">
      <Image
        src={logoPlaceholder}
        alt={`${naming}-${objectClassifier} logo`}
        className="rounded-lg self-center"
        height={50}
        width={50}
      />
      <div className="flex-grow space-y-3">
        <div>
          <h2 className="text-xl font-medium">{naming}</h2>
          <h3 className="text-lg font-medium">{objectClassifier}</h3>
          <p className="text-muted-foreground">{formatDate(createdAt)}</p>
        </div>
        <div className="text-muted-foreground">
          <p className="flex items-center gap-2 md:hidden">
            <Briefcase size={16} className="shrink-0" />
            {lotStatus}
          </p>
          <p className="flex items-center gap-2">
            <Banknote size={16} className="shrink-0" />
            {formatMoney(startPrice)}
          </p>
          <p className="flex items-center gap-2 md:hidden">
            <Clock size={16} className="shrink-0" />
            {formatDate(createdAt)}
          </p>
        </div>
      </div>
      <div className="hidden md:flex flex-col shrink-0 items-end justify-between">
        <span className="border px-2 rounded py-1 bg-muted text-muted-foreground text-sm font-medium">
          {lotStatus}
        </span>
        <span className="flex items-center gap-2 text-muted-foreground">
          <Clock size={16} />
          {formatDate(createdAt)}
        </span>
      </div>
    </article>
  );
}
