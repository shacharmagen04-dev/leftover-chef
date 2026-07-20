import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";

const AppContext = createContext(null);
const SAVED_KEY = "leftover-chef:saved-recipes";

export function AppProvider({ children }) {
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [mediaType, setMediaType] = useState("image/jpeg");
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(SAVED_KEY).then((raw) => {
      if (raw) setSaved(JSON.parse(raw));
    });
  }, []);

  const persistSaved = useCallback(async (list) => {
    setSaved(list);
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(list));
  }, []);

  const toggleSave = useCallback(
    async (recipe) => {
      const exists = saved.some((r) => r.title === recipe.title);
      const next = exists ? saved.filter((r) => r.title !== recipe.title) : [...saved, recipe];
      await persistSaved(next);
    },
    [saved, persistSaved]
  );

  const removeSaved = useCallback(
    async (recipe) => {
      const next = saved.filter((r) => r.id !== recipe.id);
      await persistSaved(next);
    },
    [saved, persistSaved]
  );

  const isSaved = useCallback((recipe) => saved.some((r) => r.title === recipe.title), [saved]);

  async function detectIngredients() {
    const res = await fetch(`${API_BASE_URL}/api/detect-ingredients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64, mediaType }),
    });
    if (!res.ok) throw new Error("detect-ingredients failed");
    const data = await res.json();
    setIngredients(data.ingredients || []);
    return data.ingredients || [];
  }

  async function generateRecipes(ingredientList) {
    const res = await fetch(`${API_BASE_URL}/api/generate-recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: ingredientList }),
    });
    if (!res.ok) throw new Error("generate-recipes failed");
    const data = await res.json();
    setRecipes(data.recipes || []);
    return data.recipes || [];
  }

  function resetFlow() {
    setImageUri(null);
    setImageBase64(null);
    setIngredients([]);
    setRecipes([]);
  }

  return (
    <AppContext.Provider
      value={{
        imageUri,
        setImageUri,
        imageBase64,
        setImageBase64,
        mediaType,
        setMediaType,
        ingredients,
        setIngredients,
        recipes,
        setRecipes,
        saved,
        toggleSave,
        removeSaved,
        isSaved,
        detectIngredients,
        generateRecipes,
        resetFlow,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
