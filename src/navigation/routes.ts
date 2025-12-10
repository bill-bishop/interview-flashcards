export type RootStackParamList = {
  Tabs: undefined;
  JobCreate: undefined;
  JobDetail: { jobId: string };
  DecksForJob: { jobId: string };
  ModeSelect: { jobId: string; categories: string[] };
  SessionSetup: { jobId: string; categories: string[]; mode: "practice" | "interview" };
  SessionRunner: { sessionId: string };
  SessionResults: { sessionId: string };
  CardReview: { attemptId: string };
};
