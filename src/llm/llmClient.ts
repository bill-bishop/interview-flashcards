export type LlmRequest = {
  kind: "build_deck" | "evaluate_answer";
  input: any;
};

export type LlmResponse = { output: any };

// Stub: replace with OpenAI client later.
export async function callLlm(req: LlmRequest): Promise<LlmResponse> {
  // In this scaffold, we never hit network.
  // Return canned responses if you want, but we mostly seed local DB instead.
  return { output: { stub: true, kind: req.kind } };
}
