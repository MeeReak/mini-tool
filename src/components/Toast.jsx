"use client";

import { useEffect } from "react";
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";

const variants = {
  success: {
    border: "border-green-400 dark:border-green-500",
    bg: "bg-green-50 dark:bg-green-950/40",
    iconBg: "bg-green-400 dark:bg-green-500",
    title: "text-green-700 dark:text-green-400",
    text: "text-green-600 dark:text-green-300",
    icon: CheckCircle
  },
  info: {
    border: "border-blue-400 dark:border-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    iconBg: "bg-blue-400 dark:bg-blue-500",
    title: "text-blue-700 dark:text-blue-400",
    text: "text-blue-600 dark:text-blue-300",
    icon: Info
  },
  warning: {
    border: "border-yellow-400 dark:border-yellow-500",
    bg: "bg-[#f5dc50]/10 dark:bg-[#f5dc50]/20",
    iconBg: "bg-yellow-400 dark:bg-yellow-500",
    title: "text-yellow-700 dark:text-yellow-400",
    text: "text-yellow-600 dark:text-yellow-300",
    icon: AlertTriangle
  },
  error: {
    border: "border-red-400 dark:border-red-500",
    bg: "bg-red-50 dark:bg-red-950/40",
    iconBg: "bg-red-400 dark:bg-red-500",
    title: "text-red-700 dark:text-red-400",
    text: "text-red-600 dark:text-red-300",
    icon: XCircle
  }
};

export const Toast = ({
  title,
  message,
  type = "info",
  duration = 3000,
  onClose
}) => {
  const config = variants[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 
        border rounded-xl min-w-[360px]
        ${config.border} ${config.bg}
        px-4 py-3 shadow-sm
        animate-slide-in
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`
            flex items-center justify-center
           rounded-full p-3
            ${config.iconBg} text-white
          `}
          >
            <Icon size={18} />
          </div>

          <div className="flex-1">
            <p className={`font-semibold ${config.titleColor}`}>{title}</p>
            <p className={`text-sm ${config.textColor}`}>{message}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-black/40 dark:text-white hover:text-black dark:hover:text-white/50"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
