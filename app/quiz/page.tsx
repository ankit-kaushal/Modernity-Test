"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Question, Answer } from "@/types/question";
import { Button, Box, Flex, Text, Input, RadioGroup, Loader } from "uiplex";
import Link from "next/link";
import styles from "./quiz.module.css";

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      const data = await response.json();
      setQuestions(data);
      setAnswers(data.map((q: Question) => ({ questionId: q.id, answer: "" })));
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (value: string | string[]) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      questionId: questions[currentIndex].id,
      answer: value,
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (
      !confirm(
        "Are you sure you want to submit? You cannot change your answers after submission."
      )
    ) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/calculate-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const result = await response.json();
      router.push(
        `/results?score=${result.score}&total=${
          result.totalPoints
        }&percentage=${result.percentage}&level=${encodeURIComponent(
          result.level
        )}`
      );
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Flex direction="column" align="center" gap="1rem">
          <Loader size="lg" />
          <Text color="secondary" size="xl">
            Loading questions...
          </Text>
        </Flex>
      </Box>
    );
  }

  if (questions.length === 0) {
    return (
      <Flex align="center" justify="center" minHeight="100vh">
        <Box style={{ textAlign: "center" }}>
          <Text size="xl" weight="bold" style={{ marginBottom: "1rem" }}>
            No questions available
          </Text>
          <Text style={{ marginBottom: "1rem" }}>
            Please add questions in the admin panel first.
          </Text>
          <Link href="/admin" style={{ textDecoration: "none" }}>
            <Button colorScheme="blue">Go to Admin Panel</Button>
          </Link>
        </Box>
      </Flex>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex]?.answer || "";
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <Box
      className={styles.quizContainer}
    >
      <Box style={{ maxWidth: "48rem", margin: "0 auto", padding: "0 1rem" }}>
        <Box
          style={{
            backgroundColor: "#1f2937",
            borderRadius: "0.5rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            padding: "2rem",
          }}
        >
          <Box style={{ marginBottom: "2rem" }}>
            <Flex
              justify="between"
              align="center"
              style={{ marginBottom: "0.5rem" }}
            >
              <Text size="sm" style={{ color: "#d1d5db" }}>
                Question {currentIndex + 1} of {questions.length}
              </Text>
              <Text size="sm" style={{ color: "#d1d5db" }}>
                {Math.round(progress)}%
              </Text>
            </Flex>
            <Box
              style={{
                width: "100%",
                height: "0.5rem",
                backgroundColor: "#374151",
                borderRadius: "9999px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  backgroundColor: "#4f46e5",
                  borderRadius: "9999px",
                  width: `${progress}%`,
                  transition: "width 0.3s",
                }}
              />
            </Box>
          </Box>

          <Box style={{ marginBottom: "2rem" }}>
            <Text
              as="h2"
              size="xl"
              weight="bold"
              style={{
                marginBottom: "1.5rem",
                fontSize: "1.5rem",
                color: "#ffffff",
              }}
            >
              {currentQuestion.text}
            </Text>

            {/* Single Choice */}
            {currentQuestion.type === "single" && (
              <RadioGroup
                name={`question-${currentQuestion.id}`}
                value={typeof currentAnswer === "string" ? currentAnswer : ""}
                onChange={(value) => handleAnswerChange(value)}
                options={
                  currentQuestion.options?.map((option) => ({
                    value: option.text,
                    label: option.text,
                  })) || []
                }
                orientation="vertical"
                colorScheme="blue"
              />
            )}

            {/* Multiple Choice */}
            {currentQuestion.type === "multiple" && (
              <Flex direction="column" gap="0.75rem">
                {currentQuestion.options?.map((option, index) => {
                  const selectedAnswers = Array.isArray(currentAnswer)
                    ? currentAnswer
                    : [];
                  const isChecked = selectedAnswers.includes(option.text);
                  return (
                    <label
                      key={index}
                      className={styles.quizContainerCheckbox}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const selected = Array.isArray(currentAnswer)
                            ? currentAnswer
                            : [];
                          if (e.target.checked) {
                            handleAnswerChange([...selected, option.text]);
                          } else {
                            handleAnswerChange(
                              selected.filter((a) => a !== option.text)
                            );
                          }
                        }}
                        style={{
                          marginRight: "0.75rem",
                          width: "1.25rem",
                          height: "1.25rem",
                        }}
                      />
                      <Text>{option.text}</Text>
                    </label>
                  );
                })}
              </Flex>
            )}

            {/* One Word Answer */}
            {currentQuestion.type === "word" && (
              <Input
                value={typeof currentAnswer === "string" ? currentAnswer : ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Enter your answer"
                size="lg"
              />
            )}
          </Box>

          {/* Navigation */}
          <Flex justify="between" align="center">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              colorScheme="gray"
            >
              Previous
            </Button>

            {currentIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                colorScheme="green"
                loading={submitting}
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            ) : (
              <Button onClick={handleNext} colorScheme="blue">
                Next
              </Button>
            )}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
