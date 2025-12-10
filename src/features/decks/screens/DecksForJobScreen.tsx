import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../navigation/routes";
import { colors, spacing, radius } from "../../../ui/theme/tokens";
import { useDb } from "../../../data/db/DbProvider";
import { getCategoryCounts } from "../../../data/repositories/decksRepo";
import { LoadingState } from "../../../ui/components/LoadingState";
import { DeckCategoryCard } from "../components/DeckCategoryCard";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function DecksForJobScreen() {
  const db = useDb();
  const nav = useNavigation<Nav>();
  const route = useRoute<any>();
  const jobId = route.params.jobId as string;

  const [cats, setCats] = React.useState<{ key: string; label: string; count: number }[] | null>(null);
  const [selected, setSelected] = React.useState<string[]>([]);

  React.useEffect(() => {
    (async () => {
      const rows = await getCategoryCounts(db, jobId);
      setCats(rows);
      setSelected(rows.filter(r => r.count > 0).slice(0, 4).map(r => r.key)); // default select some
    })();
  }, [db, jobId]);

  if (!cats) return <LoadingState label="Loading categories..." />;

  function toggle(k: string) {
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <Text style={styles.title}>Pick categories</Text>
      <Text style={styles.sub}>Select what you want to practice for this job.</Text>

      {cats.map((c) => (
        <DeckCategoryCard
          key={c.key}
          label={c.label}
          count={c.count}
          selected={selected.includes(c.key)}
          onPress={() => toggle(c.key)}
        />
      ))}

      <Pressable
        style={[styles.btn, selected.length === 0 ? styles.btnDisabled : null]}
        disabled={selected.length === 0}
        onPress={() => nav.navigate("ModeSelect", { jobId, categories: selected })}
      >
        <Text style={styles.btnText}>Continue</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 20, fontWeight: "900" },
  sub: { color: colors.subtext, fontWeight: "700", marginBottom: spacing.lg },
  btn: { marginTop: spacing.lg, backgroundColor: colors.brand, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: colors.text, fontWeight: "900" },
});
