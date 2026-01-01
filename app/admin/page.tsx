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
      ultra_modern:
        "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
      modern: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      moderately_modern:
        "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      traditional:
        "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
      very_traditional:
        "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    };
    return colors[level];
  };

  if (authenticated === null || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-700 dark:text-gray-300">
          Loading...
        </div>
      </div>
    );
  }

  if (authenticated === false) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center text-sm sm:text-base"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
            >
              Logout
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
            >
              Add Question
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question Text
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as QuestionType,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="single">Single Choice</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="word">
                    One Word Answer (LLM will analyze)
                  </option>
                </select>
              </div>

              {(formData.type === "single" || formData.type === "multiple") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Options with Modernity Levels
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
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
                      className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <select
                      value={selectedModernityLevel}
                      onChange={(e) =>
                        setSelectedModernityLevel(
                          e.target.value as ModernityLevel
                        )
                      }
                      className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="ultra_modern">Ultra Modern (100)</option>
                      <option value="modern">Modern (75)</option>
                      <option value="moderately_modern">
                        Moderately Modern (50)
                      </option>
                      <option value="traditional">Traditional (25)</option>
                      <option value="very_traditional">
                        Very Traditional (0)
                      </option>
                    </select>
                    <button
                      type="button"
                      onClick={addOption}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.options.map(
                      (option: OptionWithModernity, index: number) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium break-words">
                              {option.text}
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                              <select
                                value={option.modernityLevel}
                                onChange={(e) =>
                                  updateOptionModernity(
                                    index,
                                    e.target.value as ModernityLevel
                                  )
                                }
                                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                              >
                                <option value="ultra_modern">
                                  Ultra Modern (100)
                                </option>
                                <option value="modern">Modern (75)</option>
                                <option value="moderately_modern">
                                  Moderately Modern (50)
                                </option>
                                <option value="traditional">
                                  Traditional (25)
                                </option>
                                <option value="very_traditional">
                                  Very Traditional (0)
                                </option>
                              </select>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ${getModernityColor(
                                  option.modernityLevel
                                )}`}
                              >
                                {option.score} pts
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="self-start sm:self-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xl sm:text-2xl font-bold"
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {formData.type === "word" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Word Answer Questions:</strong> For this question
                    type, users will enter a text answer. The system will use AI
                    (LLM) to analyze the modernity level of their answer
                    automatically when they submit the quiz.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question Weight (Points)
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      points: parseInt(e.target.value) || 1,
                    })
                  }
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This determines how much this question contributes to the
                  total score.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                >
                  {editingQuestion ? "Update" : "Create"} Question
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <h2 className="text-xl sm:text-2xl font-semibold p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
            Questions ({questions.length})
          </h2>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {questions.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No questions yet. Add your first question!
              </div>
            ) : (
              questions.map((question) => (
                <div
                  key={question.id}
                  className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                          {question.type}
                        </span>
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          {question.points || 1} pts
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 break-words">
                        {question.text}
                      </p>
                      {question.options && question.options.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Options with Modernity Levels:
                          </p>
                          <div className="space-y-1">
                            {question.options.map(
                              (option: OptionWithModernity, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                                >
                                  <span className="text-gray-700 dark:text-gray-300 break-words">
                                    • {option.text}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 text-xs font-semibold rounded whitespace-nowrap ${getModernityColor(
                                      option.modernityLevel
                                    )}`}
                                  >
                                    {option.modernityLevel.replace("_", " ")} (
                                    {option.score})
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                      {question.type === "word" && (
                        <div className="mt-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                            AI will analyze answer modernity
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:ml-4 w-full sm:w-auto">
                      <button
                        onClick={() => handleEdit(question)}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
