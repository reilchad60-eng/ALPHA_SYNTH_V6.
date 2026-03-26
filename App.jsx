import React, { useState, useEffect, useRef } from 'react';
import { Zap, Copy, Check, Play, Square, Cpu, MessageSquare, Send, ShieldAlert, Globe, Terminal } from 'lucide-react';
import { inject } from '@vercel/analytics';

inject();

export default function App() {
  const brand = "ALPHA_SYNTH";
  const developer = "MAXTHEBLACKCAT";
  const myWallet = "8xZwuF84Ms64CcRgA4ZQ8syB58gWyt4h9S77m8mmNYyo";

  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [visValues, setVisValues] = useState(new Array(12).fill(10));
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "SYSTEM_ONLINE: Connection to Helius established. ALPHA_V6 ready to hunt." }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setVisValues(visValues.map(() => Math.floor(Math.random() * 85) + 15));
      }, 80);
    } else {
      setVisValues(new Array(12).fill(15));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSend = async () => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = { role: 'user', text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.text
          }))
        })
      });
      if (!response.ok) throw new Error("OFFLINE");
      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content || data.content || "DATA_ERROR";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "CRITICAL: Check OpenAI API Key in Vercel Settings." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-mono p-4 flex flex-col items-center">
      
      {/* HUD HEADER */}
      <div className="w-full max-w-md bg-zinc-900 border-b-2 border-orange-500 p-4 flex justify-between items-center mb-4 rounded-b-xl shadow-lg">
        <div className="flex items-center gap-2">
          <Cpu className="text-orange-500 animate-pulse" size={18} />
          <h1 className="text-lg font-black italic tracking-tighter">{brand}_V6</h1>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-zinc-500 font-bold italic">{developer}</span>
          <span className="text-[8px] text-green-500 font-bold flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-green-500 animate-ping"></div> LIVE
          </span>
        </div>
      </div>

      {/* 432Hz FREQUENCY VISUALIZER */}
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center mb-4 shadow-xl">
        <div className="flex items-end gap-1.5 h-16 mb-6">
          {visValues.map((h, i) => (
            <div key={i} className="w-2 bg-orange-500 rounded-t-full transition-all duration-100 shadow-[0_0_10px_rgba(249,115,22,0.3)]" style={{ height: `${h}%`, opacity: isPlaying ? 1 : 0.2 }}></div>
          ))}
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} className={`p-5 rounded-full border-4 transition-all ${isPlaying ? 'border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.5)]' : 'border-zinc-800'}`}>
          {isPlaying ? <Square size={28} fill="#f97316" className="text-orange-500" /> : <Play size={28} fill="#f97316" className="ml-1 text-orange-500" />}
        </button>
      </div>

      {/* AI COMMAND TERMINAL */}
      <div className="w-full max-w-md bg-black border border-zinc-800 rounded-3xl flex flex-col overflow-hidden h-[380px] mb-4 shadow-2xl">
        <div className="bg-zinc-900/80 p-3 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-orange-500" />
            <span className="text-[10px] font-black italic text-zinc-400">NEURAL_INTERFACE</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-[12px] ${m.role === 'user' ? 'bg-orange-500 text-black font-bold' : 'bg-zinc-800 text-zinc-100 border border-zinc-700'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && <div className="text-orange-500 text-[10px] animate-pulse">THINKING...</div>}
          <div ref={chatEndRef} />
        </div>

        <div className="p-3 bg-zinc-900/50 border-t border-zinc-800 flex gap-2">
          <input 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="TYPE COMMAND..." 
            className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-2 text-[12px] focus:outline-none focus:border-orange-500 italic"
          />
          <button onClick={handleSend} className="bg-orange-500 text-black p-2 rounded-xl active:scale-90 transition-transform">
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* WALLET DEPOSIT BOX */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-5 rounded-3xl relative">
        <p className="text-[9px] text-zinc-500 mb-2 font-black italic uppercase">Vault_Address:</p>
        <div className="flex items-center justify-between bg-black p-3 rounded-xl border border-zinc-800">
          <span className="text-[10px] text-zinc-400 font-mono truncate mr-4">{myWallet}</span>
          <button onClick={() => { navigator.clipboard.writeText(myWallet); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-orange-500" />}
          </button>
        </div>
      </div>

      <footer className="mt-6 mb-4 opacity-30 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
        <Globe size={10}/> {developer}_NETWORK_V6
      </footer>
    </div>
  );
}
