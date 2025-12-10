import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../../../ui/theme/tokens";

export function AnswerComposer({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Your answer (type)</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        multiline
        textAlignVertical="top"
        placeholder="Type your answer..."
        placeholderTextColor={colors.subtext}
      />
      <Pressable style={[styles.btn, disabled ? styles.btnDisabled : null]} onPress={onSubmit} disabled={disabled}>
        <Text style={styles.btnText}>Submit Answer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.lg },
  label: { color: colors.subtext, fontWeight: "900", marginBottom: spacing.sm },
  input: { minHeight: 140, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, color: colors.text },
  btn: { marginTop: spacing.md, backgroundColor: colors.brand, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: colors.text, fontWeight: "900" },
});
