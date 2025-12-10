import React from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useDb } from "../../../data/db/DbProvider";
import { listJobs } from "../../../data/repositories/jobsRepo";
import type { RootStackParamList } from "../../../navigation/routes";
import { colors, spacing, radius } from "../../../ui/theme/tokens";
import { LoadingState } from "../../../ui/components/LoadingState";
import { EmptyState } from "../../../ui/components/EmptyState";
import { clamp } from "../../../utils/text";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function JobsHomeScreen() {
  const nav = useNavigation<Nav>();
  const db = useDb();
  const [jobs, setJobs] = React.useState<any[] | null>(null);

  const load = React.useCallback(async () => {
    const rows = await listJobs(db);
    setJobs(rows);
  }, [db]);

  React.useEffect(() => { load(); }, [load]);

  if (!jobs) return <LoadingState label="Loading jobs..." />;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Jobs</Text>
        <Pressable style={styles.btn} onPress={() => nav.navigate("JobCreate")}>
          <Text style={styles.btnText}>+ Add</Text>
        </Pressable>
      </View>

      {jobs.length === 0 ? (
        <EmptyState title="No jobs yet" subtitle="Add a job description to generate flashcards." />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(j) => j.id}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => nav.navigate("JobDetail", { jobId: item.id })}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>{item.company} • {item.source_type}</Text>
              <Text style={styles.cardText}>{clamp(item.jd_text, 140)}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, backgroundColor: colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: 22, fontWeight: "900" },
  btn: { backgroundColor: colors.brand, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md },
  btnText: { color: colors.text, fontWeight: "900" },

  card: { backgroundColor: colors.panel, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: "900", marginBottom: spacing.xs },
  cardSub: { color: colors.subtext, fontWeight: "700", marginBottom: spacing.sm },
  cardText: { color: colors.text, opacity: 0.9 },
});
