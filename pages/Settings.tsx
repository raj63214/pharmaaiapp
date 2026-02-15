
import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Lock, 
  ShieldCheck, 
  Clock, 
  AlertTriangle,
  FileArchive,
  CheckCircle2,
  HardDrive,
  ChevronRight
} from 'lucide-react';

interface SettingsProps {
  onTriggerJob?: (name: string) => void;
}

export const SettingsPage: React.FC<SettingsProps> = ({ onTriggerJob }) => {
  const triggerBackup = () => {
    if (onTriggerJob) {
      onTriggerJob("Generating Secure Cloud Backup (AES-256)");
    }
  };

  const triggerSync = () => {
    if (onTriggerJob) {
      onTriggerJob("Syncing Local Database to LAN Node");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Disaster Recovery & Data</h2>
          <p className="text-slate-500 text-sm font-medium">Enterprise Backup Scheduling and LAN Node Synchronization.</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
          <ShieldCheck size={16} /> Hardened Backup Mode
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Backup Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
                  <Database size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Full System Snapshot</h3>
                  <p className="text-sm text-slate-500 font-medium">Encrypted backup of all sales, inventory, and immutable audit logs.</p>
                </div>
              </div>
            </div>

            <div className="p-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-emerald-100 transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Last Success State</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">Verified Stable</p>
                        <p className="text-[11px] text-slate-500 font-bold uppercase mt-1">12h ago (Daily)</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-100 transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Storage Allocation</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                        <HardDrive size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">428.5 MB Used</p>
                        <p className="text-[11px] text-slate-500 font-bold uppercase mt-1">TIER: BUSINESS (10 GB)</p>
                      </div>
                    </div>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row gap-6">
                  <button 
                    onClick={triggerBackup}
                    className="flex-1 py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/30 transition-all active:scale-95"
                  >
                    <Download size={20} /> RUN INSTANT BACKUP
                  </button>
                  <button 
                    onClick={triggerSync}
                    className="flex-1 py-6 bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all active:scale-95"
                  >
                    <RefreshCw size={20} /> SYNC TO LAN SERVER
                  </button>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm flex items-center gap-3">
                  <Clock size={18} className="text-slate-400" /> Retention Log
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">30 Day History</span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-tighter">
                    <tr>
                      <th className="p-5 pl-8">Archive Identifer</th>
                      <th className="p-5">Timestamp</th>
                      <th className="p-5">Size</th>
                      <th className="p-5">Method</th>
                      <th className="p-5 text-right pr-8">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-slate-600">
                    <BackupRow name="astra_erp_20250125_daily.bak" date="25 Jan 2025, 04:00 AM" size="12.4 MB" type="AUTO" />
                    <BackupRow name="astra_erp_20250124_daily.bak" date="24 Jan 2025, 04:00 AM" size="11.8 MB" type="AUTO" />
                    <BackupRow name="manual_migration_v1.bak" date="22 Jan 2025, 11:32 PM" size="45.2 MB" type="MANUAL" />
                  </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Restore Engine */}
        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-10 flex flex-col items-center text-center hover:border-indigo-400 transition-all">
              <div className="w-20 h-20 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-amber-600 mb-8 border border-amber-100">
                 <Upload size={40} />
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Restore Engine</h4>
              <p className="text-xs text-slate-500 mt-4 mb-10 leading-relaxed font-medium">
                Upload a verified ASTRA backup file to roll back system state. <br/>
                <span className="text-red-500 font-black uppercase block mt-2 tracking-widest">System Overwrite Trigger</span>
              </p>
              
              <div className="w-full space-y-4">
                 <button className="w-full py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                    SELECT .BAK ARCHIVE
                 </button>
                 <div className="p-6 bg-amber-50 rounded-[1.5rem] border border-amber-100 flex gap-4 text-left">
                    <AlertTriangle size={24} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-700 font-black leading-relaxed uppercase tracking-tighter">
                       Overwriting data is irreversible. All current transactions since last backup will be purged from the heap.
                    </p>
                 </div>
              </div>
           </div>

           <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <Lock className="text-indigo-400 mb-6" size={32} />
              <h4 className="font-black text-xl mb-3 uppercase tracking-tight">Encryption Vault</h4>
              <p className="text-[11px] text-indigo-200 font-bold uppercase tracking-tighter leading-relaxed mb-8">
                Every archive is bound to your Terminal ID (AST-SRV-991). Cross-terminal restores require an authorized Master Recovery Key (MRK).
              </p>
              <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 hover:translate-x-1 transition-all">
                Access Vault Controls <ChevronRight size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const BackupRow = ({name, date, size, type}: any) => (
  <tr className="hover:bg-slate-50 transition-colors cursor-default">
    <td className="p-5 pl-8 font-black text-slate-800 flex items-center gap-3">
      <FileArchive size={16} className="text-slate-300" /> {name}
    </td>
    <td className="p-5 text-slate-500">{date}</td>
    <td className="p-5 text-slate-400 font-mono tracking-tighter">{size}</td>
    <td className="p-5">
       <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${type === 'AUTO' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>{type}</span>
    </td>
    <td className="p-5 text-right pr-8">
       <button className="text-slate-300 hover:text-slate-900 transition-colors active:scale-90">
          <Download size={18} />
       </button>
    </td>
  </tr>
);
