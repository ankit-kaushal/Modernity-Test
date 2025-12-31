"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Question, Answer } from "@/types/question";

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
      // Initialize answers array
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl text-gray-700 dark:text-gray-300">
          Loading questions...
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            No questions available
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Please add questions in the admin panel first.
          </p>
          <a
            href="/admin"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-block"
          >
            Go to Admin Panel
          </a>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex]?.answer || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Math.round(((currentIndex + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {currentQuestion.text}
            </h2>

            {/* Single Choice */}
            {currentQuestion.type === "single" && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      currentAnswer === option.text
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-indigo-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option.text}
                      checked={currentAnswer === option.text}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="mr-3 w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-900 dark:text-white">
                      {option.text}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Multiple Choice */}
            {currentQuestion.type === "multiple" && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => {
                  const selectedAnswers = Array.isArray(currentAnswer)
                    ? currentAnswer
                    : [];
                  const isChecked = selectedAnswers.includes(option.text);
                  return (
                    <label
                      key={index}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        isChecked
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-indigo-400"
                      }`}
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
                        className="mr-3 w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-900 dark:text-white">
                        {option.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* One Word Answer */}
            {currentQuestion.type === "word" && (
              <div>
                <input
                  type="text"
                  value={typeof currentAnswer === "string" ? currentAnswer : ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Enter your answer"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
