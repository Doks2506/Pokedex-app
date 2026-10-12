import React from "react";
import { Pressable, Text, View } from "react-native";
import { getPokemonId } from "../api";
import { pastelFor, styles, titleCase } from "../theme";
import Artwork from "./Artwork";

// Colourful grid card. `children` is shown under the number (the Team screen
// puts its Remove button there).
export default function PokemonCard({ pokemon, onPress, children }) {
  const id = pokemon.id || getPokemonId(pokemon);

  return (
    <Pressable
      style={[styles.gridCard, { backgroundColor: pastelFor(id) }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${titleCase(pokemon.name)}, number ${id}`}
    >
      <View style={styles.gridImageBubble}>
        <Artwork id={id} style={styles.gridImage} />
      </View>
      <Text style={styles.gridName} numberOfLines={1}>
        {titleCase(pokemon.name)}
      </Text>
      <View style={styles.gridBadge}>
        <Text style={styles.gridNumber}>#{String(id).padStart(3, "0")}</Text>
      </View>
      {children}
    </Pressable>
  );
}
