import { Button } from "@/components/ui/button";
import { Auction, AuctionLot } from "@prisma/client";
import Link from "next/link";
import { cache } from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import LotListItem from "@/components/lot/LotListItem";
import { useRouter } from "next/router";

interface PageProps {
  params: { slug: string };
}

const getAuction = cache(async (slug: string) => {
  const auction = await db.auction.findUnique({
    where: { slug: slug },
  });

  if (!auction) notFound();
  return auction;
});

export default async function Auction({ params: { slug } }: PageProps) {
  const data = await fetch(`http://localhost:3000/api/lots/${slug}`, {
    method: "GET",
    cache: "no-store",
  }).then((data) => data.json());

  const { asPath } = useRouter();

  return (
    <div className="flex flex-col space-y-5 items-end">
      <Link href={"/auction/new"}>
        <Button>Створити новий аукціон</Button>
      </Link>
      <div className="grid gap-4 lg:grid-cols-3 max-md:grid-cols-1 place-content-start">
        {data.map((data: AuctionLot) => (
          <Link key={data.id} href={`${asPath}/lots/${data.lotSlug}`} className="block">
            <LotListItem auctionLot={data} />
          </Link>
        ))}
        {data.length === 0 && (
          <p className="text-center m-auto">
            There is no data found. Try adjusting your search filters.
          </p>
        )}
      </div>
    </div>
  );
}
