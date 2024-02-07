import { FC } from "react";
import { cache } from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import LotDetailsPage from "@/components/lot/LotDetails";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: { lotSlug: string };
}

const getLots = cache(async (lotSlug: string) => {
    const lot = await db.auctionLot.findUnique({
      where: { lotSlug: lotSlug },
    });
  
    if (!lot) notFound();
    return lot;
  });
  
  const getContact = cache(async (contactName: string) => {
    const contact = await db.contactPoint.findUnique({
      where: { contactName: contactName },
    });
  
    if (!contact) notFound();
    return contact;
  });
  
  export async function generateStaticParams() {
    const lots = await db.auctionLot.findMany({
      where: { lotStatus: "ACTIVE" },
      select: { lotSlug: true },
    });
  
    return lots.map(({ lotSlug }) => lotSlug);
  }
  
  export async function generateMetadata({
    params: { lotSlug },
  }: PageProps): Promise<Metadata> {
    const lot = await getLots(lotSlug);
  
    return {
      title: lot.naming,
    };
  }

export default async function LotDetailsPage({ params: { lotSlug } }: PageProps) {
  const lot = await getLots(lotSlug);

}

  return (
    <main className="flex flex-col px-4 max-w-7xl m-auto my-10 md:flex-row items-center gap-5 md:items-start">
      <lotDetailsPage lot={lot} contact={contact} />
      <aside className="flex flex-col items-center space-y-5">
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
            {lot.status === "ACTIVE"
              ? "Активний"
              : lot.status === "ENDED"
              ? "Закінчиний"
              : "Відмінений"}
          </p>
        </div>
      </aside>
    </main>
  );
}