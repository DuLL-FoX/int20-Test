import { Metadata } from "next";
import NewLotForm from "@/app/lots/new/NewLotForm";

export const metadata: Metadata = {
    title: "Опублікувати новий лот",
};

export default function NewLot() {
    return <NewLotForm />;
}
