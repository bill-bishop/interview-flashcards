import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../../../ui/theme/tokens";

export function FlashcardFace({ question }: { question: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Question</Text>
      <Text style={styles.q}>{question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg },
  label: { color: colors.subtext, fontWeight: "900", marginBottom: spacing.sm },
  q: { color: colors.text, fontSize: 16, fontWeight: "800", lineHeight: 22 },
});
