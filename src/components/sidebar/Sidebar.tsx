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
import Link from "next/link";
import { useState } from "react";

const items = [
  {
    icon: <Home size={20} />,
    text: "Домашня",
    active: true,
    alert: false,
    href: "/",
  },
  {
    icon: <Activity size={20} />,
    text: "Аукціони",
    active: false,
    alert: true,
    href: "/",
  },
  {
    icon: <PhoneCall size={20} />,
    text: "Контакти",
    active: false,
    alert: false,
    href: "/",
  },
  {
    icon: <Settings size={20} />,
    text: "Налаштування",
    active: false,
    alert: false,
    href: "/",
  },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

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
          <img
            src="https://img.logoipsum.com/288.svg"
            alt="App logo"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <ul className="flex-1 px-3">
          {items.map((item) => (
            <Link
              key={item.text}
              href={item.href}
              className={`relative flex justify-center items-center 
              py-2 px-3 my-1 font-medium 
              rounded-md cursor-pointer transition-colors group
              ${
                item.active
                  ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                  : "hover:bg-indigo-50 text-gray-600"
              }`}
            >
              {item.icon}

              <span
                className={`overflow-hidden transition-all ${
                  expanded ? "w-52 ml-3" : "w-0"
                }`}
              >
                {item.text}
              </span>
              {item.alert && (
                <div
                  className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
                    expanded ? "" : "top-2"
                  }`}
                />
              )}
            </Link>
          ))}
        </ul>
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
              <h3 className="font-semibold">Username</h3>
              <span className="text-gray-700 text-sm ">Є активні лоти</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}
