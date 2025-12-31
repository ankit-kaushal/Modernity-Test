import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modernity Test - Discover How Modern You Are",
  description:
    "Take our interactive modernity test to discover how modern you are! Answer questions about your lifestyle, technology usage, and preferences. Get your modernity score and see where you stand on the modern-traditional spectrum.",
  openGraph: {
    title: "Modernity Test - Discover How Modern You Are",
    description:
      "Take our interactive modernity test to discover how modern you are! Answer questions about your lifestyle, technology usage, and preferences.",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Modernity Test - Discover How Modern You Are",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modernity Test - Discover How Modern You Are",
    description:
      "Take our interactive modernity test to discover how modern you are!",
    images: ["/og-image.png"],
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Modernity Test",
    description:
      "Take our interactive modernity test to discover how modern you are! Answer questions about your lifestyle, technology usage, and preferences.",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://modernitytest.ankitkaushal.in/",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      ratingCount: "100",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-2xl w-full mx-4 text-center">
          <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Modernity Test
          </h1>
          <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
            Discover how modern you are through a quick questionnaire
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/quiz"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Start Quiz
            </Link>
            <Link
              href="/admin"
              className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-lg"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
