"use client";
import {
  ChevronFirst,
  MoreVertical,
  Settings,
  ChevronLast,
  Home,
  Activity,
  PhoneCall,
  SquareUserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeButton } from "@/components/theme/ThemeButton";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";

const sidebarItems = [
  {
    icon: <Home size={20} />,
    label: "Домашня",
    alert: false,
    link: "/",
  },
  {
    icon: <Activity size={20} />,
    label: "Аукціони",
    alert: true,
    link: "/auction",
  },
  {
    icon: <PhoneCall size={20} />,
    label: "Контакти",
    alert: false,
    link: "/contacts",
  },
  {
    icon: <Settings size={20} />,
    label: "Налаштування",
    alert: false,
    link: "/settings",
  },
];

const SidebarList = dynamic(() => import("./SidebarList"), {
  ssr: false,
});

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const { theme } = useTheme();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    const storedSelectedUser = Cookies.get("selectedUser");
    if (storedSelectedUser) {
      setSelectedUser(storedSelectedUser);
    }

    localStorage.setItem("theme", theme as string);
  }, [theme]);

  return (
    <aside className="h-screen">
      <nav
        className={`h-full flex flex-col bg-background border-r shadow-md ${
          expanded ? "w-60" : ""
        }`}
      >
        <SidebarList
          sidebarItems={sidebarItems}
          expanded={expanded}
          theme={theme}
          setExpanded={setExpanded}
        />
        <div className="flex justify-between m-2 space-x-2">
          <span
            className={`flex items-center w-fit justify-center  ${
              !expanded && "hidden"
            }`}
          >
            Змінити тему
          </span>
          <ThemeButton />
        </div>
        <div
          className={`flex justify-center items-center p-2 border-t leading-4`}
        >
          <SquareUserRound size={40} />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0 border-none hidden"
            }`}
          >
            <div
              className={`flex flex-col overflow-hidden transition-all ${
                expanded ? "w-52 ml-3" : "w-0"
              }`}
            >
              <h3 className="font-semibold">{selectedUser}</h3>
              <span className="text-gray-700 text-sm ">Є активні лоти</span>
            </div>
            <Button onClick={(e) => setSelectedUser("")} size="icon">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
