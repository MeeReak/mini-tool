"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CASE_TYPES } from "../../util/Constant";
import { CheckIcon, CopyIcon, DownloadIcon, Trash2Icon } from "lucide-react";

const transformers = {
  sentence: (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(),
  lower: (t) => t.toLowerCase(),
  upper: (t) => t.toUpperCase(),
  capitalized: (t) => t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
  alternating: (t) =>
    [...t].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join(""),
  title: (t) => t.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase()),
  inverse: (t) =>
    [...t]
      .map((c) => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase()))
      .join(""),
  "no-symbol": (t) =>
    t
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
};

const caseTransform = (type, text, options) => {
  if (type === "random-separator") {
    const sep = options?.separator ?? "_";
    return options?.replaceExisting
      ? text.replace(/[_-]+/g, sep)
      : text.trim().replace(/\s+/g, sep);
  }

  return transformers[type]?.(text) ?? text;
};

export const CaseCover = () => {
  const t = useTranslations("CaseConvert");
  const [text, setText] = useState("");
  const historyRef = useRef([]);
  const textareaRef = useRef(null);
  const separatorRef = useRef("_"); // current "next" separator; will toggle on click
  const [copiedButton, setCopiedButton] = useState(""); // track which case button was copied

  const pushHistory = useCallback((prev, next) => {
    if (prev !== next) {
      historyRef.current.push(prev);
    }
  }, []);

  const handleCaseChange = useCallback(
    (type) => {
      pushHistory(text);

      if (type === "random-separator") {
        const next = separatorRef.current === "_" ? "-" : "_";
        const transformed = caseTransform(type, text, {
          separator: next,
          replaceExisting: /[_-]/.test(text)
        });

        separatorRef.current = next;
        setText(transformed);
        return;
      }

      setText(caseTransform(type, text));
    },
    [text, pushHistory]
  );

  const handleTextChange = useCallback(
    (e) => {
      if (e.nativeEvent.isComposing) return;

      const nextValue = e.target.value;
      pushHistory(text, nextValue);
      setText(nextValue);
    },
    [text, pushHistory]
  );

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      const prev = historyRef.current.pop();
      if (prev !== undefined) {
        setText(prev);
        requestAnimationFrame(() => {
          const el = textareaRef.current;
          if (el) {
            const pos = prev.length;
            try {
              el.selectionStart = el.selectionEnd = pos;
            } catch {}
          }
        });
      }
    }
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date();
    const isoString = today.toISOString();

    a.href = url;
    a.download = `case-convert-${isoString.split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = React.useMemo(
    () => ({
      character: text.length,
      word: text.trim() ? text.trim().split(/\s+/).length : 0
    }),
    [text]
  );

  const handleCopy = (text, key) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedButton(key);
        setTimeout(() => setCopiedButton(""), 1500); // reset after 1.5s
      })
      .catch(() => console.error("Failed to copy"));
  };

  useEffect(() => textareaRef.current?.focus(), []);

  const actionBtn =
    "enabled:hover:brightness-90 py-2 px-3 rounded-md text-white transition-transform duration-50 ease-out enabled:active:scale-95 focus:outline-none focus:ring-1";

  const disabled = "opacity-50";

  return (
    <section
      aria-labelledby="case-convert"
      className="p-6 max-w-[860px] mx-auto"
    >
      <input
        placeholder={t("inputLabel")}
        ref={textareaRef}
        id="case-textarea"
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        spellCheck={true}
        className="
          w-full text-center text-base
          p-3
          bg-transparent
          border-b-2 border-[#060709]/30
          dark:border-white/30
          text-[#060709]
          dark:text-white
          focus:outline-none dark:focus:border-[#f5dc50]
          focus:border-[#f5dc50] hover:border-[#f5dc50]
          dark:hover:border-[#f5dc50]
          transition
        "
      />

      <div className="flex justify-between items-center gap-2 mt-6 flex-wrap">
        <div className="text-sm text-[#060709]/70 dark:text-white">
          {t("stats.word")}: {stats.word}
          <span className="dark:text-[#f5dc50]"> | </span>
          {t("stats.character")}: {stats.character}
        </div>
        <div className="flex gap-5 flex-wrap">
          <button
            aria-label="Clear text"
            onClick={() => {
              pushHistory(text);
              setText("");
            }}
            disabled={text.length === 0}
            className={`${actionBtn} bg-red-600 focus:ring-red-400 ${
              !text && disabled
            }`}
          >
            {/* {t("clear")} */}
            <Trash2Icon className="size-4" />
          </button>
          <button
            aria-label="Copy text"
            onClick={() => handleCopy(text, "copy")}
            disabled={text.length === 0}
            className={`${actionBtn} bg-blue-600 focus:ring-blue-400 ${
              !text && disabled
            }`}
          >
            {/* {copiedButton === "copy" ? `${t("copySuccess")}` : `${t("copy")}`} */}
            {copiedButton === "copy" ? (
              <CheckIcon className="size-4" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </button>

          <button
            aria-label="Download text"
            onClick={downloadText}
            disabled={text.length === 0}
            className={`${actionBtn} bg-green-600 focus:ring-green-400 ${
              !text && disabled
            }`}
          >
            {/* {t("download")} */}
            <DownloadIcon className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        {CASE_TYPES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleCaseChange(key)}
            disabled={text.trim().length === 0}
            className={`
                px-3 py-1 shadow-sm bg-[#f5dc50] rounded-md text-black
                enabled:active:scale-95
                disabled:opacity-[0.5]
                disabled:cursor-default
                cursor-pointer
                transition-transform duration-50 ease-out
                enabled:hover:brightness-90
              `}
          >
            {t(label)}
          </button>
        ))}
      </div>
    </section>
  );
};
