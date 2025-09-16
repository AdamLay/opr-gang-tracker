"use client";

import { useState } from "react";
import { createPlayerAction } from "@/actions/players";

interface CreatePlayerFormProps {
  campaignId: string;
  onPlayerCreated?: () => void;
}

export default function CreatePlayerForm({ campaignId, onPlayerCreated }: CreatePlayerFormProps) {
  const [name, setName] = useState("");
  const [listUrl, setListUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const result = await createPlayerAction({ name, listUrl, campaignId });

    if (result.success) {
      setMessage("Player added successfully!");
      setName("");
      setListUrl("");
      onPlayerCreated?.();
    } else {
      setMessage(result.error || "Failed to add player");
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label htmlFor="playerName" className="label">
          <span className="label-text">Player Name</span>
        </label>
        <input
          type="text"
          id="playerName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input input-bordered w-full"
          disabled={isLoading}
        />
      </div>
      <div className="form-control">
        <label htmlFor="listUrl" className="label">
          <span className="label-text">List URL</span>
        </label>
        <input
          type="url"
          id="listUrl"
          value={listUrl}
          onChange={(e) => setListUrl(e.target.value)}
          required
          className="input input-bordered w-full"
          disabled={isLoading}
          placeholder="https://..."
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !name.trim() || !listUrl.trim()}
        className="btn btn-success w-full"
      >
        {isLoading ? <span className="loading loading-spinner loading-sm mr-2"></span> : null}
        {isLoading ? "Adding..." : "Add Player"}
      </button>
      {message && (
        <p className={`text-sm ${message.includes("successfully") ? "text-success" : "text-error"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
