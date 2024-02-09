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
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-fit">
        <DialogHeader>
          <DialogTitle>Деталі лоту</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex items-center w-full">
          <Label htmlFor="" className="w-full">
            Назва: {naming}
          </Label>
         
        </div>
        <div className="flex items-center w-full">
          <Label htmlFor="" className="w-full">
            Стартова ціна: {startPrice}
          </Label>
        </div>
        <Button variant="outline" className="w-full">
          Увійти чи створити користувача
        </Button>
      </DialogContent>
    </Dialog>
  );
}
