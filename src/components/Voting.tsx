"use client";

import React, { useState } from "react";
import { useGame } from "@/lib/gameContext";

export default function Voting() {
  const { state, dispatch } = useGame();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const requiredVotes = state.impostorCount;

  const togglePlayer = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= requiredVotes) {
        // Replace the oldest selection
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const confirmVote = () => {
    if (selectedIds.length === requiredVotes) {
      dispatch({ type: "GROUP_VOTE", votedOutIds: selectedIds });
    }
  };

  const selectedNames = selectedIds
    .map((id) => state.players.find((p) => p.id === id)?.name)
    .filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="text-center pt-8 pb-4 px-4">
        <div className="text-6xl mb-3">🗳️</div>
        <h2 className="text-2xl font-bold text-white">
          Vote Out {requiredVotes > 1 ? `${requiredVotes} Players` : "the Impostor"}
        </h2>
        <p className="text-zinc-400 text-sm mt-2 max-w-xs mx-auto">
          {requiredVotes > 1
            ? `There are ${requiredVotes} impostors. Select ${requiredVotes} players to vote out.`
            : "Discuss as a group and agree on one player to vote out."}
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 bg-zinc-800/50 rounded-full px-3 py-1.5 text-xs text-zinc-300">
          <span className={selectedIds.length === requiredVotes ? "text-red-400 font-bold" : "text-zinc-500"}>
            {selectedIds.length}
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">{requiredVotes} selected</span>
        </div>
      </div>

      <div className="flex-1 px-4 pb-4 overflow-auto">
        <div className="max-w-md mx-auto space-y-2">
          {state.players.map((player) => {
            const isSelected = selectedIds.includes(player.id);
            const selectionIndex = selectedIds.indexOf(player.id);
            return (
              <button
                key={player.id}
                onClick={() => togglePlayer(player.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all active:scale-[0.98] ${
                  isSelected
                    ? "bg-red-500/10 border-red-500/50 ring-2 ring-red-500/30"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-black ${
                    isSelected
                      ? "bg-gradient-to-br from-red-500 to-orange-500"
                      : "bg-gradient-to-br from-zinc-600 to-zinc-700"
                  }`}
                >
                  {player.name[0].toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-medium">{player.name}</p>
                </div>
                {isSelected && (
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">
                    {selectionIndex + 1}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-8">
        <div className="max-w-md mx-auto">
          <button
            onClick={confirmVote}
            disabled={selectedIds.length !== requiredVotes}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 text-white font-bold py-4 rounded-2xl text-lg transition-all active:scale-[0.98] shadow-lg shadow-red-500/20 disabled:shadow-none"
          >
            {selectedIds.length === requiredVotes
              ? `Vote out ${selectedNames.join(" & ")}`
              : `Select ${requiredVotes - selectedIds.length} more player${requiredVotes - selectedIds.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
