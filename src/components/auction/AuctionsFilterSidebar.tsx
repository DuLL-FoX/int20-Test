import { statusAuc } from "@/lib/auction-types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Select from "../ui/select";
import {
  AuctionFilterValues,
  auctionFilterSchema,
} from "@/lib/Auction/validation";
import { redirect } from "next/navigation";
import FormSubmitButton from "../FormSubmitButton";

const filterAuctions = async (formData: FormData) => {
  "use server";

  const values = Object.fromEntries(formData.entries());

  const { q } = auctionFilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
  });

  redirect(`/auctions/?${searchParams.toString()}`);
};

type AuctionFilterSidebarProps = {
  defaultValues: AuctionFilterValues;
};

export default async function AuctionFilterSidebar({
  defaultValues,
}: AuctionFilterSidebarProps) {
  return (
    <aside className="lg:w-[300px] sticky top-0 bg-background border rounded-lg h-fit p-4">
      <form action={filterAuctions} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Пошук</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title, company, etc."
              defaultValue={defaultValues.q}
            />
          </div>
          <FormSubmitButton type="submit" className="w-full">
            Фільтрувати аукціони
          </FormSubmitButton>
        </div>
      </form>
    </aside>
  );
}
