
import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  Download, 
  Terminal, 
  ShieldCheck, 
  History, 
  ChevronRight,
  AlertCircle,
  Cpu,
  Info,
  Server
} from 'lucide-react';

interface UpdateLog {
  timestamp: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'ERROR' | 'MIGRATION';
}

export const UpdatesPage: React.FC = () => {
  const [currentVersion] = useState("v2.4.12-LTS");
  const [latestVersion, setLatestVersion] = useState("v2.4.12-LTS");
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [logs, setLogs] = useState<UpdateLog[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (message: string, type: UpdateLog['type'] = 'INFO') => {
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), message, type }]);
  };

  const checkForUpdates = () => {
    setIsChecking(true);
    addLog("Connecting to Astra Distribution Server...");
    
    setTimeout(() => {
      setLatestVersion("v2.5.0-PRO");
      addLog("New version found: v2.5.0-PRO (Major Update)", "SUCCESS");
      addLog("Security Patches: 3, Database Schema Changes: 2");
      setIsChecking(false);
    }, 1500);
  };

  const startUpdateProcess = async () => {
    setIsUpdating(true);
    setProgress(0);
    setLogs([]);

    const steps = [
      { msg: "Initiating Pre-Update Backup...", p: 10, type: 'INFO' },
      { msg: "Backup encrypted & stored: astra_pre_update_v2.5.0.bak", p: 20, type: 'SUCCESS' },
      { msg: "Downloading patch binaries (14.2 MB)...", p: 40, type: 'INFO' },
      { msg: "Verifying GPG Signature...", p: 50, type: 'SUCCESS' },
      { msg: "Starting Database Migration Runner...", p: 60, type: 'MIGRATION' },
      { msg: "Executing: ALTER TABLE sales_headers ADD COLUMN loyalty_points...", p: 70, type: 'MIGRATION' },
      { msg: "Executing: CREATE INDEX idx_loyalty_customer ON sales_headers...", p: 85, type: 'MIGRATION' },
      { msg: "Finalizing schema version 1.4.2...", p: 95, type: 'SUCCESS' },
      { msg: "System Ready. Please restart application.", p: 100, type: 'SUCCESS' }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 800));
      addLog(step.msg, step.type as UpdateLog['type']);
      setProgress(step.p);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Software Update Center</h2>
          <p className="text-slate-500 text-sm">Manage system patches and database schema migrations.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">
           Terminal ID: AST-SRV-991
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Status Dashboard */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-8 flex flex-col items-center text-center">
               <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl transition-all ${latestVersion !== currentVersion ? 'bg-amber-500 text-white rotate-3' : 'bg-emerald-500 text-white'}`}>
                  {latestVersion !== currentVersion ? <AlertCircle size={40} /> : <CheckCircle2 size={40} />}
               </div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  {latestVersion !== currentVersion ? "Update Available" : "System Up to Date"}
               </h3>
               <p className="text-xs text-slate-500 mt-2 font-medium">Current Build: {currentVersion}</p>
            </div>
            
            <div className="px-8 pb-8 space-y-4">
               {latestVersion !== currentVersion ? (
                 <button 
                  onClick={startUpdateProcess}
                  disabled={isUpdating}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-900/20"
                 >
                   <Download size={18} /> INSTALL v2.5.0-PRO
                 </button>
               ) : (
                 <button 
                  onClick={checkForUpdates}
                  disabled={isChecking}
                  className="w-full py-4 bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all"
                 >
                   <RefreshCw size={18} className={isChecking ? 'animate-spin' : ''} /> 
                   {isChecking ? "CHECKING..." : "CHECK FOR UPDATES"}
                 </button>
               )}
            </div>

            <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase">Binary Verified</span>
               </div>
               <div className="flex items-center gap-2">
                  <Server size={16} className="text-blue-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase">CDN: Mumbai-01</span>
               </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/30">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
             <Info size={24} className="mb-4 text-indigo-200" />
             <h4 className="font-black text-lg mb-2">Release Notes v2.5.0</h4>
             <ul className="text-[10px] font-medium text-indigo-100 space-y-2 mb-6 leading-relaxed">
                <li className="flex gap-2"><ChevronRight size={12} className="shrink-0 text-white" /> AI Demand forecast accuracy improved by 12%</li>
                <li className="flex gap-2"><ChevronRight size={12} className="shrink-0 text-white" /> Loyalty points integration for retail billing</li>
                <li className="flex gap-2"><ChevronRight size={12} className="shrink-0 text-white" /> Fix for thermal printer margin on Schedule X logs</li>
             </ul>
             <button className="text-[10px] font-black uppercase tracking-widest text-indigo-200 hover:text-white transition-colors">View Full Changelog</button>
          </div>
        </div>

        {/* Console / Migration Runner Output */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[600px] border border-slate-800">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-4">
                  <Terminal size={14} /> Update Runner Output
                </span>
              </div>
              <div className="flex items-center gap-2">
                 <Cpu size={14} className="text-slate-500" />
                 <span className="text-[10px] font-mono text-slate-500 uppercase">Thread: MAIN_WORKER</span>
              </div>
            </div>

            <div className="flex-1 p-6 font-mono text-xs overflow-y-auto space-y-2 scrollbar-hide">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-700">
                   <Terminal size={48} className="mb-4 opacity-20" />
                   <p className="font-bold opacity-30">Waiting for update sequence...</p>
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <span className="text-slate-600 shrink-0 font-bold select-none">[{log.timestamp}]</span>
                    <span className={`
                      ${log.type === 'SUCCESS' ? 'text-emerald-400' : ''}
                      ${log.type === 'ERROR' ? 'text-red-400' : ''}
                      ${log.type === 'MIGRATION' ? 'text-blue-400' : 'text-slate-300'}
                      font-medium leading-relaxed
                    `}>
                      <span className="text-slate-500 mr-2 opacity-50">$</span> {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>

            {isUpdating && (
              <div className="p-8 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
                 <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Running Patch Delta...</span>
                    <span className="text-lg font-black text-white">{progress}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500" style={{width: `${progress}%`}}></div>
                 </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                   <History size={24} />
                </div>
                <div>
                   <h4 className="font-bold text-slate-800 text-sm">Last Successful Migration</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Version 1.4.1 • 14-Jan-2025 • Applied by root</p>
                </div>
             </div>
             <button className="text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center gap-2">
                Migration History <ChevronRight size={14} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
