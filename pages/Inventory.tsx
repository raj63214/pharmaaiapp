
import React, { useState } from 'react';
import { Search, Plus, Filter, Download, Package, Lock, Unlock, ShieldAlert, Edit3 } from 'lucide-react';

interface InventoryProps {
  onTriggerJob?: (name: string) => void;
  role?: 'ADMIN' | 'PHARMACIST' | 'CASHIER';
  // Fix: Added activePharmacy to InventoryProps to match usage in App.tsx
  activePharmacy?: any;
}

export const InventoryPage: React.FC<InventoryProps> = ({ onTriggerJob, role = 'ADMIN', activePharmacy }) => {
  const [isMasterEditMode, setIsMasterEditMode] = useState(false);
  const isAdmin = role === 'ADMIN';

  const handleExport = () => {
    if (onTriggerJob) {
      onTriggerJob("Exporting Inventory Master to CSV");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Medicine Master</h2>
          <p className="text-slate-500 text-sm font-medium">Manage stock levels, manufacturers, and compliance categories.</p>
        </div>
        <div className="flex items-center gap-3">
           {isAdmin && (
             <button 
               onClick={() => setIsMasterEditMode(!isMasterEditMode)}
               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 border ${
                 isMasterEditMode ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
               }`}
             >
               {isMasterEditMode ? <Unlock size={18} /> : <Lock size={18} />}
               {isMasterEditMode ? 'Master Edit ON' : 'Admin Edit Mode'}
             </button>
           )}
           <button 
             onClick={handleExport}
             className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all active:scale-95"
           >
             <Download size={18} /> Export Master
           </button>
           {isAdmin && (
             <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-900/20 transition-all active:scale-95">
               <Plus size={18} /> Add New Entry
             </button>
           )}
        </div>
      </div>

      {!isAdmin && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
           <ShieldAlert className="text-blue-500" size={18} />
           <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Read-Only Access: Master data editing is restricted to Admin personnel.</p>
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between px-8">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by Name, Salt, or Category..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            <Filter size={16} /> Advanced Filtering
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-tighter border-b text-[10px]">
              <tr>
                <th className="p-6 pl-10">Medicine Item</th>
                <th className="p-6">Category</th>
                <th className="p-6">HSN / Tax</th>
                <th className="p-6">Salt Composition</th>
                <th className="p-6">Schedule</th>
                <th className="p-6">Min. Stock</th>
                <th className="p-6 text-center pr-10">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <MedicineRow isEditable={isMasterEditMode} name="Calpol 500mg" category="Tablet" hsn="3004 / 12%" salt="Paracetamol" schedule="H" min="100" />
              <MedicineRow isEditable={isMasterEditMode} name="Azithral 500" category="Capsule" hsn="3004 / 18%" salt="Azithromycin" schedule="H" min="50" />
              <MedicineRow isEditable={isMasterEditMode} name="Benadryl DR" category="Syrup" hsn="3004 / 12%" salt="Dextromethorphan" schedule="NONE" min="20" />
              <MedicineRow isEditable={isMasterEditMode} name="Vicks Inhaler" category="Others" hsn="3307 / 12%" salt="Menthol/Camphor" schedule="NONE" min="10" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MedicineRow: React.FC<{isEditable: boolean, name: string, category: string, hsn: string, salt: string, schedule: string, min: string}> = ({isEditable, name, category, hsn, salt, schedule, min}) => (
  <tr className="hover:bg-slate-50 transition-colors group cursor-default">
    <td className="p-6 pl-10">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
          <Package className="text-emerald-600 w-5 h-5" />
        </div>
        <div>
          <span className="font-black text-slate-800 tracking-tight">{name}</span>
          {isEditable && <Edit3 size={10} className="text-indigo-400 ml-2 inline" />}
        </div>
      </div>
    </td>
    <td className="p-6 text-slate-500 font-bold uppercase text-[11px] tracking-tight">{category}</td>
    <td className="p-6 font-mono text-slate-500 text-[11px]">{hsn}</td>
    <td className="p-6 italic text-slate-400 text-xs tracking-tight">{salt}</td>
    <td className="p-6">
      <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest ${schedule === 'NONE' ? 'bg-slate-100 text-slate-400' : 'bg-red-50 text-red-600 border border-red-100'}`}>
        {schedule}
      </span>
    </td>
    <td className="p-6 font-black text-slate-700">{min} <span className="text-[10px] text-slate-400">UNITS</span></td>
    <td className="p-6 text-center pr-10">
      <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
        {isEditable ? 'Quick Update' : 'Manage'}
      </button>
    </td>
  </tr>
);