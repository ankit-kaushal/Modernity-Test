"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Question,
  QuestionType,
  OptionWithModernity,
  ModernityLevel,
} from "@/types/question";
import {
  Button,
  Box,
  Flex,
  Text,
  Input,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  Loader,
  IconButton,
} from "uiplex";
import styles from "./admin.module.css";

export default function AdminPanel() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    text: "",
    type: "single" as QuestionType,
    options: [] as OptionWithModernity[],
    points: 1,
  });
  const [optionInput, setOptionInput] = useState("");
  const [selectedModernityLevel, setSelectedModernityLevel] =
    useState<ModernityLevel>("moderately_modern");
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated === true) {
      fetchQuestions();
    } else if (authenticated === false) {
      router.push("/admin/login");
    }
  }, [authenticated, router]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check");
      const data = await response.json();
      setAuthenticated(data.authenticated);
      if (!data.authenticated) {
        return;
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await fetch(`/api/questions/${editingQuestion.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await fetch(`/api/questions/${id}`, { method: "DELETE" });
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question");
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      text: question.text,
      type: question.type,
      options: question.options || [],
      points: question.points || 1,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      text: "",
      type: "single",
      options: [],
      points: 1,
    });
    setOptionInput("");
    setSelectedModernityLevel("moderately_modern");
    setEditingQuestion(null);
    setShowForm(false);
  };

  const addOption = () => {
    if (optionInput.trim()) {
      const modernityScores: Record<ModernityLevel, number> = {
        ultra_modern: 100,
        modern: 75,
        moderately_modern: 50,
        traditional: 25,
        very_traditional: 0,
      };

      const newOption: OptionWithModernity = {
        text: optionInput.trim(),
        modernityLevel: selectedModernityLevel,
        score: modernityScores[selectedModernityLevel],
      };

      setFormData({
        ...formData,
        options: [...formData.options, newOption],
      });
      setOptionInput("");
    }
  };

  const removeOption = (index: number) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index),
    });
  };

  const updateOptionModernity = (index: number, level: ModernityLevel) => {
    const modernityScores: Record<ModernityLevel, number> = {
      ultra_modern: 100,
      modern: 75,
      moderately_modern: 50,
      traditional: 25,
      very_traditional: 0,
    };

    const updatedOptions = [...formData.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      modernityLevel: level,
      score: modernityScores[level],
    };
    setFormData({ ...formData, options: updatedOptions });
  };

  const getModernityColor = (level: ModernityLevel) => {
    const colors: Record<ModernityLevel, string> = {
      ultra_modern: styles.modernityBadgeUltra,
      modern: styles.modernityBadgeModern,
      moderately_modern: styles.modernityBadgeModerate,
      traditional: styles.modernityBadgeTraditional,
      very_traditional: styles.modernityBadgeVeryTraditional,
    };
    return colors[level];
  };

  const modernityOptions = [
    { value: "ultra_modern", label: "Ultra Modern (100)" },
    { value: "modern", label: "Modern (75)" },
    { value: "moderately_modern", label: "Moderately Modern (50)" },
    { value: "traditional", label: "Traditional (25)" },
    { value: "very_traditional", label: "Very Traditional (0)" },
  ];

  if (authenticated === null || loading) {
    return (
      <Box className={styles.loadingContainer}>
        <Flex direction="column" align="center" gap="1rem">
          <Loader size="lg" />
          <Text style={{ color: "#ffffff" }}>Loading...</Text>
        </Flex>
      </Box>
    );
  }

  if (authenticated === false) {
    return null; // Will redirect to login
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.content}>
        <Flex
          direction="column"
          justify="between"
          align="start"
          gap="1rem"
          className={`${styles.header} ${styles.headerRow}`}
        >
          <Text
            as="h1"
            size="xl"
            weight="bold"
            className={styles.title}
          >
            Admin Panel
          </Text>
          <Flex
            direction="column"
            gap="0.5rem"
            style={{ width: "40%" }}
            className={styles.headerActions}
          >
            <Link
              href="/"
              style={{ textDecoration: "none", width: "100%" }}
              className={styles.formField}
            >
              <Button
                colorScheme="gray"
                style={{ width: "100%" }}
                className={styles.formField}
              >
                Home
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              colorScheme="red"
              style={{ width: "100%" }}
              className={styles.formField}
            >
              Logout
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              colorScheme="blue"
              style={{ width: "100%" }}
              className={styles.formField}
            >
              Add Question
            </Button>
          </Flex>
        </Flex>

        {showForm && (
          <Box className={styles.formCard}>
            <Text
              as="h2"
              size="xl"
              weight="semibold"
              style={{ marginBottom: "1rem", color: "#ffffff" }}
            >
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </Text>
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="1rem">
                <FormControl>
                  <FormLabel style={{ color: "#ffffff" }}>Question Text</FormLabel>
                  <Textarea
                    value={formData.text}
                    onChange={(e) =>
                      setFormData({ ...formData, text: e.target.value })
                    }
                    rows={3}
                    required
                  />
                </FormControl>

                <FormControl>
                  <FormLabel style={{ color: "#ffffff" }}>Question Type</FormLabel>
                  <Select
                    value={formData.type}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        type: value as QuestionType,
                      })
                    }
                    options={[
                      { value: "single", label: "Single Choice" },
                      { value: "multiple", label: "Multiple Choice" },
                      {
                        value: "word",
                        label: "One Word Answer (LLM will analyze)",
                      },
                    ]}
                  />
                </FormControl>

                {(formData.type === "single" ||
                  formData.type === "multiple") && (
                  <FormControl>
                    <FormLabel style={{ color: "#ffffff" }}>Options with Modernity Levels</FormLabel>
                    <Flex
                      direction="column"
                      gap="0.5rem"
                      style={{ marginBottom: "0.5rem" }}
                      className={styles.formRow}
                    >
                      <Input
                        type="text"
                        value={optionInput}
                        onChange={(e) => setOptionInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addOption();
                          }
                        }}
                        placeholder="Enter option text"
                        style={{ flex: 1, minWidth: "50%" }}
                      />
                      <Select
                        value={selectedModernityLevel}
                        onChange={(value) =>
                          setSelectedModernityLevel(value as ModernityLevel)
                        }
                        options={modernityOptions}
                        style={{ minWidth: "200px" }}
                      />
                      <Button
                        type="button"
                        onClick={addOption}
                        colorScheme="gray"
                      >
                        Add
                      </Button>
                    </Flex>
                    <Flex direction="column" gap="0.5rem">
                      {formData.options.map(
                        (option: OptionWithModernity, index: number) => (
                          <Box
                            key={index}
                            className={styles.optionItem}
                          >
                            <Flex
                              direction="column"
                              justify="between"
                              align="start"
                              gap="0.75rem"
                              className={styles.questionRow}
                            >
                              <Flex
                                direction="column"
                                align="start"
                                gap="0.75rem"
                                style={{ flex: 1, minWidth: 0 }}
                                className={styles.questionContent}
                              >
                                <Text
                                  weight="medium"
                                  style={{ wordBreak: "break-word", color: "#ffffff" }}
                                >
                                  {option.text}
                                </Text>
                                <Flex align="center" gap="0.5rem" wrap="wrap">
                                  <Select
                                    value={option.modernityLevel}
                                    onChange={(value) =>
                                      updateOptionModernity(
                                        index,
                                        value as ModernityLevel
                                      )
                                    }
                                    size="sm"
                                    options={modernityOptions}
                                  />
                                  <Box
                                    as="span"
                                    className={`${styles.modernityBadge} ${getModernityColor(
                                      option.modernityLevel
                                    )}`}
                                  >
                                    {option.score} pts
                                  </Box>
                                </Flex>
                              </Flex>
                              <Button
                                type="button"
                                onClick={() => removeOption(index)}
                                variant="outline"
                                style={{
                                  color: "#fca5a5",
                                  fontSize: "1.5rem",
                                  padding: "0.25rem",
                                  border: "none",
                                  background: "transparent",
                                }}
                              >
                                ×
                              </Button>
                            </Flex>
                          </Box>
                        )
                      )}
                    </Flex>
                  </FormControl>
                )}

                {formData.type === "word" && (
                  <Box className={styles.errorBox}>
                    <Text size="sm" className={styles.errorText}>
                      <strong>Word Answer Questions:</strong> For this question
                      type, users will enter a text answer. The system will use
                      AI (LLM) to analyze the modernity level of their answer
                      automatically when they submit the quiz.
                    </Text>
                  </Box>
                )}

                <FormControl>
                  <FormLabel style={{ color: "#ffffff" }}>Question Weight (Points)</FormLabel>
                  <Input
                    type="number"
                    value={formData.points}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        points: parseInt(e.target.value) || 1,
                      })
                    }
                    min="1"
                  />
                  <Text
                    size="sm"
                    style={{
                      marginTop: "0.25rem",
                      color: "#9ca3af",
                      fontSize: "0.75rem",
                    }}
                  >
                    This determines how much this question contributes to the
                    total score.
                  </Text>
                </FormControl>

                <Flex direction="column" gap="0.75rem" className={styles.formRow}>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    style={{ width: "100%" }}
                    className={styles.formField}
                  >
                    {editingQuestion ? "Update" : "Create"} Question
                  </Button>
                  <Button
                    type="button"
                    onClick={resetForm}
                    colorScheme="gray"
                    style={{ width: "100%" }}
                    className={styles.formField}
                  >
                    Cancel
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Box>
        )}

          <Box className={styles.questionsCard}>
          <Box className={styles.questionItem} style={{ borderBottom: "1px solid #374151", padding: "1.5rem" }}>
            <Text as="h2" size="xl" weight="semibold" style={{ color: "#ffffff" }}>
              Questions ({questions.length})
            </Text>
          </Box>
          <Box>
            {questions.length === 0 ? (
              <Box style={{ padding: "1.5rem", textAlign: "center" }}>
                <Text style={{ color: "#9ca3af" }}>
                  No questions yet. Add your first question!
                </Text>
              </Box>
            ) : (
              questions.map((question) => (
                <Box
                  key={question.id}
                  className={styles.questionItem}
                  style={{ padding: "1.5rem" }}
                >
                  <Flex
                    direction="row"
                    justify="between"
                    align="start"
                    gap="1rem"
                    style={{ width: "100%" }}
                  >
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Flex
                        align="center"
                        gap="0.75rem"
                        wrap="wrap"
                        style={{ marginBottom: "0.5rem" }}
                      >
                        <Box
                          as="span"
                          className={`${styles.typeBadge} ${
                            question.type === "single"
                              ? styles.typeBadgeSingle
                              : question.type === "multiple"
                              ? styles.typeBadgeMultiple
                              : styles.typeBadgeWord
                          }`}
                        >
                          {question.type}
                        </Box>
                        <Box
                          as="span"
                          className={`${styles.modernityBadge} ${styles.modernityBadgeModern}`}
                          style={{ backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#86efac" }}
                        >
                          {question.points || 1} pts
                        </Box>
                      </Flex>
                      <Text
                        as="p"
                        size="lg"
                        weight="medium"
                        style={{
                          marginBottom: "0.5rem",
                          wordBreak: "break-word",
                          color: "#ffffff",
                        }}
                      >
                        {question.text}
                      </Text>
                      {question.options && question.options.length > 0 && (
                        <Box style={{ marginTop: "0.5rem" }}>
                      <Text
                        size="sm"
                        style={{ marginBottom: "0.5rem", color: "#d1d5db" }}
                      >
                        Options with Modernity Levels:
                      </Text>
                          <Flex direction="column" gap="0.25rem">
                            {question.options.map(
                              (option: OptionWithModernity, idx: number) => (
                                  <Flex
                                    key={idx}
                                    direction="column"
                                    align="start"
                                    gap="0.5rem"
                                    className={styles.optionRow}
                                  >
                                    <Text
                                      size="sm"
                                      style={{ wordBreak: "break-word", color: "#d1d5db" }}
                                    >
                                      • {option.text}
                                    </Text>
                                    <Box
                                      as="span"
                                      className={`${styles.modernityBadge} ${getModernityColor(
                                        option.modernityLevel
                                      )}`}
                                    >
                                      {option.modernityLevel.replace("_", " ")} (
                                      {option.score})
                                    </Box>
                                  </Flex>
                              )
                            )}
                          </Flex>
                        </Box>
                      )}
                      {question.type === "word" && (
                        <Box style={{ marginTop: "0.5rem" }}>
                          <Box
                            as="span"
                            className={`${styles.modernityBadge} ${styles.typeBadgeWord}`}
                          >
                            AI will analyze answer modernity
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <Flex
                      direction="column"
                      gap="0.5rem"
                      className={styles.questionActions}
                    >
                      <Button
                        onClick={() => handleEdit(question)}
                        colorScheme="blue"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(question.id)}
                        colorScheme="red"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
