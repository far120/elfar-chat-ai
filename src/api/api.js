// src/api/api.js

import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

// ===============================
// API Keys
// ===============================
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;



// ===============================
// OpenAI Client
// ===============================

const openai = new OpenAI({
  apiKey: OPENAI_KEY || "",
  dangerouslyAllowBrowser: true,
});

// ===============================
// Gemini Client
// ===============================

const gemini = new GoogleGenAI({
  apiKey: GEMINI_KEY || "",
});

// ===============================
// OpenAI
// ===============================

async function callOpenAI(messages) {
  if (!OPENAI_KEY || OPENAI_KEY.trim() === "") {
    throw new Error("VITE_OPENAI_API_KEY is missing in your .env file.");
  }

  console.log("Calling OpenAI...");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  });

  return response.choices[0]?.message?.content || "No response received from OpenAI.";
}

// ===============================
// Gemini
// ===============================

async function callGemini(messages) {
  if (!GEMINI_KEY || GEMINI_KEY.trim() === "") {
    throw new Error("VITE_GEMINI_API_KEY is missing in your .env file.");
  }

  console.log("Calling Gemini...");

  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: message.content,
      },
    ],
  }));

  const MODEL = "gemini-3.5-flash-lite";
  const MAX_RETRIES = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Calling Gemini (${MODEL}) - Attempt ${attempt}/${MAX_RETRIES}`);
      
      const response = await gemini.models.generateContent({
        model: MODEL,
        contents,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn(`Gemini attempt ${attempt} failed:`, err?.message || err);
      lastError = err;

      // If it's a 503 high demand error or temporary server issue, wait 1.5 seconds and retry
      const isTemporaryError =
        err?.status === 503 ||
        err?.message?.includes("503") ||
        err?.message?.includes("high demand") ||
        err?.message?.includes("UNAVAILABLE");

      if (isTemporaryError && attempt < MAX_RETRIES) {
        console.log(`High demand detected. Waiting 1.5s before retry ${attempt + 1}...`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else if (!isTemporaryError) {
        // If it's not a temporary error (e.g. invalid key), fail fast
        break;
      }
    }
  }

  throw lastError || new Error("Gemini service is currently overloaded. Please try again in a few seconds.");
}

// ===============================
// Ollama (Localhost)
// ===============================

const OLLAMA_MODEL_ENV = import.meta.env.VITE_OLLAMA_MODEL;

async function getOllamaModel() {
  if (OLLAMA_MODEL_ENV && OLLAMA_MODEL_ENV.trim() !== "") {
    return OLLAMA_MODEL_ENV.trim();
  }

  try {
    const res = await fetch("/ollama/api/tags").catch(() =>
      fetch("http://localhost:11434/api/tags")
    );
    if (res && res.ok) {
      const data = await res.json();
      if (data?.models && data.models.length > 0) {
        return data.models[0].name;
      }
    }
  } catch (e) {
    console.warn("Could not fetch Ollama models list:", e);
  }

  return "llama3";
}

async function callOllama(messages) {
  console.log("Calling Ollama...");

  const model = await getOllamaModel();
  console.log(`Using Ollama model: ${model}`);

  let response;
  const payload = {
    model: model,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    stream: false,
  };

  try {
    response = await fetch("/ollama/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (fetchErr) {
    try {
      response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (directErr) {
      throw new Error(
        "Could not connect to Ollama on http://localhost:11434. Please make sure Ollama application is running locally."
      );
    }
  }

  if (!response || !response.ok) {
    const errBody = await response?.json().catch(() => ({}));
    throw new Error(
      errBody?.error ||
        `Ollama returned status ${response?.status || 500}. Make sure model '${model}' is pulled (\`ollama run ${model}\`).`
    );
  }

  const data = await response.json();
  return data?.message?.content || "No response received from Ollama.";
}

// ===============================
// Main Function
// ===============================

export async function sendMessage(provider, messages) {
  console.log("Provider:", provider);
  console.log("Messages:", messages);

  if (!messages || messages.length === 0) {
    throw new Error("Messages cannot be empty");
  }

  if (provider === "openai") {
    return await callOpenAI(messages);
  }

  if (provider === "gemini") {
    return await callGemini(messages);
  }

  if (provider === "ollama") {
    return await callOllama(messages);
  }

  throw new Error(`Unknown provider: ${provider}`);
}