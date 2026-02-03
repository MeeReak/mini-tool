"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getLunarDate } from "@/util/LunarDate";
import { getDate, getKhmerDate } from "../../util/Helper";
import { Check, Copy } from "lucide-react";
import { Toast } from "../Toast";

export const LunarDate = () => {
  const t = useTranslations("LunarDate");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [khmerDate, setKhmerDate] = useState("");
  const [lunarResult, setLunarResult] = useState("");
  const [defaultDate, setDefaultDate] = useState("");
  const [copiedButton, setCopiedButton] = useState("");
  const [toast, setToast] = useState(null);
  const isAnyCopied = copiedButton !== "";

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const handleDateChange = (event) => {
    const dateValue = new Date(event.target.value);
    if (isNaN(dateValue.getTime())) {
      showToast(t("invalidDate"), "warning");
      return;
    }
    updateDateResults(dateValue);
  };

  const updateDateResults = (dateValue) => {
    setSelectedDate(dateValue);
    const lunarDate = getLunarDate(dateValue);
    setKhmerDate(getKhmerDate(dateValue));
    setDefaultDate(getDate(dateValue));
    setLunarResult(lunarDate);
  };

  useEffect(() => {
    updateDateResults(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleCopy = (text, key) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedButton(key);
        setTimeout(() => setCopiedButton(""), 1500);
      })
      .catch(() => {
        showToast(t("copyFailed"), "error");
      });
  };

  return (
    <section
      aria-labelledby="lunar-date-title"
      className="mx-auto space-y-4 max-w-2xl transition-all rounded-xl bg-card p-6 
      border border-black/10 dark:border-white/10
      bg-white dark:bg-[#060709]
      shadow-sm"
    >
      <header className="flex justify-between items-center">
        <h1 id="lunar-date-title" className="block font-semibold text-xl">
          {t("chooseDate")}
        </h1>
      </header>
      <div>
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={handleDateChange}
          className="w-full rounded-md border-input bg-background py-2 px-3 text-sm shadow-sm transition-colors focus:border-[#f5dc50] focus:outline-none focus:ring-1 focus:ring-[#f5dc50] font-kantumruy
          border border-black/10 dark:border-white/10
                bg-black/5 dark:bg-white/5 dark:hover:bg-white/10"
        />
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Lunar Date */}
      <div className="group">
        <div
          className="w-full rounded-md px-3 py-2 text-sm
    flex justify-between items-center font-kantumruy border border-black/10 dark:border-white/10
                bg-black/5 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <p>{lunarResult}</p>
          <div
            className="
    opacity-0 translate-y-1 scale-95
    group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
    transition-all duration-200 ease-out
    pointer-events-none group-hover:pointer-events-auto
  "
          >
            <CopyButton
              id="lunar"
              copiedButton={copiedButton}
              disabled={isAnyCopied && copiedButton !== "lunar"}
              onClick={() => {
                showToast(t("copySuccess"), "success");
                handleCopy(lunarResult, "lunar");
              }}
            />
          </div>
        </div>
      </div>

      {/* Khmer Date */}
      <div className="group">
        <div
          className="w-full rounded-md px-3 py-2 text-sm
    flex justify-between items-center font-kantumruy border border-black/10 dark:border-white/10
                bg-black/5 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <p>{khmerDate}</p>
          <div
            className="
    opacity-0 translate-y-1 scale-95
    group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
    transition-all duration-200 ease-out
    pointer-events-none group-hover:pointer-events-auto
  "
          >
            <CopyButton
              id="khmer"
              copiedButton={copiedButton}
              disabled={isAnyCopied && copiedButton !== "khmer"}
              onClick={() => {
                showToast(t("copySuccess"), "success");
                handleCopy(khmerDate, "khmer");
              }}
            />
          </div>
        </div>
      </div>

      {/* Default Date */}
      <div className="group">
        <div
          className="w-full rounded-md px-3 py-2 text-sm
    flex justify-between items-center font-kantumruy border border-black/10 dark:border-white/10
                bg-black/5 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <p>{defaultDate}</p>
          <div
            className="
    opacity-0 translate-y-1 scale-95
    group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
    transition-all duration-200 ease-out
    pointer-events-none group-hover:pointer-events-auto
  "
          >
            <CopyButton
              id="default"
              copiedButton={copiedButton}
              disabled={isAnyCopied && copiedButton !== "default"}
              onClick={() => {
                showToast(t("copySuccess"), "success");
                handleCopy(defaultDate, "default");
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const brandActionBtn = `
  p-2 rounded-md flex items-center justify-center gap-1
  bg-[#f5dc50] text-black
  transition-all duration-150 ease-out
  enabled:hover:brightness-90
  enabled:active:scale-95
  focus:outline-none focus:ring-1 focus:ring-[#f5dc50]
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const CopyButton = ({ id, disabled, copiedButton, onClick }) => (
  <button disabled={disabled} onClick={onClick} className={brandActionBtn}>
    {copiedButton === id ? (
      <Check className="size-3" />
    ) : (
      <Copy className="size-3" />
    )}
  </button>
);
