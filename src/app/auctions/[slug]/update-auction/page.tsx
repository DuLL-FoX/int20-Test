import { Metadata } from "next";
import AuctionUpdateForm from "./AuctionUpdateForm";

export const metadata: Metadata = {
  title: "Оновити дані аукціону",
};

export default function NewLots() {
  return <AuctionUpdateForm />;
}
