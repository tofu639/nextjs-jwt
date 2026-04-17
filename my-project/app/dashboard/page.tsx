"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../lib/auth-context";

interface TokenPayload {
  iss?: string;
  aud?: string;
  iat?: number;
  exp?: number;
  username?: string;
  role?: string;
}

export default function DashboardPage() {
  const { user, token, logout, isLoading } = useAuth();
  const router = useRouter();
  const [tokenPayload, setTokenPayload] = useState<TokenPayload | null>(null);
  const [verifyResult, setVerifyResult] = useState<Record<string, unknown> | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [tokenFormat, setTokenFormat] = useState<{ header: string; payload: string; signature: string } | null>(null);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [token, isLoading, router]);

  useEffect(() => {
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          setTokenFormat({
            header: atob(parts[0]),
            payload: atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
            signature: parts[2],
          });
        }
      } catch {}
    }
  }, [token]);

  const handleVerify = async () => {
    if (!token) return;
    setVerifying(true);
    try {
      const res = await fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVerifyResult(data);
    } catch {
      setVerifyResult({ error: "Failed to verify token" });
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  if (!token || !user) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/users"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Users
            </Link>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Welcome, <strong>{user.username}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* JWT Token Display */}
          <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Your JWT Token
            </h2>
            <p className="mb-4 text-sm text-zinc-500">
              This token was generated server-side after login and is stored in
              your browser&apos;s localStorage.
            </p>
            <div className="overflow-x-auto rounded-lg bg-zinc-900 p-4 dark:bg-zinc-950">
              <code className="break-all text-xs text-green-400">
                <span className="text-yellow-400">{token.split(".")[0]}</span>
                <span className="text-zinc-500">.</span>
                <span className="text-blue-400">{token.split(".")[1]}</span>
                <span className="text-zinc-500">.</span>
                <span className="text-pink-400">{token.split(".")[2]}</span>
              </code>
            </div>
            <div className="mt-3 flex gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-400" />
                Header
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-400" />
                Payload
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-pink-400" />
                Signature
              </span>
            </div>
          </div>

          {/* Decoded Token */}
          {tokenFormat && (
            <>
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  Header (Algorithm & Token Type)
                </h3>
                <pre className="overflow-x-auto rounded-lg bg-zinc-50 p-4 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  {JSON.stringify(JSON.parse(tokenFormat.header), null, 2)}
                </pre>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-400" />
                  Payload (Data)
                </h3>
                <pre className="overflow-x-auto rounded-lg bg-zinc-50 p-4 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  {JSON.stringify(JSON.parse(tokenFormat.payload), null, 2)}
                </pre>
              </div>
            </>
          )}

          {/* Verify Token Section */}
          <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Verify Token with Server
            </h2>
            <p className="mb-4 text-sm text-zinc-500">
              Click below to send the token to the server via the{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                Authorization: Bearer &lt;token&gt;
              </code>{" "}
              header. The server will verify the token signature and expiration.
            </p>
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            >
              {verifying ? "Verifying..." : "Verify Token"}
            </button>

            {verifyResult && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Server Response:
                </h4>
                <pre className="overflow-x-auto rounded-lg bg-zinc-50 p-4 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  {JSON.stringify(verifyResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Flow Diagram */}
          <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">
              How JWT Works Between Pages
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                <div className="mb-2 text-2xl">1</div>
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">
                  Login Page
                </h4>
                <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                  User submits credentials (username + password) via POST to{" "}
                  <code>/api/auth/login</code>
                </p>
              </div>

              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                <div className="mb-2 text-2xl">2</div>
                <h4 className="text-sm font-bold text-green-900 dark:text-green-300">
                  Server Signs JWT
                </h4>
                <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                  Server validates credentials, creates a signed JWT with user
                  data, and returns it to the client.
                </p>
              </div>

              <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950">
                <div className="mb-2 text-2xl">3</div>
                <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300">
                  Token Stored
                </h4>
                <p className="mt-1 text-xs text-purple-700 dark:text-purple-400">
                  Client stores the JWT in localStorage. Every page navigation
                  reads the token from storage.
                </p>
              </div>

              <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950">
                <div className="mb-2 text-2xl">4</div>
                <h4 className="text-sm font-bold text-orange-900 dark:text-orange-300">
                  Protected Access
                </h4>
                <p className="mt-1 text-xs text-orange-700 dark:text-orange-400">
                  Dashboard sends the token in the Authorization header to
                  verify identity with the server.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
