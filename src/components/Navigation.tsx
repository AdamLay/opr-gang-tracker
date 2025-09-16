"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { signOutAction } from "@/actions/auth";

export default function Navigation() {
  const { user, loading } = useAuth();

  return (
    <nav className="navbar bg-base-100 shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost normal-case text-xl" aria-label="Home">
            OPR Gang Tracker
          </Link>
          {user && (
            <Link href="/campaigns" className="btn btn-ghost ml-2" aria-label="Campaigns">
              Campaigns
            </Link>
          )}
        </div>
        <div className="navbar-end">
          {loading ? (
            <div className="skeleton w-20 h-8"></div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-label="User Email">
                {user.email}
              </span>
              <form action={signOutAction}>
                <button type="submit" className="btn btn-outline btn-sm" aria-label="Sign Out">
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login" className="btn btn-outline btn-sm" aria-label="Sign In">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn btn-primary btn-sm" aria-label="Sign Up">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
