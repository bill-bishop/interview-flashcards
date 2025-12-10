import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../../../ui/theme/tokens";

// Simple non-animated flip (swap views). Upgrade later.
export function FlashcardFlip({
  question,
  suggestedAnswer,
  reveal,
  onToggleReveal,
}: {
  question: string;
  suggestedAnswer: string;
  reveal: boolean;
  onToggleReveal: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        {!reveal ? (
          <>
            <Text style={styles.label}>Question</Text>
            <Text style={styles.big}>{question}</Text>
          </>
        ) : (
          <>
            <Text style={styles.label}>Suggested answer</Text>
            <Text style={styles.big}>{suggestedAnswer}</Text>
          </>
        )}
      </View>

      <Pressable style={styles.flipBtn} onPress={onToggleReveal}>
        <Text style={styles.flipText}>{reveal ? "Hide" : "Flip"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  card: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg },
  label: { color: colors.subtext, fontWeight: "900", marginBottom: spacing.sm },
  big: { color: colors.text, fontSize: 16, fontWeight: "800", lineHeight: 22 },
  flipBtn: { alignSelf: "flex-start", backgroundColor: colors.brand, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md },
  flipText: { color: colors.text, fontWeight: "900" },
});
