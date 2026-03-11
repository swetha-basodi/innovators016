import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { streamChat } from "@/lib/streamChat";
import { toast } from "sonner";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ThemeToggle from "@/components/ThemeToggle";
import { Sparkles, MessageSquarePlus } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };
type Conversation = { id: string; title: string; updated_at: string };

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversations list
  const loadConversations = useCallback(async () => {
    const { data } = await supabase
      .from("conversations")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false });
    if (data) setConversations(data);
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  }, []);

  const handleNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
  };

  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    await loadMessages(id);
  };

  const handleDeleteConversation = async (id: string) => {
    await supabase.from("conversations").delete().eq("id", id);
    if (activeConversationId === id) {
      setMessages([]);
      setActiveConversationId(null);
    }
    loadConversations();
  };

  const handleSend = async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Create or reuse conversation
      let convId = activeConversationId;
      if (!convId) {
        const title = input.length > 50 ? input.substring(0, 50) + "..." : input;
        const { data: conv, error } = await supabase
          .from("conversations")
          .insert({ title })
          .select("id")
          .single();
        if (error) throw error;
        convId = conv.id;
        setActiveConversationId(convId);
      }

      // Save user message
      await supabase.from("messages").insert({
        conversation_id: convId,
        role: "user",
        content: input,
      });

      // Stream AI response
      let assistantSoFar = "";
      const upsertAssistant = (nextChunk: string) => {
        assistantSoFar += nextChunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      await streamChat({
        messages: updatedMessages,
        onDelta: upsertAssistant,
        onDone: async () => {
          setIsLoading(false);
          // Save assistant message
          if (assistantSoFar && convId) {
            await supabase.from("messages").insert({
              conversation_id: convId,
              role: "assistant",
              content: assistantSoFar,
            });
            await supabase
              .from("conversations")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", convId);
            loadConversations();
          }
        },
      });
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to get response. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        onNewChat={handleNewChat}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between p-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm">Gemini Chat</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button onClick={handleNewChat} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <MessageSquarePlus className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">How can I help you?</h2>
              <p className="text-muted-foreground text-sm max-w-md">
                Ask me anything — I'm powered by Google Gemini and ready to assist.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-6 px-4 flex flex-col gap-4">
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
                  </div>
                  <div className="bg-ai-bubble rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Index;
