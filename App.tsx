import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  User, 
  Menu, 
  X, 
  CheckCircle, 
  History, 
  Trophy, 
  Globe,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

// Internal Components
import { ApplicationForm } from './components/ApplicationForm';
import { DrawResults } from './components/DrawResults';
import { TicketChecker } from './components/TicketChecker';
import { UserDashboard } from './components/UserDashboard';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';

const ADMIN_EMAIL = 'jasonmorrison087@gmail.com';

export default function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [view, setView] = useState<'home' | 'apply' | 'dashboard' | 'admin'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleApplyClick = () => {
    setView('apply');
  };
  const handleLogout = async () => {
    await signOut(auth);
    setView('home');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-brand-navy text-white h-16 flex items-center justify-between px-4 md:px-8 border-b-4 border-brand-red">
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <div className="w-8 h-8 bg-white flex items-center justify-center transform transition-transform group-hover:rotate-45">
            <div className="w-4 h-4 bg-brand-red rotate-45"></div>
          </div>
          <div>
            <span className="text-white font-black text-xl tracking-tighter leading-none">USA<span className="text-brand-red">LUCKY</span>DRAW</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => setView('home')}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${view === 'home' ? 'text-brand-red' : 'text-white hover:text-brand-red'}`}
          >
            Home
          </button>
          <button 
            onClick={handleApplyClick}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${view === 'apply' ? 'text-brand-red' : 'text-white hover:text-brand-red'}`}
          >
            Apply Free
          </button>
          {isAdmin && (
            <button 
              onClick={() => setView('admin')}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${view === 'admin' ? 'text-brand-red' : 'text-white hover:text-brand-red'}`}
            >
              Admin Panel
            </button>
          )}
          {user && (
            <button 
              onClick={() => setView('dashboard')}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${view === 'dashboard' ? 'text-brand-red' : 'text-white hover:text-brand-red'}`}
            >
              Dashboard
            </button>
          )}
          {user ? (
            <div className="flex items-center space-x-4 pl-4 border-l-2 border-white/10">
              <span className="text-xs font-black uppercase tracking-widest text-white/60">{user.displayName}</span>
              <button onClick={handleLogout} className="p-2 text-white/60 hover:text-brand-red transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="geometric-btn-secondary px-6"
              >
                Join Now
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-brand-navy p-4 space-y-4 border-b-4 border-brand-red sticky top-16 z-40 outline-none"
          >
            <button onClick={() => { setView('home'); setIsMenuOpen(false); }} className="block w-full text-left text-white text-xs font-bold uppercase tracking-widest p-2">Home</button>
            <button onClick={() => { handleApplyClick(); setIsMenuOpen(false); }} className="block w-full text-left text-white text-xs font-bold uppercase tracking-widest p-2">Apply Free</button>
            {user && <button onClick={() => { setView('dashboard'); setIsMenuOpen(false); }} className="block w-full text-left text-white text-xs font-bold uppercase tracking-widest p-2">Dashboard</button>}
            {!user ? (
              <button onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }} className="w-full bg-white text-brand-navy p-3 font-black uppercase tracking-widest text-xs">Access Portal</button>
            ) : (
              <button onClick={handleLogout} className="w-full text-brand-red p-3 font-black uppercase tracking-widest text-xs text-left">Logout</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {view === 'home' && (
          <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-100 pt-16 pb-24 border-b-2 border-slate-200">
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                <div className="absolute top-0 right-0 w-1/2 h-full border-l-2 border-brand-navy" />
                <div className="absolute top-1/2 left-0 w-full h-1/2 border-t-2 border-brand-navy" />
              </div>

              <div className="max-w-7xl mx-auto px-4 relative">
                <div className="grid md:grid-cols-12 gap-0">
                  <motion.div
                    className="md:col-span-7 pr-8"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-brand-red text-white text-[10px] px-2 py-1 font-bold uppercase tracking-widest">Official Channel</span>
                      <span className="text-slate-400 text-xs font-mono uppercase">EST. 2026</span>
                    </div>
                    <h1 className="text-7xl font-black leading-none mb-8 uppercase text-brand-navy tracking-tighter">
                      National <br/> <span className="text-brand-red">Super Jackpot</span>
                    </h1>
                    <p className="text-slate-600 text-base mb-10 max-w-lg font-bold leading-relaxed">
                      EASY VERIFICATION. FAST RESULTS. SECURE WITHDRAWALS. APPLY FOR YOUR FREE TICKET TODAY.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <button 
                        onClick={handleApplyClick}
                        className="geometric-btn-primary"
                      >
                        Start Application
                      </button>
                      <button 
                        onClick={() => document.getElementById('latest-draws')?.scrollIntoView({ behavior: 'smooth' })}
                        className="geometric-btn-secondary h-full flex items-center px-8"
                      >
                        Recent Results
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="md:col-span-5 mt-12 md:mt-0 flex flex-col justify-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="bg-brand-navy p-10 text-white border-l-8 border-brand-red shadow-2xl relative">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Trophy className="w-16 h-16" />
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-red mb-2">Estimated Pool</p>
                      <h2 className="text-5xl font-black mb-6">$2,450,000</h2>
                      <div className="w-full bg-white/10 h-1 mb-8">
                        <div className="bg-brand-red h-full w-[70%]" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Next Draw</p>
                          <p className="text-lg font-mono font-bold">04:22:18</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-white/40 mb-1">State</p>
                          <p className="text-lg font-bold tracking-tight">Active</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Checker & Results */}
            <section className="py-20 bg-white" id="latest-draws">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-12 gap-0 border-2 border-slate-100">
                  <div className="lg:col-span-8 p-8 md:p-12 border-r-2 border-slate-100">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-2 h-8 bg-brand-red" />
                      <h2 className="text-3xl font-black uppercase text-brand-navy">Draw History</h2>
                    </div>
                    <DrawResults />
                  </div>
                  <div className="lg:col-span-4 bg-slate-50 p-8 md:p-12">
                    <h2 className="text-3xl font-black uppercase text-brand-navy mb-8">Check My Ticket</h2>
                    <TicketChecker />
                    
                    <div className="mt-12 bg-white p-6 border-l-4 border-brand-navy">
                      <h3 className="text-xs font-black uppercase tracking-widest mb-4">Guidelines</h3>
                      <ul className="space-y-4">
                        {[
                          "One application per social security number",
                          "Verified ID documentation required",
                          "Winning notification via priority email"
                        ].map((text, idx) => (
                          <li key={idx} className="flex items-start space-x-3 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                            <span className="text-brand-red">•</span>
                            <span>{text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {view === 'apply' && (
          <section className="py-16 md:py-24 px-4 bg-slate-100 flex items-center justify-center">
            <ApplicationForm 
              onSuccess={() => setView('dashboard')} 
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          </section>
        )}

        {view === 'dashboard' && user && (
          <section className="py-16 px-4 bg-slate-100 min-h-screen">
            <UserDashboard />
          </section>
        )}

        {view === 'admin' && isAdmin && (
          <section className="py-16 px-4 bg-slate-100 min-h-screen">
            <AdminDashboard />
          </section>
        )}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* Bottom Ticker */}
      <div className="bg-brand-navy text-white h-12 flex items-center overflow-hidden border-t-2 border-white/5">
        <div className="flex whitespace-nowrap gap-12 text-[10px] font-black uppercase tracking-[0.2em] px-8">
          <span>• NO PURCHASE NECESSARY TO ENTER</span>
          <span className="text-brand-red">• DRAW #882 CLOSING SOON</span>
          <span>• SECURE IDENTITY VERIFICATION POWERED BY USA-AUTH</span>
          <span className="text-brand-red">• WINNERS NOTIFIED VIA EMAIL</span>
          <span>• PLAY RESPONSIBLY</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-brand-navy py-16 border-t-8 border-brand-red">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-8">
                <div className="w-10 h-10 bg-white flex items-center justify-center">
                  <div className="w-5 h-5 bg-brand-red rotate-45"></div>
                </div>
                <span className="text-white font-black text-2xl tracking-tighter uppercase italic">USA<span className="text-brand-red">LUCKY</span>DRAW</span>
              </div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-loose max-w-sm">
                THE PREMIER SECURE DIGITAL SWEEPSTAKES HUB. FEDERALLY COMPLIANT IDENTITY VERIFICATION SYSTEM. TRANSPARENT SELECTION ALGORITHMS.
              </p>
            </div>
            <div>
              <h4 className="text-white font-black uppercase text-xs tracking-widest mb-8 text-brand-red">Resource Hub</h4>
              <ul className="space-y-4">
                <li><button onClick={() => setView('home')} className="text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Past Results</button></li>
                <li><button onClick={() => setView('apply')} className="text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Apply Free</button></li>
                {isAdmin && <li><button onClick={() => setView('admin')} className="text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Admin Console</button></li>}
                <li><button className="text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Verification Rules</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black uppercase text-xs tracking-widest mb-8 text-brand-red">Official Support</h4>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">VERIFICATION@USADRAW.GOV</p>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">1-800-OFFICIAL-DRAW</p>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-white/20 text-[8px] font-black uppercase tracking-[0.3em]">
            <p>© 2026 USA LUCKY DRAW DIVISION. ALL RIGHTS RESERVED.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <p>PRIVACY PROTOCOL</p>
              <p>SECURITY OPS</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
