const BASE_URL = "https://pokeapi.co/api/v2";

// Where the Pokédex list starts: last three digits of my student number.
// Offset N starts at dex number N + 1, so 186 starts at #187.
export const START_OFFSET = 186;

// Highest National Dex number to show. Higher IDs are alternate forms (mega, gmax, etc.)
// whose artwork is often missing. Raise this when new generations are added.
export const MAX_DEX_ID = 1025;

const REQUEST_TIMEOUT_MS = 10000;
const SEARCH_LIMIT = 50;

let pokemonNamesPromise = null; // caches the promise, not the result
const detailsCache = new Map();

async function request(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("The request timed out. Check your connection.");
    }
    throw new Error("Network error. Check your connection.");
  } finally {
    clearTimeout(timer);
  }
}

// List URLs look like .../pokemon/25/ so the id is the last non-empty piece.
export function getPokemonId(pokemon) {
  return Number(pokemon.url.split("/").filter(Boolean).pop());
}

// Plain sprite from the same repo: a smaller backup if the artwork file is missing.
export function getSprite(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

// Image URLs that PokéAPI itself returns inside the details response.
export function spriteUris(details) {
  const sprites = (details && details.sprites) || {};
  return [
    sprites.other?.["official-artwork"]?.front_default,
    sprites.other?.home?.front_default,
    sprites.front_default,
  ].filter(Boolean);
}

export function getArtwork(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export async function fetchPokemonPage(offset = START_OFFSET, limit = 20) {
  // The list is ordered by ID, so offset N starts at dex number N + 1.
  const safeLimit = Math.min(limit, MAX_DEX_ID - offset);

  if (safeLimit <= 0) {
    return { results: [], hasMore: false };
  }

  const response = await request(`/pokemon?offset=${offset}&limit=${safeLimit}`);

  if (!response.ok) {
    throw new Error("Could not load Pokémon.");
  }

  const data = await response.json();

  return {
    results: data.results,
    hasMore: offset + data.results.length < MAX_DEX_ID,
  };
}

export async function fetchPokemonDetails(nameOrId) {
  const key = String(nameOrId).toLowerCase();

  if (detailsCache.has(key)) return detailsCache.get(key);

  const response = await request(`/pokemon/${encodeURIComponent(key)}`);

  if (!response.ok) {
    throw new Error("Pokémon details not found.");
  }

  const data = await response.json();

  // Cache under both name and id so either lookup hits.
  detailsCache.set(String(data.name).toLowerCase(), data);
  detailsCache.set(String(data.id), data);

  return data;
}

function loadPokemonNames() {
  if (!pokemonNamesPromise) {
    pokemonNamesPromise = (async () => {
      // The list is ordered by id, so the first MAX_DEX_ID entries are the real dex.
      const response = await request(`/pokemon?limit=${MAX_DEX_ID}`);

      if (!response.ok) {
        throw new Error("Could not load the Pokémon search list.");
      }

      const data = await response.json();
      return data.results;
    })().catch((err) => {
      pokemonNamesPromise = null; // a failed load must not be cached forever
      throw err;
    });
  }

  return pokemonNamesPromise;
}

export async function searchPokemon(query) {
  const term = query.trim().toLowerCase();

  if (!term) return [];

  const names = await loadPokemonNames();
  const matches = names.filter((pokemon) => pokemon.name.includes(term));

  // Names that start with the search term come first.
  matches.sort(
    (a, b) =>
      Number(b.name.startsWith(term)) - Number(a.name.startsWith(term))
  );

  return matches.slice(0, SEARCH_LIMIT);
}
