"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid code. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to admin panel
      router.push("/admin");
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your Google Authenticator code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Authentication Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => {
                // Only allow numbers and limit to 6 digits
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCode(value);
                setError("");
              }}
              placeholder="000000"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              maxLength={6}
              autoComplete="off"
              autoFocus
              required
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200 text-center">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

