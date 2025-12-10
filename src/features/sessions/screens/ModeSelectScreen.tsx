import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../navigation/routes";
import { colors, spacing, radius } from "../../../ui/theme/tokens";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ModeSelectScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<any>();
  const jobId = route.params.jobId as string;
  const categories = route.params.categories as string[];

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Choose mode</Text>
      <Text style={styles.sub}>Practice = feedback after each question. Interview = feedback at the end.</Text>

      <Pressable style={styles.btn} onPress={() => nav.navigate("SessionSetup", { jobId, categories, mode: "practice" })}>
        <Text style={styles.btnText}>Practice mode</Text>
      </Pressable>

      <Pressable style={[styles.btn, styles.secondary]} onPress={() => nav.navigate("SessionSetup", { jobId, categories, mode: "interview" })}>
        <Text style={styles.btnText}>Interview mode</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 20, fontWeight: "900", marginBottom: spacing.sm },
  sub: { color: colors.subtext, fontWeight: "700", marginBottom: spacing.lg },
  btn: { backgroundColor: colors.brand, padding: spacing.md, borderRadius: radius.md, alignItems: "center", marginBottom: spacing.md },
  secondary: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border },
  btnText: { color: colors.text, fontWeight: "900" },
});
