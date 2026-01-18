import type { Metadata } from "next";
import HomeContent from "./page-content";

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
  return <HomeContent />;
}
