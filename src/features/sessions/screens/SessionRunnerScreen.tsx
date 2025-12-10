import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../navigation/routes";
import { colors, spacing, radius } from "../../../ui/theme/tokens";
import { useDb } from "../../../data/db/DbProvider";
import { getSession, pickNextCardId, setSessionCompleted, upsertAttempt, upsertAttemptEval, listAttemptsForSession } from "../../../data/repositories/sessionsRepo";
import { getCardById } from "../../../data/repositories/decksRepo";
import { evaluateAnswer } from "../services/evaluator";
import { FlashcardFlip } from "../components/FlashcardFlip";
import { AnswerComposer } from "../components/AnswerComposer";
import { EvaluationPanel } from "../components/EvaluationPanel";
import { ComparisonView } from "../components/ComparisonView";
import { SessionProgressHeader } from "../components/SessionProgressHeader";
import { LoadingState } from "../../../ui/components/LoadingState";
import { ReattemptFooter } from "../components/ReattemptFooter";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SessionRunnerScreen() {
  const db = useDb();
  const nav = useNavigation<Nav>();
  const route = useRoute<any>();
  const sessionId = route.params.sessionId as string;

  const [session, setSession] = React.useState<any | null>(null);
  const [card, setCard] = React.useState<any | null>(null);
  const [reveal, setReveal] = React.useState(false);
  const [answer, setAnswer] = React.useState("");
  const [evalResult, setEvalResult] = React.useState<any | null>(null);
  const [attemptId, setAttemptId] = React.useState<string | null>(null);
  const [doneCount, setDoneCount] = React.useState(0);

  const load = React.useCallback(async () => {
    const s = await getSession(db, sessionId);
    setSession(s);
    const attempts = await listAttemptsForSession(db, sessionId);
    setDoneCount(attempts.length);
    const nextCardId = await pickNextCardId(db, sessionId);
    if (!nextCardId) {
      await setSessionCompleted(db, sessionId);
      nav.replace("SessionResults", { sessionId });
      return;
    }
    const c = await getCardById(db, nextCardId);
    setCard(c);
    setReveal(false);
    setAnswer("");
    setEvalResult(null);
    setAttemptId(null);
  }, [db, sessionId, nav]);

  React.useEffect(() => { load(); }, [load]);

  async function submit() {
    if (!session || !card) return;
    const attId = await upsertAttempt(db, { sessionId, cardId: card.id, userAnswer: answer });
    setAttemptId(attId);

    if (session.mode === "practice") {
      const r = await evaluateAnswer({ question: card.question, suggestedAnswer: card.suggested_answer, userAnswer: answer, categoryKey: card.category_key });
      const verdict = r.verdict;
      await upsertAttemptEval(db, { attemptId: attId, verdict, summary: r.summary, improvements: r.improvements, suggestedAnswer: card.suggested_answer });
      setEvalResult({ ...r, verdict });
    } else {
      // Interview mode: defer eval to end; still store attempt.
      setEvalResult({ deferred: true });
    }

    // update done count UI
    const attempts = await listAttemptsForSession(db, sessionId);
    setDoneCount(attempts.length);
  }

  async function next() {
    if (!session) return;
    if (session.mode === "interview") {
      // if we reached target count, finish.
      const attempts = await listAttemptsForSession(db, sessionId);
      if (attempts.length >= session.target_count) {
        await setSessionCompleted(db, sessionId);
        nav.replace("SessionResults", { sessionId });
        return;
      }
    }
    await load();
  }

  function reattempt() {
    setAnswer("");
    setEvalResult(null);
    setAttemptId(null);
  }

  if (!session || !card) return <LoadingState label="Loading session..." />;

  const showPracticeEval = session.mode === "practice" && evalResult && !evalResult.deferred;

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <SessionProgressHeader done={doneCount} total={session.target_count} mode={session.mode} />

      <FlashcardFlip
        question={card.question}
        suggestedAnswer={card.suggested_answer}
        reveal={reveal}
        onToggleReveal={() => setReveal((r) => !r)}
      />

      {!attemptId ? (
        <AnswerComposer value={answer} onChange={setAnswer} onSubmit={submit} disabled={answer.trim().length === 0} />
      ) : null}

      {session.mode === "interview" && attemptId ? (
        <View style={styles.panel}>
          <Text style={styles.panelText}>Saved. Evaluation will show at the end.</Text>
          <Pressable style={styles.btn} onPress={next}>
            <Text style={styles.btnText}>Next</Text>
          </Pressable>
        </View>
      ) : null}

      {showPracticeEval ? (
        <>
          <ComparisonView userAnswer={answer} suggestedAnswer={card.suggested_answer} />
          <EvaluationPanel verdict={evalResult.verdict} summary={evalResult.summary} improvements={evalResult.improvements} />
          <ReattemptFooter onReattempt={reattempt} onNext={next} />
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, backgroundColor: colors.bg },
  panel: { marginTop: spacing.lg, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, gap: spacing.md },
  panelText: { color: colors.text, fontWeight: "700" },
  btn: { backgroundColor: colors.brand, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  btnText: { color: colors.text, fontWeight: "900" },
});
