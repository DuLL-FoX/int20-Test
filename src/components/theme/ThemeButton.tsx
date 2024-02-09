"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

type ThemeButtonProps = {
  expanded: boolean;
};

export function ThemeButton({ expanded }: ThemeButtonProps) {
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setTheme(localStorage.getItem("theme") as string);
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(`${theme === "light" ? "dark" : "light"}`)}
      className={`${expanded && "w-full"}`}
    >
      <Sun
        size={20}
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        size={20}
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
    </Button>
  );
}
