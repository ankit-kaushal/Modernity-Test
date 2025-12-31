import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Modernity Test - Discover How Modern You Are",
    template: "%s | Modernity Test",
  },
  description:
    "Take our interactive modernity test to discover how modern you are! Answer questions about your lifestyle, technology usage, and preferences. Get your modernity score and see where you stand on the modern-traditional spectrum.",
  keywords: [
    "modernity test",
    "how modern are you",
    "modernity quiz",
    "personality test",
    "lifestyle quiz",
    "technology quiz",
    "modern vs traditional",
    "modernity assessment",
  ],
  authors: [{ name: "Modernity Test" }],
  creator: "Modernity Test",
  publisher: "Modernity Test",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://modernitytest.ankitkaushal.in/"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Modernity Test",
    title: "Modernity Test - Discover How Modern You Are",
    description:
      "Take our interactive modernity test to discover how modern you are! Answer questions about your lifestyle, technology usage, and preferences.",
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
      "Take our interactive modernity test to discover how modern you are! Answer questions about your lifestyle, technology usage, and preferences.",
    images: ["/og-image.png"],
    creator: "@modernitytest",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
  },
  manifest: "/manifest.json",
  category: "entertainment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
