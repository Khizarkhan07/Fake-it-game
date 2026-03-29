"use client";

import React, { useState } from "react";
import { useGame } from "@/lib/gameContext";
import { CATEGORIES } from "@/lib/words";

export default function Lobby() {
  const { state, dispatch } = useGame();
  const [playerName, setPlayerName] = useState("");
  const [showRules, setShowRules] = useState(false);

  const addPlayer = () => {
    if (playerName.trim()) {
      dispatch({ type: "ADD_PLAYER", name: playerName });
      setPlayerName("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addPlayer();
  };

  const canStart = state.players.length >= 3;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="text-center pt-8 pb-4 px-4">
        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
          FAKE IT
        </h1>
        <p className="text-zinc-400 mt-1 text-sm font-medium tracking-widest uppercase">
          Impostor Party Game
        </p>
        {state.roundNumber > 0 && (
          <div className="mt-2 inline-flex items-center gap-2 bg-zinc-800/50 rounded-full px-4 py-1.5 text-xs text-zinc-300">
            <span>Round {state.roundNumber} completed</span>
            <span className="w-1 h-1 rounded-full bg-zinc-500" />
            <span>{state.roundHistory.length} games played</span>
          </div>
        )}
      </div>

      {/* Players Section */}
      <div className="flex-1 px-4 pb-4 overflow-auto">
        <div className="max-w-md mx-auto space-y-4">
          {/* How to Play */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <button
              onClick={() => setShowRules(!showRules)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📖</span>
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  How to Play
                </h2>
              </div>
              <svg
                className={`w-5 h-5 text-zinc-500 transition-transform ${showRules ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showRules && (
              <div className="px-4 pb-4 space-y-4">
                <div className="h-px bg-zinc-800" />
                
                {/* Overview */}
                <div>
                  <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1.5">Overview</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    One or more players are secretly the <span className="text-red-400 font-semibold">Impostor</span> — they don&apos;t know the secret word! Everyone else is on the <span className="text-emerald-400 font-semibold">Team</span> and must figure out who&apos;s faking it.
                  </p>
                </div>

                {/* Game Flow */}
                <div>
                  <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Game Flow</h3>
                  <div className="space-y-2.5">
                    {[
                      { step: "1", icon: "👀", title: "Role Reveal", desc: "Pass the phone around. Each player privately sees if they're on the Team (with the secret word) or the Impostor (no word)." },
                      { step: "2", icon: "💬", title: "Discussion", desc: "Everyone takes turns giving a one-word hint about the secret word. The Impostor must bluff! Go around as many times as you like." },
                      { step: "3", icon: "🗳️", title: "Vote", desc: "The group discusses who they think is faking it, then votes. You must vote out as many players as there are impostors." },
                      { step: "4", icon: "🏆", title: "Results", desc: "See who was right! Team earns +100 pts per impostor caught. Impostors earn +200 pts if they survive." },
                    ].map((item) => (
                      <div key={item.step} className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-sm">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                          <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-zinc-800/50 rounded-xl p-3">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">💡 Tips</h3>
                  <ul className="space-y-1">
                    {[
                      "Impostors: give vague but plausible hints — don't be too specific or too generic.",
                      "Team: don't make your hints too obvious, or the impostor will figure out the word!",
                      "Watch reactions — hesitation and nervous laughs are tell-tale signs.",
                      "With multiple impostors, they don't know who each other are.",
                    ].map((tip, i) => (
                      <li key={i} className="text-xs text-zinc-400 leading-relaxed flex gap-1.5">
                        <span className="text-zinc-600 flex-shrink-0">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          {/* Add Player */}
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Add Players ({state.players.length}/15)
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter player name..."
                maxLength={20}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <button
                onClick={addPlayer}
                disabled={!playerName.trim() || state.players.length >= 15}
                className="bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold px-5 py-3 rounded-xl transition-all active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Player List */}
          {state.players.length > 0 && (
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                Players
              </h2>
              <div className="space-y-2">
                {state.players.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-zinc-800/50 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-white font-medium">
                        {player.name}
                      </span>
                      {player.score > 0 && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                          {player.score} pts
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        dispatch({ type: "REMOVE_PLAYER", id: player.id })
                      }
                      className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Selection */}
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                Categories ({state.selectedCategories.length}/{CATEGORIES.length})
              </h2>
              <button
                onClick={() => {
                  if (state.selectedCategories.length === CATEGORIES.length) {
                    // Deselect all except first
                    for (const cat of CATEGORIES.slice(1)) {
                      if (state.selectedCategories.includes(cat.name)) {
                        dispatch({ type: "TOGGLE_CATEGORY", category: cat.name });
                      }
                    }
                  } else {
                    dispatch({ type: "SELECT_ALL_CATEGORIES" });
                  }
                }}
                className={`text-xs font-semibold px-3 py-1 rounded-full transition-all ${
                  state.selectedCategories.length === CATEGORIES.length
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {state.selectedCategories.length === CATEGORIES.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = state.selectedCategories.includes(cat.name);
                return (
                  <button
                    key={cat.name}
                    onClick={() =>
                      dispatch({ type: "TOGGLE_CATEGORY", category: cat.name })
                    }
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all active:scale-95 ${
                      isSelected
                        ? "bg-purple-600/20 border-purple-500 text-purple-300"
                        : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    <span className="text-xl">{cat.emoji}</span>
                    <span className="text-xs font-medium">{cat.name}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Tap to toggle. Words will come from any selected category.
            </p>
          </div>

          {/* Impostor Count */}
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Number of Impostors
            </h2>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((count) => {
                const maxAllowed = Math.max(1, Math.floor(state.players.length / 2));
                const disabled = count > maxAllowed;
                return (
                  <button
                    key={count}
                    onClick={() =>
                      !disabled && dispatch({ type: "SET_IMPOSTOR_COUNT", count })
                    }
                    disabled={disabled}
                    className={`flex-1 py-3 rounded-xl border font-bold text-lg transition-all active:scale-95 ${
                      state.impostorCount === count
                        ? "bg-red-500/20 border-red-500 text-red-400"
                        : disabled
                        ? "bg-zinc-800/30 border-zinc-800 text-zinc-600 cursor-not-allowed"
                        : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              {state.players.length < 3
                ? "Add at least 3 players first"
                : `Max ${Math.floor(state.players.length / 2)} impostor${Math.floor(state.players.length / 2) !== 1 ? "s" : ""} for ${state.players.length} players`}
            </p>
          </div>

          {/* Scoreboard */}
          {state.roundHistory.length > 0 && (
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                Scoreboard
              </h2>
              <div className="space-y-2">
                {[...state.players]
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between bg-zinc-800/50 rounded-xl px-4 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {index === 0
                            ? "🥇"
                            : index === 1
                            ? "🥈"
                            : index === 2
                            ? "🥉"
                            : `#${index + 1}`}
                        </span>
                        <span className="text-white font-medium text-sm">
                          {player.name}
                        </span>
                      </div>
                      <span className="text-yellow-400 font-bold text-sm">
                        {player.score}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Start Button */}
      <div className="sticky bottom-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-8">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => dispatch({ type: "START_GAME" })}
            disabled={!canStart}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 text-white font-bold py-4 rounded-2xl text-lg transition-all active:scale-[0.98] shadow-lg shadow-purple-500/20 disabled:shadow-none"
          >
            {!canStart
              ? `Need ${3 - state.players.length} more player${
                  3 - state.players.length !== 1 ? "s" : ""
                }`
              : state.roundNumber > 0
              ? "Next Round"
              : "Start Game"}
          </button>
          {state.roundNumber > 0 && (
            <button
              onClick={() => dispatch({ type: "RESET_GAME" })}
              className="w-full mt-2 text-zinc-500 hover:text-zinc-300 font-medium py-2 transition-colors text-sm"
            >
              Reset All Scores
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
