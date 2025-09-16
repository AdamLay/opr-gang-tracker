"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function HomeContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="skeleton h-12 w-2/3 mb-4"></div>
          <div className="skeleton h-6 w-1/2 mb-4"></div>
          <div className="skeleton h-12 w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">OPR Gang Tracker</h1>
        <p className="text-xl mb-8">
          Track your Grimdark Future Firefight campaigns with the Gang Wars expansion
        </p>

        {user ? (
          <Link href="/campaigns" className="btn btn-primary btn-lg">
            View Your Campaigns
          </Link>
        ) : (
          <div className="flex justify-center gap-4">
            <Link href="/auth/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link href="/auth/login" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </div>
        )}
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="card bg-base-100 shadow p-6">
          <h2 className="card-title mb-4">Features</h2>
          <ul className="space-y-2">
            <li>• Create and manage multiple campaigns</li>
            <li>• Add players to your campaigns</li>
            <li>• Track army list URLs for each player</li>
            <li>• View campaign details and player lists</li>
            <li>• Secure user authentication</li>
          </ul>
        </div>

        <div className="card bg-base-100 shadow p-6">
          <h2 className="card-title mb-4">Getting Started</h2>
          <ol className="space-y-2">
            <li>1. {user ? "Create a new campaign" : "Sign up for an account"}</li>
            <li>2. {user ? "Add players to your campaign" : "Sign in to your account"}</li>
            <li>3. {user ? "Include army list URLs for easy reference" : "Create your first campaign"}</li>
            <li>4. {user ? "Start your gang war!" : "Add players and start your gang war!"}</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
