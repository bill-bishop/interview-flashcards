import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../../../ui/theme/tokens";

export function DeckCategoryCard({
  label,
  count,
  selected,
  onPress,
}: {
  label: string;
  count: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.card, selected ? styles.selected : null]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.sub}>{count} cards</Text>
      </View>
      <Text style={styles.tick}>{selected ? "✓" : ""}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  selected: { borderColor: colors.brand },
  title: { color: colors.text, fontWeight: "900", fontSize: 15 },
  sub: { color: colors.subtext, fontWeight: "700", marginTop: spacing.xs },
  tick: { color: colors.brand, fontWeight: "900", fontSize: 18, width: 20, textAlign: "right" },
});
