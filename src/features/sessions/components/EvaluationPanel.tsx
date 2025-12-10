import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../../../ui/theme/tokens";
import { ScoreBadge } from "./ScoreBadge";

export function EvaluationPanel({
  verdict,
  summary,
  improvements,
}: {
  verdict: "good" | "medium" | "bad" | "neutral";
  summary: string;
  improvements: string[];
}) {
  return (
    <View style={styles.wrap}>
      <ScoreBadge verdict={verdict} />
      <Text style={styles.summary}>{summary}</Text>
      <Text style={styles.label}>Suggested improvements</Text>
      {improvements.map((t, i) => (
        <Text key={i} style={styles.bullet}>• {t}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm, marginTop: spacing.lg },
  summary: { color: colors.text, fontWeight: "700", lineHeight: 18 },
  label: { color: colors.subtext, fontWeight: "900", marginTop: spacing.sm },
  bullet: { color: colors.text, fontWeight: "600", lineHeight: 18 },
});
