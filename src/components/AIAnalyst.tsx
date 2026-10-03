import React, { useState, useRef, useEffect } from 'react';
import { Cpu, X, Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { RiverRegion } from '../types/charwatch';

interface AIAnalystProps {
  isOpen: boolean;
  onClose: () => void;
  activeRegion?: RiverRegion;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'analyst';
  text: string;
  timestamp: string;
}

export const AIAnalyst: React.FC<AIAnalystProps> = ({ isOpen, onClose, activeRegion }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'analyst',
      text: `Hello! I am RIVERGUARD ANALYST, your AI Earth Observation & River Dynamics Specialist. How can I assist your analysis of the ${activeRegion ? activeRegion.name : 'Jamuna River Basin'} today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'Why is Sirajganj bank shifting?',
    'What does 0.38 radar coherence mean?',
    'How does L-Band differ from C-Band in monsoon?',
    'What data sources are being used?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyst/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          activeRegion: activeRegion || null,
          activeData: activeRegion ? {
            coherence: activeRegion.radarCoherence,
            soilMoisture: activeRegion.soilMoisturePercent,
            bankShift: activeRegion.bankShiftMeters,
            riskLevel: activeRegion.riskTier,
          } : null,
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'analyst',
        text: data.reply || 'Analysis completed based on prototype satellite telemetry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI Analyst Error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'analyst',
        text: 'Note: AI model response error. Currently operating under prototype simulation rules.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] z-50 glass-panel-cyan border-l border-cyan-500/40 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/30 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-display">RIVERGUARD ANALYST</h3>
            <span className="text-[10px] font-mono text-cyan-400">GEMINI AI · EARTH OBSERVATION</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-slate-400">
              {msg.sender === 'analyst' ? (
                <>
                  <Bot className="w-3 h-3 text-cyan-400" />
                  <span className="text-cyan-400 font-bold">RIVERGUARD ANALYST</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-slate-300" />
                  <span>YOU</span>
                </>
              )}
              <span>· {msg.timestamp}</span>
            </div>

            <div
              className={`p-3 rounded-2xl max-w-[88%] text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/40 rounded-tr-none'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none font-sans'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Analyzing SAR telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="px-4 py-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[10px] font-mono">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-2 py-1 bg-slate-900 hover:bg-cyan-950/60 text-slate-300 border border-slate-800 hover:border-cyan-500/40 rounded transition-all text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-cyan-500/30 bg-slate-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about river dynamics, L-band SAR..."
            className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
