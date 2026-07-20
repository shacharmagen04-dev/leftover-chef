import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../config";
import { useApp } from "../context/AppContext";
import RecipeCard from "../components/RecipeCard";

export default function SavedScreen() {
  const { saved, removeSaved } = useApp();

  if (saved.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="heart" size={28} color={COLORS.border} style={{ marginBottom: 10 }} />
        <Text style={styles.emptyTitle}>Nothing saved yet</Text>
        <Text style={styles.emptySubtitle}>Recipes you heart will show up here.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.eyebrow}>YOUR BOX</Text>
      <Text style={styles.title}>Saved recipes</Text>
      {saved.map((r) => (
        <RecipeCard key={r.id} recipe={r} saved={true} onToggleSave={removeSaved} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  eyebrow: { fontFamily: "IBMPlexMono_500Medium", fontSize: 11, letterSpacing: 1.5, color: COLORS.herb, marginBottom: 8 },
  title: { fontFamily: "Fraunces_600SemiBold", fontSize: 28, color: COLORS.ink, marginBottom: 20 },
  emptyContainer: { flex: 1, backgroundColor: COLORS.bg, alignItems: "center", justifyContent: "center", padding: 40 },
  emptyTitle: { fontFamily: "Fraunces_600SemiBold", fontSize: 19, color: COLORS.ink, marginBottom: 4 },
  emptySubtitle: { fontFamily: "WorkSans_400Regular", fontSize: 14, color: COLORS.inkFaint, textAlign: "center" },
});
