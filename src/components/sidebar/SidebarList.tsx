import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItem = {
  label: string;
  link: string;
  alert: boolean;
  icon: JSX.Element;
};

type SidebarGroupProps = {
  sidebarItems: SidebarItem[];
  expanded: boolean;
  theme: string | undefined;
};

export default function SidebarList({
  sidebarItems,
  expanded,
  theme,
}: SidebarGroupProps) {
  const pathName = usePathname();

  return (
    <ul className="flex-1 px-3">
      {sidebarItems.map((item: SidebarItem) => (
        <Link
          key={item.label}
          href={item.link}
          className={`relative flex justify-center items-center 
        py-2 px-3 my-1 font-medium 
        rounded-md cursor-pointer transition-colors group
        ${
          pathName === item.link || pathName.startsWith(`${item.link}/`)
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100"
            : "hover:bg-indigo-50 text-gray-600 "
        }
        ${
          theme === "dark" &&
          "text-indigo-100 from-indigo-700 to-indigo-600 hover:bg-indigo-500"
        }
        `}
        >
          {item.icon}
          <span
            className={`overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            {item.label}
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
  );
}
