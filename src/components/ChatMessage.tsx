import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-user-bubble text-user-bubble-foreground rounded-br-md"
            : "bg-ai-bubble text-ai-bubble-foreground rounded-bl-md"
        }`}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap">{content}</span>
        ) : (
          <div className="prose prose-sm max-w-none prose-headings:text-ai-bubble-foreground prose-p:text-ai-bubble-foreground prose-strong:text-ai-bubble-foreground prose-code:text-ai-bubble-foreground prose-li:text-ai-bubble-foreground prose-a:text-primary prose-pre:bg-sidebar prose-pre:text-sidebar-foreground prose-code:bg-sidebar/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
