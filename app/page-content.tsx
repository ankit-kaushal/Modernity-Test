"use client";

import Link from "next/link";
import { Button, Flex, Text } from "uiplex";

export default function HomeContent() {
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
      <Flex
        direction="column"
        align="center"
        justify="center"
        minHeight="100vh"
      >
        <Flex direction="column" align="center" justify="center">
          <Text
            weight="bold"
            style={{
              color: "#ffffff",
              fontSize: "3rem",
            }}
          >
            Modernity Test
          </Text>
          <Text size="xl" style={{ marginBottom: "2rem", color: "#d1d5db" }}>
            Discover how modern you are through a quick questionnaire
          </Text>
          <Flex gap="1rem" justify="center" wrap="wrap">
            <Link href="/quiz" style={{ textDecoration: "none" }}>
              <Button colorScheme="blue" size="lg">
                Start Quiz
              </Button>
            </Link>
            <Link href="/admin" style={{ textDecoration: "none" }}>
              <Button colorScheme="gray" size="lg">
                Admin Panel
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
