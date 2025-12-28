
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Loader2, 
  User, 
  Bot, 
  Sparkles, 
  ChevronDown,
  Maximize2,
  Minimize2,
  Sprout
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to AgriVision Intelligence. I am AgriBot, your specialized consultant. How can I assist with your farm operations today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initChat = async () => {
    if (!chatRef.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: "You are AgriBot, a senior agricultural consultant for the AgriVision AI platform. You provide expert advice on crop selection, soil science, irrigation, pest management, and agricultural market trends. Be professional, concise, and data-driven. Use bullet points for readability when explaining complex steps.",
        },
      });
    }
    return chatRef.current;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const chat = await initChat();
      const result = await chat.sendMessage({ message: userMessage });
      const responseText = result.text;
      
      setMessages(prev => [...prev, { role: 'model', text: responseText || "I'm sorry, I couldn't process that. Please try again." }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Connection to Intelligence Grid interrupted. Please check your network and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Recommend wheat fertilizers",
    "Current market trends for Corn",
    "How to improve soil pH?",
    "Organic farming best practices"
  ];

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-600 text-white rounded-2xl shadow-[0_20px_50px_-10px_rgba(16,185,129,0.4)] hover:bg-emerald-500 transition-all hover:scale-110 active:scale-95 flex items-center justify-center z-50 group border-4 border-white"
      >
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-8 right-8 w-[420px] bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] z-50 border border-slate-100 flex flex-col transition-all duration-500 overflow-hidden ${isMinimized ? 'h-20' : 'h-[650px]'}`}
    >
      {/* Header */}
      <div className="bg-slate-950 p-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
            <Sprout size={20} />
          </div>
          <div>
            <h4 className="font-black text-sm tracking-tight leading-none">AgriBot Assistant</h4>
            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1 opacity-80">AI Consultant v3.0</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed font-medium shadow-sm border ${msg.role === 'user' ? 'bg-emerald-50 border-emerald-100 text-emerald-900 rounded-tr-none' : 'bg-white border-slate-100 text-slate-700 rounded-tl-none'}`}>
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx} className={idx > 0 ? "mt-2" : ""}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center animate-pulse">
                  <Bot size={14} />
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-emerald-600" />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Processing Intelligence...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-100">
            {messages.length < 3 && !isLoading && (
              <div className="flex flex-wrap gap-2 mb-6">
                {quickPrompts.map((p, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setInput(p); }}
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-500 hover:border-emerald-500 hover:text-emerald-600 transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
            
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask AgriBot about your harvest..."
                className="w-full pl-6 pr-14 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:ring-0 outline-none transition-all font-semibold text-slate-800"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`absolute right-2 p-3 rounded-xl transition-all ${!input.trim() || isLoading ? 'text-slate-300' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700'}`}
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] mt-4 opacity-50">
              Powered by Gemini 3.0 Pro Intelligence
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBot;
