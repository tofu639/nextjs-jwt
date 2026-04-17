import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-lg px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Next.js JWT Demo
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          A demo showing how JWT authentication works between a login page and a
          protected dashboard.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Go to Login
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Login
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              POST credentials to the server and receive a signed JWT.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Token Storage
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              JWT is stored in localStorage and decoded on the client side.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Verification
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Send the token to the server to verify signature and expiration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


