import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { colors, spacing, radius } from "../../../ui/theme/tokens";
import { useDb } from "../../../data/db/DbProvider";
import { getProfile, upsertProfile } from "../../../data/repositories/profileRepo";
import { LoadingState } from "../../../ui/components/LoadingState";

export function ProfileSetupScreen() {
  const db = useDb();
  const [loading, setLoading] = React.useState(true);
  const [resumeText, setResumeText] = React.useState("");
  const [linksJson, setLinksJson] = React.useState('["https://github.com/yourname/project-foo"]');

  React.useEffect(() => {
    (async () => {
      const p = await getProfile(db);
      if (p) {
        setResumeText(p.resume_text);
        setLinksJson(p.portfolio_links_json);
      }
      setLoading(false);
    })();
  }, [db]);

  async function save() {
    await upsertProfile(db, { resumeText, portfolioLinksJson: linksJson });
  }

  if (loading) return <LoadingState label="Loading profile..." />;

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.sub}>Resume + links are used to generate personalized decks (stubbed for now).</Text>

      <Text style={styles.label}>Resume (text)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={resumeText}
        onChangeText={setResumeText}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.label}>Portfolio links (JSON array)</Text>
      <TextInput style={styles.input} value={linksJson} onChangeText={setLinksJson} />

      <Pressable style={styles.btn} onPress={save}>
        <Text style={styles.btnText}>Save</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 22, fontWeight: "900" },
  sub: { color: colors.subtext, fontWeight: "600", marginBottom: spacing.lg },
  label: { color: colors.subtext, fontWeight: "800", marginTop: spacing.md, marginBottom: spacing.sm },
  input: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, color: colors.text },
  multiline: { height: 220 },
  btn: { marginTop: spacing.lg, backgroundColor: colors.brand, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  btnText: { color: colors.text, fontWeight: "900" },
});
