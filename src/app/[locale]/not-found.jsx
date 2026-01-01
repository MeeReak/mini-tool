import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center transition-all bg-white dark:bg-[#060709]">
      {/* Title */}
      {/* <h1 className="text-4xl font-extrabold mb-5 text-[#10172a] dark:text-white">
        {t("title")}
      </h1> */}

      {/* Visual Placeholder */}
      <div
        id="four_zero_four_bg"
        className="w-full max-w-md h-80 my-3 rounded-lg shadow-lg overflow-hidden"
      ></div>

      {/* Description */}
      <h2 className="text-base text-gray-800 dark:text-gray-200 mb-5 max-w-md">
        {t("description")}
      </h2>

      {/* Back Button */}
      <Link
        href="/"
        className="px-6 py-3 text-sm font-medium rounded-lg bg-[#f5dc50] text-black hover:brightness-95 transition"
      >
        {t("back")}
      </Link>
    </div>
  );
}
