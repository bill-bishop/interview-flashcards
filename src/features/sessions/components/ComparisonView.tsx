import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../../../ui/theme/tokens";

export function ComparisonView({ userAnswer, suggestedAnswer }: { userAnswer: string; suggestedAnswer: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.block}>
        <Text style={styles.label}>Your answer</Text>
        <Text style={styles.text}>{userAnswer || "(empty)"}</Text>
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>Suggested</Text>
        <Text style={styles.text}>{suggestedAnswer}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md, marginTop: spacing.lg },
  block: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md },
  label: { color: colors.subtext, fontWeight: "900", marginBottom: spacing.sm },
  text: { color: colors.text, fontWeight: "600", lineHeight: 18 },
});
