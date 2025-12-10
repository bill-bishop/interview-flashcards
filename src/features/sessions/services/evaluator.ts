import { callLlm } from "../../../llm/llmClient";
import { pick } from "../../../utils/random";

// Stub evaluation: quick heuristic + canned feedback.
export async function evaluateAnswer(input: {
  question: string;
  suggestedAnswer: string;
  userAnswer: string;
  categoryKey: string;
}) {
  await callLlm({ kind: "evaluate_answer", input });

  const len = (input.userAnswer ?? "").trim().length;
  let verdict: "good" | "medium" | "bad" | "neutral" = "neutral";
  if (len === 0) verdict = "bad";
  else if (len < 80) verdict = "medium";
  else verdict = "good";

  const improvementsPool = [
    "Lead with a crisp 1–2 sentence thesis before details.",
    "Name tradeoffs explicitly (latency vs consistency, cost vs complexity).",
    "Use a concrete example from your own work to make it memorable.",
    "Close with a brief 'what I'd do next' to show ownership.",
    "Add one measurable metric (scale, users, latency, error rate).",
  ];

  const improvements = [pick(improvementsPool), pick(improvementsPool)].filter((v, i, a) => a.indexOf(v) === i);

  const summary =
    verdict === "good"
      ? "Solid answer. Clear structure and enough technical detail."
      : verdict === "medium"
      ? "Decent start, but it needs more structure and specifics."
      : "Answer is missing. Try again with a short thesis + 2–3 supporting points.";

  return { verdict, summary, improvements };
}
