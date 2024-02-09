import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "@prisma/client";

type UserProfileProps = {
  children: React.ReactNode;
  user: string;
};

export default function UserProfile({ children, user }: UserProfileProps) {
  return (
    <Popover>
      <PopoverTrigger asChild className="cursor-pointer">
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="w-fit">
          <h4>Змінити нік або пароль</h4>
          <p>{user}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
