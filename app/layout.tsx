import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modernity Test",
  description: "Find out how modern you are through a quick questionnaire",
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
