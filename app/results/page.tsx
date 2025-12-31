'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResultsContent() {
  const searchParams = useSearchParams();

  const score = parseFloat(searchParams.get('score') || '0');
  const totalPoints = parseFloat(searchParams.get('total') || '0');
  const percentage = parseInt(searchParams.get('percentage') || '0');
  const level = searchParams.get('level') || 'Unknown';

  const getLevelColor = (level: string) => {
    if (level.includes('Ultra')) return 'from-purple-500 to-pink-500';
    if (level.includes('Modern')) return 'from-blue-500 to-indigo-500';
    if (level.includes('Moderately')) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-gray-600';
  };

  const getLevelEmoji = (level: string) => {
    if (level.includes('Ultra')) return '🚀';
    if (level.includes('Modern')) return '✨';
    if (level.includes('Moderately')) return '📱';
    return '📚';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <div className={`inline-block p-4 rounded-full bg-gradient-to-r ${getLevelColor(level)} mb-6 text-6xl`}>
            {getLevelEmoji(level)}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Modernity Level
          </h1>

          <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${getLevelColor(level)} text-white text-2xl font-bold mb-8`}>
            {level}
          </div>

          <div className="mb-8">
            <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {percentage}%
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              You scored {score.toFixed(1)} out of {totalPoints} points
            </div>
          </div>

          {/* Progress Circle */}
          <div className="mb-8">
            <div className="relative w-48 h-48 mx-auto">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${(percentage / 100) * 552.92} 552.92`}
                  className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              {percentage >= 80 && "Congratulations! You're at the cutting edge of modernity. You embrace new technologies, trends, and ideas with enthusiasm."}
              {percentage >= 60 && percentage < 80 && "You're quite modern! You stay updated with current trends and are open to new experiences."}
              {percentage >= 40 && percentage < 60 && "You're moderately modern. You balance tradition with contemporary ideas."}
              {percentage >= 20 && percentage < 40 && "You lean towards traditional values while still being open to some modern concepts."}
              {percentage < 20 && "You prefer traditional approaches and values. There's beauty in maintaining classic perspectives."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Link
              href="/quiz"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Retake Quiz
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-xl text-gray-700 dark:text-gray-300">Loading results...</div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResultsContent />
    </Suspense>
  );
}
