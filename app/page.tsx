import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl w-full mx-4 text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Modernity Test
        </h1>
        <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
          Discover how modern you are through a quick questionnaire
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/quiz"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Start Quiz
          </Link>
          <Link
            href="/admin"
            className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-lg"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </main>
  );
}


