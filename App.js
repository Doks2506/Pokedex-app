import React from "react";
import { StatusBar, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { COLORS } from "./src/theme";
import { TeamProvider } from "./src/context/TeamContext";
import PokedexScreen from "./src/screens/PokedexScreen";
import DetailsScreen from "./src/screens/DetailsScreen";
import TeamScreen from "./src/screens/TeamScreen";
import GameScreen from "./src/screens/GameScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Simple emoji tab icons: dimmed when the tab is not selected.
const tabIcon = (symbol) => ({ focused }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{symbol}</Text>
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: { height: 62, paddingBottom: 7, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tab.Screen name="Pokédex" component={PokedexScreen} options={{ tabBarIcon: tabIcon("📖") }} />
      <Tab.Screen name="My Team" component={TeamScreen} options={{ tabBarIcon: tabIcon("⭐") }} />
      <Tab.Screen name="Game" component={GameScreen} options={{ tabBarIcon: tabIcon("🎮") }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TeamProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
          <Stack.Navigator
            screenOptions={{
              headerTintColor: COLORS.primary,
              headerStyle: { backgroundColor: COLORS.background },
              headerTitleStyle: { fontWeight: "700" },
              contentStyle: { backgroundColor: COLORS.background },
            }}
          >
            <Stack.Screen name="Home" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="Details"
              component={DetailsScreen}
              options={{ title: "Pokémon Details" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TeamProvider>
    </SafeAreaProvider>
  );
}
