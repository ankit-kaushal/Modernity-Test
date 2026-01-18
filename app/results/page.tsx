"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Box,
  Flex,
  Text,
  CircularProgress,
  CircularProgressLabel,
} from "uiplex";
import styles from "./results.module.css";

function ResultsContent() {
  const searchParams = useSearchParams();

  const score = parseFloat(searchParams.get("score") || "0");
  const totalPoints = parseFloat(searchParams.get("total") || "0");
  const percentage = parseInt(searchParams.get("percentage") || "0");
  const level = searchParams.get("level") || "Unknown";

  const getEmojiClass = (level: string) => {
    if (level.includes("Ultra")) return styles.emojiContainerUltra;
    if (level.includes("Modern")) return styles.emojiContainerModern;
    if (level.includes("Moderately")) return styles.emojiContainerModerate;
    return styles.emojiContainerTraditional;
  };

  const getLevelBadgeClass = (level: string) => {
    if (level.includes("Ultra")) return styles.levelBadgeUltra;
    if (level.includes("Modern")) return styles.levelBadgeModern;
    if (level.includes("Moderately")) return styles.levelBadgeModerate;
    return styles.levelBadgeTraditional;
  };

  const getLevelEmoji = (level: string) => {
    if (level.includes("Ultra")) return "🚀";
    if (level.includes("Modern")) return "✨";
    if (level.includes("Moderately")) return "📱";
    return "📚";
  };

  const getDescription = () => {
    if (percentage >= 80)
      return "Congratulations! You're at the cutting edge of modernity. You embrace new technologies, trends, and ideas with enthusiasm.";
    if (percentage >= 60)
      return "You're quite modern! You stay updated with current trends and are open to new experiences.";
    if (percentage >= 40)
      return "You're moderately modern. You balance tradition with contemporary ideas.";
    if (percentage >= 20)
      return "You lean towards traditional values while still being open to some modern concepts.";
    return "You prefer traditional approaches and values. There's beauty in maintaining classic perspectives.";
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.card}>
        <Box className={styles.content}>
          <Box
            className={`${styles.emojiContainer} ${getEmojiClass(level)}`}
          >
            {getLevelEmoji(level)}
          </Box>

          <Text
            as="h1"
            size="xl"
            weight="bold"
            align="center"
            style={{
              marginBottom: "1rem",
              fontSize: "2.25rem",
              color: "#ffffff",
            }}
          >
            Your Modernity Level
          </Text>

          <Box className={`${styles.levelBadge} ${getLevelBadgeClass(level)}`}>
            <Text
              size="xl"
              weight="bold"
              style={{ color: "white", fontSize: "1.5rem" }}
            >
              {level}
            </Text>
          </Box>

          <Box style={{ marginBottom: "2rem" }}>
            <Text
              size="xl"
              weight="bold"
              style={{
                color: "#818cf8",
                marginBottom: "0.5rem",
                fontSize: "3.75rem",
                textAlign: "center",
              }}
            >
              {percentage}%
            </Text>
            <Text size="lg" style={{ color: "#d1d5db", textAlign: "center" }}>
              You scored {score.toFixed(1)} out of {totalPoints} points
            </Text>
          </Box>

          {/* Progress Circle */}
          <Box className={styles.progressContainer}>
            <CircularProgress value={percentage} size={192} thickness={16}>
              <CircularProgressLabel>
                <Text
                  size="xl"
                  weight="bold"
                  style={{ fontSize: "1.875rem", color: "#ffffff" }}
                >
                  {percentage}%
                </Text>
              </CircularProgressLabel>
            </CircularProgress>
          </Box>

          {/* Description */}
          <Box className={styles.descriptionBox}>
            <Text size="lg" style={{ color: "#e5e7eb" }}>
              {getDescription()}
            </Text>
          </Box>

          {/* Actions */}
          <Flex gap="1rem" justify="center" wrap="wrap">
            <Link href="/quiz" style={{ textDecoration: "none" }}>
              <Button colorScheme="blue" size="lg">
                Retake Quiz
              </Button>
            </Link>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button colorScheme="gray" size="lg">
                Home
              </Button>
            </Link>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

function LoadingFallback() {
  return (
    <Box className={styles.loadingContainer}>
      <Flex direction="column" align="center" gap="1rem">
        <Text size="xl" style={{ color: "#ffffff" }}>Loading results...</Text>
      </Flex>
    </Box>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResultsContent />
    </Suspense>
  );
}
