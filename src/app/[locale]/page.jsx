import { Landing } from "@/components/Landing/Landing";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations("Homepage", locale);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = locale === "km" ? baseUrl : `${baseUrl}/${locale}`;

  // const supportedLocales = ["en", "km"];
  // const languageAlternates = Object.fromEntries(
  //   supportedLocales.map((loc) => [
  //     loc,
  //     loc === "km" ? baseUrl : `${baseUrl}/${loc}`
  //   ])
  // );

  return {
    title: t("title"),
    description: t("description"),

    openGraph: {
      title: t("title"),
      description: t("description"),
      url,
      type: "website",
      siteName: "Tithyareak App",
      locale: locale === "km" ? "km-KH" : "en-US",
      images: [
        {
          url: "https://profit.pakistantoday.com.pk/wp-content/uploads/2025/04/donkey-donkey-hd-free-download-world-hd-1200x630-cropped.jpg",
          width: 1200,
          height: 630,
          alt: "Tithyareak App"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "https://profit.pakistantoday.com.pk/wp-content/uploads/2025/04/donkey-donkey-hd-free-download-world-hd-1200x630-cropped.jpg",
          width: 1200,
          height: 630,
          alt: "Tithyareak App"
        }
      ]
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/google-len`,
        km: `${baseUrl}/google-len`
      }
    },
    keywords: [t("title"), t("description"), "Tithyareak App", "Useful Tool"],
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function Home({ params }) {
  const { locale } = await params;
  const t = await getTranslations("Homepage");

  return (
    <>
      <Landing />
      {/* Footer */}
      <footer className="mb-8 border-t border-gray-200 dark:border-gray-800 pt-8 text-gray-500 dark:text-gray-400 text-sm">
        <p className=" text-center">
          © {new Date().getFullYear()} Mini App — Built with ❤️ by Wukong
        </p>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t("title"),
            description: t("description"),
            url:
              locale === "km"
                ? process.env.NEXT_PUBLIC_SITE_URL
                : `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
            publisher: {
              "@type": "Organization",
              name: "Tithyareak App"
            }
          })
        }}
      />
    </>
  );
}
