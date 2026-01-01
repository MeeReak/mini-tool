import React from "react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";

export const Landing = async () => {
  const t = await getTranslations("Homepage");

  return (
    <div className="min-h-screen bg-white dark:bg-[#060709] text-[#060709] dark:text-white transition-colors">
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 items-center">
          {/* Left: Text Content */}
          <div>
            {/* Badge / Highlight */}
            <span className="inline-block mb-4 px-3 py-1 text-sm font-medium rounded-full bg-[#f5dc50]/20 text-[#a89100] dark:text-[#f5dc50]">
              {t("badge")}
            </span>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-2 md:mb-6">
              <span className="block">{t("title")}</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-[#060709]/70 dark:text-white/70 max-w-xl mb-6 md:mb-10">
              {t("description")}
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/tools"
                className="
                  inline-flex items-center justify-center
                  px-3 md:px-6 py-1 md:py-3 rounded-lg font-medium
                  bg-[#f5dc50] text-black
                  hover:brightness-95
                  active:scale-95
                  transition
                "
              >
                {t("ctaPrimary")}
              </Link>

              <Link
                href="/about"
                className="
                  inline-flex items-center justify-center
                  px-3 md:px-6 py-1 md:py-3 rounded-lg font-medium
                  border border-[#060709]/20 dark:border-white/20
                  hover:border-[#f5dc50]
                  transition
                "
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>

          {/* Right: Visual Placeholder */}
          <div className="w-full hidden md:block">
            <Image
              src="/developer.jpg"
              width={250}
              height={250}
              alt={t("developerAlt")}
              className="rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mx-auto"
            />
          </div>
        </section>
      </main>
    </div>
  );
};
