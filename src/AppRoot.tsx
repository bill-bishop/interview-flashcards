import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, StyleSheet, StatusBar } from "react-native";

import { colors } from "./ui/theme/tokens";
import { RootNavigator } from "./navigation/RootNavigator";
import { DbProvider, useDbReady } from "./data/db/DbProvider";
import { LoadingState } from "./ui/components/LoadingState";

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.panel,
    text: colors.text,
    border: colors.border,
    primary: colors.brand,
  },
};

function AppShell() {
  const ready = useDbReady();
  if (!ready) return <LoadingState label="Initializing local database..." />;
  return <RootNavigator />;
}

export default function AppRoot() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <View style={styles.root}>
        <DbProvider>
          <NavigationContainer theme={navTheme}>
            <AppShell />
          </NavigationContainer>
        </DbProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
