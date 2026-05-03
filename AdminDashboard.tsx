import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  FileCheck, 
  XSquare, 
  Eye, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { applicationService } from '../services/applicationService';
import { DrawApplication } from '../types';

export const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<DrawApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<DrawApplication | null>(null);

  useEffect(() => {
    const unsubscribe = applicationService.getAllApplications((items) => {
      setApplications(items);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, status: 'verified' | 'rejected') => {
    try {
      await applicationService.updateApplicationStatus(id, status);
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status });
      }
    } catch (error) {
      alert('Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center space-x-2 text-brand-red font-black text-[10px] uppercase tracking-[0.3em] mb-3">
             <div className="w-2 h-2 bg-brand-red" />
             <span>Admin Protocol v1.0</span>
          </div>
          <h1 className="text-5xl font-black text-brand-navy uppercase tracking-tighter leading-none">
            Control <span className="text-brand-red">Center</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-8 py-4 border-2 border-brand-navy flex items-center space-x-4">
             <div className="p-3 bg-brand-navy text-white">
               <ShieldAlert className="w-5 h-5" />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">Role</p>
               <p className="text-sm font-black text-brand-navy uppercase tracking-tight">Lead Auditor</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Sidebar Controls */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white border-2 border-brand-navy p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Search Records</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="geometric-input pl-10 h-10 text-xs"
                  placeholder="Name or Email..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filter Status</label>
              <div className="flex flex-col gap-2">
                {['all', 'pending', 'verified', 'rejected'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s as any)}
                    className={`text-[10px] font-black uppercase tracking-widest py-2 px-3 text-left border-2 transition-all ${
                      statusFilter === s ? 'border-brand-navy bg-brand-navy text-white' : 'border-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 border-b-4 border-brand-red">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-navy mb-4">Quick Stats</h3>
            <div className="space-y-4">
               <StatItem label="Total Apps" value={applications.length} />
               <StatItem label="Pending" value={applications.filter(a => a.status === 'pending').length} variant="amber" />
               <StatItem label="Verified" value={applications.filter(a => a.status === 'verified').length} variant="green" />
            </div>
          </div>
        </div>

        {/* Main List */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-100 animate-pulse border-2 border-slate-50" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app) => (
                <AdminAppCard 
                  key={app.id} 
                  app={app} 
                  isSelected={selectedApp?.id === app.id}
                  onClick={() => setSelectedApp(app)}
                />
              ))}

              {filteredApps.length === 0 && (
                <div className="p-20 text-center border-2 border-dashed border-slate-200">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No matching records found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Detail Panel */}
      <AnimatePresence>
        {selectedApp && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="fixed inset-0 z-[110] bg-brand-navy/60 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[120] w-full max-w-2xl bg-white border-l-8 border-brand-navy shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.3)] overflow-y-auto"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-12">
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 mr-1 rotate-180" /> Close Detail
                  </button>
                  <div className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 ${
                    selectedApp.status === 'verified' ? 'border-green-600 text-green-600' :
                    selectedApp.status === 'rejected' ? 'border-brand-red text-brand-red' :
                    'border-amber-500 text-amber-500'
                  }`}>
                    {selectedApp.status}
                  </div>
                </div>

                <div className="space-y-12">
                  <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-brand-navy mb-2">{selectedApp.name}</h2>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Submitted on {selectedApp.createdAt?.seconds ? format(new Date(selectedApp.createdAt.seconds * 1000), 'MMM dd, yyyy HH:mm') : 'N/A'}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                     <DetailGroup label="Email ID" value={selectedApp.email} />
                     <DetailGroup label="Mobile" value={selectedApp.phone} />
                     <DetailGroup label="Birth Date" value={selectedApp.dob} />
                     <DetailGroup label="User ID" value={selectedApp.userId} />
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-brand-navy flex items-center">
                      <FileCheck className="w-4 h-4 mr-2" /> Proof of Identity
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <ImagePreview label="Gov ID Front" url={selectedApp.idFrontUrl} />
                      <ImagePreview label="Gov ID Back" url={selectedApp.idBackUrl} />
                      <div className="col-span-2">
                        <ImagePreview label="Biometric Selfie" url={selectedApp.selfieUrl} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-12 border-t-2 border-slate-100 flex gap-4">
                    <button 
                      onClick={() => handleUpdateStatus(selectedApp.id!, 'rejected')}
                      disabled={selectedApp.status === 'rejected'}
                      className="flex-1 geometric-btn-secondary py-5 text-brand-red border-brand-red hover:bg-brand-red hover:text-white disabled:opacity-20"
                    >
                      Reject Entry
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedApp.id!, 'verified')}
                      disabled={selectedApp.status === 'verified'}
                      className="flex-[2] geometric-btn-primary py-5 bg-green-600 border-green-600 hover:bg-green-700 disabled:opacity-20"
                    >
                      Authenticate Entry
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminAppCard = ({ app, isSelected, onClick }: { app: DrawApplication, isSelected: boolean, onClick: () => void, key?: any }) => {
  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    verified: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white border-2 p-6 transition-all cursor-pointer group ${
        isSelected ? 'border-brand-navy shadow-xl translate-x-1' : 'border-slate-100 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-50 flex items-center justify-center text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-brand-navy uppercase tracking-tight">{app.name}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{app.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border-2 ${statusColors[app.status]}`}>
            {app.status}
          </div>
          <div className="text-[9px] text-slate-300 font-mono hidden md:block">#{app.id?.slice(-8).toUpperCase()}</div>
          <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-brand-navy transition-all" />
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, variant = 'navy' }: any) => {
  const variants = {
    navy: 'text-brand-navy',
    amber: 'text-amber-600',
    green: 'text-green-600'
  } as any;

  return (
    <div className="flex justify-between items-end border-b border-slate-200 pb-2">
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{label}</span>
      <span className={`text-xl font-black ${variants[variant]}`}>{value}</span>
    </div>
  );
};

const DetailGroup = ({ label, value }: any) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    <p className="text-sm font-black text-brand-navy uppercase tracking-tight">{value || '---'}</p>
  </div>
);

const ImagePreview = ({ label, url }: any) => (
  <div className="space-y-2">
    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    <div className="aspect-video bg-slate-100 border-2 border-slate-200 overflow-hidden relative group">
      <img src={url} alt={label} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-brand-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <ExternalLink className="text-white w-6 h-6" />
      </div>
    </div>
  </div>
);
