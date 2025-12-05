import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { askPrintExpert } from '../services/geminiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  contextData: string;
}

export const ChatInterface: React.FC<Props> = ({ isOpen, onClose, contextData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your prepress assistant. Ask me about paper grain, glue types, or specific InDesign settings.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await askPrintExpert(userMsg.text, contextData);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-zinc-900 rounded-xl border border-zinc-700 shadow-2xl flex flex-col h-[600px]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Print Expert AI</h3>
              <p className="text-[10px] text-zinc-500">Powered by Gemini 2.5</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-zinc-700 text-zinc-300' : 'bg-indigo-900/30 text-indigo-400'}`}>
                 {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
               </div>
               <div className={`rounded-lg p-3 text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-100' : 'bg-indigo-950/30 text-zinc-300 border border-indigo-900/30'}`}>
                 {msg.text}
               </div>
            </div>
          ))}
          {loading && (
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-indigo-900/30 text-indigo-400">
                 <Bot size={14} />
               </div>
               <div className="bg-indigo-950/30 rounded-lg p-3 text-sm border border-indigo-900/30 text-zinc-500 animate-pulse">
                 Thinking...
               </div>
             </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-800">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about binding, paper, or glue..."
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 placeholder-zinc-600"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};