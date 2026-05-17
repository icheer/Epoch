export interface StoredMessage {
  role: "user" | "assistant";
  content: string | object;
  isAction?: boolean;
  actionLabel?: string;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: StoredMessage[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "epoch_conversations";
const MAX_CONVERSATIONS = 50;

export const conversationStorage = {
  getAll(): Conversation[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  save(conversation: Conversation): void {
    if (typeof window === "undefined") return;
    try {
      const conversations = this.getAll();
      const index = conversations.findIndex((c) => c.id === conversation.id);

      if (index >= 0) {
        conversations[index] = conversation;
      } else {
        conversations.unshift(conversation);
        if (conversations.length > MAX_CONVERSATIONS) {
          conversations.pop();
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error("Failed to save conversation:", error);
    }
  },

  delete(id: string): void {
    if (typeof window === "undefined") return;
    try {
      const conversations = this.getAll().filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  },

  getById(id: string): Conversation | null {
    return this.getAll().find((c) => c.id === id) || null;
  },
};
