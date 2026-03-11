import { MessageSquarePlus, Sparkles, Trash2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

type Conversation = {
  id: string;
  title: string;
  updated_at: string;
};

interface ChatSidebarProps {
  onNewChat: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

const ChatSidebar = ({
  onNewChat,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
}: ChatSidebarProps) => {
  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-sidebar-accent" />
          <h1 className="text-lg font-bold tracking-tight text-sidebar-primary-foreground">Gemini Chat</h1>
        </div>
        <ThemeToggle />
      </div>
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground hover:opacity-90 transition-opacity font-medium text-sm"
        >
          <MessageSquarePlus className="w-4 h-4" />
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
              conv.id === activeConversationId
                ? "bg-sidebar-muted text-sidebar-primary-foreground"
                : "hover:bg-sidebar-muted/50 text-sidebar-foreground"
            }`}
            onClick={() => onSelectConversation(conv.id)}
          >
            <span className="truncate flex-1">{conv.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="p-4 text-xs text-sidebar-foreground/50">
        Powered by Google Gemini
      </div>
    </aside>
  );
};

export default ChatSidebar;
