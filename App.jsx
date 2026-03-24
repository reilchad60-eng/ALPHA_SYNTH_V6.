import React, { useState, useEffect } from 'react';
import { Zap, Copy, Check, Play, Square, Cpu, Lock, ShieldAlert, Globe } from 'lucide-react';

export default function App() {
  const brand = "ALPHA_SYNTH";
  const developer = "MAXTHEBLACKCAT";
  const myWallet = "8xZwuF84Ms64CcRgA4ZQ8syB58gWyt4h9S77m8mmNYyo";
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [visValues, setVisValues] = useState(new Array(16).fill(10));
  const [logs, setLogs] = useState(["[SYSTEM] Alpha_Engine_v6.0_Initialized", "[NETWORK] Connected", "[SECURITY] Wallet_Verified"]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setVisValues(visValues.map(() => Math.floor(Math.random() * 85) + 15));
      }, 70);
    } else {
      setVisValues(new Array(16).fill(15));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = myWallet;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setLogs(prev => ["[SUCCESS] Address_Copied", ...prev.slice(0, 3)]);
    } catch (err) { console.error('Copy failed', err); }
    document.body.removeChild(textArea);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-mono p-4 flex flex-col items-center justify-start overflow-x-hidden">
      
      {/* HUD HEADER */}
      <div className="w-full max-w-md bg-zinc-900/90 border border-orange-500/30 p-5 rounded-[2.5rem] flex justify-between items-center shadow-[0_0_40px_rgba(249,115,22,0.15)] mb-6 mt-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-500/10 rounded-2xl border border-orange-500/40">
            <Cpu size={22} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic text-white tracking-tighter uppercase leading-tight">{brand}</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
              <span className="text-[9px] font-black text-zinc-400 tracking-[0.2em] uppercase italic">DEV_{developer}</span>
            </div>
          </div>
        </div>
        <div className="text-right border-l border-zinc-800 pl-4">
          <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest leading-none mb-1 italic">STABLE</p>
          <p className="text-md font-black text-orange-400 italic tracking-tighter">MAINNET</p>
        </div>
      </div>

      {/* VISUALIZER ENGINE */}
      <div className="w-full max-w-md bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] p-10 flex flex-col items-center relative overflow-hidden mb-6 shadow-inner text-center">
        <div className="flex items-end gap-2 h-40 mb-12">
          {visValues.map((h, i) => (
            <div key={i} className="w-3 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-full transition-all duration-75" style={{ height: `${h}%`, opacity: isPlaying ? 0.4 + (h/100) : 0.15 }}></div>
          ))}
        </div>
        <button 
          onClick={() => { setIsPlaying(!isPlaying); setLogs(prev => [isPlaying ? "[PAUSED]" : "[ACTIVE_432HZ]", ...prev.slice(0, 3)]); }} 
          className={`relative w-40 h-40 rounded-full border-[10px] flex items-center justify-center transition-all bg-black z-10 ${isPlaying ? 'border-orange-500 shadow-[0_0_60px_rgba(249,115,22,0.4)]' : 'border-zinc-800 opacity-80'}`}
        >
          {isPlaying ? <Square className="fill-orange-500 text-orange-500" size={36}/> : <Play className="fill-orange-500 text-orange-500 ml-2" size={54}/>}
        </button>
        <div className="mt-12">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white">{brand}_V6</h2>
          <p className="text-[10px] text-orange-500 font-black tracking-[0.5em] mt-3 uppercase opacity-80 italic">AURA_SYNC_READY</p>
        </div>
      </div>

      {/* PORTAL BOX */}
      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl relative">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] flex items-center gap-2 italic">
            <ShieldAlert size={14} className="text-orange-500"/> SECURITY_GATE
          </p>
          <span className="text-[10px] bg-orange-500 text-black px-3 py-1 rounded-full font-black italic tracking-tighter">ACCESS_KEY_REQUIRED</span>
        </div>
        
        <div className="bg-black p-5 rounded-2xl border border-zinc-800/50 mb-8 relative">
          <p className="text-[10px] text-zinc-600 mb-3 font-black uppercase tracking-widest italic leading-none">Solana_Vault (0.01 SOL):</p>
          <p className="text-[11px] text-zinc-200 font-mono break-all leading-relaxed pr-12">{myWallet}</p>
          <button 
            onClick={handleCopy} 
            className="absolute right-4 bottom-4 p-3 bg-zinc-800 rounded-xl hover:bg-orange-500 hover:text-black transition-all shadow-xl"
          >
            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20}/>}
          </button>
        </div>

        <button className="w-full py-6 bg-orange-500 hover:bg-orange-400 text-black font-black rounded-2xl text-sm uppercase tracking-[0.3em] transition-all shadow-[0_15px_40px_rgba(249,115,22,0.3)] flex items-center justify-center gap-3">
          <Zap size={18} fill="currentColor"/> UNLOCK_ALPHA_SNIPER
        </button>
      </div>

      {/* TERMINAL STATUS */}
      <div className="w-full max-w-md mt-6 bg-black/80 border border-zinc-900 p-5 rounded-[2rem] h-28 overflow-hidden shadow-inner flex flex-col-reverse italic">
        <div className="text-[10px] space-y-1.5 font-bold italic">
          {logs.map((log, i) => (
            <p key={i} className={log.includes('[SUCCESS]') ? 'text-green-500' : 'text-orange-400'}>{`> ${log}`}</p>
          ))}
        </div>
      </div>
      
      <footer className="mt-10 mb-8 opacity-40 text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600 italic flex items-center gap-2">
        <Globe size={10}/> SYSTEM_V6_OPERATED_BY_{developer}
      </footer>
    </div>
  );
}

