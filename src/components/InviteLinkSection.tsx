"use client";

import { useState } from "react";

interface InviteLinkSectionProps {
  inviteToken: string;
}

export default function InviteLinkSection({ inviteToken }: InviteLinkSectionProps) {
  const [copied, setCopied] = useState(false);

  const inviteLink = `${window.location.origin}/join/${inviteToken}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <div className="card bg-base-200 shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Invite Players</h3>
      <p className="text-sm text-gray-600 mb-3">Share this link to let others join your campaign:</p>
      <div className="flex gap-2">
        <input type="text" value={inviteLink} readOnly className="input input-bordered flex-1 text-sm" />
        <button onClick={copyToClipboard} className={`btn ${copied ? "btn-success" : "btn-primary"}`}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
