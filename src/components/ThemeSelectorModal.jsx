import { THEMES } from "../utils/theme";

function ThemeSelectorModal({ isOpen, onClose, currentTheme, onSelectTheme }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* Modal Card */}
      <div 
        className={`relative w-full max-w-md rounded-3xl border ${currentTheme.borderClass} ${currentTheme.mode === "light" ? "bg-white text-slate-900 shadow-2xl shadow-slate-300/50" : "bg-[#09090b] text-white shadow-2xl shadow-black/80"} p-6 backdrop-blur-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${currentTheme.borderClass}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${currentTheme.iconBg}`}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className={`text-lg font-extrabold ${currentTheme.textPrimary}`}>Select Theme</h3>
              <p className={`text-xs ${currentTheme.textSecondary}`}>Choose Black or White background</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`rounded-xl p-2 ${currentTheme.textSecondary} hover:bg-slate-500/10 transition-colors`}
            title="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Theme Cards (Black / White) */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          {THEMES.map((theme) => {
            const isActive = currentTheme.id === theme.id;
            const isWhite = theme.id === "white";

            return (
              <button
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme);
                }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 text-left border-2 transition-all duration-200 ${
                  isActive
                    ? "border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg"
                    : isWhite
                    ? "border-slate-200 bg-slate-50 hover:border-slate-400"
                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                }`}
              >
                {/* Visual Swatch Preview Box */}
                <div 
                  className={`h-24 w-full rounded-xl p-3 flex flex-col justify-between mb-3 border shadow-sm ${
                    isWhite 
                      ? "bg-white border-slate-200 text-slate-900" 
                      : "bg-black border-zinc-800 text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isWhite ? "text-slate-500" : "text-zinc-500"}`}>
                      {isWhite ? "White Mode" : "Black Mode"}
                    </span>
                    {isActive && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                  
                  {/* Mock message bubble inside swatch */}
                  <div className="space-y-1.5">
                    <div className={`h-2 w-16 rounded ${isWhite ? "bg-slate-300" : "bg-zinc-800"}`}></div>
                    <div className={`h-3 w-full rounded-md ${isWhite ? "bg-slate-900" : "bg-zinc-100"}`}></div>
                  </div>
                </div>

                <div>
                  <h4 className={`text-sm font-bold ${isWhite ? "text-slate-900" : "text-white"}`}>
                    {theme.name}
                  </h4>
                  <p className={`mt-0.5 text-xs ${isWhite ? "text-slate-500" : "text-zinc-400"}`}>
                    {isWhite ? "Pure White Theme" : "Pure Black Theme"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all ${currentTheme.btnPrimary}`}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThemeSelectorModal;
