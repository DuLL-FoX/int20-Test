import { cache } from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import AuctionDetailsPage from "@/components/auction/AuctionDetailsPage";
import { Button } from "@/components/ui/button";
import LotList from "@/components/lot/LotList";
import Chat from "@/components/chat/Chat";

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

const getLots = cache(async (slug: string) => {
  const lots = await db.auctionLot.findMany({
    where: { auction: { slug: slug } },
  });

  if (!lots) notFound();
  return lots;
});

const getContact = cache(async (contactPhone: string) => {
  const contact = await db.contactPoint.findUnique({
    where: { contactPhone: contactPhone },
  });

  if (!contact) notFound();
  return contact;
});

export async function generateStaticParams() {
  const auctions = await db.auction.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true },
  });

  return auctions.map(({ slug }) => slug);
}

export async function generateMetadata({
  params: { slug },
}: PageProps): Promise<Metadata> {
  const auction = await getAuction(slug);

  return {
    title: auction.title,
  };
}

export default async function AuctionDetails({ params: { slug } }: PageProps) {
  const auction = await getAuction(slug);
  const lots = await getLots(slug);
  const contact = await getContact(auction.contactPhone as string);
  const { contactEmail } = contact;
  const applicationLink = contactEmail && `mailto:${contactEmail}`;

  if (!applicationLink) {
    console.error("Аукціон не має email");
    notFound();
  }

  return (
    <main className="flex flex-col px-4 max-w-7xl my-10 space-y-10 md:items-center">
      <div className="flex justify-between space-x-60">
        <div className="flex flex-col m-auto md:flex-row items-center gap-5 md:items-start">
          <AuctionDetailsPage auction={auction} contact={contact} />
          <aside className="flex flex-col items-center space-y-5 border-l p-3 h-full">
            <div className="flex flex-col items-center">
              <Button asChild>
                <a href={applicationLink} className="w-40 md:w-fit">
                  Написати на email
                </a>
              </Button>
              <p className="flex items-center text-muted-foreground text-sm font-medium">
                {contactEmail}
              </p>
            </div>
            <div className="hidden md:flex shrink-0 items-end justify-center">
              <p className="border px-2 rounded py-1 bg-muted text-muted-foreground text-sm font-medium">
                {auction.status === "ACTIVE"
                  ? "Активний"
                  : auction.status === "ENDED"
                  ? "Закінчено"
                  : "Відмінено"}
              </p>
            </div>
          </aside>
        </div>
        <div className="flex">
          <Chat auctionSlug={slug} />
        </div>
      </div>
      <LotList lots={lots} slug={slug} />
    </main>
  );
}
