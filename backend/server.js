// Leftover Chef — backend proxy
// Keeps the Anthropic API key server-side. The mobile app never sees it.

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // photos as base64 need headroom

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = "claude-sonnet-4-6";

if (!ANTHROPIC_API_KEY) {
  console.warn("⚠️  ANTHROPIC_API_KEY is not set. Add it to your .env file.");
}

async function callClaude(content) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: "user", content }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

function parseJSONLoose(text) {
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const startCandidates = [cleaned.indexOf("["), cleaned.indexOf("{")].filter((i) => i !== -1);
  const start = startCandidates.length ? Math.min(...startCandidates) : -1;
  const end = Math.max(cleaned.lastIndexOf("]"), cleaned.lastIndexOf("}"));
  const slice = start !== -1 && end !== -1 ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(slice);
}

// Rough in-memory rate limiting per IP (swap for something real in production)
const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const max = 20;
  const record = hits.get(ip) || { count: 0, start: now };
  if (now - record.start > windowMs) {
    record.count = 0;
    record.start = now;
  }
  record.count += 1;
  hits.set(ip, record);
  if (record.count > max) {
    return res.status(429).json({ error: "Too many requests. Slow down a bit." });
  }
  next();
}
app.use(rateLimit);

// POST /api/detect-ingredients { imageBase64, mediaType }
app.post("/api/detect-ingredients", async (req, res) => {
  try {
    const { imageBase64, mediaType } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "imageBase64 is required" });

    const content = [
      { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: imageBase64 } },
      {
        type: "text",
        text: "You are looking at a photo of a fridge or pantry. Identify every distinct food ingredient you can see. Respond with ONLY a JSON array of strings, lowercase, no preamble, no markdown fences. Example: [\"eggs\",\"spinach\",\"cheddar cheese\"]. If you truly cannot identify anything, return an empty array.",
      },
    ];

    const text = await callClaude(content);
    const ingredients = parseJSONLoose(text);
    res.json({ ingredients: Array.isArray(ingredients) ? ingredients : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to detect ingredients" });
  }
});

// POST /api/generate-recipes { ingredients: string[] }
app.post("/api/generate-recipes", async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: "ingredients array is required" });
    }

    const content = [
      {
        type: "text",
        text: `I have these ingredients on hand: ${ingredients.join(", ")}.
Suggest 4 recipes I could cook, ranked so the ones needing the FEWEST additional ingredients come first.
Respond with ONLY a JSON array (no markdown fences), where each item has this exact shape:
{
  "title": string,
  "prepTime": string (e.g. "20 min"),
  "owned": string[] (ingredients used that I already have, from my list),
  "missing": string[] (additional ingredients needed, keep this short and realistic),
  "steps": string[] (concise numbered-style steps, no numbering prefix needed)
}`,
      },
    ];

    const text = await callClaude(content);
    const recipes = parseJSONLoose(text);
    const withIds = (Array.isArray(recipes) ? recipes : []).map((r, i) => ({
      ...r,
      id: `${Date.now()}-${i}`,
    }));
    res.json({ recipes: withIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate recipes" });
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Leftover Chef backend running on port ${PORT}`));
