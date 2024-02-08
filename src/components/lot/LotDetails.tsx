import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LotDetails() {
  const pathname = usePathname();

  // receive last part of the path
  const slug = pathname.split("/").pop();

  return (
    <div>
      <Link href={"/lots/" + "new/"}>
        <Button>Створити новий лот</Button>
      </Link>
    </div>
  );
}
