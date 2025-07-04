// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/login2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gmail, password }),
        credentials: "include", // Include cookies for session
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store user data (e.g., in local storage or context) if needed
      localStorage.setItem("usersid", data.usersid);
      localStorage.setItem("roleid", data.roleid);

      // Redirect to home page
      router.push("/");
    } catch (err) {
      setError((err as Error).message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#171717]">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl shadow-lg max-w-md w-full"
      >
        <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-[#eaeaea]">
          Нэвтрэх
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-[#eaeaea]/70 mb-2">
            Имэйл (Gmail)
          </label>
          <input
            type="email"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:border-white/10 bg-transparent text-gray-900 dark:text-[#eaeaea]"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-[#eaeaea]/70 mb-2">
            Нууц Үг (Password)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:border-white/10 bg-transparent text-gray-900 dark:text-[#eaeaea]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Нэвтрэх
        </button>
      </form>
    </div>
  );
}