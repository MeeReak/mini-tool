"use client";

import React, { useState } from "react";
import { LocaleSwitcher } from "./LocaleSwitcher";
import ThemeToggle from "./ThemeSwitcher";
import { SettingsIcon } from "lucide-react";

export const LocaleTheme = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleMenu = () => {
    if (isOpen) {
      // close
      setIsOpen(false);
      setTimeout(() => setIsVisible(false), 300); // match animation duration
    } else {
      // open
      setIsVisible(true);
      setIsOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-2 fixed right-8 bottom-8 md:w-[57.6px]">
      {isVisible && (
        <>
          <div
            className={`flex ${
              isOpen ? "animate-slide-up" : "animate-slide-down"
            }`}
          >
            <ThemeToggle />
          </div>
          <div
            className={`flex ${
              isOpen ? "animate-slide-up" : "animate-slide-down"
            }`}
          >
            <LocaleSwitcher />
          </div>
        </>
      )}

      <div
        onClick={toggleMenu}
        aria-label="Rotate icon"
        className="p-3 md:p-4 bg-[#f5dc50]/20 hover:bg-[#f5dc50]/30 border border-yellow-400 dark:border-yellow-500 rounded-full cursor-pointer"
      >
        <SettingsIcon
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-[180deg]" : ""
          }`}
        />
      </div>
    </div>
  );
};
