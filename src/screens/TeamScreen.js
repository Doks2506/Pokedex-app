import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles, titleCase } from "../theme";
import { MAX_TEAM_SIZE, useTeam } from "../context/TeamContext";
import Header from "../components/Header";
import PokemonCard from "../components/PokemonCard";

export default function TeamScreen({ navigation }) {
  const { team, removeFromTeam } = useTeam();

  const totalPower = team.reduce(
    (sum, member) =>
      sum +
      (member.stats || []).reduce((memberSum, stat) => memberSum + stat.base_stat, 0),
    0
  );

  // Always show 6 slots: the team first, then empty placeholders.
  const slots = [
    ...team,
    ...Array.from({ length: MAX_TEAM_SIZE - team.length }, (_, i) => ({
      id: `empty-${i}`,
      empty: true,
    })),
  ];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <Header
        title="🏆 My Team"
        subtitle={`${team.length} of ${MAX_TEAM_SIZE} Pokémon selected`}
      />

      <View style={styles.teamSummary}>
        <Text style={styles.teamPowerLabel}>⚡ Team power</Text>
        <Text style={styles.teamPowerValue}>{totalPower}</Text>
      </View>

      <FlatList
        data={slots}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) =>
          item.empty ? (
            <View style={styles.emptySlot}>
              <Text style={styles.emptySlotPlus}>+</Text>
              <Text style={styles.emptySlotText}>Empty slot</Text>
            </View>
          ) : (
            <PokemonCard
              pokemon={{ name: item.name, id: item.id }}
              onPress={() => navigation.navigate("Details", { id: item.id })}
            >
              <Pressable
                style={styles.removePill}
                onPress={() => removeFromTeam(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${titleCase(item.name)} from team`}
              >
                <Text style={styles.removeText}>✕ Remove</Text>
              </Pressable>
            </PokemonCard>
          )
        }
      />
    </SafeAreaView>
  );
}
