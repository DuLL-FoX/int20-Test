import { Metadata } from "next";
import NewLotsForm from "@/app/auction/[slug]/new-lots/NewLotsForm";

export const metadata: Metadata = {
  title: "Додати лоти до аукціону",
};

export default function NewLots() {
  return <NewLotsForm />;
}
