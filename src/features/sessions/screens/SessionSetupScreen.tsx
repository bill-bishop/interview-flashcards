import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../navigation/routes";
import { colors, spacing, radius } from "../../../ui/theme/tokens";
import { useDb } from "../../../data/db/DbProvider";
import { createSession } from "../../../data/repositories/sessionsRepo";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SessionSetupScreen() {
  const db = useDb();
  const nav = useNavigation<Nav>();
  const route = useRoute<any>();
  const jobId = route.params.jobId as string;
  const categories = route.params.categories as string[];
  const mode = route.params.mode as "practice" | "interview";

  const [targetCount, setTargetCount] = React.useState(5);

  async function start() {
    const sessionId = await createSession(db, { jobId, mode, categories, targetCount });
    nav.replace("SessionRunner", { sessionId });
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Session setup</Text>
      <Text style={styles.sub}>Mode: {mode}. Categories: {categories.length}.</Text>

      <View style={styles.row}>
        {[5, 10, 15].map((n) => (
          <Pressable key={n} style={[styles.pill, targetCount === n ? styles.pillOn : null]} onPress={() => setTargetCount(n)}>
            <Text style={styles.pillText}>{n}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.btn} onPress={start}>
        <Text style={styles.btnText}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 20, fontWeight: "900", marginBottom: spacing.sm },
  sub: { color: colors.subtext, fontWeight: "700", marginBottom: spacing.lg },
  row: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  pill: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg },
  pillOn: { borderColor: colors.brand },
  pillText: { color: colors.text, fontWeight: "900" },
  btn: { backgroundColor: colors.brand, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  btnText: { color: colors.text, fontWeight: "900" },
});
