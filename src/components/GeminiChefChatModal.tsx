import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, RefreshCw, ChevronRight, Cake, Lightbulb, Trash2 } from 'lucide-react';
import { CakeDoodles } from './CakeDoodles';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface GeminiChefChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomizerWithFlavor?: (flavorDesc: string) => void;
}

export const GeminiChefChatModal: React.FC<GeminiChefChatModalProps> = ({
  isOpen,
  onClose,
  onOpenCustomizerWithFlavor
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "👋 Bonjour! I'm **Chef Rosette**, your CakeBox Pastry Master & Flavor Sommelier! 🍰✨\n\nAsk me anything: customized flavor pairings, guest portion math, sweet cake inscriptions, or dietary substitutions!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.7-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.7-flash');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '🎂 Servings for 25 guests', prompt: 'How big of a cake do I need to feed 25 guests, and how many tiers would you recommend?' },
    { label: '🍓 Red Velvet pairing', prompt: 'What gourmet frosting, drip, and topping combo goes best with a Red Velvet sponge?' },
    { label: '✍️ Witty Birthday Toppers', prompt: 'Give me 4 cute and witty short cake topper inscriptions for a 30th birthday.' },
    { label: '🌱 Gluten-free ideas', prompt: 'What are delicious gluten-free and eggless cake options and flavor combinations you suggest?' }
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      // Build server request
      const formattedHistory = newHistory.map((m) => ({
        role: m.role,
        text: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: formattedHistory.slice(0, -1), // previous history
          message: textToSend.trim(),
          model: selectedModel
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.text || 'I would love to help! Tell me more about your dream cake.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: `🍰 **Chef Rosette's Sweet Recommendation:**\n\nFor a truly unforgettable cake, try pairing our **Red Velvet** or **Dutch Chocolate Sponge** with **Whipped Strawberry Buttercream** and a **Dark Ganache Drip**! For 20–25 guests, an 8" two-tier cake or a 10" cake is the golden standard!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: "✨ Chat cleared! I'm ready to help you craft your next cake masterpiece.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none">
      <div className="w-full max-w-md h-[92vh] max-h-[720px] bg-[#FFF8F8] rounded-t-[36px] sm:rounded-[36px] border-t-2 sm:border-2 border-pink-200 shadow-2xl flex flex-col overflow-hidden relative">
        <CakeDoodles density="low" />

        {/* Top Header */}
        <div className="px-4 py-3 bg-[#FFF0F5] border-b border-pink-200 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 border-2 border-white flex items-center justify-center text-xl shadow-xs text-white">
              👩‍🍳
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold font-display text-sm text-[#3B2C30]">
                  Chef Rosette (Gemini AI)
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span className="text-[10px] text-pink-600 font-semibold block">
                Master Pastry Sommelier & Flavor Architect
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              title="Clear chat"
              className="w-7 h-7 rounded-full bg-white/90 text-gray-500 hover:text-rose-600 flex items-center justify-center transition-colors"
            >
              <Trash2 size={13} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white text-pink-700 hover:bg-pink-100 flex items-center justify-center border border-pink-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Model Selection Bar */}
        <div className="bg-[#FFE5EC] px-4 py-1.5 border-b border-pink-200/80 flex items-center justify-between text-[11px] z-10 shrink-0">
          <span className="font-bold text-[#584146] flex items-center gap-1">
            <Sparkles size={11} className="text-pink-600" />
            <span>AI Brain:</span>
          </span>
          <div className="flex items-center gap-1">
            {(
              [
                { id: 'gemini-3.7-flash', label: '3.7 Flash (Balanced)' },
                { id: 'gemini-3.1-flash-lite', label: '3.1 Lite (Fast)' },
                { id: 'gemini-3.1-pro-preview', label: '3.1 Pro (Complex)' }
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                  selectedModel === m.id
                    ? 'bg-pink-600 text-white shadow-2xs'
                    : 'bg-white/80 text-[#584146] hover:bg-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 z-10">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[88%] ${
                  isUser ? 'self-end flex-row-reverse' : 'self-start'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-1 shadow-2xs ${
                    isUser
                      ? 'bg-[#3B2C30] text-white'
                      : 'bg-pink-400 text-white'
                  }`}
                >
                  {isUser ? <User size={14} /> : <span>🍰</span>}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#FF5E89] text-white rounded-tr-none font-medium'
                      : 'bg-white text-[#3B2C30] border border-pink-100 rounded-tl-none font-normal'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <span
                    className={`block text-[9px] mt-1 ${
                      isUser ? 'text-pink-200 text-right' : 'text-gray-400 text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 max-w-[80%] self-start">
              <div className="w-7 h-7 rounded-full bg-pink-400 text-white flex items-center justify-center text-xs shrink-0">
                🍰
              </div>
              <div className="p-3 bg-white rounded-2xl rounded-tl-none border border-pink-100 shadow-xs flex items-center gap-1.5 text-xs text-[#584146]">
                <RefreshCw size={13} className="animate-spin text-pink-500" />
                <span>Chef Rosette is whisking up recommendations...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 bg-[#FFF8F8]/90 overflow-x-auto flex gap-1.5 scrollbar-none z-10 shrink-0 border-t border-pink-100">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              className="whitespace-nowrap bg-white border border-pink-200 hover:border-pink-400 text-[#3B2C30] text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 shadow-2xs btn-bounce"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-t border-pink-200 z-10 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Chef Rosette for sweet advice..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#FFF8F8] text-xs text-[#3B2C30] placeholder-gray-400 border border-pink-200 rounded-full px-3.5 py-2.5 outline-none focus:border-pink-500 font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#FF5E89] hover:bg-[#F43F5E] disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-md shadow-pink-500/25 transition-all btn-bounce"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
