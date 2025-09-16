import Link from "next/link";
import { loginAction } from "@/actions/auth";

interface LoginPageProps {
  searchParams: {
    message?: string;
    error?: string;
    returnUrl?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="min-h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold ">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm">
            Or{" "}
            <Link href="/auth/register" className="font-medium text-primary">
              create a new account
            </Link>
          </p>
        </div>

        {searchParams.message && <div className="alert alert-info">{searchParams.message}</div>}
        {searchParams.error && <div className="alert alert-error">{searchParams.error}</div>}

        <form className="card-1 mt-8 space-y-6" action={loginAction}>
          {searchParams.returnUrl && <input type="hidden" name="returnUrl" value={searchParams.returnUrl} />}
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
                autoComplete="current-password"
                required
                className="input w-full"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button type="submit" className="btn btn-primary w-full">
              Sign in
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
