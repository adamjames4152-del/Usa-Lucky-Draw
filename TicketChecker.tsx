import React, { useState } from 'react';
import { Search, Ticket, Sparkles, Loader2, Trophy, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TicketChecker = () => {
  const [ticketNo, setTicketNo] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<'winner' | 'not-winner' | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNo) return;
    
    setIsChecking(true);
    setResult(null);
    
    setTimeout(() => {
      setIsChecking(false);
      if (ticketNo.includes('77')) {
        setResult('winner');
      } else {
        setResult('not-winner');
      }
    }, 1500);
  };

  return (
    <div className="bg-white p-8 border-2 border-slate-100">
      <form onSubmit={handleCheck} className="space-y-6">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Ticket ID Number</label>
        
        <div className="relative">
          <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="e.g. TX-458921"
            value={ticketNo}
            onChange={(e) => setTicketNo(e.target.value)}
            className="geometric-input pl-12 font-mono uppercase tracking-wider"
          />
        </div>

        <button 
          disabled={isChecking || !ticketNo}
          className="geometric-btn-primary w-full disabled:opacity-50"
        >
          {isChecking ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Check Status</span>
          )}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {result === 'winner' && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 p-6 bg-brand-red text-white border-2 border-brand-red"
          >
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="font-black text-xl uppercase italic">Jackpot!</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest leading-tight opacity-70">Matching signature detected. Check dashboard.</p>
              </div>
            </div>
          </motion.div>
        )}

        {result === 'not-winner' && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 p-6 border-2 border-brand-navy"
          >
             <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Negative Match</p>
             <p className="text-[10px] font-bold uppercase text-slate-400 mt-1">Ticket did not register in winner pool.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
