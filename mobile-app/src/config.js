// Point this at your deployed backend from the backend/ folder.
// For local dev on a physical device, use your computer's LAN IP, not localhost.
// e.g. "http://192.168.1.42:3001"
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://your-backend-url.onrender.com";

export const COLORS = {
  bg: "#FAF6EE",
  ink: "#232017",
  inkFaint: "rgba(35,32,23,0.5)",
  inkFainter: "rgba(35,32,23,0.35)",
  card: "#FFFFFF",
  border: "rgba(35,32,23,0.12)",
  herb: "#4A5D3A",
  herbDark: "#3d4d2f",
  herbTint: "rgba(74,93,58,0.1)",
  mustard: "#E8A33D",
  mustardText: "#8a5c10",
  mustardTint: "rgba(232,163,61,0.15)",
  tomato: "#C24A3B",
  tomatoTint: "rgba(194,74,59,0.1)",
};
