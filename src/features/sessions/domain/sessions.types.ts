export type SessionMode = "practice" | "interview";

export type Session = {
  id: string;
  jobId: string;
  mode: SessionMode;
  categoriesJson: string; // json string array
  targetCount: number;
  createdAt: string;
  completedAt?: string | null;
};

export type Attempt = {
  id: string;
  sessionId: string;
  cardId: string;
  userAnswer: string;
  createdAt: string;
};

export type AttemptEval = {
  attemptId: string;
  verdict: "good" | "medium" | "bad" | "neutral";
  summary: string;
  improvementsJson: string; // json string array
  suggestedAnswer: string;
};
