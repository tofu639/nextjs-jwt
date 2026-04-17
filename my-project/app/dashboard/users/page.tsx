"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
import Link from "next/link";
import { useAuth } from "../../lib/auth-context";
import { useRouter } from "next/navigation";
import type { User } from "../../lib/mock-db";
import VirtualizedTable from "./components/VirtualizedTable";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";

interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  totalPages: number;
}

export default function UsersPage() {
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const limit = 20;

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [token, authLoading, router]);

  const fetchUsers = useCallback(
    async (p: number, s: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: String(limit),
        });
        if (s) params.set("search", s);

        const res = await fetch(`/api/users?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: UsersResponse = await res.json();
        startTransition(() => {
          setUsers(json.data);
          setTotal(json.total);
          setPage(json.page);
          setTotalPages(json.totalPages);
        });
      } catch {
        startTransition(() => {
          setError("Failed to load users. Please try again.");
        });
      } finally {
        startTransition(() => {
          setLoading(false);
        });
      }
    },
    [limit, startTransition]
  );

  useEffect(() => {
    fetchUsers(1, "");
  }, [fetchUsers]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      fetchUsers(newPage, search);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchUsers, search]
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearch(query);
      fetchUsers(1, query);
    },
    [fetchUsers]
  );

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              &larr; Dashboard
            </Link>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Users
            </h1>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            100,000 records
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} isLoading={loading || isPending} />
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {error}
            <button
              onClick={() => fetchUsers(page, search)}
              className="ml-2 underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading && users.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex items-center gap-3 text-zinc-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-500" />
              Loading users...
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
            No users found matching your search.
          </div>
        ) : (
          <>
            <VirtualizedTable users={users} />

            {(loading || isPending) && (
              <div className="mt-4 flex justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-500" />
              </div>
            )}

            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                onPageChange={handlePageChange}
                disabled={loading || isPending}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
