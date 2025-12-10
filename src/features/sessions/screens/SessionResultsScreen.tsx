import React from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../navigation/routes";
import { colors, spacing, radius } from "../../../ui/theme/tokens";
import { useDb } from "../../../data/db/DbProvider";
import { getSession, listAttemptsForSession, upsertAttemptEval, getAttemptEval } from "../../../data/repositories/sessionsRepo";
import { getCardById } from "../../../data/repositories/decksRepo";
import { evaluateAnswer } from "../services/evaluator";
import { LoadingState } from "../../../ui/components/LoadingState";
import { ScoreBadge } from "../components/ScoreBadge";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SessionResultsScreen() {
  const db = useDb();
  const nav = useNavigation<Nav>();
  const route = useRoute<any>();
  const sessionId = route.params.sessionId as string;

  const [items, setItems] = React.useState<any[] | null>(null);
  const [mode, setMode] = React.useState<string>("");

  React.useEffect(() => {
    (async () => {
      const s = await getSession(db, sessionId);
      setMode(s?.mode ?? "");
      const attempts = await listAttemptsForSession(db, sessionId);

      // If interview mode, evaluate now (stubbed), store eval rows.
      const enriched: any[] = [];
      for (const a of attempts) {
        const card = await getCardById(db, a.card_id);
        let ev = await getAttemptEval(db, a.id);
        if (!ev) {
          const r = await evaluateAnswer({
            question: card.question,
            suggestedAnswer: card.suggested_answer,
            userAnswer: a.user_answer,
            categoryKey: card.category_key,
          });
          await upsertAttemptEval(db, {
            attemptId: a.id,
            verdict: r.verdict,
            summary: r.summary,
            improvements: r.improvements,
            suggestedAnswer: card.suggested_answer,
          });
          ev = await getAttemptEval(db, a.id);
        }
        enriched.push({ attempt: a, card, eval: ev });
      }
      setItems(enriched);
    })();
  }, [db, sessionId]);

  if (!items) return <LoadingState label="Building results..." />;

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Results</Text>
      <Text style={styles.sub}>Mode: {mode}</Text>

      <FlatList
        data={items}
        keyExtractor={(x) => x.attempt.id}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => nav.navigate("CardReview", { attemptId: item.attempt.id })}>
            <View style={{ flex: 1 }}>
              <Text style={styles.q} numberOfLines={2}>{item.card.question}</Text>
              <Text style={styles.meta}>{item.card.category_key}</Text>
            </View>
            <ScoreBadge verdict={item.eval.verdict} />
          </Pressable>
        )}
      />

      <Pressable style={styles.btn} onPress={() => nav.navigate("Tabs")}>
        <Text style={styles.btnText}>Back to Jobs</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 20, fontWeight: "900" },
  sub: { color: colors.subtext, fontWeight: "700", marginBottom: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, marginBottom: spacing.md },
  q: { color: colors.text, fontWeight: "800" },
  meta: { color: colors.subtext, fontWeight: "700", marginTop: spacing.xs },
  btn: { marginTop: spacing.md, backgroundColor: colors.brand, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  btnText: { color: colors.text, fontWeight: "900" },
});
