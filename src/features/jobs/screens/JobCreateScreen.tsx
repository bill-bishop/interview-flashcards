import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../navigation/routes";
import { colors, spacing, radius } from "../../../ui/theme/tokens";
import { useDb } from "../../../data/db/DbProvider";
import { createJob } from "../../../data/repositories/jobsRepo";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function JobCreateScreen() {
  const nav = useNavigation<Nav>();
  const db = useDb();

  const [title, setTitle] = React.useState("Senior React Native Engineer");
  const [company, setCompany] = React.useState("NewCo");
  const [jdText, setJdText] = React.useState("Paste the job description here...");

  async function onCreate() {
    const id = await createJob(db, { title, company, jdText, sourceType: "paste", sourceValue: "(manual)" });
    nav.replace("JobDetail", { jobId: id });
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Company</Text>
      <TextInput style={styles.input} value={company} onChangeText={setCompany} />

      <Text style={styles.label}>Job Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={jdText}
        onChangeText={setJdText}
        multiline
        textAlignVertical="top"
      />

      <Pressable style={styles.btn} onPress={onCreate}>
        <Text style={styles.btnText}>Create Job</Text>
      </Pressable>

      <Text style={styles.hint}>
        Deck generation is stubbed. Use the seeded job to test categories + sessions.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, backgroundColor: colors.bg },
  label: { color: colors.subtext, fontWeight: "800", marginTop: spacing.md, marginBottom: spacing.sm },
  input: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, color: colors.text },
  multiline: { height: 220 },
  btn: { marginTop: spacing.lg, backgroundColor: colors.brand, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  btnText: { color: colors.text, fontWeight: "900" },
  hint: { marginTop: spacing.lg, color: colors.subtext, fontWeight: "600" },
});
