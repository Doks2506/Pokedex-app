import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { getArtwork, getSprite } from "../api";
import { styles } from "../theme";

// Shows the official artwork. If an image fails to load it tries the next
// source, and only shows a "?" placeholder once every source has failed.
export default function Artwork({ id, style, resizeMode, fallbackUris = [] }) {
  const sources = [getArtwork(id), ...fallbackUris, getSprite(id)];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [id]);

  if (index >= sources.length) {
    // tintColor is only valid on Image, so strip it for the placeholder View.
    const { tintColor, ...viewStyle } = StyleSheet.flatten(style) || {};
    return (
      <View style={[viewStyle, styles.artworkFallback]}>
        <Text style={styles.artworkFallbackText}>?</Text>
      </View>
    );
  }

  return (
    <Image
      key={sources[index]}
      source={{ uri: sources[index] }}
      style={style}
      resizeMode={resizeMode}
      onError={() => setIndex((current) => current + 1)}
    />
  );
}
