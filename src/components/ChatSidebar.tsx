import { MessageSquarePlus, Sparkles } from "lucide-react";

interface ChatSidebarProps {
  onNewChat: () => void;
}

const ChatSidebar = ({ onNewChat }: ChatSidebarProps) => {
  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="p-4 flex items-center gap-2 border-b border-sidebar-border">
        <Sparkles className="w-6 h-6 text-sidebar-accent" />
        <h1 className="text-lg font-bold tracking-tight text-sidebar-primary-foreground">Gemini Chat</h1>
      </div>
      <div className="flex-1 p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground hover:opacity-90 transition-opacity font-medium text-sm"
        >
          <MessageSquarePlus className="w-4 h-4" />
          New Chat
        </button>
      </div>
      <div className="p-4 text-xs text-sidebar-foreground/50">
        Powered by Google Gemini
      </div>
    </aside>
  );
};

export default ChatSidebar;
