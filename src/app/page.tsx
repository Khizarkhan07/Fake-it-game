"use client";

import { GameProvider, useGame } from "@/lib/gameContext";
import Lobby from "@/components/Lobby";
import RoleReveal from "@/components/RoleReveal";
import Discussion from "@/components/Discussion";
import Voting from "@/components/Voting";
import Results from "@/components/Results";

function GameRouter() {
  const { state } = useGame();

  switch (state.phase) {
    case "lobby":
      return <Lobby />;
    case "roleReveal":
      return <RoleReveal />;
    case "discussion":
      return <Discussion />;
    case "voting":
      return <Voting />;
    case "results":
      return <Results />;
    default:
      return <Lobby />;
  }
}

export default function Home() {
  return (
    <GameProvider>
      <div className="flex flex-col flex-1 bg-zinc-950 font-sans min-h-screen">
        <GameRouter />
      </div>
    </GameProvider>
  );
}
