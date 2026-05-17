"use client";

import { Conversation, conversationStorage } from "@/lib/conversationStorage";
import { Menu, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export function Sidebar({
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
}: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setConversations(conversationStorage.getAll());
  }, [currentConversationId]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("确定要删除这条对话吗？")) {
      onDeleteConversation(id);
      setConversations(conversationStorage.getAll());
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="打开菜单"
      >
        <Menu size={20} />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-[60]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-[70] flex flex-col transition-transform duration-300",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            对话历史
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            aria-label="关闭菜单"
          >
            <X size={18} />
          </button>
        </div>

        {/* New conversation button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewConversation();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-brand text-brand-foreground hover:brightness-105 transition-[filter] text-sm font-medium"
          >
            <Plus size={16} />
            新对话
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {conversations.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-8">
              暂无历史对话
            </p>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm",
                    currentConversationId === conv.id
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <span className="flex-1 truncate">{conv.title}</span>
                  <button
                    onClick={(e) => handleDelete(e, conv.id)}
                    className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                    aria-label="删除对话"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
