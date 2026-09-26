// src/utils/theme.js

export const THEMES = [
  {
    id: "black",
    name: "Dark Mode (Black)",
    description: "Pure dark black background with high contrast crisp text",
    mode: "dark",
    bgClass: "bg-[#000000]",
    sidebarBg: "bg-[#09090b]/95",
    headerBg: "bg-[#09090b]/90",
    cardBg: "bg-[#121215]",
    userMsgBg: "bg-zinc-800 text-white border-zinc-700",
    assistantMsgBg: "bg-[#121215] border-zinc-800 text-zinc-100",
    inputBg: "bg-[#121215] border-zinc-800 text-white placeholder-zinc-500",
    borderClass: "border-zinc-800",
    textPrimary: "text-zinc-100",
    textSecondary: "text-zinc-400",
    glowPrimary: "bg-zinc-800/20",
    glowSecondary: "bg-zinc-900/30",
    swatchBg: "from-black via-zinc-900 to-black",
    accentGradients: "from-zinc-100 via-zinc-300 to-zinc-400",
    badgeColor: "text-zinc-200 bg-zinc-800/60 border-zinc-700",
    btnPrimary: "bg-zinc-100 text-zinc-950 hover:bg-white shadow-zinc-900/50",
    iconBg: "bg-zinc-800 text-zinc-200 border-zinc-700",
  },
  {
    id: "white",
    name: "Light Mode (White)",
    description: "Clean pure white background with sharp dark typography",
    mode: "light",
    bgClass: "bg-[#ffffff]",
    sidebarBg: "bg-[#f8fafc]/95",
    headerBg: "bg-[#ffffff]/90",
    cardBg: "bg-[#f1f5f9]",
    userMsgBg: "bg-zinc-900 text-white border-zinc-900",
    assistantMsgBg: "bg-[#f1f5f9] border-slate-200 text-slate-800",
    inputBg: "bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400",
    borderClass: "border-slate-200",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-600",
    glowPrimary: "bg-slate-200/40",
    glowSecondary: "bg-slate-300/30",
    swatchBg: "from-white via-slate-100 to-slate-200",
    accentGradients: "from-slate-900 via-zinc-800 to-slate-700",
    badgeColor: "text-slate-800 bg-slate-200/80 border-slate-300",
    btnPrimary: "bg-slate-900 text-white hover:bg-black shadow-slate-300",
    iconBg: "bg-slate-200 text-slate-800 border-slate-300",
  },
];

const THEME_STORAGE_KEY = "elfar-chat-bw-theme";

export function getSavedTheme() {
  try {
    const savedId = localStorage.getItem(THEME_STORAGE_KEY);
    const found = THEMES.find((t) => t.id === savedId);
    return found || THEMES[0]; // Default to Black
  } catch (e) {
    return THEMES[0];
  }
}

export function saveTheme(themeId) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch (e) {
    console.error("Failed to save theme:", e);
  }
}
