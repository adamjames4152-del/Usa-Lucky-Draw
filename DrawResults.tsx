import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Trophy, TrendingUp, Calendar, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { drawService } from '../services/drawService';
import { Draw } from '../types';

export const DrawResults = () => {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = drawService.subscribeToLatestDraws((items) => {
      setDraws(items);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-100 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (draws.length === 0) {
    // Empty state with some placeholder data for demo if no real data exists
    return (
      <div className="space-y-4">
        <DrawItem draw={{
          id: '1',
          drawNo: 'DRW-8821',
          drawDate: { seconds: Date.now() / 1000 },
          winningNumbers: ['12', '24', '35', '09', '44', '18'],
          bonusNumber: '02',
          status: 'completed',
          poolAmount: 50000
        }} />
        <DrawItem draw={{
          id: '2',
          drawNo: 'DRW-8820',
          drawDate: { seconds: (Date.now() - 604800000) / 1000 },
          winningNumbers: ['03', '15', '22', '31', '40', '07'],
          bonusNumber: '11',
          status: 'completed',
          poolAmount: 48500
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {draws.map((draw, idx) => (
        <DrawItem key={draw.id} draw={draw} isLatest={idx === 0} />
      ))}
    </div>
  );
};

const DrawItem = ({ draw, isLatest }: { draw: any, isLatest?: boolean, key?: any }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 border-2 transition-all ${
        isLatest 
          ? 'bg-brand-navy text-white border-brand-red shadow-xl' 
          : 'bg-white text-brand-navy border-slate-100'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 ${isLatest ? 'bg-brand-red text-white' : 'bg-slate-900 text-white'}`}>
              Draw #{draw.drawNo}
            </span>
            {isLatest && <span className="flex items-center text-brand-red text-[10px] font-black uppercase tracking-widest"><span className="w-1.5 h-1.5 bg-brand-red mr-1.5" /> Live Result</span>}
          </div>
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">
            Result Update
          </h3>
          <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              {draw.drawDate?.seconds ? format(new Date(draw.drawDate.seconds * 1000), 'MMM dd, yyyy') : 'TBA'}
            </div>
            <div className="flex items-center">
              <Trophy className="w-3.5 h-3.5 mr-1.5" />
              ${draw.poolAmount?.toLocaleString()} Est
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {draw.winningNumbers?.map((num: string, i: number) => (
            <div 
              key={i}
              className={`w-14 h-14 border-4 flex items-center justify-center font-black text-2xl ${
                isLatest 
                  ? 'border-white text-white' 
                  : 'border-brand-navy text-brand-navy'
              }`}
            >
              {num}
            </div>
          ))}
          {draw.bonusNumber && (
            <div className={`w-14 h-14 flex items-center justify-center font-black text-2xl ${isLatest ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' : 'bg-brand-red text-white'}`}>
              {draw.bonusNumber}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
