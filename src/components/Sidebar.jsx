function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isOpen,
  onClose,
  currentTheme,
  onOpenThemeModal,
}) {
  const isWhite = currentTheme.mode === "light";

  const handleSelect = (id) => {
    onSelectChat(id);
    if (onClose) onClose();
  };

  const handleNew = () => {
    onNewChat();
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 flex w-72 sm:w-80 flex-col border-r ${currentTheme.borderClass} ${currentTheme.sidebarBg} backdrop-blur-xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header & Logo */}
        <div className={`relative z-10 border-b ${currentTheme.borderClass} p-4 sm:p-5`}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl p-0.5 shadow-md font-black text-xs tracking-tighter ${isWhite ? "bg-slate-900 text-white" : "bg-white text-black"}`}>
                FAR
              </div>
              <div>
                <h1 className={`text-base sm:text-lg font-black tracking-wider ${currentTheme.textPrimary}`}>
                  ELFAR_AI-CHAT
                </h1>
                <span className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${currentTheme.badgeColor}`}>
                  {isWhite ? "LIGHT MODE" : "DARK MODE"}
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className={`flex md:hidden h-8 w-8 items-center justify-center rounded-lg ${currentTheme.textSecondary} hover:bg-slate-500/10 transition-colors`}
              title="Close Sidebar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNew}
            className={`group relative flex w-full items-center justify-center gap-2 rounded-xl py-2.5 sm:py-3 px-4 font-bold text-sm shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${currentTheme.btnPrimary}`}
          >
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="relative z-10 flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-2 flex items-center justify-between">
            <p className={`text-[11px] font-bold uppercase tracking-wider ${currentTheme.textSecondary}`}>
              Recent Conversations ({chats.length})
            </p>
          </div>

          {chats.length === 0 ? (
            <div className="mt-8 px-4 text-center">
              <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border ${currentTheme.borderClass} ${currentTheme.textSecondary}`}>
                💬
              </div>
              <p className={`text-sm font-medium ${currentTheme.textPrimary}`}>No chats yet</p>
              <p className={`mt-1 text-xs ${currentTheme.textSecondary}`}>Click New Chat to begin</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {chats.map((chat) => {
                const isActive = activeChatId === chat.id;

                return (
                  <div
                    key={chat.id}
                    className={`group relative flex items-center rounded-xl border transition-all duration-200 ${
                      isActive
                        ? isWhite
                          ? "bg-slate-200/80 border-slate-300 text-slate-900 font-bold shadow-sm"
                          : "bg-zinc-800/90 border-zinc-700 text-white font-bold shadow-sm"
                        : isWhite
                        ? "border-transparent text-slate-700 hover:bg-slate-200/50 hover:text-slate-900"
                        : "border-transparent text-zinc-300 hover:bg-zinc-900/80 hover:text-white"
                    }`}
                  >
                    {/* Active Bar Indicator */}
                    {isActive && (
                      <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${isWhite ? "bg-black" : "bg-white"}`}></div>
                    )}

                    <button
                      onClick={() => handleSelect(chat.id)}
                      className="min-w-0 flex-1 px-3.5 py-3 text-left pl-4"
                    >
                      <p className="truncate text-xs sm:text-sm font-semibold">
                        {chat.title || "New Chat"}
                      </p>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="mr-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500"
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

        {/* Footer with Theme Switcher Button */}
        <div className={`relative z-10 border-t ${currentTheme.borderClass} p-3 sm:p-4 space-y-2`}>
          <button
            onClick={onOpenThemeModal}
            className={`flex w-full items-center justify-between gap-2.5 rounded-xl p-2.5 border transition-all text-left group ${
              isWhite 
                ? "bg-slate-100 border-slate-300 hover:bg-slate-200" 
                : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`h-6 w-6 rounded-full border border-slate-400 shrink-0 ${isWhite ? "bg-white" : "bg-black"}`}></div>
              <div className="min-w-0">
                <p className={`text-xs font-bold truncate ${currentTheme.textPrimary}`}>
                  Background: {isWhite ? "White" : "Black"}
                </p>
                <p className={`text-[10px] truncate ${currentTheme.textSecondary}`}>
                  Switch to {isWhite ? "Black" : "White"}
                </p>
              </div>
            </div>
            <svg className={`h-4 w-4 shrink-0 ${currentTheme.textSecondary}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>

          <div className={`flex items-center gap-3 rounded-xl p-2.5 border ${currentTheme.borderClass} ${isWhite ? "bg-slate-100" : "bg-zinc-900"}`}>
            <div className={`relative flex h-7 w-7 items-center justify-center rounded-lg font-black text-[9px] shrink-0 ${isWhite ? "bg-slate-900 text-white" : "bg-white text-black"}`}>
              FAR
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold truncate ${currentTheme.textPrimary}`}>ELFAR_AI Engine</p>
              <p className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium">
                System Online
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;