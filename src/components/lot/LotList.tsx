import Link from "next/link";
import { Button } from "../ui/button";
import LotListItem from "./LotListItem";
import { AuctionLot } from "@prisma/client";
import LotDetails from "./LotDetails";

type LotListProps = {
  lots: AuctionLot[];
  slug: string;
};

export default function LotList({ lots, slug }: LotListProps) {
  return (
    <div className="flex flex-col w-full max-w-7xl items-end gap-2">
      <Button asChild>
        <Link href={`/auctions/${slug}/new-lot`} className="md:w-fit">
          Додати лоти для даного аукціону
        </Link>
      </Button>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-3 border-t w-full pt-3">
        {lots.map((lot, key) => {
          return (
            <div key={key}>
              <LotDetails auctionLot={lot}>
                <LotListItem auctionLot={lot} />
              </LotDetails>
            </div>
          );
        })}
      </div>
    </div>
  );
}
