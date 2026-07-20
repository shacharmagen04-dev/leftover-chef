import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../config";
import { useApp } from "../context/AppContext";

export default function UploadScreen({ navigation }) {
  const { imageUri, setImageUri, setImageBase64, setMediaType, detectIngredients, resetFlow } = useApp();
  const [loading, setLoading] = useState(false);

  async function pickImage(fromCamera) {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Leftover Chef needs access to continue.");
      return;
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.6 })
      : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.6 });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setImageBase64(asset.base64);
      setMediaType(asset.mimeType || "image/jpeg");
    }
  }

  async function handleDetect() {
    setLoading(true);
    try {
      await detectIngredients();
      navigation.navigate("Ingredients");
    } catch (e) {
      Alert.alert("Couldn't read that photo", "Try again, or add ingredients by hand on the next screen.");
      navigation.navigate("Ingredients");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>STEP 1 OF 3</Text>
      <Text style={styles.title}>What's hiding in your fridge?</Text>
      <Text style={styles.subtitle}>Snap a photo and I'll figure out what you can cook without a grocery run.</Text>

      <View style={styles.dropzone}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.iconCircle}>
              <Feather name="camera" size={24} color="#B87710" />
            </View>
            <Text style={styles.placeholderText}>No photo yet</Text>
          </View>
        )}
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => pickImage(true)}>
          <Feather name="camera" size={16} color={COLORS.ink} />
          <Text style={styles.secondaryBtnText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => pickImage(false)}>
          <Feather name="image" size={16} color={COLORS.ink} />
          <Text style={styles.secondaryBtnText}>Photo Library</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, !imageUri && styles.disabled]}
        disabled={!imageUri || loading}
        onPress={handleDetect}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.bg} />
        ) : (
          <>
            <Feather name="upload" size={16} color={COLORS.bg} />
            <Text style={styles.primaryBtnText}>Find my ingredients</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          resetFlow();
          navigation.navigate("Ingredients");
        }}
      >
        <Text style={styles.manualLink}>Enter manually instead</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.bg },
  eyebrow: { fontFamily: "IBMPlexMono_500Medium", fontSize: 11, letterSpacing: 1.5, color: COLORS.herb, marginBottom: 8 },
  title: { fontFamily: "Fraunces_600SemiBold", fontSize: 30, color: COLORS.ink, marginBottom: 8, lineHeight: 36 },
  subtitle: { fontFamily: "WorkSans_400Regular", fontSize: 15, color: COLORS.inkFaint, marginBottom: 24, lineHeight: 21 },
  dropzone: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    minHeight: 260,
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 16,
  },
  preview: { width: "100%", height: 300, resizeMode: "cover" },
  placeholder: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.mustardTint, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  placeholderText: { fontFamily: "WorkSans_500Medium", color: COLORS.inkFainter },
  row: { flexDirection: "row", gap: 10, marginBottom: 16 },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    borderRadius: 999,
    paddingVertical: 12,
  },
  secondaryBtnText: { fontFamily: "WorkSans_500Medium", fontSize: 14, color: COLORS.ink },
  primaryBtn: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.herb,
    borderRadius: 999,
    paddingVertical: 15,
    marginBottom: 14,
  },
  primaryBtnText: { fontFamily: "WorkSans_500Medium", fontSize: 15, color: COLORS.bg },
  disabled: { opacity: 0.35 },
  manualLink: { textAlign: "center", fontFamily: "WorkSans_500Medium", color: COLORS.inkFaint, fontSize: 14 },
});
