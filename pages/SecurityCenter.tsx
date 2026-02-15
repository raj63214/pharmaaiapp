
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Eye, 
  EyeOff, 
  History, 
  Fingerprint, 
  Database, 
  Server, 
  Wifi, 
  Activity,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  ShieldIcon
} from 'lucide-react';

export const SecurityCenterPage: React.FC = () => {
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const runSecurityScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Security Hardening Dashboard</h2>
          <p className="text-slate-500 text-sm font-medium">Enterprise Data Integrity & Cyber-Defense Monitoring.</p>
        </div>
        <button 
          onClick={runSecurityScan}
          disabled={isScanning}
          className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isScanning ? <ShieldCheck className="animate-pulse" size={18} /> : <Activity size={18} />}
          {isScanning ? "Scanning Core..." : "Run Security Audit"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SecurityStat icon={<Lock className="text-emerald-500" />} label="AES-256 Encryption" status="Active" detail="Field-level enabled" />
        <SecurityStat icon={<ShieldCheck className="text-blue-500" />} label="Audit Immutability" status="Verified" detail="Hash-chain consistent" />
        <SecurityStat icon={<Wifi className="text-indigo-500" />} label="Network Isolation" status="Protected" detail="LAN Only Restriction" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Encryption Demo & PII Protection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                    <Fingerprint size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-tight">Data Obfuscation Engine</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">PII Masking & Encryption at Rest</p>
                  </div>
               </div>
               <button 
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all"
               >
                 {showSensitiveData ? <EyeOff size={14} /> : <Eye size={14} />}
                 {showSensitiveData ? "Mask PII" : "Decrypt View"}
               </button>
            </div>
            
            <div className="p-8">
               <table className="w-full text-xs">
                  <thead className="text-slate-400 font-black uppercase tracking-tighter">
                    <tr className="border-b border-slate-100">
                      <th className="pb-4 text-left">Record Type</th>
                      <th className="pb-4 text-left">Sensitive Value (Raw State)</th>
                      <th className="pb-4 text-right">Security Layer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <PIIRow type="Customer Mobile" value="9876543210" isVisible={showSensitiveData} layer="AES-256" />
                    <PIIRow type="Purchase Rate" value="₹452.50 / Unit" isVisible={showSensitiveData} layer="Field-RSA" />
                    <PIIRow type="Vendor Tax ID" value="27AAACR9981M1Z" isVisible={showSensitiveData} layer="GCM-Auth" />
                    <PIIRow type="Wholesale Margin" value="12.4%" isVisible={showSensitiveData} layer="AES-256" />
                  </tbody>
               </table>
               
               <div className="mt-8 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex gap-4">
                  <Lock className="text-emerald-600 shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-black text-emerald-900">Zero-Leakage Architecture</p>
                    <p className="text-[10px] text-emerald-700 leading-relaxed font-medium mt-1">
                      Encryption keys are generated per session and never stored in plain text. Even with root access to the database, the data remains a 256-bit randomized string.
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <ShieldAlert className="text-amber-500 mb-6" size={32} />
            <h4 className="text-xl font-black mb-3 tracking-tight uppercase">Threat Prevention Log</h4>
            <div className="space-y-3">
               <ThreatItem time="02:14 PM" event="Rapid Inventory Export Blocked" origin="IP: 192.168.1.42" action="Rate Limit" />
               <ThreatItem time="11:05 AM" event="SQL Pattern Detected (Injection Attempt)" origin="Search Bar" action="Neutralized" />
               <ThreatItem time="Yesterday" event="Unrecognized Terminal ID Sync" origin="WiFi-Terminal-09" action="Denied" />
            </div>
          </div>
        </div>

        {/* Audit Shield */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <History className="text-indigo-600" size={24} />
                  <h3 className="font-black text-slate-800 uppercase tracking-tight">Immutable Audit Shield</h3>
               </div>
               <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                  <FileCheck size={12} /> Chain Verified
               </div>
            </div>

            <div className="flex-1 space-y-4">
               <AuditItem user="admin_root" action="DELETED BATCH #B122" time="10m ago" severity="CRITICAL" hash="7f88...a12" />
               <AuditItem user="cashier_01" action="RE-PRINTED BILL #1204" time="1hr ago" severity="LOW" hash="3d12...c99" />
               <AuditItem user="admin_root" action="UPDATED WHOLESALE TAX" time="3hr ago" severity="HIGH" hash="9a44...e44" />
               <AuditItem user="pharmacist_99" action="MODIFIED MIN STOCK LVL" time="5hr ago" severity="MEDIUM" hash="11b2...f21" />
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
               <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  <span>Audit Log Integrity Index</span>
                  <span className="text-emerald-600">99.99% SECURE</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[99.99%]"></div>
               </div>
               <button className="w-full mt-6 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-600 transition-all flex items-center justify-center gap-2">
                 Generate Compliance Log Export <ChevronRight size={14} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecurityStat = ({icon, label, status, detail}: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-lg transition-all border-b-4 border-b-transparent hover:border-b-indigo-500">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="font-black text-slate-900 text-sm mt-1">{status}</p>
      <p className="text-[10px] text-slate-400 font-bold italic">{detail}</p>
    </div>
  </div>
);

const PIIRow = ({type, value, isVisible, layer}: any) => (
  <tr className="group">
    <td className="py-4 text-slate-500 font-bold uppercase tracking-tighter">{type}</td>
    <td className="py-4">
      {isVisible ? (
        <span className="font-mono text-slate-900 font-black">{value}</span>
      ) : (
        <span className="font-mono text-slate-300 select-none bg-slate-100 px-2 rounded blur-[3px]">
          {Array(15).fill('x').join('')}
        </span>
      )}
    </td>
    <td className="py-4 text-right">
      <span className="text-[8px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 uppercase tracking-widest">
        {layer}
      </span>
    </td>
  </tr>
);

const ThreatItem = ({time, event, origin, action}: any) => (
  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
     <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"></div>
        <div>
           <p className="text-xs font-black text-indigo-100 tracking-tight">{event}</p>
           <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{time} • {origin}</p>
        </div>
     </div>
     <div className="text-[10px] font-black text-amber-500 uppercase bg-amber-500/10 px-3 py-1 rounded-lg">
        {action}
     </div>
  </div>
);

const AuditItem = ({user, action, time, severity, hash}: any) => {
  const sevColors: any = {
    CRITICAL: 'bg-red-50 text-red-600 border-red-100',
    HIGH: 'bg-amber-50 text-amber-600 border-amber-100',
    MEDIUM: 'bg-blue-50 text-blue-600 border-blue-100',
    LOW: 'bg-slate-50 text-slate-500 border-slate-100'
  };

  return (
    <div className="p-4 rounded-2xl border border-slate-50 hover:bg-slate-50/50 transition-all cursor-default">
       <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-[8px] font-black text-white">
                {user[0].toUpperCase()}
             </div>
             <p className="text-[11px] font-black text-slate-800 tracking-tight">{user}</p>
          </div>
          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${sevColors[severity]}`}>
            {severity}
          </span>
       </div>
       <p className="text-[10px] font-bold text-slate-600 uppercase mb-2">{action}</p>
       <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-400 font-medium">{time}</span>
          <span className="text-[9px] font-mono text-slate-300 font-black tracking-tighter flex items-center gap-1 bg-slate-100 px-1.5 rounded">
            <Lock size={8} /> {hash}
          </span>
       </div>
    </div>
  );
};
