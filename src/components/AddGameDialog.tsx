"use client";

import { useState } from "react";
import { createGameAction } from "@/app/campaigns/actions";

interface AddGameDialogProps {
  campaignId: string;
  players: { id: string; name: string }[];
}

export default function AddGameDialog({ campaignId, players }: AddGameDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [winnerId, setWinnerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePlayerChange = (id: string, checked: boolean) => {
    setSelectedPlayers((prev) => (checked ? [...prev, id] : prev.filter((pid) => pid !== id)));
  };

  const valid = Boolean(winnerId) && selectedPlayers.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (!winnerId || selectedPlayers.length === 0) {
      setMessage("Select players and a winner.");
      setLoading(false);
      return;
    }
    const result = await createGameAction({ campaignId, playerIds: selectedPlayers, winnerId });
    if (result.success) {
      setMessage("");
      setSelectedPlayers([]);
      setWinnerId("");
      setOpen(false);
    } else {
      setMessage(result.error || "Failed to add game");
    }
    setLoading(false);
  };

  return (
    <>
      <button className="btn btn-primary mb-6" onClick={() => setOpen(true)}>
        Add Game
      </button>
      {open && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setOpen(false)}>
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">Add Game</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label mb-2">
                  <span className="label-text">Players in Game</span>
                </label>
                <div className="flex flex-col gap-2">
                  {players.map((player) => (
                    <label key={player.id} className="cursor-pointer flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPlayers.includes(player.id)}
                        onChange={(e) => handlePlayerChange(player.id, e.target.checked)}
                        className="checkbox"
                      />
                      <span>{player.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-control mb-4">
                <label className="label mb-2">
                  <span className="label-text">Winner</span>
                </label>
                <select
                  value={winnerId}
                  onChange={(e) => setWinnerId(e.target.value)}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select winner</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading || !valid}>
                  {loading ? "Adding..." : "Add Game"}
                </button>
              </div>
              {message && (
                <p
                  className={`mt-2 text-sm ${
                    message.includes("successfully") ? "text-success" : "text-error"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
