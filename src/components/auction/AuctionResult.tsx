import { Prisma } from "@prisma/client";
import { AuctionFilterValues } from "@/lib/Auction/validation";
import { db } from "@/lib/db";
import Link from "next/link";
import dynamic from "next/dynamic";

type AuctionResultsProps = {
  filterValues: AuctionFilterValues;
};

import AuctionListItem from "@/components/auction/AuctionListItem";

export default async function AuctionResults({
  filterValues: { q },
}: AuctionResultsProps) {
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchFilter: Prisma.AuctionWhereInput = searchString
    ? {
        OR: [
          { title: { search: searchString } },
          { authorName: { search: searchString } },
        ],
      }
    : {};

  const where: Prisma.AuctionWhereInput = {
    AND: [searchFilter],
  };

  const auctions = await db.auction.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 place-content-start">
      {auctions.map((auction) => (
        <Link
          key={auction.id}
          href={`/auctions/${auction.slug}`}
          className="block"
        >
          <AuctionListItem auction={auction} />
        </Link>
      ))}
      {auctions.length === 0 && (
        <p className="text-center m-auto">Не знайдено аукціонів</p>
      )}
    </div>
  );
}
