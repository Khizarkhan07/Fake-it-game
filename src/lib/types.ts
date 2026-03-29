export type GamePhase =
  | "lobby"
  | "roleReveal"
  | "discussion"
  | "voting"
  | "results";

export interface Player {
  id: string;
  name: string;
  isImpostor: boolean;
  score: number;
  votedFor: string;
  isEliminated: boolean;
  hasSeenRole: boolean;
}

export interface RoundResult {
  round: number;
  word: string;
  category: string;
  impostorIds: string[];
  impostorNames: string[];
  impostorsCaught: number;
  totalImpostors: number;
  votedOutIds: string[];
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  selectedCategories: string[];
  activeCategory: string;
  secretWord: string;
  roundNumber: number;
  currentPlayerIndex: number;
  roundTimeRemaining: number;
  roundHistory: RoundResult[];
  usedWords: string[];
  impostorCount: number;
}

export type GameAction =
  | { type: "ADD_PLAYER"; name: string }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "TOGGLE_CATEGORY"; category: string }
  | { type: "SELECT_ALL_CATEGORIES" }
  | { type: "DESELECT_ALL_CATEGORIES" }
  | { type: "SET_IMPOSTOR_COUNT"; count: number }
  | { type: "START_GAME" }
  | { type: "PLAYER_SEEN_ROLE" }
  | { type: "ALL_ROLES_REVEALED" }
  | { type: "START_VOTING" }
  | { type: "GROUP_VOTE"; votedOutIds: string[] }
  | { type: "SHOW_RESULTS" }
  | { type: "NEXT_ROUND" }
  | { type: "RESET_GAME" }
  | { type: "TICK_TIMER" };
