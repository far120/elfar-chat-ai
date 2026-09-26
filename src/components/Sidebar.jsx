function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) {
  const getProviderBadge = (provider) => {
    switch (provider) {
      case "gemini":
        return { icon: "✨", label: "Gemini", color: "text-cyan-400 bg-cyan-950/60 border-cyan-800/50" };
      case "ollama":
        return { icon: "🦙", label: "Ollama", color: "text-emerald-400 bg-emerald-950/60 border-emerald-800/50" };
      case "openai":
        return { icon: "⚡", label: "OpenAI", color: "text-purple-400 bg-purple-950/60 border-purple-800/50" };
      default:
        return { icon: "🤖", label: provider, color: "text-slate-400 bg-slate-800/60 border-slate-700/50" };
    }
  };

  return (
    <aside className="relative flex w-80 flex-col border-r border-slate-800/80 bg-[#090d16]/90 backdrop-blur-xl">
      {/* Glow highlight */}
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl"></div>

      {/* Header & Logo */}
      <div className="relative z-10 border-b border-slate-800/80 p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0b0f19]">
                <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-lg font-black tracking-wider text-transparent">
                ELFAR_AI-CHAT
              </h1>
              <span className="inline-block rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                PRO V2.0
              </span>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 p-[1px] font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99]"
        >
          <div className="flex h-full w-full items-center justify-center gap-2 rounded-[11px] bg-slate-950/80 px-4 py-3 transition-colors group-hover:bg-transparent">
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">New Chat</span>
          </div>
        </button>
      </div>

      {/* Chat List */}
      <div className="relative z-10 flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Recent Conversations ({chats.length})
          </p>
        </div>

        {chats.length === 0 ? (
          <div className="mt-8 px-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-600">
              💬
            </div>
            <p className="text-sm font-medium text-slate-400">No chats yet</p>
            <p className="mt-1 text-xs text-slate-600">Click New Chat to begin</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {chats.map((chat) => {
              const isActive = activeChatId === chat.id;
              const badge = getProviderBadge(chat.provider);

              return (
                <div
                  key={chat.id}
                  className={`group relative flex items-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-slate-800/80 border border-slate-700/80 shadow-md shadow-slate-950/50"
                      : "hover:bg-slate-900/60 border border-transparent hover:border-slate-800/50"
                  }`}
                >
                  {/* Left Active Glow bar */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-indigo-400 to-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  )}

                  <button
                    onClick={() => onSelectChat(chat.id)}
                    className="min-w-0 flex-1 px-3.5 py-3 text-left pl-4"
                  >
                    <p className={`truncate text-sm font-medium ${isActive ? "text-white font-semibold" : "text-slate-300 group-hover:text-white"}`}>
                      {chat.title || "New Chat"}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium border ${badge.color}`}>
                        <span>{badge.icon}</span>
                        <span>{badge.label}</span>
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="mr-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
                    title="Delete Chat"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-slate-800/80 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900/60 p-2.5 border border-slate-800/50">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <span className="text-sm font-black">E</span>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-200 truncate">ELFAR_AI Engine</p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              System Ready
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;