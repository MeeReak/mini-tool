"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { CheckIcon, CopyIcon, Trash2Icon, XIcon } from "lucide-react";
import { Toast } from "@/components/Toast";
const QrScanner = dynamic(() => import("./QrScanner"), { ssr: false });

export const GoogleLen = () => {
  const t = useTranslations("GoogleLen");
  const scannerRef = useRef();
  const pasteTimeoutRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [qrResults, setQrResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedQR, setClickedQR] = useState([]);
  const [copiedButton, setCopiedButton] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    // "image/gif",
    "application/pdf"
  ];

  const MAX_TOTAL = 15;
  const MAX_PDF = 5;

  const handleFiles = async (fileList) => {
    const incomingFiles = Array.from(fileList);

    // 1️⃣ Filter allowed types
    const validFiles = incomingFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (validFiles.length === 0) return;

    if (validFiles.length !== incomingFiles.length) {
      showToast(t("invalidType"), "error");
    }

    // 2️⃣ Count THIS BATCH ONLY
    const totalCount = validFiles.length;
    const pdfCount = validFiles.filter(
      (f) => f.type === "application/pdf"
    ).length;

    // 3️⃣ Enforce per-upload rules
    if (totalCount > MAX_TOTAL) {
      showToast(t("fileLimitExceeded"), "warning");
      return;
    }

    if (pdfCount > MAX_PDF) {
      showToast(t("pdfFIleLimit"), "warning");
      return;
    }

    // 4️⃣ Process batch
    setIsLoading(true);
    await new Promise((r) => requestAnimationFrame(r));

    const scanResults = await Promise.allSettled(
      validFiles.map(async (file) => {
        const data = await scannerRef.current.scanFile(file);
        return {
          file,
          previewUrl: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
          data
        };
      })
    );

    const newPreviews = [];
    const newResults = [];

    scanResults.forEach((res) => {
      if (res.status === "fulfilled") {
        newPreviews.push({
          file: res.value.file,
          previewUrl: res.value.previewUrl
        });
        newResults.push(res.value.data || null);
      }
    });

    // 5️⃣ Append (NO LIMIT HERE)
    setFiles((prev) => [...prev, ...newPreviews.map((p) => p.file)]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setQrResults((prev) => [...prev, ...newResults]);

    setIsLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation(); // 🔑 prevents bubbling

    const dropped = e.dataTransfer.files;
    if (dropped.length > 0) {
      handleFiles(dropped);
    }
  };

  const handleInputChange = (e) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;
    handleFiles(selected);
  };

  const resetFiles = () => {
    setFiles([]);
    setPreviews([]);
    setQrResults([]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setQrResults((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handlePaste = (e) => {
      if (pasteTimeoutRef.current) return;

      const items = e.clipboardData.items;
      const filesFromClipboard = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          if (blob) filesFromClipboard.push(blob);
        }
      }
      if (filesFromClipboard.length > 0) {
        handleFiles(filesFromClipboard);
        pasteTimeoutRef.current = setTimeout(() => {
          pasteTimeoutRef.current = null;
        }, 1000);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
      if (pasteTimeoutRef.current) clearTimeout(pasteTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("dragover", preventDefaults);
    window.addEventListener("drop", preventDefaults);

    return () => {
      window.removeEventListener("dragover", preventDefaults);
      window.removeEventListener("drop", preventDefaults);
    };
  }, []);

  const handleCopy = (text, index) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast(t("copySuccess"), "success");
        setCopiedButton(index);
        setTimeout(() => setCopiedButton(""), 1500); // reset after 1.5s
      })
      .catch(() => console.error("Failed to copy"));
  };

  return (
    <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}{" "}
      <section
        aria-labelledby="google-len-title"
        className="
      p-6 max-w-3xl mx-auto
      rounded-2xl
      border border-black/10 dark:border-white/10
      bg-white dark:bg-[#060709]
      shadow-sm
    "
      >
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <h2
            id="google-len-title"
            className="font-semibold text-lg text-[#060709] dark:text-white"
          >
            {t("inputLabel")}
          </h2>

          {files.length > 0 && (
            <button
              onClick={resetFiles}
              className="
            p-2 text-sm rounded-md
            bg-red-600 text-white
            hover:brightness-90
            transition
          "
            >
              <Trash2Icon className="size-2 md:size-3" />
            </button>
          )}
        </header>

        {/* Dropzone */}

        <label htmlFor="fileInput" className="cursor-pointer">
          <div
            onDragOver={(e) => e.preventDefault()}
            className="
        border-2 border-dashed border-[#f5dc50]
        rounded-2xl px-6 py-12
        text-center
        bg-[#f5dc50]/10
        hover:bg-[#f5dc50]/20
        transition cursor-pointer
      "
          >
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleInputChange}
              className="hidden"
              id="fileInput"
            />

            <p className="font-medium text-base text-[#060709] dark:text-white">
              {t("dragLabel")}
            </p>
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">
              {t("clickLabel")}
            </p>
          </div>
        </label>
        {/* Loading */}
        {isLoading && (
          <div className="mt-4 flex justify-center items-center gap-2 text-[#f5dc50]">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
              />
            </svg>
            <span className="text-sm">{t("processing")}</span>
          </div>
        )}

        {/* Results */}
        {previews.length > 0 && (
          <>
            <ul className="mt-6 space-y-3">
              {[...previews].reverse().map(({ file }, index) => {
                const realIndex = previews.length - 1 - index;

                return (
                  <li
                    key={realIndex}
                    className="
                rounded-xl p-3
                border border-black/10 dark:border-white/10
                bg-black/5 dark:bg-white/5 dark:hover:bg-white/10
              "
                  >
                    <div className="flex justify-between items-center gap-10">
                      <span className="truncate text-sm text-[#060709] dark:text-white">
                        {file.name}
                      </span>
                      {/* {clickedQR.includes(realIndex) && (
                      <span className="ml-2 text-xs px-1 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                        Visited
                      </span>
                    )} */}
                      <div className=" flex items-center gap-4">
                        {qrResults[realIndex] !== null && (
                          <button
                            aria-label="Copy url"
                            onClick={() =>
                              handleCopy(qrResults[realIndex], realIndex)
                            }
                            className="
                    p-2 text-xs rounded-md
                    bg-[#3662e3] text-white
                    hover:brightness-90
                  "
                          >
                            {copiedButton === realIndex ? (
                              <CheckIcon className="size-2 md:size-3" />
                            ) : (
                              <CopyIcon className="size-2 md:size-3" />
                            )}
                          </button>
                        )}
                        <button
                          aria-label="Remove url"
                          onClick={() => removeFile(realIndex)}
                          className="p-2 text-xs rounded-md bg-[#f5dc50] text-black hover:brightness-90 enabled:active:scale-95"
                        >
                          <XIcon className="size-2 md:size-3" />
                        </button>
                      </div>
                    </div>

                    {qrResults[realIndex] ? (
                      <a
                        href={qrResults[realIndex]}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setClickedQR((prev) => [...prev, realIndex]);
                        }}
                        className={`
       mt-2 block text-sm break-all underline
      ${
        clickedQR.includes(realIndex)
          ? "text-gray-400 dark:text-gray-500" // visited style
          : "text-green-500 dark:text-green-400"
      } 
    `}
                      >
                        {qrResults[realIndex]}
                      </a>
                    ) : (
                      <p className="mt-2 text-sm italic text-black/40 dark:text-white/40">
                        {t("noQRFound")}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <QrScanner ref={scannerRef} />
      </section>
    </div>
  );
};
