import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import ThemeSelectorModal from "./components/ThemeSelectorModal";
import { getSavedTheme, saveTheme } from "./utils/theme";

import {
  getChats,
  addChat,
  updateChat,
  deleteChat,
} from "./api/storage";

function createNewChat() {
  return {
    id: `chat-${Date.now()}`,
    title: "New Chat",
    provider: "gemini",
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function App() {
  const [chats, setChats] = useState(() => getChats());
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Background & Theme state
  const [currentTheme, setCurrentTheme] = useState(() => getSavedTheme());
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Handle Theme Change
  function handleSelectTheme(theme) {
    setCurrentTheme(theme);
    saveTheme(theme.id);
  }

  // =========================
  // Create New Chat
  // =========================

  function handleNewChat() {
    const newChat = createNewChat();

    addChat(newChat);

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }

  // =========================
  // Delete Chat
  // =========================

  function handleDeleteChat(chatId) {
    deleteChat(chatId);

    setChats((prev) => {
      const updatedChats = prev.filter((chat) => chat.id !== chatId);

      // If deleted chat was active
      if (chatId === activeChatId) {
        setActiveChatId(updatedChats[0]?.id || null);
      }

      return updatedChats;
    });
  }

  // =========================
  // Update Chat
  // =========================

  function handleUpdateChat(chatId, data) {
    const updatedChat = updateChat(chatId, data);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? updatedChat : chat
      )
    );
  }

  // =========================
  // Select Chat
  // =========================

  function handleSelectChat(chatId) {
    setActiveChatId(chatId);
  }

  // =========================
  // First Load
  // =========================

  useEffect(() => {
    if (chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);

  const activeChat =
    chats.find((chat) => chat.id === activeChatId) || null;

  return (
    <div className={`flex h-[100dvh] w-full ${currentTheme.bgClass} text-slate-100 overflow-hidden antialiased transition-colors duration-300`}>
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentTheme={currentTheme}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      <Chat
        chat={activeChat}
        onUpdateChat={handleUpdateChat}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        currentTheme={currentTheme}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />
    </div>
  );
}

export default App;
