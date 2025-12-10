import { callLlm } from "../../../llm/llmClient";

// Stub: later generate & persist decks/cards. Right now we seed locally at DB init.
export async function generateDecksForJob(_input: {
  jobId: string;
  categories?: string[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  await callLlm({ kind: "build_deck", input: _input });
  return { ok: true };
}
