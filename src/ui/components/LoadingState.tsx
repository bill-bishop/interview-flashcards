import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../theme/tokens";

export function LoadingState({ label }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator />
      {label ? <Text style={styles.text}>{label}</Text> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: spacing.lg, alignItems: "center", gap: spacing.sm },
  text: { color: colors.subtext, fontWeight: "600" },
});
