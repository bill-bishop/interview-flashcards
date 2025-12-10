import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../../ui/theme/tokens";

export function SessionProgressHeader({ done, total, mode }: { done: number; total: number; mode: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.mode}>{mode.toUpperCase()}</Text>
      <Text style={styles.count}>{done}/{total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  mode: { color: colors.subtext, fontWeight: "900" },
  count: { color: colors.text, fontWeight: "900" },
});
