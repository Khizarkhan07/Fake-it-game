"use client";

import React from "react";
import { useGame } from "@/lib/gameContext";

export default function Timer() {
  const { state } = useGame();
  const minutes = Math.floor(state.roundTimeRemaining / 60);
  const seconds = state.roundTimeRemaining % 60;

  const isLow = state.roundTimeRemaining <= 60;
  const isCritical = state.roundTimeRemaining <= 30;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-lg font-bold ${
        isCritical
          ? "bg-red-500/20 text-red-400 animate-pulse"
          : isLow
          ? "bg-amber-500/20 text-amber-400"
          : "bg-zinc-800 text-zinc-300"
      }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}
