const STORAGE_KEY = "elfar-chat-history";

// ==================== Get Chats ====================

export function getChats() {
  try {
    const chats = localStorage.getItem(STORAGE_KEY);

    if (!chats) {
      return [];
    }

    return JSON.parse(chats);
  } catch (error) {
    console.error("Failed to get chats:", error);
    return [];
  }
}

// ==================== Save Chats ====================

export function saveChats(chats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error("Failed to save chats:", error);
  }
}

// ==================== Get One Chat ====================

export function getChatById(chatId) {
  const chats = getChats();

  return chats.find((chat) => chat.id === chatId) || null;
}

// ==================== Add New Chat ====================

export function addChat(chat) {
  const chats = getChats();

  chats.unshift(chat);

  saveChats(chats);

  return chat;
}

// ==================== Update Chat ====================

export function updateChat(chatId, updatedData) {
  const chats = getChats();

  const updatedChats = chats.map((chat) =>
    chat.id === chatId
      ? {
          ...chat,
          ...updatedData,
          updatedAt: new Date().toISOString(),
        }
      : chat
  );

  saveChats(updatedChats);

  return getChatById(chatId);
}

// ==================== Delete Chat ====================

export function deleteChat(chatId) {
  const chats = getChats();

  const filteredChats = chats.filter((chat) => chat.id !== chatId);

  saveChats(filteredChats);
}

// ==================== Delete All Chats ====================

export function clearChats() {
  localStorage.removeItem(STORAGE_KEY);
}