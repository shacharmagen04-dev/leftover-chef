import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../config";
import { useApp } from "../context/AppContext";

function Chip({ label, onRemove }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
      <TouchableOpacity onPress={onRemove} style={styles.chipRemove}>
        <Feather name="x" size={11} color={COLORS.inkFainter} />
      </TouchableOpacity>
    </View>
  );
}

export default function IngredientsScreen({ navigation }) {
  const { ingredients, setIngredients, generateRecipes } = useApp();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  function addIngredient() {
    const v = text.trim().toLowerCase();
    if (v && !ingredients.includes(v)) setIngredients([...ingredients, v]);
    setText("");
  }

  function removeIngredient(idx) {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      await generateRecipes(ingredients);
      navigation.navigate("Recipes");
    } catch (e) {
      Alert.alert("Couldn't generate recipes", "Give it another try.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.eyebrow}>STEP 2 OF 3</Text>
      <Text style={styles.title}>Here's what I spotted</Text>
      <Text style={styles.subtitle}>Add anything I missed, and remove what's not actually there.</Text>

      <View style={styles.card}>
        {ingredients.length === 0 ? (
          <Text style={styles.empty}>No ingredients yet — add some below.</Text>
        ) : (
          <View style={styles.chipWrap}>
            {ingredients.map((ing, idx) => (
              <Chip key={`${ing}-${idx}`} label={ing} onRemove={() => removeIngredient(idx)} />
            ))}
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={addIngredient}
            placeholder="e.g. leftover rice"
            placeholderTextColor={COLORS.inkFainter}
            style={styles.input}
          />
          <TouchableOpacity onPress={addIngredient} style={styles.addBtn}>
            <Feather name="plus" size={16} color={COLORS.bg} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, ingredients.length === 0 && styles.disabled]}
        disabled={ingredients.length === 0 || loading}
        onPress={handleGenerate}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.bg} />
        ) : (
          <Text style={styles.primaryBtnText}>
            Cook with {ingredients.length} ingredient{ingredients.length === 1 ? "" : "s"}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  eyebrow: { fontFamily: "IBMPlexMono_500Medium", fontSize: 11, letterSpacing: 1.5, color: COLORS.herb, marginBottom: 8 },
  title: { fontFamily: "Fraunces_600SemiBold", fontSize: 30, color: COLORS.ink, marginBottom: 8, lineHeight: 36 },
  subtitle: { fontFamily: "WorkSans_400Regular", fontSize: 15, color: COLORS.inkFaint, marginBottom: 24, lineHeight: 21 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 18, marginBottom: 20 },
  empty: { fontFamily: "WorkSans_400Regular", fontStyle: "italic", color: COLORS.inkFainter, marginBottom: 14, fontSize: 14 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 999, paddingLeft: 12, paddingRight: 6, paddingVertical: 6 },
  chipText: { fontFamily: "WorkSans_500Medium", fontSize: 13, color: COLORS.ink },
  chipRemove: { width: 16, height: 16, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  inputRow: { flexDirection: "row", gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, fontFamily: "WorkSans_400Regular", fontSize: 14, color: COLORS.ink },
  addBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.ink, alignItems: "center", justifyContent: "center" },
  primaryBtn: { backgroundColor: COLORS.herb, borderRadius: 999, paddingVertical: 15, alignItems: "center", justifyContent: "center" },
  primaryBtnText: { fontFamily: "WorkSans_500Medium", fontSize: 15, color: COLORS.bg },
  disabled: { opacity: 0.35 },
});
