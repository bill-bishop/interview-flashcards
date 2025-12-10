import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { RootStackParamList } from "./routes";

import { JobsHomeScreen } from "../features/jobs/screens/JobsHomeScreen";
import { JobCreateScreen } from "../features/jobs/screens/JobCreateScreen";
import { JobDetailScreen } from "../features/jobs/screens/JobDetailScreen";

import { ProfileSetupScreen } from "../features/profile/screens/ProfileSetupScreen";

import { DecksForJobScreen } from "../features/decks/screens/DecksForJobScreen";
import { ModeSelectScreen } from "../features/sessions/screens/ModeSelectScreen";
import { SessionSetupScreen } from "../features/sessions/screens/SessionSetupScreen";
import { SessionRunnerScreen } from "../features/sessions/screens/SessionRunnerScreen";
import { SessionResultsScreen } from "../features/sessions/screens/SessionResultsScreen";
import { CardReviewScreen } from "../features/sessions/screens/CardReviewScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Jobs" component={JobsHomeScreen} />
      <Tab.Screen name="Profile" component={ProfileSetupScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="JobCreate" component={JobCreateScreen} options={{ title: "New Job" }} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: "Job" }} />
      <Stack.Screen name="DecksForJob" component={DecksForJobScreen} options={{ title: "Deck Categories" }} />
      <Stack.Screen name="ModeSelect" component={ModeSelectScreen} options={{ title: "Mode" }} />
      <Stack.Screen name="SessionSetup" component={SessionSetupScreen} options={{ title: "Session" }} />
      <Stack.Screen name="SessionRunner" component={SessionRunnerScreen} options={{ title: "Practice" }} />
      <Stack.Screen name="SessionResults" component={SessionResultsScreen} options={{ title: "Results" }} />
      <Stack.Screen name="CardReview" component={CardReviewScreen} options={{ title: "Review" }} />
    </Stack.Navigator>
  );
}
