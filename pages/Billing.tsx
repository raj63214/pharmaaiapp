
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Printer, 
  Save, 
  Search, 
  Plus, 
  User, 
  Info, 
  Lock, 
  ShieldCheck, 
  Building2, 
  X, 
  FileText, 
  Truck,
  CheckCircle2,
  ChevronDown,
  Hash
} from 'lucide-react';

interface BillItem {
  id: string;
  name: string;
  batch: string;
  expiry: string;
  qty: number;
  rate: number;
  gst: number;
  mrp: number;
}

interface BillingProps {
  activePharmacy: any;
}

export const BillingPage: React.FC<BillingProps> = ({ activePharmacy }) => {
  const [items, setItems] = useState<BillItem[]>([]);
  const [search, setSearch] = useState('');
  const [customer, setCustomer] = useState({ name: 'Walk-in Customer', mobile: '', address: '' });
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printConfig, setPrintConfig] = useState<{ mode: 'INVOICE' | 'CHALLAN' | 'BOTH' }>({ mode: 'BOTH' });
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') { e.preventDefault(); searchInputRef.current?.focus(); }
      if (e.key === 'F8') { e.preventDefault(); handleFinalize(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items]);

  const addItem = useCallback(() => {
    const newItem: BillItem = {
      id: Math.random().toString(),
      name: 'Azithromycin 500mg (Astra)',
      batch: 'AZ-1224',
      expiry: '10/26',
      qty: 1,
      rate: 145.00,
      gst: 12,
      mrp: 180.00
    };
    setItems(prev => [...prev, newItem]);
    setSearch('');
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const handleFinalize = () => {
    if (items.length > 0) {
      setShowPrintModal(true);
    }
  };

  const totals = useMemo(() => items.reduce((acc, item) => {
    const taxable = item.rate * item.qty;
    const gst = (taxable * item.gst) / 100;
    return {
      taxable: acc.taxable + taxable,
      gst: acc.gst + gst,
      total: acc.total + taxable + gst
    };
  }, { taxable: 0, gst: 0, total: 0 }), [items]);

  const invoiceNo = useMemo(() => `AST-${activePharmacy.id}-${Date.now().toString().slice(-6)}`, [activePharmacy.id]);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in slide-in-from-right-2 duration-500">
      {/* Top Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-3 flex items-center justify-between gap-8">
          <div className="flex-1 border-r border-slate-100 pr-8">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 block">Customer Identity</label>
            <div className="flex items-center gap-3">
              <User size={18} className="text-slate-400" />
              <input 
                type="text" 
                value={customer.name}
                onChange={e => setCustomer({...customer, name: e.target.value})}
                className="font-black text-slate-800 border-none outline-none focus:ring-0 w-full text-lg tracking-tight" 
                placeholder="Walk-in Customer"
              />
            </div>
          </div>
          <div className="flex-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 block">Accounting Context</label>
             <div className="flex items-center gap-3">
               <Building2 size={18} className="text-indigo-600" />
               <div>
                 <p className="font-black text-slate-800 text-sm truncate">{activePharmacy?.name}</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase">GST: {activePharmacy?.gstin}</p>
               </div>
             </div>
          </div>
        </div>
        <div className="bg-emerald-600 p-6 rounded-2xl shadow-xl shadow-emerald-900/20 text-white flex flex-col justify-center items-end relative overflow-hidden">
          <span className="text-[10px] font-black opacity-80 uppercase tracking-[0.2em] relative z-10">Total Payable</span>
          <span className="text-4xl font-black relative z-10 tracking-tighter">₹{totals.total.toFixed(2)}</span>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between px-8">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
            <input 
              ref={searchInputRef}
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="F2 to Search Medicines..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
              onKeyDown={e => e.key === 'Enter' && addItem()}
            />
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1"><kbd className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">F2</kbd> Find</span>
            <span className="flex items-center gap-1"><kbd className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">F8</kbd> Finalize</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 sticky top-0 font-black uppercase tracking-tighter z-10 border-b">
              <tr>
                <th className="p-4 pl-8">#</th>
                <th className="p-4">Medicine Item</th>
                <th className="p-4">Batch ID</th>
                <th className="p-4 text-center">Qty</th>
                <th className="p-4 text-right">Net Amt</th>
                <th className="p-4 text-center pr-8">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item, idx) => (
                <MemoizedBillRow key={item.id} idx={idx} item={item} onRemove={removeItem} />
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-32 text-center text-slate-400">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingCart size={32} className="opacity-10" />
                    </div>
                    <p className="text-lg font-black text-slate-300 uppercase tracking-widest">Transaction Queue Empty</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Action Bar */}
        <div className="p-8 bg-slate-50 border-t border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-3 flex gap-8">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Taxable Val</p>
                <p className="font-black text-slate-800">₹{totals.taxable.toFixed(2)}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">GST Liability</p>
                <p className="font-black text-emerald-600">₹{totals.gst.toFixed(2)}</p>
             </div>
          </div>
          
          <div className="md:col-span-5 flex items-center justify-center">
             <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                <button 
                  onClick={() => setPrintConfig({ mode: 'INVOICE' })}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${printConfig.mode === 'INVOICE' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <FileText size={14} /> Tax Invoice
                </button>
                <button 
                  onClick={() => setPrintConfig({ mode: 'CHALLAN' })}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${printConfig.mode === 'CHALLAN' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Truck size={14} /> Neutral Challan
                </button>
                <button 
                  onClick={() => setPrintConfig({ mode: 'BOTH' })}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${printConfig.mode === 'BOTH' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Printer size={14} /> Dual Mode
                </button>
             </div>
          </div>

          <div className="md:col-span-4 flex items-center gap-3 justify-end">
             <button 
               onClick={handleFinalize}
               className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 shadow-2xl shadow-emerald-900/40 transition-all text-xs uppercase tracking-widest active:scale-95"
             >
                <Save size={18} /> SAVE & PRINT (F8)
             </button>
          </div>
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300 overflow-y-auto">
           <div className="bg-slate-100 w-full max-w-5xl my-auto rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
              <div className="p-8 bg-white border-b border-slate-200 flex items-center justify-between">
                 <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Print Preview Dashboard</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                     Rendering {printConfig.mode === 'BOTH' ? 'Invoice + Neutral Challan' : printConfig.mode} for {activePharmacy.name}
                   </p>
                 </div>
                 <button onClick={() => setShowPrintModal(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all">
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 bg-slate-200/50 custom-scrollbar max-h-[70vh]">
                 <div className="max-w-4xl mx-auto space-y-12">
                    {/* Invoice Template (Full details) */}
                    {(printConfig.mode === 'INVOICE' || printConfig.mode === 'BOTH') && (
                      <div className="bg-white p-12 shadow-2xl rounded-sm border border-slate-100 print-area overflow-hidden">
                        <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-slate-900">
                          <div>
                            <h4 className="text-2xl font-black text-slate-900 uppercase">{activePharmacy?.legalName || activePharmacy?.name}</h4>
                            <p className="text-xs text-slate-600 mt-1 max-w-xs">{activePharmacy?.address}</p>
                            <p className="text-xs font-black text-indigo-600 mt-2 uppercase">GSTIN: {activePharmacy?.gstin}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Drug License: {activePharmacy?.dlNo || 'MH-Z5-21-99801'}</p>
                          </div>
                          <div className="text-right">
                             <h2 className="text-4xl font-black text-slate-900 opacity-10 uppercase tracking-tighter mb-2">Tax Invoice</h2>
                             <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Inv: {invoiceNo}</p>
                             <p className="text-xs text-slate-400 font-bold mt-1 uppercase">Date: {new Date().toLocaleDateString('en-IN')}</p>
                          </div>
                        </div>

                        <div className="mb-8 p-4 bg-slate-50 rounded-xl">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Billed To:</p>
                            <p className="font-black text-slate-800 text-lg uppercase tracking-tight">{customer.name}</p>
                        </div>

                        <table className="w-full text-left mb-8">
                           <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-tighter">
                             <tr>
                               <th className="p-3">Item Description</th>
                               <th className="p-3">Batch/Exp</th>
                               <th className="p-3 text-center">Qty</th>
                               <th className="p-3 text-right">Rate</th>
                               <th className="p-3 text-right">Tax%</th>
                               <th className="p-3 text-right">Total</th>
                             </tr>
                           </thead>
                           <tbody className="text-xs divide-y divide-slate-100">
                             {items.map(item => (
                               <tr key={item.id}>
                                 <td className="p-3 font-black text-slate-800">{item.name}</td>
                                 <td className="p-3 font-mono text-slate-400">{item.batch} / {item.expiry}</td>
                                 <td className="p-3 text-center">{item.qty}</td>
                                 <td className="p-3 text-right">₹{item.rate.toFixed(2)}</td>
                                 <td className="p-3 text-right">{item.gst}%</td>
                                 <td className="p-3 text-right font-black">₹{(item.rate * item.qty * (1 + item.gst/100)).toFixed(2)}</td>
                               </tr>
                             ))}
                           </tbody>
                        </table>

                        <div className="flex justify-end pt-8 border-t-2 border-slate-900">
                           <div className="w-64 space-y-2">
                              <div className="flex justify-between text-xs">
                                 <span className="text-slate-500 font-bold uppercase tracking-widest">Taxable Subtotal</span>
                                 <span className="font-black">₹{totals.taxable.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                 <span className="text-slate-500 font-bold uppercase tracking-widest">Output GST</span>
                                 <span className="font-black">₹{totals.gst.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-xl pt-4 border-t-2 border-slate-100">
                                 <span className="font-black text-slate-900 uppercase tracking-tighter">Total</span>
                                 <span className="font-black text-emerald-600">₹{totals.total.toFixed(2)}</span>
                              </div>
                           </div>
                        </div>

                        <div className="mt-12 text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed border-t border-slate-100 pt-6">
                           <p>E.& O.E. Goods once sold will not be returned. Computer generated Tax Invoice.</p>
                           <p className="mt-4 text-slate-400 italic">Signature: _________________________</p>
                        </div>
                      </div>
                    )}

                    {/* Delivery Challan (Neutral - Strict exclusion of firm details) */}
                    {(printConfig.mode === 'CHALLAN' || printConfig.mode === 'BOTH') && (
                      <div className="bg-white p-12 shadow-2xl rounded-sm border border-slate-100 print-area overflow-hidden">
                        <div className="flex justify-between items-center mb-8 pb-8 border-b-2 border-slate-900">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                               <Truck size={24} />
                            </div>
                            <div>
                               <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Delivery Challan</h2>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Non-Commercial Document / Goods Transit</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-black text-slate-600 uppercase tracking-widest">DC: DC-{Date.now().toString().slice(-6)}</p>
                             <p className="text-xs text-slate-400 font-bold mt-1 uppercase">Date: {new Date().toLocaleDateString('en-IN')}</p>
                          </div>
                        </div>

                        {/* EXCEPTION: NO FIRM NAME, NO FIRM GST, NO FIRM ADDRESS DISPLAYED HERE */}

                        <div className="mb-10 p-8 bg-slate-100 rounded-[1.5rem] border border-slate-200">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ship To / Handover To:</p>
                           <p className="font-black text-slate-800 text-2xl uppercase tracking-tight">{customer.name}</p>
                           <p className="text-xs text-slate-500 mt-1 font-medium">{customer.mobile}</p>
                        </div>

                        <table className="w-full text-left mb-16">
                           <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                             <tr>
                               <th className="p-5 rounded-l-xl">Description of Articles</th>
                               <th className="p-5 text-center">Batch ID</th>
                               <th className="p-5 text-center rounded-r-xl">Quantity (Units)</th>
                             </tr>
                           </thead>
                           <tbody className="text-sm divide-y divide-slate-100 font-bold text-slate-700">
                             {items.map(item => (
                               <tr key={item.id}>
                                 <td className="p-5">{item.name}</td>
                                 <td className="p-5 text-center font-mono text-slate-400">{item.batch}</td>
                                 <td className="p-5 text-center text-xl font-black">{item.qty}</td>
                               </tr>
                             ))}
                           </tbody>
                        </table>

                        <div className="mt-24 grid grid-cols-2 gap-16">
                           <div className="pt-8 border-t-2 border-slate-200">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receiver's Signature & Stamp</p>
                           </div>
                           <div className="pt-8 border-t-2 border-slate-200 text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Dispatch Officer</p>
                           </div>
                        </div>
                      </div>
                    )}
                 </div>
              </div>

              <div className="p-8 bg-white border-t border-slate-200 flex items-center justify-between">
                 <div className="flex items-center gap-3 text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                    <CheckCircle2 size={16} /> Print Buffer Sync Complete
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setShowPrintModal(false)}
                      className="px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-slate-900 hover:text-slate-900 transition-all"
                    >
                       Cancel
                    </button>
                    <button 
                      onClick={() => {
                        window.print();
                        setShowPrintModal(false);
                        setItems([]); 
                      }}
                      className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 hover:scale-105 transition-all"
                    >
                       PRINT NOW <Printer size={18} className="inline ml-2" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const MemoizedBillRow = React.memo(({ idx, item, onRemove }: any) => (
  <tr className="hover:bg-slate-50 transition-colors group">
    <td className="p-4 pl-8 text-slate-400 font-mono font-black">{idx + 1}</td>
    <td className="p-4">
      <p className="font-black text-slate-800 text-sm tracking-tight">{item.name}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase">HSN: 3004</p>
    </td>
    <td className="p-4 font-mono font-bold text-slate-400 uppercase">{item.batch}</td>
    <td className="p-4 text-center">
      <input type="number" defaultValue={item.qty} className="w-16 p-1.5 border border-slate-200 rounded-lg text-center font-black focus:ring-2 focus:ring-emerald-500 outline-none" />
    </td>
    <td className="p-4 text-right font-black text-slate-500">₹{item.rate.toFixed(2)}</td>
    <td className="p-4 text-right font-black text-slate-900 text-sm">₹{(item.rate * item.qty * (1 + item.gst/100)).toFixed(2)}</td>
    <td className="p-4 text-center pr-8">
      <button onClick={() => onRemove(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors bg-white border border-transparent hover:border-red-100 rounded-lg">
        <Trash2 size={16} />
      </button>
    </td>
  </tr>
));
