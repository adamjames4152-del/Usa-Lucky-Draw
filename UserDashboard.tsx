import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  QrCode,
  ShieldCheck,
  User as UserIcon,
  ChevronRight,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { applicationService } from '../services/applicationService';
import { DrawApplication } from '../types';
import { auth } from '../lib/firebase';

export const UserDashboard = () => {
  const [applications, setApplications] = useState<DrawApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
    const unsubscribe = applicationService.getUserApplications((items) => {
      setApplications(items);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-12 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 border-2 border-slate-100" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center space-x-2 text-brand-red font-black text-[10px] uppercase tracking-[0.3em] mb-3">
             <div className="w-2 h-2 bg-brand-red" />
             <span>Verified Session</span>
          </div>
          <h1 className="text-5xl font-black text-brand-navy uppercase tracking-tighter leading-none">
            User <span className="text-brand-red">Terminal</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-8 py-4 border-2 border-brand-navy flex items-center space-x-4">
             <div className="p-3 bg-brand-navy text-white">
               <ShieldCheck className="w-5 h-5" />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">Clearence</p>
               <p className="text-sm font-black text-brand-navy uppercase tracking-tight">{auth.currentUser?.displayName}</p>
             </div>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border-2 border-brand-navy p-16 text-center shadow-2xl shadow-brand-navy/5">
          <div className="w-20 h-20 bg-slate-100 flex items-center justify-center mx-auto mb-10 border border-slate-200">
            <Ticket className="text-slate-300 w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black text-brand-navy mb-4 uppercase tracking-tight">Access Denied</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-12 font-bold uppercase text-xs tracking-widest leading-relaxed">
            No active registrations found for this profile. Apply for verification to generate entries.
          </p>
          <button className="geometric-btn-primary">
            Initialize Application
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between px-4 border-l-4 border-brand-red">
               <h2 className="text-xl font-black text-brand-navy uppercase tracking-tight">Active Logs</h2>
               <span className="text-[10px] font-black tracking-widest text-brand-red uppercase">{applications.length} Records Found</span>
            </div>
            <div className="space-y-4">
              {applications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            {/* Digital Ticket Preview (only if verified) */}
            {applications.some(a => a.status === 'verified') && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-navy text-white p-10 relative overflow-hidden border-t-8 border-brand-red shadow-2xl"
              >
                <div className="absolute top-0 right-0 p-6 opacity-30 select-none">
                   <span className="text-[80px] font-black italic tracking-tighter text-white/5">001</span>
                </div>
                
                <div className="relative">
                  <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 bg-brand-red flex items-center justify-center">
                         <Ticket className="w-5 h-5 text-white" />
                       </div>
                       <span className="font-black text-xl tracking-tighter uppercase italic">SECURE TICKET</span>
                    </div>
                    <QrCode className="w-12 h-12 text-white/20" />
                  </div>

                  <div className="space-y-8">
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-2">Registration ID</p>
                      <p className="text-4xl font-black text-brand-red tracking-tighter font-mono">TX-7789-2026</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-2">Subject</p>
                        <p className="text-xs font-black uppercase truncate tracking-tight">{auth.currentUser?.displayName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-2">Cycle Ends</p>
                        <p className="text-xs font-black uppercase tracking-tight">MAY 09, 26</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                    <div className="text-[9px] font-black uppercase text-white/20 tracking-[0.25em]">Verified Entry Pass</div>
                    <button className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-red hover:underline">
                      Expnd <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="bg-white p-10 border-2 border-slate-100">
               <div className="flex items-center space-x-2 mb-10">
                 <div className="w-1.5 h-6 bg-brand-navy" />
                 <h3 className="font-black text-brand-navy uppercase tracking-tight">Activity Protocol</h3>
               </div>
               
               <div className="space-y-8">
                 {[
                   { t: "Verification Submitted", d: "Today, 14:30", i: <Clock className="w-4 h-4" /> },
                   { t: "Identity Authenticated", d: "Yesterday, 09:00", i: <CheckCircle className="w-4 h-4 text-green-600" />, success: true },
                   { t: "Draw Cycle #882 Primed", d: "2 days ago", i: <AlertCircle className="w-4 h-4 text-brand-red" /> }
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-start space-x-5 group cursor-pointer">
                     <div className="mt-0.5 w-10 h-10 bg-slate-50 flex items-center justify-center border-2 border-slate-100 group-hover:border-brand-navy transition-all">
                       {item.i}
                     </div>
                     <div className="flex-grow">
                       <p className={`text-xs font-black uppercase tracking-tight ${item.success ? 'text-green-600' : 'text-brand-navy'}`}>{item.t}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{item.d}</p>
                     </div>
                     <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-brand-red transition-colors" />
                   </div>
                 ))}
               </div>

               <button className="w-full mt-12 py-4 border-2 border-brand-navy text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-navy hover:text-white transition-all">
                 View Full Archives
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ApplicationCard = ({ application }: { application: DrawApplication, key?: any }) => {
  const statusStyles = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', label: 'Processing' },
    verified: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', label: 'Verified' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', label: 'Denied' },
  };

  const style = statusStyles[application.status];

  return (
    <div className="bg-white p-6 border-2 border-slate-100 hover:border-brand-navy transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <div className="w-12 h-12 bg-slate-50 flex items-center justify-center text-brand-navy group-hover:bg-brand-red group-hover:text-white transition-all border border-slate-100">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-brand-navy uppercase tracking-tight">Universal Entry</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
              LOG: {application.createdAt?.seconds ? format(new Date(application.createdAt.seconds * 1000), 'MMM dd, yyyy') : 'PENDING'}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 font-black text-[9px] uppercase tracking-widest ${style.bg} ${style.text} border-2 ${style.border}`}>
          {style.label}
        </div>
      </div>
      
      {application.status === 'verified' && (
        <div className="mt-6 pt-6 border-t-2 border-slate-50 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Key Code</p>
            <p className="font-mono text-sm font-black text-brand-red tracking-wider">TX-7789-2026</p>
          </div>
          <button className="p-3 bg-brand-navy text-white hover:bg-brand-red transition-all">
            <QrCode className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
