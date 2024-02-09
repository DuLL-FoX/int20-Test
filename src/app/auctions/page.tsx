import AuctionListItem from "@/components/auction/AuctionListItem";
import { Button } from "@/components/ui/button";
import { Auction } from "@prisma/client";
import Link from "next/link";

export default async function Auction() {
  const data = await fetch(`http://localhost:3000/api/auction`, {
    method: "GET",
    cache: "no-store",
  }).then((data) => data.json());

  return (
    <div className="flex flex-col space-y-5 items-end">
      <Link href={"/auctions/new"}>
        <Button>Створити новий аукціон</Button>
      </Link>
      <div className="grid gap-4 lg:grid-cols-3 max-md:grid-cols-1 place-content-start">
        {data.map((data: Auction) => (
          <Link key={data.id} href={`/auctions/${data.slug}`} className="block">
            <AuctionListItem auction={data} />
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
