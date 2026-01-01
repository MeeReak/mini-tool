import React from "react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export const Landing = async () => {
  const t = await getTranslations("Homepage");

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 mb-24">
          {/* Left: Text Content */}
          <div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-cyan-700 dark:text-cyan-400 mb-6">
              {t("title")}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10">
              {t("description")}
            </p>
          </div>

          {/* Right: Image */}
          <div className="flex justify-end">
            <Image
              src="/developer.jpg"
              width={250}
              height={250}
              alt={t("developerAlt")}
              className="rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
            />
          </div>
        </section>

        {/* Features Section */}
        <section aria-labelledby="features">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {[
              {
                title: t("easy"),
                desc: t("easyDesc"),
                icon: "🧠"
              },
              {
                title: t("multiLang"),
                desc: t("multiLangDesc"),
                icon: "🌍"
              },
              {
                title: t("themeMode"),
                desc: t("themeModeDesc"),
                icon: "🌗"
              }
            ].map((f) => (
              <div
                key={f.title}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-200 border border-gray-100 dark:border-gray-700"
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <h2 className="text-xl font-semibold text-cyan-700 dark:text-cyan-400 mb-2">
                  {f.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
