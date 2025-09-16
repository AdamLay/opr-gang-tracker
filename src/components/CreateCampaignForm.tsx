"use client";

import { createCampaignAction } from "@/app/campaigns/actions";
import { useState } from "react";

export default function CreateCampaignForm() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const result = await createCampaignAction({ name });

    if (result.success) {
      setMessage("Campaign created successfully!");
      setName("");
    } else {
      setMessage(result.error || "Failed to create campaign");
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label htmlFor="name" className="label">
          <span className="label-text">Campaign Name</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input input-bordered w-full"
          disabled={isLoading}
        />
      </div>
      <button type="submit" disabled={isLoading || !name.trim()} className="btn btn-primary w-full">
        {isLoading ? <span className="loading loading-spinner loading-sm mr-2"></span> : null}
        {isLoading ? "Creating..." : "Create Campaign"}
      </button>
      {message && (
        <p className={`text-sm ${message.includes("successfully") ? "text-success" : "text-error"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
