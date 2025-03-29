import { CornerDownLeft, Paperclip } from "lucide-react";
import { Button } from "../ui/button";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat/chat-bubble";
import { ChatInput } from "../ui/chat/chat-input";
import { ChatMessageList } from "../ui/chat/chat-message-list";
import { useState, useRef, useEffect } from "react";
import { chatService } from "@/services/api";
import { Bounce, toast } from "react-toastify";
export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  fileUrl?: string;
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são permitidos.', {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce
      });
      return;
    }

    try {
      setIsUploading(true);
      const response = await chatService.uploadPdf(file);

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `Arquivo PDF enviado: ${file.name}`,
        role: "user",
        fileUrl: response.url
      };

      setMessages(prev => [...prev, newMessage]);
    } catch {
      toast.error('Erro ao enviar arquivo PDF. Tente novamente.', {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce
      });
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      role: "user"
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    try {
      setIsLoading(true);
      const response = await chatService.sendMessage(message);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.user,
        role: "assistant"
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Desculpe, ocorreu um erro ao processar sua mensagem.",
        role: "assistant"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full">
      <div className="flex flex-col items-center min-h-screen w-[50%] min-w-[300px] max-w-[900px]">
        <div className="flex-1 overflow-y-auto w-full">
          <ChatMessageList>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} variant={msg.role === "user" ? "sent" : "received"}>
                <ChatBubbleAvatar fallback={msg.role === "user" ? "US" : "AI"} />
                <ChatBubbleMessage 
                  variant={msg.role === "user" ? "sent" : "received"}
                >
                  {msg.content}
                  {msg.fileUrl && (
                    <a 
                      href={msg.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block mt-2 text-sm text-primary hover:underline"
                    >
                      Abrir PDF
                    </a>
                  )}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}
            {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar fallback="AI" />
                <ChatBubbleMessage variant="received" isLoading />
              </ChatBubble>
            )}
            <div ref={messagesEndRef} />
          </ChatMessageList>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative w-full rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <ChatInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem aqui..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <div className="flex items-center p-3 pt-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf"
              className="hidden"
            />
            <Button 
              type="button"
              variant="ghost" 
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isUploading}
            >
              <Paperclip className="size-4" />
              <span className="sr-only">Anexar arquivo</span>
            </Button>

            <Button 
              type="submit"
              size="sm" 
              className="ml-auto gap-1.5"
              disabled={!message.trim() || isLoading}
            >
              Enviar mensagem
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
