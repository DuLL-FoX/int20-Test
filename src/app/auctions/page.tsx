import { Button } from "@/components/ui/button";
import { Auction } from "@prisma/client";
import Link from "next/link";
import dynamic from "next/dynamic";
import AuctionFilterSidebar from "@/components/auction/AuctionsFilterSidebar";
import {
  AuctionFilterValues,
  auctionFilterSchema,
} from "@/lib/Auction/validation";
import { Metadata } from "next";
import AuctionResult from "@/components/auction/AuctionResult";

const AuctionListItem = dynamic(
  () => import("@/components/auction/AuctionListItem")
);

type PageProps = {
  searchParams: {
    q?: string;
  };
};

const getTitle = ({ q }: AuctionFilterValues) => {
  const title = q ? `${q} аукціони` : "Усі аукціони";

  return `${title}`;
};

export const generateMetadata = ({
  searchParams: { q },
}: PageProps): Metadata => {
  return {
    title: `${getTitle({
      q,
    })} | Аукціони`,
  };
};

export default async function Auction({ searchParams: { q } }: PageProps) {

  const filterValues: AuctionFilterValues = {
    q,
  };

  return (
    <main className="flex flex-col space-y-5 items-end">
      <Link href={"/auctions/new"}>
        <Button>Створити новий аукціон</Button>
      </Link>
      <section className="flex flex-col lg:flex-row gap-3">
        <AuctionFilterSidebar defaultValues={filterValues} />
        <AuctionResult filterValues={filterValues} />
      </section>
    </main>
  );
}
