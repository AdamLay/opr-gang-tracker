import Link from "next/link";
import { registerAction } from "@/actions/auth";

interface RegisterPageProps {
  searchParams: {
    error?: string;
  };
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  return (
    <div className="min-h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">Create your account</h2>
          <p className="mt-2 text-center text-sm">
            Or{" "}
            <Link href="/auth/login" className="font-medium text-primary">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {searchParams.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {searchParams.error}
          </div>
        )}

        <form className="card-1 mt-8 space-y-6" action={registerAction}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input w-full"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="input w-full"
                placeholder="Enter your password (min 6 characters)"
              />
            </div>
          </div>

          <div>
            <button type="submit" className="btn btn-primary w-full">
              Create account
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
