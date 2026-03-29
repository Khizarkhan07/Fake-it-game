"use client";

import React, { useState } from "react";
import { useGame } from "@/lib/gameContext";

export default function RoleReveal() {
  const { state, dispatch } = useGame();
  const [isRevealed, setIsRevealed] = useState(false);

  const currentPlayer = state.players[state.currentPlayerIndex];
  const allRevealed = state.currentPlayerIndex >= state.players.length;

  if (allRevealed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md space-y-6">
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-bold text-white">Everyone&apos;s Ready!</h2>
          <p className="text-zinc-400">
            All players have seen their roles. Time to discuss!
          </p>
          <button
            onClick={() => dispatch({ type: "ALL_ROLES_REVEALED" })}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-2xl text-lg transition-all active:scale-[0.98] shadow-lg shadow-purple-500/20"
          >
            Start Discussion
          </button>
        </div>
      </div>
    );
  }

  if (!isRevealed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md space-y-6">
          <div className="text-sm text-zinc-500 font-medium tracking-widest uppercase">
            Player {state.currentPlayerIndex + 1} of {state.players.length}
          </div>
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-black">
            {currentPlayer.name[0].toUpperCase()}
          </div>
          <h2 className="text-3xl font-black text-white">
            {currentPlayer.name}
          </h2>
          <p className="text-zinc-400 text-lg">
            Pass the phone to <strong className="text-white">{currentPlayer.name}</strong>
          </p>
          <div className="pt-4">
            <button
              onClick={() => setIsRevealed(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-2xl text-lg transition-all active:scale-[0.98] shadow-lg shadow-purple-500/20"
            >
              👀 Reveal My Role
            </button>
            <p className="text-zinc-600 text-xs mt-3">
              Make sure no one else can see the screen!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Role is revealed
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-md space-y-6 w-full">
        <div className="text-sm text-zinc-500 font-medium tracking-widest uppercase">
          {currentPlayer.name}&apos;s Role
        </div>

        {currentPlayer.isImpostor ? (
          <div className="space-y-4">
            <div className="text-7xl">🕵️</div>
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6">
              <h2 className="text-3xl font-black text-red-400 mb-2">
                IMPOSTOR
              </h2>
              <p className="text-red-300/80">
                You don&apos;t know the word! Blend in during the discussion
                without getting caught.
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-4 text-sm text-zinc-400">
              <p className="font-medium text-zinc-300 mb-1">Tips:</p>
              <ul className="space-y-1 text-left list-disc list-inside">
                <li>Act natural during the discussion</li>
                <li>Watch others&apos; reactions for clues about the word</li>
                <li>Category is: <strong className="text-purple-400">{state.selectedCategories.length === 1 ? state.selectedCategories[0] : `${state.selectedCategories.length} categories`}</strong></li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-7xl">👤</div>
            <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-emerald-400 mb-1">
                THE SECRET WORD IS
              </h2>
              <p className="text-4xl font-black text-white">
                {state.secretWord}
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-4 text-sm text-zinc-400">
              <p className="font-medium text-zinc-300 mb-1">Tips:</p>
              <ul className="space-y-1 text-left list-disc list-inside">
                <li>Prove you know the word during discussion</li>
                <li>Don&apos;t make it too obvious — the impostor is listening!</li>
                <li>Watch who seems clueless</li>
              </ul>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            dispatch({ type: "PLAYER_SEEN_ROLE" });
            setIsRevealed(false);
          }}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl text-lg transition-all active:scale-[0.98] border border-zinc-700"
        >
          Got it! Pass the phone →
        </button>
      </div>
    </div>
  );
}
