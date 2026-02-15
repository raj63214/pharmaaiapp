
import React, { useState } from 'react';
import { Plus, Search, Trash2, Save, Building2, Package, ClipboardList, AlertCircle } from 'lucide-react';

interface PurchaseItem {
  id: string;
  name: string;
  batch: string;
  mrp: number;
  ptr: number;
  qty: number;
  gst: number;
}

export const PurchaseEntryPage: React.FC<{ activePharmacy: any }> = ({ activePharmacy }) => {
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [vendor, setVendor] = useState({ name: '', invoiceNo: '', date: '' });

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), name: '', batch: '', mrp: 0, ptr: 0, qty: 0, gst: 12 }]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Stock Purchase Inbound</h2>
          <p className="text-slate-500 text-sm font-medium">Reconcile inventory batches for the selected branch context.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 text-[10px] font-black uppercase flex items-center gap-2">
              <Building2 size={14} /> Profile: {activePharmacy.name}
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
         <EntryInput label="Vendor Name" value={vendor.name} onChange={v => setVendor({...vendor, name: v})} />
         <EntryInput label="Invoice Number" value={vendor.invoiceNo} onChange={v => setVendor({...vendor, invoiceNo: v})} />
         <EntryInput label="Invoice Date" value={vendor.date} type="date" onChange={v => setVendor({...vendor, date: v})} />
         <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 h-full items-center">
            <AlertCircle size={20} className="text-amber-500 shrink-0" />
            <p className="text-[10px] text-amber-800 font-bold uppercase leading-tight tracking-tighter">
              Stock will be committed to <strong>{activePharmacy.name}</strong> batch master upon saving.
            </p>
         </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center px-8">
           <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm flex items-center gap-2">
             <Package size={18} className="text-emerald-500" /> Itemized Stock Entry
           </h3>
           <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
             <Plus size={16} /> Add Row
           </button>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-widest border-b text-[9px]">
               <tr>
                 <th className="p-5 pl-8">Medicine Item</th>
                 <th className="p-5">Batch ID</th>
                 <th className="p-5 text-center">Qty</th>
                 <th className="p-5 text-right">PTR (Purchase)</th>
                 <th className="p-5 text-right">MRP (Retail)</th>
                 <th className="p-5 text-center pr-8">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {items.map((item, idx) => (
                 <tr key={item.id}>
                    <td className="p-4 pl-8"><input type="text" className="w-full bg-slate-50 p-2 rounded-lg font-bold" placeholder="Start typing..." /></td>
                    <td className="p-4"><input type="text" className="w-full bg-slate-50 p-2 rounded-lg font-mono" placeholder="Batch #" /></td>
                    <td className="p-4 text-center"><input type="number" className="w-20 p-2 border border-slate-200 rounded-lg text-center font-black" /></td>
                    <td className="p-4 text-right"><input type="number" className="w-24 p-2 border border-slate-200 rounded-lg text-right font-black" placeholder="0.00" /></td>
                    <td className="p-4 text-right"><input type="number" className="w-24 p-2 border border-slate-200 rounded-lg text-right font-black" placeholder="0.00" /></td>
                    <td className="p-4 text-center pr-8"><button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></td>
                 </tr>
               ))}
               {items.length === 0 && (
                 <tr>
                    <td colSpan={6} className="p-20 text-center">
                       <ClipboardList size={48} className="mx-auto text-slate-100 mb-4" />
                       <p className="text-slate-300 font-black uppercase tracking-widest">No Items Added Yet</p>
                    </td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
           <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Consolidated Bill Value</p>
              <p className="text-2xl font-black text-white">₹0.00</p>
           </div>
           <button className="flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-500 shadow-2xl shadow-emerald-900/40 transition-all">
             <Save size={18} /> COMMIT TO {activePharmacy.name}
           </button>
        </div>
      </div>
    </div>
  );
};

const EntryInput = ({label, value, onChange, type = 'text'}: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
    />
  </div>
);
