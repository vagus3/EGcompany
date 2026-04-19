export type PuzzleType = "SLIDER" | "PATTERN" | "CODE" | "LOGIC" | "HIDDEN_OBJECT";
export type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export interface SceneConfig {
  camera: {
    position: [number, number, number];
    fov: number;
  };
  lighting: {
    ambient: { color: string; intensity: number };
    directional: { color: string; intensity: number; position: [number, number, number] };
  };
  background: string;
}

export interface PuzzleObjectConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  modelPath?: string;
  color?: string;
}

export interface PuzzleData {
  question: string;
  hints: string[];
  answer: string | string[] | number[];
  maxAttempts?: number;
}

export interface RoomWithPuzzles {
  id: string;
  title: string;
  description: string | null;
  difficulty: number;
  sceneConfig: SceneConfig;
  puzzles: PuzzleWithConfig[];
}

export interface PuzzleWithConfig {
  id: string;
  roomId: string;
  title: string;
  type: PuzzleType;
  order: number;
  data: PuzzleData;
  objectConfig: PuzzleObjectConfig;
}

export interface UserProgress {
  userId: string;
  roomId: string;
  puzzleId?: string;
  status: ProgressStatus;
  solvedAt?: Date;
  attempts: number;
  hintUsed: boolean;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
