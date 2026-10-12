import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { START_OFFSET, fetchPokemonPage, getPokemonId, searchPokemon } from "../api";
import { COLORS, styles } from "../theme";
import Header from "../components/Header";
import Loading from "../components/Loading";
import PokemonCard from "../components/PokemonCard";

const STUDENT_NAME = "Tshering Dolkar"; 
const PAGE_SIZE = 20;
const SEARCH_DELAY_MS = 450;

export default function PokedexScreen({ navigation }) {
  const [pokemon, setPokemon] = useState([]);
  const [offset, setOffset] = useState(START_OFFSET);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // A ref (not state) so two quick onEndReached calls can't both start a fetch.
  const fetching = useRef(false);

  // silent = true keeps the list on screen (used by pull-to-refresh).
  const loadPage = useCallback(async (pageOffset, append, silent = false) => {
    if (fetching.current) return;
    fetching.current = true;

    try {
      setError("");
      if (append) setLoadingMore(true);
      else if (!silent) setLoading(true);

      const data = await fetchPokemonPage(pageOffset, PAGE_SIZE);

      setPokemon((previous) => {
        const base = append ? previous : [];
        const seen = new Set(base.map((item) => item.name));
        return [...base, ...data.results.filter((item) => !seen.has(item.name))];
      });
      setOffset(pageOffset + data.results.length);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      fetching.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPage(START_OFFSET, false);
  }, [loadPage]);

  // Debounced search: wait until the user stops typing before calling the API.
  useEffect(() => {
    const term = query.trim();

    if (!term) {
      setSearchResults(null);
      setSearching(false);
      setError("");
      return;
    }

    let active = true; // ignore answers from outdated queries
    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        setError("");
        const results = await searchPokemon(term);
        if (active) setSearchResults(results);
      } catch (err) {
        if (active) setError(err.message || "Search failed.");
      } finally {
        if (active) setSearching(false);
      }
    }, SEARCH_DELAY_MS);

    // Runs before the next effect and on unmount: cancels the pending timer.
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, retryCount]);

  async function handleRefresh() {
    if (searchResults !== null || query.trim()) return;
    setRefreshing(true);
    await loadPage(START_OFFSET, false, true);
    setRefreshing(false);
  }

  function retry() {
    if (searchResults !== null || query.trim()) {
      setRetryCount((count) => count + 1);
    } else if (pokemon.length === 0) {
      loadPage(START_OFFSET, false);
    } else {
      // Retry the page that failed instead of wiping the list.
      loadPage(offset, true);
    }
  }

  const displayedPokemon = searchResults === null ? pokemon : searchResults;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <Header
        title={`Pokédex – ${STUDENT_NAME}`}
        subtitle="Discover your next favourite Pokémon"
      />

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search any Pokémon..."
          placeholderTextColor={COLORS.muted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {searchResults !== null ? (
        <Pressable
          style={styles.clearSearch}
          onPress={() => {
            setQuery("");
            setSearchResults(null);
            setError("");
          }}
        >
          <Text style={styles.linkText}>Clear search and return to Pokédex</Text>
        </Pressable>
      ) : null}

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={retry}>
            <Text style={styles.linkText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {searching ? (
        <ActivityIndicator size="small" color={COLORS.primary} style={styles.searchSpinner} />
      ) : null}

      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={displayedPokemon}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onPress={() =>
                navigation.navigate("Details", { id: item.id || getPokemonId(item) })
              }
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={() => {
            if (
              searchResults === null &&
              hasMore &&
              !loadingMore &&
              !loading &&
              !error
            ) {
              loadPage(offset, true);
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            error ? null : <Text style={styles.emptyText}>No Pokémon found.</Text>
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
                style={{ margin: 20 }}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
