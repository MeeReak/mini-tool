"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      title="Toggle theme"
      type="button"
      data-testid="theme-toggle"
      className="p-3 md:p-4 bg-[#f5dc50]/20 hover:bg-[#f5dc50]/30 border border-yellow-400 dark:border-yellow-500 rounded-full cursor-pointer "
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
