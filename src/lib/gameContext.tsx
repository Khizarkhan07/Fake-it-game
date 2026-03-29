"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { GameState, GameAction, GamePhase, Player, RoundResult } from "./types";
import { getRandomWord, CATEGORIES } from "./words";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createPlayer(name: string): Player {
  return {
    id: generateId(),
    name,
    isImpostor: false,
    score: 0,
    votedFor: "",
    isEliminated: false,
    hasSeenRole: false,
  };
}

const ROUND_DURATION = 300; // 5 minutes in seconds

const initialState: GameState = {
  phase: "lobby",
  players: [],
  selectedCategories: ["Party"],
  activeCategory: "",
  secretWord: "",
  roundNumber: 0,
  currentPlayerIndex: 0,
  roundTimeRemaining: ROUND_DURATION,
  roundHistory: [],
  usedWords: [],
  impostorCount: 1,
};

function assignImpostors(players: Player[], count: number): Player[] {
  const reset = [...players].map((p) => ({
    ...p,
    isImpostor: false,
    votedFor: "",
    isEliminated: false,
    hasSeenRole: false,
  }));
  // Shuffle indices and pick `count` impostors
  const indices = reset.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const impostorIndices = indices.slice(0, Math.min(count, reset.length - 1));
  impostorIndices.forEach((idx) => {
    reset[idx].isImpostor = true;
  });
  return reset;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_PLAYER": {
      if (state.players.length >= 15) return state;
      const trimmed = action.name.trim();
      if (!trimmed) return state;
      return {
        ...state,
        players: [...state.players, createPlayer(trimmed)],
      };
    }

    case "REMOVE_PLAYER": {
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.id),
      };
    }

    case "TOGGLE_CATEGORY": {
      const cats = state.selectedCategories;
      const has = cats.includes(action.category);
      if (has && cats.length === 1) return state; // must keep at least one
      return {
        ...state,
        selectedCategories: has
          ? cats.filter((c) => c !== action.category)
          : [...cats, action.category],
      };
    }

    case "SELECT_ALL_CATEGORIES": {
      const allNames = CATEGORIES.map((c) => c.name);
      return { ...state, selectedCategories: allNames };
    }

    case "DESELECT_ALL_CATEGORIES": {
      return state; // no-op, must keep at least one selected
    }

    case "SET_IMPOSTOR_COUNT": {
      return { ...state, impostorCount: action.count };
    }

    case "START_GAME": {
      if (state.players.length < 3) return state;
      const maxImpostors = Math.floor(state.players.length / 2);
      const actualCount = Math.min(state.impostorCount, maxImpostors);
      const { word, category } = getRandomWord(state.selectedCategories, state.usedWords);
      const playersWithRoles = assignImpostors(state.players, actualCount);
      return {
        ...state,
        phase: "roleReveal",
        players: playersWithRoles,
        secretWord: word,
        activeCategory: category,
        roundNumber: state.roundNumber + 1,
        currentPlayerIndex: 0,
        roundTimeRemaining: ROUND_DURATION,
        usedWords: [...state.usedWords, word],
        impostorCount: actualCount,
      };
    }

    case "PLAYER_SEEN_ROLE": {
      const updated = state.players.map((p, i) =>
        i === state.currentPlayerIndex ? { ...p, hasSeenRole: true } : p
      );
      const nextIndex = state.currentPlayerIndex + 1;
      if (nextIndex >= state.players.length) {
        return { ...state, players: updated, currentPlayerIndex: nextIndex };
      }
      return { ...state, players: updated, currentPlayerIndex: nextIndex };
    }

    case "ALL_ROLES_REVEALED": {
      return {
        ...state,
        phase: "discussion",
        currentPlayerIndex: 0,
      };
    }

    case "START_VOTING": {
      return { ...state, phase: "voting" };
    }

    case "GROUP_VOTE": {
      const votedOutIds = action.votedOutIds;
      const impostors = state.players.filter((p) => p.isImpostor);
      const impostorsCaught = votedOutIds.filter((id) =>
        impostors.some((imp) => imp.id === id)
      ).length;
      const teamWins = impostorsCaught > 0;

      // Update scores
      const scored = state.players.map((p) => {
        if (teamWins && !p.isImpostor) {
          // +100 per impostor caught for each team member
          return { ...p, score: p.score + 100 * impostorsCaught };
        }
        if (!teamWins && p.isImpostor) {
          return { ...p, score: p.score + 200 };
        }
        return p;
      });

      // Mark voted out players
      const final = scored.map((p) =>
        votedOutIds.includes(p.id) ? { ...p, isEliminated: true } : p
      );

      const result: RoundResult = {
        round: state.roundNumber,
        word: state.secretWord,
        category: state.activeCategory || "",
        impostorIds: impostors.map((p) => p.id),
        impostorNames: impostors.map((p) => p.name),
        impostorsCaught,
        totalImpostors: impostors.length,
        votedOutIds,
      };

      return {
        ...state,
        players: final,
        phase: "results",
        roundHistory: [...state.roundHistory, result],
      };
    }

    case "SHOW_RESULTS": {
      return { ...state, phase: "results" };
    }

    case "NEXT_ROUND": {
      return {
        ...state,
        phase: "lobby",
        secretWord: "",
        currentPlayerIndex: 0,
        roundTimeRemaining: ROUND_DURATION,
      };
    }

    case "RESET_GAME": {
      return {
        ...initialState,
        players: state.players.map((p) => ({
          ...p,
          score: 0,
          isImpostor: false,
          votedFor: "",
          isEliminated: false,
          hasSeenRole: false,
        })),
      };
    }

    case "TICK_TIMER": {
      if (state.roundTimeRemaining <= 0) return state;
      return { ...state, roundTimeRemaining: state.roundTimeRemaining - 1 };
    }

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer for discussion phase
  useEffect(() => {
    const timerPhases: GamePhase[] = ["discussion"];
    if (timerPhases.includes(state.phase) && state.roundTimeRemaining > 0) {
      timerRef.current = setInterval(() => {
        dispatch({ type: "TICK_TIMER" });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.phase, state.roundTimeRemaining > 0]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
