import { StyleSheet } from "react-native";

export const COLORS = {
  background: "#F8F5FC",
  primary: "#7A3FB5",
  primarySoft: "#EBDDF8",
  card: "#FFFFFF",
  text: "#2A2038",
  muted: "#756B85",
  accent: "#E85D75",
  yellow: "#FFC94D",
  border: "#E8E0F0",
  green: "#2D8A63",
};

// Each Pokémon type gets its own colour (used on the Details screen).
const TYPE_COLORS = {
  normal: "#A8A878", fire: "#F08030", water: "#6890F0", electric: "#F2B90F",
  grass: "#5DB847", ice: "#6CC6C6", fighting: "#C03028", poison: "#A040A0",
  ground: "#C9A23E", flying: "#8F7FE0", psychic: "#F85888", bug: "#9AAA18",
  rock: "#A89028", ghost: "#705898", dragon: "#7038F8", dark: "#705848",
  steel: "#8E8EAA", fairy: "#E57F96",
};

export function typeColor(details) {
  const name = details?.types?.[0]?.type?.name;
  return TYPE_COLORS[name] || COLORS.primary;
}

// Soft card colours that cycle through the Pokédex.
const PASTELS = ["#FFE1E6", "#DDEEFF", "#DFF6DD", "#FFF1C2", "#EBDDF8", "#FFE5D0"];

export function pastelFor(id) {
  return PASTELS[Number(id) % PASTELS.length];
}

export function titleCase(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },

  // Banner header with rounded bottom corners
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 14,
  },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
  headerSubtitle: { fontSize: 14, color: "#E9DDF7", marginTop: 4 },

  searchRow: { paddingHorizontal: 16, paddingBottom: 10 },
  searchInput: {
    minHeight: 50,
    borderWidth: 2,
    borderColor: COLORS.primarySoft,
    backgroundColor: COLORS.card,
    borderRadius: 25,
    paddingHorizontal: 20,
    color: COLORS.text,
    fontSize: 15,
  },
  searchSpinner: { marginBottom: 8 },
  clearSearch: { paddingHorizontal: 20, paddingBottom: 8 },
  linkText: { color: COLORS.primary, fontWeight: "700" },

  primaryButtonWide: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    padding: 17,
    alignItems: "center",
    marginTop: 22,
  },
  disabledButton: { opacity: 0.4 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },

  // Grid cards (Pokédex and My Team)
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  gridRow: { justifyContent: "space-between" },
  gridCard: {
    width: "48%",
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  gridImageBubble: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  gridImage: { width: 98, height: 98 },
  gridName: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginTop: 10, textAlign: "center" },
  gridBadge: { backgroundColor: "#FFFFFF", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, marginTop: 6 },
  gridNumber: { color: COLORS.primary, fontSize: 12, fontWeight: "800" },

  artworkFallback: { backgroundColor: COLORS.border, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  artworkFallbackText: { color: COLORS.muted, fontSize: 28, fontWeight: "800" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  mutedText: { color: COLORS.muted, fontSize: 14, marginTop: 6 },
  errorBox: { padding: 16, alignItems: "center" },
  errorText: { color: "#B42336", fontSize: 14, marginBottom: 8 },
  emptyText: { textAlign: "center", color: COLORS.muted, padding: 24 },

  // Details screen
  hero: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 28,
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
  },
  heroNumber: { color: "rgba(255,255,255,0.9)", fontWeight: "800", letterSpacing: 2 },
  heroBubble: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  detailImage: { width: 210, height: 210 },
  heroTitle: { color: "#FFFFFF", fontSize: 34, fontWeight: "800" },
  typeRow: { flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 12 },
  heroPill: { backgroundColor: "#FFFFFF", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  heroPillText: { fontWeight: "800" },
  detailBody: { padding: 20, paddingBottom: 40 },
  measureRow: { flexDirection: "row", gap: 12 },
  measureCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 22, padding: 16, alignItems: "center" },
  measureValue: { color: COLORS.text, fontSize: 20, fontWeight: "800" },
  sectionTitle: { color: COLORS.text, fontSize: 19, fontWeight: "800", marginTop: 22, marginBottom: 12 },
  statContainer: { marginBottom: 12 },
  statLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  statName: { color: COLORS.text, fontSize: 13 },
  statValue: { color: COLORS.text, fontSize: 13, fontWeight: "800" },
  statTrack: { height: 12, borderRadius: 12, backgroundColor: COLORS.border, overflow: "hidden" },
  statFill: { height: "100%", borderRadius: 12 },

  // My Team
  teamSummary: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#FFF3CC",
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamPowerLabel: { color: COLORS.text, fontSize: 16, fontWeight: "800" },
  teamPowerValue: { color: COLORS.primary, fontSize: 24, fontWeight: "800" },
  emptySlot: {
    width: "48%",
    minHeight: 196,
    borderRadius: 28,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    opacity: 0.55,
  },
  emptySlotPlus: { color: COLORS.primary, fontSize: 38, fontWeight: "800" },
  emptySlotText: { color: COLORS.primary, fontWeight: "700", marginTop: 2 },
  removePill: { marginTop: 8, backgroundColor: "#FFFFFF", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6 },
  removeText: { color: "#B42336", fontWeight: "800", fontSize: 12 },

  // Game
  gameContent: { paddingHorizontal: 16, paddingBottom: 32 },
  scoreRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  scoreChip: { flex: 1, borderRadius: 18, paddingVertical: 10, alignItems: "center" },
  scoreChipValue: { color: COLORS.text, fontSize: 20, fontWeight: "800" },
  scoreChipLabel: { color: COLORS.text, fontSize: 12, fontWeight: "700" },
  mysteryCard: { borderRadius: 32, alignItems: "center", padding: 20 },
  mysteryBubble: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  mysteryImage: { width: 210, height: 210 },
  mysteryHint: { color: COLORS.text, fontSize: 20, fontWeight: "800", textAlign: "center", marginTop: 14 },
  choiceGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  choiceButton: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderColor: COLORS.primarySoft,
    borderWidth: 2,
    borderRadius: 22,
    paddingVertical: 20,
    marginBottom: 12,
    alignItems: "center",
  },
  choiceText: { color: COLORS.text, fontSize: 16, fontWeight: "800" },
  correctChoice: { backgroundColor: "#DFF5E8", borderColor: COLORS.green },
  wrongChoice: { backgroundColor: "#FCE5E9", borderColor: COLORS.accent },
});
