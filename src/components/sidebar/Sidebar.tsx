"use client";
import {
  MoreVertical,
  Settings,
  Home,
  Activity,
  PhoneCall,
  SquareUserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeButton } from "@/components/theme/ThemeButton";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import UserProfile from "../user/profile/Profile";
import Link from "next/link";
import {useUser} from "@/contexts/UserContext";

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
    link: "/auctions",
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
  const { selectedUser, setSelectedUser } = useUser();

  useEffect(() => {
    const storedSelectedUser = Cookies.get("selectedUser");
    if (storedSelectedUser) {
      setSelectedUser(storedSelectedUser);
    }

    localStorage.setItem("theme", theme as string);
  }, [theme, selectedUser]);

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
          selectedUser={selectedUser as string}
        />
        <div className="flex justify-between m-2 space-x-2">
          <span
            className={`flex items-center w-full justify-center  ${
              !expanded && "hidden"
            }`}
          >
            Змінити тему
          </span>

          <ThemeButton expanded={expanded} />
        </div>
        <UserProfile user={selectedUser as string}>
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
              <MoreVertical size={30} />
            </div>
          </div>
        </UserProfile>
      </nav>
    </aside>
  );
}
