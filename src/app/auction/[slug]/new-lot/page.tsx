import { Metadata } from "next";
import NewLotForm from "@/app/auction/[slug]/new-lot/NewLotForm";

export const metadata: Metadata = {
  title: "Додати лоти до аукціону",
};

export default function NewLots() {
  return <NewLotForm />;
}
