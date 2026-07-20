import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../config";

export default function RecipeCard({ recipe, saved, onToggleSave }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.pin} />
      <View style={styles.headerRow}>
        <Text style={styles.title}>{recipe.title}</Text>
        <TouchableOpacity onPress={() => onToggleSave(recipe)} style={styles.heartBtn}>
          <Feather name="heart" size={18} color={saved ? COLORS.tomato : COLORS.inkFainter} />
        </TouchableOpacity>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Feather name="clock" size={12} color={COLORS.inkFaint} />
          <Text style={styles.metaText}>{recipe.prepTime || "—"}</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="shopping-bag" size={12} color={COLORS.inkFaint} />
          <Text style={styles.metaText}>{(recipe.missing || []).length} to buy</Text>
        </View>
      </View>

      <View style={styles.tagWrap}>
        {(recipe.owned || []).map((i, idx) => (
          <View key={idx} style={styles.ownedTag}>
            <Text style={styles.ownedTagText}>{i}</Text>
          </View>
        ))}
      </View>
      {(recipe.missing || []).length > 0 && (
        <View style={[styles.tagWrap, { marginTop: 6 }]}>
          {recipe.missing.map((i, idx) => (
            <View key={idx} style={styles.missingTag}>
              <Text style={styles.missingTagText}>+ {i}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.toggleRow}>
        <Text style={styles.toggleText}>{expanded ? "Hide steps" : "Show steps"}</Text>
        <Feather name={expanded ? "chevron-up" : "chevron-down"} size={15} color={COLORS.ink} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.steps}>
          {(recipe.steps || []).map((s, idx) => (
            <View key={idx} style={styles.stepRow}>
              <Text style={styles.stepNum}>{String(idx + 1).padStart(2, "0")}</Text>
              <Text style={styles.stepText}>{s}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 18, paddingTop: 22, paddingBottom: 18, marginBottom: 18 },
  pin: { position: "absolute", top: -6, left: "50%", marginLeft: -6, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.tomato, borderWidth: 1, borderColor: "#8f3226" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  title: { flex: 1, fontFamily: "Fraunces_600SemiBold", fontSize: 19, color: COLORS.ink, paddingRight: 8 },
  heartBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  metaRow: { flexDirection: "row", gap: 16, marginBottom: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontFamily: "IBMPlexMono_500Medium", fontSize: 11, color: COLORS.inkFaint },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  ownedTag: { backgroundColor: COLORS.herbTint, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  ownedTagText: { fontFamily: "WorkSans_500Medium", fontSize: 12, color: COLORS.herbDark },
  missingTag: { backgroundColor: COLORS.mustardTint, borderWidth: 1, borderColor: "rgba(232,163,61,0.3)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  missingTagText: { fontFamily: "WorkSans_500Medium", fontSize: 12, color: COLORS.mustardText },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 12 },
  toggleText: { fontFamily: "WorkSans_500Medium", fontSize: 14, color: COLORS.ink },
  steps: { marginTop: 12, paddingTop: 14, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 10 },
  stepRow: { flexDirection: "row", gap: 10 },
  stepNum: { fontFamily: "IBMPlexMono_500Medium", fontSize: 11, color: COLORS.herb, paddingTop: 2 },
  stepText: { flex: 1, fontFamily: "WorkSans_400Regular", fontSize: 14, color: COLORS.ink, lineHeight: 20 },
});
