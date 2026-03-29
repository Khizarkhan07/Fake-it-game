"use client";

import React from "react";
import { useGame } from "@/lib/gameContext";

export default function Results() {
  const { state, dispatch } = useGame();

  const latestResult = state.roundHistory[state.roundHistory.length - 1];
  if (!latestResult) return null;

  const impostors = state.players.filter((p) => p.isImpostor);
  const allCaught = latestResult.impostorsCaught === latestResult.totalImpostors;
  const someCaught = latestResult.impostorsCaught > 0 && !allCaught;
  const noneCaught = latestResult.impostorsCaught === 0;
  const votedOutPlayers = state.players.filter((p) => p.isEliminated);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-4 py-8 overflow-auto">
        <div className="max-w-md mx-auto space-y-6">
          {/* Result Banner */}
          <div className="text-center space-y-4">
            <div className="text-7xl">
              {allCaught ? "🎉" : someCaught ? "😬" : "😈"}
            </div>
            <h1
              className={`text-3xl font-black ${
                allCaught
                  ? "text-emerald-400"
                  : someCaught
                  ? "text-amber-400"
                  : "text-red-400"
              }`}
            >
              {allCaught
                ? latestResult.totalImpostors > 1
                  ? "All Impostors Caught!"
                  : "Impostor Caught!"
                : someCaught
                ? "Partial Victory!"
                : latestResult.totalImpostors > 1
                ? "Impostors Win!"
                : "Impostor Wins!"}
            </h1>
            <p className="text-zinc-400 text-lg">
              {allCaught
                ? "The team identified all the impostors!"
                : someCaught
                ? `Caught ${latestResult.impostorsCaught} of ${latestResult.totalImpostors} impostors!`
                : latestResult.totalImpostors > 1
                ? "The impostors fooled everyone!"
                : "The impostor fooled everyone!"}
            </p>
          </div>

          {/* The Impostor Reveal */}
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 text-center">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-3">
              {impostors.length > 1 ? "The Impostors Were" : "The Impostor Was"}
            </p>
            <div className={`flex justify-center gap-4 ${impostors.length > 2 ? "flex-wrap" : ""}`}>
              {impostors.map((imp) => (
                <div key={imp.id} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xl font-black mb-1">
                    {imp.name[0].toUpperCase()}
                  </div>
                  <p className="text-base font-bold text-white">{imp.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The Word */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5 text-center">
            <p className="text-xs text-purple-400 uppercase tracking-widest font-medium mb-1">
              The Secret Word
            </p>
            <p className="text-3xl font-black text-white">
              {latestResult.word}
            </p>
            <p className="text-sm text-purple-300/60 mt-1">
              Category: {latestResult.category}
            </p>
          </div>

          {/* Group Vote Result */}
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Voted Out ({votedOutPlayers.length})
            </h3>
            <div className="space-y-2">
              {votedOutPlayers.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-3 rounded-xl p-3 ${
                    player.isImpostor
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      player.isImpostor
                        ? "bg-gradient-to-br from-emerald-500 to-green-500"
                        : "bg-gradient-to-br from-red-500 to-orange-500"
                    }`}
                  >
                    {player.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">
                        {player.name}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          player.isImpostor
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-zinc-700 text-zinc-400"
                        }`}
                      >
                        {player.isImpostor ? "WAS AN IMPOSTOR" : "INNOCENT"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {latestResult.impostorsCaught > 0 && latestResult.impostorsCaught < latestResult.totalImpostors && (
              <p className="text-xs text-amber-400 mt-3">
                ⚠️ {latestResult.totalImpostors - latestResult.impostorsCaught} impostor{latestResult.totalImpostors - latestResult.impostorsCaught > 1 ? "s" : ""} escaped!
              </p>
            )}
          </div>

          {/* Score Changes */}
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Scores
            </h3>
            <div className="space-y-2">
              {[...state.players]
                .sort((a, b) => b.score - a.score)
                .map((player, i) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-zinc-800/50 rounded-xl px-4 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">
                        {i === 0
                          ? "🥇"
                          : i === 1
                          ? "🥈"
                          : i === 2
                          ? "🥉"
                          : `#${i + 1}`}
                      </span>
                      <span className="text-white font-medium text-sm">
                        {player.name}
                      </span>
                    </div>
                    <span className="text-yellow-400 font-bold">
                      {player.score} pts
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-8">
        <div className="max-w-md mx-auto space-y-2">
          <button
            onClick={() => dispatch({ type: "NEXT_ROUND" })}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-2xl text-lg transition-all active:scale-[0.98] shadow-lg shadow-purple-500/20"
          >
            Play Again
          </button>
          <button
            onClick={() => dispatch({ type: "RESET_GAME" })}
            className="w-full text-zinc-500 hover:text-zinc-300 font-medium py-2 transition-colors text-sm"
          >
            Reset Everything
          </button>
        </div>
      </div>
    </div>
  );
}
