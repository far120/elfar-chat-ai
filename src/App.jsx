import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";

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
    <div className="flex h-screen bg-[#0b0f19] text-slate-100 overflow-hidden antialiased">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      <Chat
        chat={activeChat}
        onUpdateChat={handleUpdateChat}
      />
    </div>
  );
}

export default App;
