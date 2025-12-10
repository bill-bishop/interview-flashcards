import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../../../ui/theme/tokens";

export function ReattemptFooter({
  onReattempt,
  onNext,
}: {
  onReattempt: () => void;
  onNext: () => void;
}) {
  return (
    <View style={styles.row}>
      <Pressable style={[styles.btn, styles.secondary]} onPress={onReattempt}>
        <Text style={styles.btnText}>Reattempt</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={onNext}>
        <Text style={styles.btnText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg },
  btn: { flex: 1, backgroundColor: colors.brand, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  secondary: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border },
  btnText: { color: colors.text, fontWeight: "900" },
});
