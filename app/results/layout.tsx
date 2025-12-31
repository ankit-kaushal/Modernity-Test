import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Results",
  description:
    "View your modernity test results. See your modernity score, percentage, and level - from Ultra Modern to Traditional.",
  openGraph: {
    title: "Your Modernity Test Results",
    description:
      "View your modernity test results. See your modernity score, percentage, and level.",
    url: "/results",
  },
  twitter: {
    title: "Your Modernity Test Results",
    description:
      "View your modernity test results. See your modernity score, percentage, and level.",
  },
  robots: {
    index: false, // Don't index results pages
    follow: false,
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
