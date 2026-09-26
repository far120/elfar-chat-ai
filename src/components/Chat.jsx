import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { sendMessage } from "../api/api";

function Chat({ chat, onUpdateChat }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!chat) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-6 bg-[#0b0f19] relative overflow-hidden">
        <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]"></div>
        <div className="relative z-10 text-center max-w-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0b0f19]">
              <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h2 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-2xl font-extrabold text-transparent tracking-tight">
            ELFAR_AI-CHAT
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Create or select a chat from the sidebar to begin your conversation.
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // Provider Change
  // =========================

  function handleProviderChange(event) {
    onUpdateChat(chat.id, {
      provider: event.target.value,
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
    <main className="relative flex min-w-0 flex-1 flex-col bg-[#0b0f19]">
      
      {/* Background Glows */}
      <div className="pointer-events-none absolute right-1/4 top-10 h-72 w-72 rounded-full bg-indigo-600/10 blur-[100px]"></div>
      <div className="pointer-events-none absolute left-1/3 bottom-20 h-80 w-80 rounded-full bg-cyan-600/10 blur-[120px]"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-slate-800/80 bg-[#090d16]/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-sm">
            E
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 tracking-wide">
              {chat.title || "New Chat"}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">ELFAR_AI-CHAT Interface</p>
          </div>
        </div>

        {/* Provider Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">AI Model:</span>
          <select
            value={chat.provider}
            onChange={handleProviderChange}
            className="cursor-pointer rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-200 outline-none transition-all hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
          >
            <option value="gemini">✨ Gemini (Google)</option>
            <option value="ollama">🦙 Ollama (Local)</option>
            <option value="openai">⚡ OpenAI (GPT-4o)</option>
          </select>
        </div>
      </header>

      {/* Messages / Welcome View */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6">
        {chat.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center py-8">
            <div className="max-w-2xl text-center px-4">
              
              {/* Brand Header */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-2xl shadow-indigo-500/30 animate-pulse-glow">
                <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-[#0b0f19]">
                  <svg className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>

              <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-3xl sm:text-4xl font-black tracking-tight text-transparent">
                ELFAR_AI-CHAT
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-md mx-auto">
                Next-generation conversational AI powered by Gemini, local Ollama, and OpenAI models.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {chat.messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={index}
                  className={`flex gap-3.5 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* AI Avatar */}
                  {!isUser && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  )}

                  <div className="group relative max-w-[85%] sm:max-w-[80%]">
                    <div
                      className={`relative rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? "bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white font-medium rounded-tr-xs shadow-indigo-500/15 whitespace-pre-wrap"
                          : "bg-slate-900/90 border border-slate-800/90 text-slate-100 rounded-tl-xs shadow-slate-950/40"
                      }`}
                    >
                      {isUser ? (
                        message.content
                      ) : (
                        <ReactMarkdown
                          components={{
                            strong({ children }) {
                              return <strong className="font-bold text-white bg-indigo-500/10 px-1 py-0.5 rounded text-indigo-200 border border-indigo-500/20">{children}</strong>;
                            },
                            em({ children }) {
                              return <em className="italic text-cyan-200">{children}</em>;
                            },
                            p({ children }) {
                              return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
                            },
                            ul({ children }) {
                              return <ul className="my-2.5 ml-4 list-disc space-y-1.5 text-slate-200">{children}</ul>;
                            },
                            ol({ children }) {
                              return <ol className="my-2.5 ml-4 list-decimal space-y-1.5 text-slate-200">{children}</ol>;
                            },
                            li({ children }) {
                              return <li className="leading-relaxed">{children}</li>;
                            },
                            h1({ children }) {
                              return <h1 className="text-base sm:text-lg font-bold text-white my-3 border-b border-slate-800 pb-1.5">{children}</h1>;
                            },
                            h2({ children }) {
                              return <h2 className="text-sm sm:text-base font-bold text-slate-100 my-2.5">{children}</h2>;
                            },
                            h3({ children }) {
                              return <h3 className="text-xs sm:text-sm font-bold text-indigo-300 my-2">{children}</h3>;
                            },
                            code({ node, inline, className, children, ...props }) {
                              return inline ? (
                                <code className="rounded bg-slate-800/90 px-1.5 py-0.5 font-mono text-xs text-cyan-300 border border-slate-700/60" {...props}>
                                  {children}
                                </code>
                              ) : (
                                <div className="relative my-3 rounded-xl overflow-hidden border border-slate-800 bg-[#070a11]">
                                  <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900/80 border-b border-slate-800 text-slate-400 text-[11px] font-mono">
                                    <span>code snippet</span>
                                  </div>
                                  <pre className="p-3.5 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed" {...props}>
                                    <code>{children}</code>
                                  </pre>
                                </div>
                              );
                            },
                            blockquote({ children }) {
                              return <blockquote className="border-l-2 border-indigo-500 pl-3 italic text-slate-400 my-2.5">{children}</blockquote>;
                            },
                            hr() {
                              return <hr className="my-3 border-slate-800" />;
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
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs">
                      U
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-3.5 justify-start">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                </div>
                <div className="rounded-2xl rounded-tl-xs border border-slate-800 bg-slate-900/90 px-5 py-3.5 text-xs text-slate-400 flex items-center gap-2">
                  <span className="font-semibold text-indigo-400">ELFAR_AI</span> is thinking...
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative z-10 border-t border-slate-800/80 bg-[#090d16]/90 p-4 backdrop-blur-xl">
        <form
          onSubmit={handleSendMessage}
          className="mx-auto flex max-w-3xl items-center gap-2.5 rounded-2xl border border-slate-800 bg-slate-900/90 p-2 shadow-xl shadow-slate-950/50 transition-all duration-200 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20"
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Message ELFAR_AI-CHAT..."
            disabled={loading}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 font-medium text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:shadow-indigo-500/40 hover:scale-[1.03] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L18 12M18 12L12 6M18 12L12 18" />
            </svg>
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] text-slate-600 font-medium">
          ELFAR_AI-CHAT V2.0 • Powered by Gemini, Ollama & OpenAI
        </p>
      </div>
    </main>
  );
}

export default Chat;