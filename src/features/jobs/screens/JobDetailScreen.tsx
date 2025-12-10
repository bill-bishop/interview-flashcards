import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useDb } from "../../../data/db/DbProvider";
import { getJob } from "../../../data/repositories/jobsRepo";
import type { RootStackParamList } from "../../../navigation/routes";
import { colors, spacing, radius } from "../../../ui/theme/tokens";
import { LoadingState } from "../../../ui/components/LoadingState";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function JobDetailScreen() {
  const db = useDb();
  const nav = useNavigation<Nav>();
  const route = useRoute<any>();
  const jobId = route.params.jobId as string;

  const [job, setJob] = React.useState<any | null>(null);

  React.useEffect(() => {
    (async () => {
      const j = await getJob(db, jobId);
      setJob(j);
    })();
  }, [db, jobId]);

  if (!job) return <LoadingState label="Loading job..." />;

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.sub}>{job.company}</Text>

      <Pressable style={styles.btn} onPress={() => nav.navigate("DecksForJob", { jobId })}>
        <Text style={styles.btnText}>Choose Deck Categories</Text>
      </Pressable>

      <Text style={styles.h2}>Job Description</Text>
      <Text style={styles.jd}>{job.jd_text}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 20, fontWeight: "900" },
  sub: { color: colors.subtext, fontWeight: "700", marginBottom: spacing.lg },
  btn: { backgroundColor: colors.brand, padding: spacing.md, borderRadius: radius.md, alignItems: "center", marginBottom: spacing.lg },
  btnText: { color: colors.text, fontWeight: "900" },
  h2: { color: colors.subtext, fontWeight: "900", marginBottom: spacing.sm },
  jd: { color: colors.text, lineHeight: 20 },
});
