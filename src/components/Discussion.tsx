"use client";

import React from "react";
import { useGame } from "@/lib/gameContext";
import Timer from "./Timer";

export default function Discussion() {
  const { state, dispatch } = useGame();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="text-center pt-6 pb-4 px-4">
        <Timer />
        <h1 className="text-3xl font-black text-white mt-4">
          🗣️ Discussion Time!
        </h1>
        <p className="text-zinc-400 mt-2 text-sm max-w-xs mx-auto">
          Everyone discusses in person. Give hints, ask questions, and figure out
          who the {state.impostorCount > 1 ? "impostors are" : "impostor is"}!
        </p>
      </div>

      {/* Players */}
      <div className="flex-1 px-4 pb-4 overflow-auto">
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Players in this round
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {state.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 bg-zinc-800/50 rounded-xl p-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center text-white font-bold">
                    {player.name[0].toUpperCase()}
                  </div>
                  <span className="text-white font-medium text-sm truncate">
                    {player.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 text-center">
            <p className="text-xs text-purple-400 uppercase tracking-widest font-medium mb-1">
              Category
            </p>
            <p className="text-xl font-bold text-white">
              {state.currentCategory}
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
            <h3 className="text-amber-400 font-bold text-sm mb-1">
              💡 Discussion Tips
            </h3>
            <ul className="text-amber-300/70 text-sm space-y-1 list-disc list-inside">
              <li>Take turns giving verbal hints about the word</li>
              <li>Who seems unsure or gives vague answers?</li>
              <li>Ask players to explain their logic!</li>
              <li>The {state.impostorCount > 1 ? "impostors don't" : "impostor doesn't"} know the word — catch them out!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Vote Button */}
      <div className="sticky bottom-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-8">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => dispatch({ type: "START_VOTING" })}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-2xl text-lg transition-all active:scale-[0.98] shadow-lg shadow-red-500/20"
          >
            🗳️ Start Voting
          </button>
        </div>
      </div>
    </div>
  );
}
