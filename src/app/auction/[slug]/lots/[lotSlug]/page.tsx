import { Button } from "@/components/ui/button";
import { AuctionLot } from "@prisma/client";
import Link from "next/link";
import LotListItem from "@/components/lot/LotListItem";
import { useRouter } from "next/router";
import useSWR from "swr";

interface PageProps {
  params: { slug: string };
}

const fetcher = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data');
  }
};


export default function Auction({ params: { slug } }: PageProps) {
  const { data, error } = useSWR(`/api/lots/${slug}`, fetcher);
  const { asPath } = useRouter();

  if (error) return <div>Error loading lots...</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col space-y-5 items-end">
      <Link href={"/auction/new"}>
        <Button>Створити новий аукціон</Button>
      </Link>
      <div className="grid gap-4 lg:grid-cols-3 max-md:grid-cols-1 place-content-start">
        {data.map((auctionLot: AuctionLot) => (
          <Link
            key={auctionLot.id}
            href={`${asPath}/lots/${auctionLot.lotSlug}`}
            className="block"
          >
            <LotListItem auctionLot={auctionLot} />
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
