import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Take the Quiz",
  description:
    "Answer questions about your lifestyle, technology usage, and preferences to discover your modernity score. The quiz includes single choice, multiple choice, and word answer questions.",
  openGraph: {
    title: "Take the Modernity Test Quiz",
    description:
      "Answer questions about your lifestyle, technology usage, and preferences to discover your modernity score.",
    url: "/quiz",
  },
  twitter: {
    title: "Take the Modernity Test Quiz",
    description:
      "Answer questions about your lifestyle, technology usage, and preferences to discover your modernity score.",
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
