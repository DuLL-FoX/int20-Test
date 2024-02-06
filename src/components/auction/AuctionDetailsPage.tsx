import { formatDate } from "@/lib/utils";
import { Auction, ContactPoint } from "@prisma/client";
import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  Contact2,
  PhoneForwarded,
} from "lucide-react";
import Image from "next/image";
import Markdown from "../Makrdown";

interface AuctionDetailsPageProps {
  auction: Auction;
  contact: ContactPoint;
}

export default function AuctionDetailsPage({
  auction: {
    title,
    auctionDate,
    createdAt,
    auctionLotLogoUrl,
    updatedAt,
    briefDescription,
  },
  contact: { contactName, contactPhone },
}: AuctionDetailsPageProps) {
  return (
    <section className="w-full grow space-y-5">
      <div className="flex items-center gap-4">
        {auctionLotLogoUrl && (
          <Image
            src={auctionLotLogoUrl}
            alt="Company logo"
            width={100}
            height={100}
            className="rounded-xl bg-slate-50"
          />
        )}
        <div>
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          <div className="text-muted-foreground">
            <p className="flex items-center gap-2">
              <Contact2 size={25} className="shrink-0" />
              {contactName}
            </p>
            <p className="flex items-center gap-2">
              <PhoneForwarded size={16} className="shrink-0" />
              {contactPhone}
            </p>
            <p className="flex items-center gap-2">
              <CalendarClock size={16} className="shrink-0" />
              {formatDate(auctionDate)}
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays size={16} className="shrink-0" />
              {formatDate(createdAt)}
            </p>
            <p className="flex items-center gap-2">
              <CalendarCheck size={16} className="shrink-0" />
              {formatDate(updatedAt)}
            </p>
          </div>
        </div>
      </div>
      <div>{briefDescription && <Markdown>{briefDescription}</Markdown>}</div>
    </section>
  );
}
