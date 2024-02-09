import { Metadata } from "next";
import NewAuctionForm from "@/app/auction/new/NewAuctionForm";

export const metadata: Metadata = {
  title: "Опублікувати новий аукціон",
};

export default function NewAuction() {
  return <NewAuctionForm />;
}
