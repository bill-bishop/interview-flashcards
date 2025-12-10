import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../../../ui/theme/tokens";

const map = {
  good: colors.good,
  medium: colors.medium,
  bad: colors.bad,
  neutral: colors.neutral,
} as const;

export function ScoreBadge({ verdict }: { verdict: "good" | "medium" | "bad" | "neutral" }) {
  const bg = map[verdict];
  return (
    <View style={[styles.badge, { borderColor: bg }]}>
      <Text style={[styles.text, { color: bg }]}>{verdict.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: "flex-start", paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.lg, borderWidth: 2 },
  text: { fontWeight: "900" },
});
