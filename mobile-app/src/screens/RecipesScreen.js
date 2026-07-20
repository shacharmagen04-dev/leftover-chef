import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../config";
import { useApp } from "../context/AppContext";
import RecipeCard from "../components/RecipeCard";

export default function RecipesScreen() {
  const { recipes, ingredients, generateRecipes, toggleSave, isSaved } = useApp();
  const [loading, setLoading] = useState(false);

  async function handleRegenerate() {
    setLoading(true);
    try {
      await generateRecipes(ingredients);
    } catch (e) {
      Alert.alert("Couldn't reshuffle", "Give it another try.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>STEP 3 OF 3</Text>
          <Text style={styles.title}>Tonight's options</Text>
        </View>
        <TouchableOpacity onPress={handleRegenerate} disabled={loading} style={styles.shuffleBtn}>
          {loading ? <ActivityIndicator size="small" color={COLORS.inkFaint} /> : <Feather name="refresh-ccw" size={14} color={COLORS.inkFaint} />}
          <Text style={styles.shuffleText}>Shuffle</Text>
        </TouchableOpacity>
      </View>

      {recipes.length === 0 ? (
        <Text style={styles.empty}>No recipes yet.</Text>
      ) : (
        recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} saved={isSaved(r)} onToggleSave={toggleSave} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  headerRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 20 },
  eyebrow: { fontFamily: "IBMPlexMono_500Medium", fontSize: 11, letterSpacing: 1.5, color: COLORS.herb, marginBottom: 8 },
  title: { fontFamily: "Fraunces_600SemiBold", fontSize: 28, color: COLORS.ink, lineHeight: 34 },
  shuffleBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  shuffleText: { fontFamily: "WorkSans_500Medium", fontSize: 14, color: COLORS.inkFaint },
  empty: { fontFamily: "WorkSans_400Regular", fontStyle: "italic", color: COLORS.inkFainter },
});
