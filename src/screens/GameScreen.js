import React, { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPokemonDetails, spriteUris } from "../api";
import { COLORS, pastelFor, styles, titleCase } from "../theme";
import Artwork from "../components/Artwork";
import Header from "../components/Header";
import Loading from "../components/Loading";

export default function GameScreen() {
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const newQuestion = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSelected(null);
      // Clear the old round so a failed fetch never leaves stale content.
      setQuestion(null);
      setChoices([]);

      const ids = new Set();
      while (ids.size < 4) {
        ids.add(Math.floor(Math.random() * 151) + 1);
      }

      const details = await Promise.all(
        [...ids].map((id) => fetchPokemonDetails(id))
      );

      const target = details[Math.floor(Math.random() * details.length)];
      setQuestion(target);
      setChoices(details);
    } catch (err) {
      setError(err.message || "Could not start the game.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    newQuestion();
  }, [newQuestion]);

  function chooseAnswer(choice) {
    if (selected !== null || !question) return;

    setSelected(choice.name);

    if (choice.id === question.id) {
      const next = streak + 1;
      setScore((previous) => previous + 1);
      setStreak(next);
      setBestStreak((best) => Math.max(best, next));
    } else {
      setStreak(0);
    }
  }

  const answered = selected !== null;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <Header
        title="❓ Who's That Pokémon?"
        subtitle="Recognise the silhouette to earn a point"
      />

      <ScrollView contentContainerStyle={styles.gameContent}>
        <View style={styles.scoreRow}>
          <View style={[styles.scoreChip, { backgroundColor: "#FFF1C2" }]}>
            <Text style={styles.scoreChipValue}>⭐ {score}</Text>
            <Text style={styles.scoreChipLabel}>Score</Text>
          </View>
          <View style={[styles.scoreChip, { backgroundColor: "#FFE5D0" }]}>
            <Text style={styles.scoreChipValue}>🔥 {streak}</Text>
            <Text style={styles.scoreChipLabel}>Streak</Text>
          </View>
          <View style={[styles.scoreChip, { backgroundColor: "#EBDDF8" }]}>
            <Text style={styles.scoreChipValue}>🏆 {bestStreak}</Text>
            <Text style={styles.scoreChipLabel}>Best</Text>
          </View>
        </View>

        {loading ? (
          <Loading />
        ) : question ? (
          <>
            <View style={[styles.mysteryCard, { backgroundColor: pastelFor(question.id) }]}>
              <View style={styles.mysteryBubble}>
                <Artwork
                  id={question.id}
                  fallbackUris={spriteUris(question)}
                  style={[
                    styles.mysteryImage,
                    !answered ? { tintColor: "#151515" } : null,
                  ]}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.mysteryHint}>
                {!answered
                  ? "Who's that Pokémon?"
                  : selected === question.name
                    ? "🎉 Correct! Great job!"
                    : `😅 Not quite! It was ${titleCase(question.name)}.`}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Choose your answer</Text>

            <View style={styles.choiceGrid}>
              {choices.map((choice) => {
                let buttonStyle = styles.choiceButton;

                if (answered && choice.id === question.id) {
                  buttonStyle = [styles.choiceButton, styles.correctChoice];
                } else if (selected === choice.name) {
                  buttonStyle = [styles.choiceButton, styles.wrongChoice];
                }

                return (
                  <Pressable
                    key={choice.id}
                    style={buttonStyle}
                    onPress={() => chooseAnswer(choice)}
                    disabled={answered}
                    accessibilityRole="button"
                    accessibilityLabel={titleCase(choice.name)}
                  >
                    <Text style={styles.choiceText}>{titleCase(choice.name)}</Text>
                  </Pressable>
                );
              })}
            </View>

            {answered ? (
              <Pressable style={styles.primaryButtonWide} onPress={newQuestion}>
                <Text style={styles.buttonText}>Next Pokémon ➜</Text>
              </Pressable>
            ) : null}
          </>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!question && !loading ? (
          <Pressable style={styles.primaryButtonWide} onPress={newQuestion}>
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
