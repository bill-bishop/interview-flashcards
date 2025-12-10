import { Db } from "./client";
import { nowIso } from "../../utils/time";

function j(v: any) { return JSON.stringify(v); }

export async function seedIfEmpty(db: Db) {
  const jobCount = await db.getFirstAsync<{ c: number }>("SELECT COUNT(*) as c FROM jobs");
  if (jobCount && (jobCount as any).c > 0) return;

  const createdAt = nowIso();

  // Profile seed
  await db.runAsync(
    "INSERT INTO profile (id, resume_text, portfolio_links_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [
      "profile-1",
      [
        "Will Bishop",
        "Senior Full-Stack Engineer (10+ years)",
        "React/TypeScript, Node, Python, systems design, reliability",
        "Modernization, CI/CD, mentoring, AI tooling",
      ].join("\n"),
      j(["https://github.com/yourname/project-foo", "https://your-portfolio.example.com"]),
      createdAt,
      createdAt,
    ]
  );

  // Job seed
  const jobId = "job-1";
  const jdText = [
    "We are hiring a Senior React Native Engineer to build a polished mobile experience.",
    "Requirements: React Native, TypeScript, offline-first, performance, testing, API design.",
    "Nice to have: security fundamentals, system design, mentoring.",
    "Behavioral: ownership, conflict resolution, leadership.",
  ].join("\n");

  await db.runAsync(
    "INSERT INTO jobs (id, title, company, source_type, source_value, jd_text, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [jobId, "Senior React Native Engineer", "Acme Mobile", "paste", "(seed)", jdText, createdAt]
  );

  // Categories seed
  const cats = [
    ["system_design", "System Design"],
    ["security", "Security"],
    ["javascript", "JavaScript / TS"],
    ["react_native", "React Native"],
    ["leadership", "Leadership"],
    ["conflict_resolution", "Conflict Resolution"],
    ["hard_hitting", "Hard Hitting"],
    ["project_history", "Project History"],
  ] as const;

  let idx = 0;
  for (const [key, label] of cats) {
    await db.runAsync(
      "INSERT INTO deck_categories (id, job_id, key, label, order_index) VALUES (?, ?, ?, ?, ?)",
      [`cat-${key}`, jobId, key, label, idx++]
    );
  }

  // Cards seed (a few per category)
  const cards: { id: string; cat: string; q: string; a: string; tags: string[] }[] = [
    { id: "c1", cat: "system_design", q: "Design an offline-first flashcard app. What are the key components?", a: "Local DB (SQLite) as source of truth, sync queue for network, deterministic session scheduler, caching, migrations, background retries, clear domain boundaries (jobs/decks/sessions), and instrumentation.", tags: ["offline", "sqlite", "sync"] },
    { id: "c2", cat: "system_design", q: "How would you structure the app so LLM providers are swappable?", a: "A thin llmClient wrapper + request/response schemas; isolate prompt builders; keep domain logic provider-agnostic; unit-test normalization; avoid UI importing provider SDKs.", tags: ["architecture", "abstraction"] },

    { id: "c3", cat: "security", q: "What PII risks exist when uploading resumes/JDs to an LLM, and how do you mitigate?", a: "PII leakage; redact sensitive fields; user consent toggles; client-side filtering; minimal necessary context; logging discipline; encryption at rest/in transit; vendor policy review.", tags: ["pii", "redaction"] },

    { id: "c4", cat: "javascript", q: "Explain the difference between structural typing and nominal typing in TypeScript.", a: "TS is structural: compatibility depends on shape, not explicit declarations. Nominal requires explicit identity. Structural boosts ergonomics but can hide accidental compatibility; use branded types to simulate nominal.", tags: ["typescript"] },

    { id: "c5", cat: "react_native", q: "What are common causes of jank in React Native and how do you address them?", a: "Excess re-renders, heavy JS thread work, large lists without virtualization, expensive layouts. Address with memoization, FlatList tuning, offload work, avoid inline funcs, optimize images, use Reanimated where needed.", tags: ["performance", "rn"] },

    { id: "c6", cat: "leadership", q: "Describe a time you mentored an engineer through a tricky technical problem.", a: "Frame context, ask them to propose hypotheses, set up minimal reproductions, guide with questions, pair on tests, and ensure a postmortem learning write-up. Emphasize autonomy growth.", tags: ["mentoring"] },

    { id: "c7", cat: "conflict_resolution", q: "How do you handle a disagreement on architecture direction?", a: "Clarify goals/constraints, gather data, propose options with tradeoffs, timebox experiments, write an ADR, align on decision owner, and revisit with metrics.", tags: ["adr", "tradeoffs"] },

    { id: "c8", cat: "hard_hitting", q: "What’s your biggest weakness and what are you doing about it?", a: "Pick a real but non-fatal weakness; show mitigation steps and measurable improvement. Example: over-indexing on perfect architecture early; now I timebox design and ship incremental slices.", tags: ["behavioral"] },

    { id: "c9", cat: "project_history", q: "Walk me through the architecture of your most impressive project.", a: "Start with goal -> high-level diagram -> core components -> data flow -> key decisions -> failure modes -> testing/observability -> what you’d improve next.", tags: ["story", "architecture"] },
  ];

  for (const c of cards) {
    await db.runAsync(
      "INSERT INTO cards (id, job_id, category_key, question, suggested_answer, tags_json) VALUES (?, ?, ?, ?, ?, ?)",
      [c.id, jobId, c.cat, c.q, c.a, j(c.tags)]
    );
  }
}
