import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { sendMessage } from "../api/api";

function Chat({ chat, onUpdateChat, onOpenSidebar, currentTheme, onOpenThemeModal }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const isWhite = currentTheme.mode === "light";

  if (!chat) {
    return (
      <main className={`flex flex-1 flex-col items-center justify-center p-6 ${currentTheme.bgClass} relative overflow-hidden transition-colors duration-300`}>
        <div className="relative z-10 text-center max-w-md px-4">
          <div className="md:hidden mb-6 flex justify-center">
            <button
              onClick={onOpenSidebar}
              className={`flex items-center gap-2 rounded-xl border ${currentTheme.borderClass} ${currentTheme.cardBg} px-4 py-2 text-xs font-semibold ${currentTheme.textPrimary} shadow-md`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Open Sidebar Menu</span>
            </button>
          </div>

          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl font-black text-xl tracking-tighter ${isWhite ? "bg-slate-900 text-white" : "bg-white text-black"}`}>
            FAR
          </div>

          <h2 className={`text-2xl font-black tracking-tight ${currentTheme.textPrimary}`}>
            ELFAR_AI-CHAT
          </h2>
          <p className={`mt-2 text-sm ${currentTheme.textSecondary}`}>
            Create or select a chat from the sidebar to begin your conversation.
          </p>

          {/* Theme Switcher Quick Toggle Button */}
          <div className="mt-6">
            <button
              onClick={onOpenThemeModal}
              className={`inline-flex items-center gap-2 rounded-xl border ${currentTheme.borderClass} ${currentTheme.cardBg} px-4 py-2 text-xs font-bold ${currentTheme.textPrimary} hover:opacity-80 transition-all shadow-sm`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Switch Theme ({isWhite ? "White Mode" : "Black Mode"})</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // Provider Change
  // =========================

  function handleProviderChange(event) {
    onUpdateChat(chat.id, {
      provider: event.target.value || "gemini",
    });
  }

  // =========================
  // Send Message
  // =========================

  async function handleSendMessage(event) {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: message,
    };

    const updatedMessages = [
      ...chat.messages,
      userMessage,
    ];

    // Clear input
    setInput("");

    // Show user message immediately
    onUpdateChat(chat.id, {
      messages: updatedMessages,
      title:
        chat.messages.length === 0
          ? message.slice(0, 40)
          : chat.title,
    });

    setLoading(true);

    try {
      const response = await sendMessage(
        chat.provider,
        updatedMessages
      );

      const assistantMessage = {
        role: "assistant",
        content: response,
      };

      onUpdateChat(chat.id, {
        messages: [
          ...updatedMessages,
          assistantMessage,
        ],
      });
    } catch (error) {
      console.error("Chat Error:", error);

      const details = error?.message || "Something went wrong. Please check your API keys or connection and try again.";

      const errorMessage = {
        role: "assistant",
        content: `Sorry, something went wrong: ${details}`,
      };

      onUpdateChat(chat.id, {
        messages: [
          ...updatedMessages,
          errorMessage,
        ],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={`relative flex min-w-0 flex-1 flex-col ${currentTheme.bgClass} transition-colors duration-300 overflow-hidden`}>
      
      {/* Header */}
      <header className={`relative z-10 flex items-center justify-between border-b ${currentTheme.borderClass} ${currentTheme.headerBg} px-4 sm:px-6 py-3.5 backdrop-blur-xl shrink-0`}>
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger Menu Toggle Button for Mobile */}
          <button
            onClick={onOpenSidebar}
            className={`flex md:hidden h-9 w-9 items-center justify-center rounded-xl border ${currentTheme.borderClass} ${currentTheme.cardBg} ${currentTheme.textPrimary} hover:opacity-80 transition-colors shrink-0`}
            title="Open Conversations Menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className={`hidden sm:flex h-8 w-8 items-center justify-center rounded-lg font-black text-[10px] tracking-tighter shrink-0 ${isWhite ? "bg-slate-900 text-white" : "bg-white text-black"}`}>
            FAR
          </div>

          <div className="min-w-0 flex-1">
            <h2 className={`text-xs sm:text-sm font-bold tracking-wide truncate ${currentTheme.textPrimary}`}>
              {chat.title || "New Chat"}
            </h2>
            <p className={`text-[10px] sm:text-[11px] font-medium truncate ${currentTheme.textSecondary}`}>
              ELFAR_AI-CHAT Interface
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* <select
            value={chat.provider || "gemini"}
            onChange={handleProviderChange}
            className={`cursor-pointer rounded-xl border ${currentTheme.borderClass} ${isWhite ? "bg-slate-100 text-slate-900" : "bg-zinc-900 text-white"} px-2.5 sm:px-3 py-1.5 text-xs font-semibold outline-none transition-all focus:ring-2 focus:ring-slate-500/20 shadow-sm max-w-[125px] sm:max-w-none truncate`}
          >
            <option value="gemini">✨ Gemini</option>
            <option value="ollama">🦙 Ollama</option>
            <option value="openai">⚡ OpenAI</option>
          </select> */}

          {/* Theme Toggle Button */}
          <button
            onClick={onOpenThemeModal}
            className={`flex h-8 sm:h-9 items-center gap-1.5 rounded-xl border ${currentTheme.borderClass} ${isWhite ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-zinc-900 text-white hover:bg-zinc-800"} px-2.5 text-xs font-bold transition-all shadow-sm`}
            title="Switch Theme"
          >
            <span className={`h-3 w-3 rounded-full border border-slate-400 ${isWhite ? "bg-white" : "bg-black"}`}></span>
            <span className="hidden sm:inline-block">{isWhite ? "White Mode" : "Black Mode"}</span>
          </button>
        </div>
      </header>

      {/* Messages / Welcome View */}
      <div className="relative z-10 flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
        {chat.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center py-8">
            <div className="max-w-2xl text-center px-4">
              
              {/* Brand Header */}
              <div className={`mx-auto mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl shadow-xl font-black text-xl sm:text-2xl tracking-tighter ${isWhite ? "bg-slate-900 text-white" : "bg-white text-black"}`}>
                FAR
              </div>

              <h1 className={`text-2xl sm:text-4xl font-black tracking-tight ${currentTheme.textPrimary}`}>
                ELFAR_AI-CHAT
              </h1>
              <p className={`mt-3 text-xs sm:text-base ${currentTheme.textSecondary} max-w-md mx-auto leading-relaxed`}>
                Next-generation conversational AI powered by Gemini, local Ollama, and OpenAI models.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6 pb-2">
            {chat.messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={index}
                  className={`flex gap-2.5 sm:gap-3.5 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* AI Avatar */}
                  {!isUser && (
                    <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl shadow-md ${isWhite ? "bg-slate-900 text-white" : "bg-white text-black"}`}>
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  )}

                  <div className="group relative max-w-[90%] sm:max-w-[80%]">
                    <div
                      className={`relative rounded-2xl px-4 sm:px-5 py-3 text-xs sm:text-sm leading-relaxed border shadow-xs break-words overflow-hidden ${
                        isUser
                          ? isWhite
                            ? "bg-slate-900 text-white border-slate-900 rounded-tr-xs"
                            : "bg-zinc-100 text-black border-zinc-100 font-semibold rounded-tr-xs"
                          : isWhite
                          ? "bg-slate-100 text-slate-900 border-slate-200 rounded-tl-xs"
                          : "bg-zinc-900 text-zinc-100 border-zinc-800 rounded-tl-xs"
                      }`}
                    >
                      {isUser ? (
                        message.content
                      ) : (
                        <ReactMarkdown
                          components={{
                            strong({ children }) {
                              return <strong className={`font-bold px-1 py-0.5 rounded ${isWhite ? "bg-slate-200 text-slate-950" : "bg-zinc-800 text-white"}`}>{children}</strong>;
                            },
                            em({ children }) {
                              return <em className="italic">{children}</em>;
                            },
                            p({ children }) {
                              return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
                            },
                            ul({ children }) {
                              return <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>;
                            },
                            ol({ children }) {
                              return <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>;
                            },
                            li({ children }) {
                              return <li className="leading-relaxed">{children}</li>;
                            },
                            h1({ children }) {
                              return <h1 className={`text-sm sm:text-lg font-bold my-2.5 border-b pb-1 ${isWhite ? "border-slate-300" : "border-zinc-800"}`}>{children}</h1>;
                            },
                            h2({ children }) {
                              return <h2 className="text-xs sm:text-base font-bold my-2">{children}</h2>;
                            },
                            h3({ children }) {
                              return <h3 className="text-xs sm:text-sm font-bold my-1.5">{children}</h3>;
                            },
                            code({ node, inline, className, children, ...props }) {
                              return inline ? (
                                <code className={`rounded px-1.5 py-0.5 font-mono text-[11px] sm:text-xs border break-all ${isWhite ? "bg-slate-200 border-slate-300 text-slate-900" : "bg-zinc-800 border-zinc-700 text-zinc-200"}`} {...props}>
                                  {children}
                                </code>
                              ) : (
                                <div className={`relative my-2.5 rounded-xl overflow-hidden border max-w-full ${isWhite ? "bg-slate-900 text-slate-100 border-slate-800" : "bg-black text-zinc-100 border-zinc-800"}`}>
                                  <div className={`flex items-center justify-between px-3.5 py-1 text-[10px] font-mono border-b ${isWhite ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-zinc-950 border-zinc-900 text-zinc-500"}`}>
                                    <span>code</span>
                                  </div>
                                  <pre className="p-3 overflow-x-auto font-mono text-[11px] sm:text-xs leading-relaxed" {...props}>
                                    <code>{children}</code>
                                  </pre>
                                </div>
                              );
                            },
                            blockquote({ children }) {
                              return <blockquote className={`border-l-2 pl-3 italic my-2 ${isWhite ? "border-slate-400 text-slate-600" : "border-zinc-500 text-zinc-400"}`}>{children}</blockquote>;
                            },
                            hr() {
                              return <hr className={`my-3 ${isWhite ? "border-slate-300" : "border-zinc-800"}`} />;
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border font-bold text-xs ${isWhite ? "bg-slate-200 border-slate-300 text-slate-900" : "bg-zinc-800 border-zinc-700 text-white"}`}>
                      U
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-2.5 sm:gap-3.5 justify-start">
                <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl shadow-md ${isWhite ? "bg-slate-900 text-white" : "bg-white text-black"}`}>
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                </div>
                <div className={`rounded-2xl rounded-tl-xs border ${currentTheme.borderClass} ${currentTheme.cardBg} px-4 sm:px-5 py-3 text-xs ${currentTheme.textSecondary} flex items-center gap-2`}>
                  <span className={`font-bold ${currentTheme.textPrimary}`}>ELFAR_AI</span> is thinking...
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-600 animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`relative z-10 border-t ${currentTheme.borderClass} ${currentTheme.headerBg} p-3 sm:p-4 backdrop-blur-xl shrink-0`}>
        <form
          onSubmit={handleSendMessage}
          className={`mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border p-1.5 sm:p-2 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-slate-500/20 ${currentTheme.inputBg}`}
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Message ELFAR_AI-CHAT..."
            disabled={loading}
            className="flex-1 bg-transparent px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none disabled:opacity-50 min-w-0"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl font-bold shadow-md transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 shrink-0 ${currentTheme.btnPrimary}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L18 12M18 12L12 6M18 12L12 18" />
            </svg>
          </button>
        </form>
        <p className={`mt-1.5 text-center text-[10px] sm:text-[11px] font-medium truncate ${currentTheme.textSecondary}`}>
          ELFAR_AI-CHAT V2.0 • Black & White Minimalist Design
        </p>
      </div>
    </main>
  );
}

export default Chat;