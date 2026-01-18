"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Box, Flex, Text, Input, FormControl, FormLabel, Loader } from "uiplex";
import Link from "next/link";
import styles from "./login.module.css";

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

      router.push("/admin");
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.card}>
        <Box className={styles.header}>
          <Text as="h1" size="xl" weight="bold" style={{ marginBottom: "0.5rem", fontSize: "1.875rem", color: "#ffffff" }}>
            Admin Login
          </Text>
          <Text style={{ color: "#d1d5db" }}>
            Enter your Google Authenticator code
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="1.5rem">
            <FormControl>
              <FormLabel htmlFor="code" style={{color: "#ffffff"}}>Authentication Code</FormLabel>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setCode(value);
                  setError("");
                }}
                placeholder="000000"
                maxLength={6}
                autoComplete="off"
                autoFocus
                required
                style={{
                  textAlign: "center",
                  fontSize: "1.5rem",
                  letterSpacing: "0.5em",
                  padding: "0.75rem",
                }}
              />
              <Text size="sm" style={{ marginTop: "0.5rem", textAlign: "center", color: "#9ca3af", fontSize: "0.75rem" }}>
                Enter the 6-digit code from your authenticator app
              </Text>
            </FormControl>

            {error && (
              <Box className={styles.errorBox}>
                <Text size="sm" className={styles.errorText}>
                  {error}
                </Text>
              </Box>
            )}

            <Button
              type="submit"
              disabled={loading || code.length !== 6}
              colorScheme="blue"
              loading={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </Button>
          </Flex>
        </form>

        <Box className={styles.backLink}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text size="sm" className={styles.backLinkText}>
              ← Back to Home
            </Text>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
