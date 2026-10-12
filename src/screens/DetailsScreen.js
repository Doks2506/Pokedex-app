import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPokemonDetails, spriteUris } from "../api";
import { styles, titleCase, typeColor } from "../theme";
import { MAX_TEAM_SIZE, useTeam } from "../context/TeamContext";
import Artwork from "../components/Artwork";
import Loading from "../components/Loading";

export default function DetailsScreen({ route }) {
  const { id } = route.params;
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const { team, addToTeam, removeFromTeam } = useTeam();

  useEffect(() => {
    let active = true;

    // Reset so stale content never shows for a different Pokémon.
    setDetails(null);
    setError("");

    fetchPokemonDetails(id)
      .then((data) => {
        if (active) setDetails(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!details) return <Loading />;

  const color = typeColor(details);
  const inTeam = team.some((member) => member.id === details.id);
  const teamFull = team.length >= MAX_TEAM_SIZE && !inTeam;

  function toggleTeam() {
    if (inTeam) {
      removeFromTeam(details.id);
    } else if (!addToTeam(details)) {
      Alert.alert("Team full", "Your team can contain only six Pokémon.");
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <ScrollView>
        <View style={[styles.hero, { backgroundColor: color }]}>
          <Text style={styles.heroNumber}>
            POKÉMON #{String(details.id).padStart(3, "0")}
          </Text>

          <View style={styles.heroBubble}>
            <Artwork
              id={details.id}
              style={styles.detailImage}
              resizeMode="contain"
              fallbackUris={spriteUris(details)}
            />
          </View>

          <Text style={styles.heroTitle}>{titleCase(details.name)}</Text>

          <View style={styles.typeRow}>
            {details.types.map((item) => (
              <View key={item.type.name} style={styles.heroPill}>
                <Text style={[styles.heroPillText, { color }]}>
                  {titleCase(item.type.name)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.detailBody}>
          <View style={styles.measureRow}>
            <View style={styles.measureCard}>
              <Text style={styles.measureValue}>{details.height / 10} m</Text>
              <Text style={styles.mutedText}>📏 Height</Text>
            </View>
            <View style={styles.measureCard}>
              <Text style={styles.measureValue}>{details.weight / 10} kg</Text>
              <Text style={styles.mutedText}>⚖️ Weight</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>💪 Base stats</Text>

          {details.stats.map((item) => (
            <View key={item.stat.name} style={styles.statContainer}>
              <View style={styles.statLabelRow}>
                <Text style={styles.statName}>
                  {titleCase(item.stat.name.replace(/-/g, " "))}
                </Text>
                <Text style={styles.statValue}>{item.base_stat}</Text>
              </View>
              <View style={styles.statTrack}>
                <View
                  style={[
                    styles.statFill,
                    {
                      backgroundColor: color,
                      width: `${Math.min(item.base_stat / 255, 1) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>
          ))}

          <Pressable
            style={[
              styles.primaryButtonWide,
              { backgroundColor: color },
              teamFull && styles.disabledButton,
            ]}
            onPress={toggleTeam}
            disabled={teamFull}
            accessibilityRole="button"
            accessibilityState={{ disabled: teamFull }}
          >
            <Text style={styles.buttonText}>
              {inTeam
                ? "Remove from My Team"
                : teamFull
                  ? `Team full (${MAX_TEAM_SIZE}/${MAX_TEAM_SIZE})`
                  : "⭐ Add to My Team"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
