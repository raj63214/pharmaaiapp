
import React, { useState } from 'react';
/* Added ChevronRight to imports */
import { Lock, User, Package, Terminal, ShieldCheck, ChevronRight } from 'lucide-react';

export const LoginPage: React.FC<{onLogin: (creds: any) => void, isLoading: boolean}> = ({onLogin, isLoading}) => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <Package className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">AstraPharmacy <span className="text-emerald-400">ERP</span></h1>
            <p className="text-slate-400 text-sm mt-2">Enterprise Drug Inventory & Billing System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Terminal ID / Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="admin_root"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-black rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>AUTHENTICATE SESSION <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700 grid grid-cols-2 gap-4">
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                <ShieldCheck size={14} className="text-emerald-500" /> AES-256 Encrypted
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                <Terminal size={14} className="text-emerald-500" /> Offline Sync
             </div>
          </div>
        </div>
        
        <p className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-6">
          Phase 3 Core Frontend Engine Deployment
        </p>
      </div>
    </div>
  );
};
