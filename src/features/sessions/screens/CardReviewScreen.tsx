import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../navigation/routes";
import { colors, spacing, radius } from "../../../ui/theme/tokens";
import { useDb } from "../../../data/db/DbProvider";
import { getAttempt, getAttemptEval } from "../../../data/repositories/sessionsRepo";
import { getCardById } from "../../../data/repositories/decksRepo";
import { LoadingState } from "../../../ui/components/LoadingState";
import { ScoreBadge } from "../components/ScoreBadge";
import { ComparisonView } from "../components/ComparisonView";
import { EvaluationPanel } from "../components/EvaluationPanel";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function CardReviewScreen() {
  const db = useDb();
  const nav = useNavigation<Nav>();
  const route = useRoute<any>();
  const attemptId = route.params.attemptId as string;

  const [data, setData] = React.useState<any | null>(null);

  React.useEffect(() => {
    (async () => {
      const attempt = await getAttempt(db, attemptId);
      const ev = await getAttemptEval(db, attemptId);
      const card = await getCardById(db, attempt.card_id);
      setData({ attempt, ev, card });
    })();
  }, [db, attemptId]);

  if (!data) return <LoadingState label="Loading review..." />;

  const improvements = JSON.parse(data.ev.improvements_json ?? "[]");

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <Text style={styles.title}>Card Review</Text>
      <ScoreBadge verdict={data.ev.verdict} />

      <View style={styles.card}>
        <Text style={styles.label}>Question</Text>
        <Text style={styles.text}>{data.card.question}</Text>
      </View>

      <ComparisonView userAnswer={data.attempt.user_answer} suggestedAnswer={data.ev.suggested_answer} />

      <EvaluationPanel verdict={data.ev.verdict} summary={data.ev.summary} improvements={improvements} />

      <Pressable style={styles.btn} onPress={() => nav.goBack()}>
        <Text style={styles.btnText}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 20, fontWeight: "900", marginBottom: spacing.md },
  card: { marginTop: spacing.lg, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md },
  label: { color: colors.subtext, fontWeight: "900", marginBottom: spacing.sm },
  text: { color: colors.text, fontWeight: "700", lineHeight: 18 },
  btn: { marginTop: spacing.lg, backgroundColor: colors.brand, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  btnText: { color: colors.text, fontWeight: "900" },
});
