import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { COLORS, styles } from "../theme";

export default function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.mutedText}>Loading Pokémon...</Text>
    </View>
  );
}
