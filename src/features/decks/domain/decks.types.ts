export type DeckCategory = {
  id: string;
  jobId: string;
  key: string;      // e.g. "system_design"
  label: string;    // "System Design"
  orderIndex: number;
};

export type Flashcard = {
  id: string;
  jobId: string;
  categoryKey: string;
  question: string;
  suggestedAnswer: string;
  tagsJson: string; // json string array
};
