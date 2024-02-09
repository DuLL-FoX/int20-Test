import { Auction } from "@prisma/client";
import { Briefcase, Clock, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import logoPlaceholder from "@/assets/building-2.svg";

type AuctionListItemProps = {
  auction: Auction;
};

export default function AuctionListItem({
  auction: {
    title,
    status,
    auctionDate,
    createdAt,
    auctionLotLogoUrl,
    updatedAt,
    contactPointContactName,
  },
}: AuctionListItemProps) {
  return (
    <article className="flex md:min-h-full gap-3 rounded-xl border p-4 hover:bg-muted/60">
      <Image
        src={auctionLotLogoUrl || logoPlaceholder}
        alt={`${title} logo`}
        className="rounded-lg self-center bg-slate-50"
        height={100}
        width={100}
      />
      <div className="flex-grow space-y-3">
        <div>
          <h2 className="text-xl font-medium">{title}</h2>
          <p className="text-muted-foreground">{formatDate(createdAt)}</p>
        </div>
        <div className="text-muted-foreground">
          <p className="flex items-center gap-2 md:hidden">
            <Briefcase size={16} className="shrink-0" />
            {status === "ACTIVE"
              ? "Активний"
              : status === "ENDED"
              ? "Закінчено"
              : "Відмінено"}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={16} className="shrink-0" />
            {formatDate(auctionDate)}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={16} className="shrink-0" />
            {contactPointContactName}
          </p>
          <p className="flex items-center gap-2 md:hidden">
            <Clock size={16} className="shrink-0" />
            {formatDate(createdAt)}
          </p>
        </div>
      </div>
      <div className="hidden md:flex flex-col shrink-0 items-end justify-between">
        <span className="border px-2 rounded py-1 bg-muted text-muted-foreground text-sm font-medium">
          {status}
        </span>
        <span className="flex items-center gap-2 text-muted-foreground">
          <Clock size={16} />
          {formatDate(updatedAt)}
        </span>
      </div>
    </article>
  );
}
