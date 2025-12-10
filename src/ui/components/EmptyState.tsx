import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../theme/tokens";

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.lg },
  title: { color: colors.text, fontSize: 16, fontWeight: "800", marginBottom: spacing.sm },
  subtitle: { color: colors.subtext, fontSize: 13, fontWeight: "600" },
});
