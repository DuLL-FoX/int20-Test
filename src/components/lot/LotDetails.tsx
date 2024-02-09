import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuctionLot } from "@prisma/client";

type LotDetaisProps = {
  auctionLot: AuctionLot;
  children: React.ReactNode;
};

export default function LotDetails({
  auctionLot: {
    naming,
    objectClassifier,
    lotStatus,
    createdAt,
    lotLogoUrl,
    startPrice,
  },
  children,
}: LotDetaisProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md w-fit">
        <DialogHeader>
          <DialogTitle>Попередні входи</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {/* <form onSubmit={handleSubmit} className="flex flex-col space-y-2"> */}
        <div className="flex items-center w-full">
          <Label htmlFor="" className="w-full">
            ЛАЛАЛЕНД {naming}
          </Label>
          <Input
            type="text"
            id=""
            name=""
            required
            // onChange={}
            defaultValue=""
          />
        </div>
        <div className="flex items-center w-full">
          <Label htmlFor="" className="w-full">
            БУБУБІБІ {startPrice}
          </Label>
          <Input
            type=""
            id=""
            name=""
            required
            // onChange={}
          />
        </div>
        <Button type="submit" variant="outline" className="w-full">
          Увійти чи створити користувача
        </Button>
        {/* </form> */}
      </DialogContent>
    </Dialog>
  );
}
