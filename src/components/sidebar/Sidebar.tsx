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
import SidebarList from "./SidebarList";
import { ThemeButton } from "@/components/theme/ThemeButton";
import { useTheme } from "next-themes";
import Image from "next/image";
import Cookies from "js-cookie";
import { Button } from "../ui/button";

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

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const { theme } = useTheme();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    const storedSelectedUser = Cookies.get("selectedUser");
    if (storedSelectedUser) {
      setSelectedUser(storedSelectedUser);
    }
  }, [selectedUser]);

  return (
    <aside className="h-screen">
      <nav
        className={`h-full flex flex-col bg-background border-r shadow-md ${
          expanded ? "w-60" : ""
        }`}
      >
        <div
          className={`p-4 pb-2 flex justify-between items-center ${
            expanded ? "space-x-2" : ""
          }`}
        >
          <Image
            src="https://img.logoipsum.com/288.svg"
            alt="App logo"
            width={32}
            height={10}
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200
                      ${theme === "dark" ? "bg-gray-600 hover:bg-gray-700" : ""}
            `}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <SidebarList
          sidebarItems={sidebarItems}
          expanded={expanded}
          theme={theme}
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
