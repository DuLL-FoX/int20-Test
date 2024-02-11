import { cache } from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { GetUserBids } from "@/app/api/bids/UserBids/UserBids";
import H1 from "@/components/ui/h1";
import Link from "next/link";
import AuctionListItem from "@/components/auction/AuctionListItem";
import { Auction } from "@prisma/client";

const getAuction = cache(async (username: string) => {
  return await db.auction.findMany({
    where: { authorName: username },
  });
});

const getLots = cache(async (username: string) => {
  return await db.auctionLot.findMany({
    where: { auction: { authorName: username } },
  });
});

export async function generateStaticParams() {
  const users = await db.user.findMany({
    select: { username: true },
  });

  return users.map(({ username }) => username);
}

export async function generateMetadata({
  params: { username },
}: MyBidsProps): Promise<Metadata> {
  const user = await db.user.findUnique({
    where: { username },
  });

  return {
    title: user?.username,
  };
}

type MyBidsProps = {
  params: { username: string };
};

export default async function MyActivity({ params: { username } }: MyBidsProps) {
  const bids = await GetUserBids(username);
  const auction = await getAuction(username);
  return (
    <main className="flex flex-col px-4 w-full max-w-7xl my-10 space-y-10 md:items-center">
      {auction.length === 0 && (
        <div className="flex flex-col items-center">
          <H1>Немає власних аукціонів</H1>
          <Button>
            <Link href="/auctions">Створити аукціон</Link>
          </Button>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2 max-md:grid-cols-1 place-content-start">
        {auction.map((data: Auction) => (
          <Link key={data.id} href={`/auctions/${data.slug}`} className="block">
            <AuctionListItem auction={data} />
          </Link>
        ))}
      </div>
      {bids.length === 0 && (
        <div className="flex flex-col items-center">
          <H1>Зробити ставку</H1>
          <Button>
            <Link href="/auctions">Зробити ставку</Link>
          </Button>
        </div>
      )}
      {bids.map((bid) => (
        <div>
          <p>{bid.userId}</p>
          <p>{bid.bidAmount}</p>
        </div>
      ))}
    </main>
  );
}
