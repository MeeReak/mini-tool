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
      className="mx-auto space-y-4 max-w-2xl transition-all rounded-lg border bg-card p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
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
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-gray-800 font-kantumruy"
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
      <div className="group flex justify-between items-center">
        <div
          className="w-[70%] rounded-md border bg-muted/30 px-3 py-2 text-sm
    border-gray-300 dark:border-gray-600 dark:bg-gray-800 font-kantumruy"
        >
          <p>{lunarResult}</p>
        </div>

        <div
          className="
      opacity-0 translate-y-2
      group-hover:opacity-100 group-hover:translate-y-0
      transition-all duration-300 ease-out
      pointer-events-none group-hover:pointer-events-auto
    "
        >
          <CopyButton
            id="lunar"
            copiedButton={copiedButton}
            disabled={isAnyCopied && copiedButton !== "lunar"}
            label={t("copyDate")}
            success={t("copySuccess")}
            onClick={() => {
              showToast(t("copySuccess"), "success");
              handleCopy(lunarResult, "lunar");
            }}
          />
        </div>
      </div>

      {/* Khmer Date */}
      <div className="group flex justify-between items-center">
        <div
          className="w-[70%] rounded-md border bg-muted/30 px-3 py-2 text-sm
    border-gray-300 dark:border-gray-600 dark:bg-gray-800 font-kantumruy"
        >
          <p>{khmerDate}</p>
        </div>

        <div
          className="
      opacity-0 translate-y-2
      group-hover:opacity-100 group-hover:translate-y-0
      transition-all duration-300 ease-out
      pointer-events-none group-hover:pointer-events-auto
    "
        >
          <CopyButton
            id="khmer"
            copiedButton={copiedButton}
            disabled={isAnyCopied && copiedButton !== "khmer"}
            label={t("copyDate")}
            success={t("copySuccess")}
            onClick={() => {
              showToast(t("copySuccess"), "success");
              handleCopy(khmerDate, "khmer");
            }}
          />
        </div>
      </div>

      {/* Default Date */}
      <div className="group flex justify-between items-center">
        <div
          className="w-[70%] rounded-md border bg-muted/30 px-3 py-2 text-sm
    border-gray-300 dark:border-gray-600 dark:bg-gray-800 font-kantumruy"
        >
          <p>{defaultDate}</p>
        </div>

        <div
          className="
      opacity-0 translate-y-2
      group-hover:opacity-100 group-hover:translate-y-0
      transition-all duration-300 ease-out
      pointer-events-none group-hover:pointer-events-auto
    "
        >
          <CopyButton
            id="default"
            copiedButton={copiedButton}
            disabled={isAnyCopied && copiedButton !== "default"}
            label={t("copyDate")}
            success={t("copySuccess")}
            onClick={() => {
              showToast(t("copySuccess"), "success");
              handleCopy(defaultDate, "default");
            }}
          />
        </div>
      </div>
    </section>
  );
};

const CopyButton = ({
  id,
  disabled,
  copiedButton,
  onClick,
  label,
  success
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="min-w-[120px] py-[10px] text-xs rounded transition-all flex items-center justify-center gap-1
      bg-gray-200 dark:bg-gray-700
      hover:bg-gray-300 dark:hover:bg-gray-600
      disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {copiedButton === id ? (
      <>
        <Check className="size-3" />
        {success}
      </>
    ) : (
      <>
        <Copy className="size-3" />
        {label}
      </>
    )}
  </button>
);
