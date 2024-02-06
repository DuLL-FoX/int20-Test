import { cache } from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import AuctionDetailsPage from "@/components/auction/AuctionDetailsPage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname  } from 'next/navigation';

interface PageProps {
  params: { slug: string };
}

const getAuction = cache(async (slug: string) => {
  const auction = await db.auction.findUnique({
    where: { slug },
  });

  if (!auction) notFound();
  return auction;
});

const getContact = cache(async (contactName: string) => {
  const contact = await db.contactPoint.findUnique({
    where: { contactName: contactName },
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

export async function page({ params: { slug } }: PageProps) {
  const auction = await getAuction(slug);
  const contact = await getContact(
    auction.contactPointContactName
  );
  const { contactEmail } = contact;
  const applicationLink = contactEmail && `mailto:${contactEmail}`;
  if (!applicationLink) {
    console.error("Аукціон не має email");
    notFound();
  }

  return (
    <main className="flex flex-col px-4 max-w-7xl m-auto my-10 md:flex-row items-center gap-5 md:items-start">
      <AuctionDetailsPage auction={auction} contact={contact}/>
      <aside className="flex flex-col items-center space-y-5">
        <div className="flex flex-col items-center">
        <Button asChild>
          <a href={applicationLink} className="w-40 md:w-fit">
            Написати на email
          </a>
        </Button>
        <p className="flex items-center text-muted-foreground text-sm font-medium">{contactEmail}</p>
        </div>
        <div className="hidden md:flex shrink-0 items-end justify-center">
              <p className="border px-2 rounded py-1 bg-muted text-muted-foreground text-sm font-medium">
                {auction.status === "ACTIVE"
                  ? "Активний"
                  : auction.status === "ENDED"
                  ? "Закінчиний"
                  : "Відмінений"}
              </p>
            </div>
      </aside>
    </main>
  );


export function Page() {
  
    const pathname = usePathname()

    // receive last part of the path
    const slug = pathname.split('/').pop();

    return (
        <div>
            <Link href={"/lots/" + "new/"}>
                <Button>Створити новий лот</Button>
            </Link>
        </div>
    );
}
