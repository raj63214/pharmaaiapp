
import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  FileCheck, 
  Globe, 
  Image as ImageIcon, 
  ShieldCheck, 
  CreditCard, 
  Landmark, 
  Plus, 
  ChevronRight, 
  Trash2,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../App';

interface OrganizationProfileProps {
  onTriggerJob?: (name: string) => void;
}

export const OrganizationProfilePage: React.FC<OrganizationProfileProps> = ({ onTriggerJob }) => {
  const { pharmacies, activePharmacy, setActivePharmacy, addPharmacy } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: 'New Pharmacy Branch',
    legalName: '',
    gstin: '',
    dlNo: '',
    fssai: '',
    address: '',
    pincode: '',
    phone: '',
    email: '',
    website: '',
    bankName: '',
    accountNo: '',
    ifsc: '',
    branch: ''
  });

  const handleSave = () => {
    if (onTriggerJob) {
      onTriggerJob(isCreating ? "Creating New Pharmacy Profile" : "Updating Branch Metadata");
    }
    if (isCreating) {
      addPharmacy({
        id: Math.random().toString(),
        name: formData.name,
        gstin: formData.gstin,
        address: formData.address
      });
      setIsCreating(false);
    }
  };

  if (!isCreating && !editingId) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pharmacy Network</h2>
            <p className="text-slate-500 text-sm font-medium">Manage multiple branches, accounting entities, and legal profiles.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
          >
            <Plus size={18} /> Add New Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pharmacies.map(p => (
            <div 
              key={p.id}
              className={`p-6 bg-white rounded-[2.5rem] border-2 transition-all group relative ${activePharmacy?.id === p.id ? 'border-emerald-500 shadow-xl shadow-emerald-900/5' : 'border-slate-100 hover:border-slate-300'}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activePharmacy?.id === p.id ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                  <Building2 size={24} />
                </div>
                {activePharmacy?.id === p.id && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest">
                    <CheckCircle size={10} /> Active Session
                  </span>
                )}
              </div>
              
              <h4 className="text-xl font-black text-slate-900 tracking-tight mb-1">{p.name}</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                GST: <span className="text-slate-600">{p.gstin}</span>
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-4">
                <button 
                  onClick={() => setActivePharmacy(p)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePharmacy?.id === p.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  {activePharmacy?.id === p.id ? 'Context Active' : 'Switch To Profile'}
                </button>
                <button 
                  onClick={() => setEditingId(p.id)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all border border-slate-200"
                >
                  <Save size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => { setIsCreating(false); setEditingId(null); }}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{isCreating ? 'Create Pharmacy Profile' : 'Modify Branch Details'}</h2>
            <p className="text-slate-500 text-sm font-medium">Define legal identity, tax registration, and billing context.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all active:scale-95"
        >
          <Save size={18} /> {isCreating ? 'Save New Profile' : 'Update Metadata'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Branding & Legal */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
               <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm flex items-center gap-3">
                 <Building2 size={18} className="text-indigo-600" /> Identity & Branding
               </h3>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
               <ProfileInput label="Branch/Pharmacy Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
               <ProfileInput label="Registered Legal Entity" value={formData.legalName} onChange={v => setFormData({...formData, legalName: v})} />
               <ProfileInput label="GSTIN" value={formData.gstin} onChange={v => setFormData({...formData, gstin: v})} />
               <ProfileInput label="Drug License (DL) No." value={formData.dlNo} onChange={v => setFormData({...formData, dlNo: v})} />
               <ProfileInput label="FSSAI License" value={formData.fssai} onChange={v => setFormData({...formData, fssai: v})} />
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Logo</label>
                  <div className="h-12 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 gap-2 cursor-pointer hover:bg-slate-50 transition-all">
                     <ImageIcon size={16} /> <span className="text-[10px] font-bold uppercase">Upload Branding</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
               <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm flex items-center gap-3">
                 <MapPin size={18} className="text-red-500" /> Contact & Localization
               </h3>
            </div>
            <div className="p-8 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileInput label="Branch Email" icon={<Mail size={14}/>} value={formData.email} onChange={v => setFormData({...formData, email: v})} />
                  <ProfileInput label="Branch Phone" icon={<Phone size={14}/>} value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                  <ProfileInput label="Website" icon={<Globe size={14}/>} value={formData.website} onChange={v => setFormData({...formData, website: v})} />
                  <ProfileInput label="Pincode" value={formData.pincode} onChange={v => setFormData({...formData, pincode: v})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch Address</label>
                  <textarea 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px] resize-none"
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Right Column - Financial & Summary */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <Landmark className="text-indigo-300 mb-6" size={32} />
              <h4 className="font-black text-xl mb-6 tracking-tight uppercase">Settlement Bank</h4>
              <div className="space-y-4">
                 <ProfileInputDark label="Bank Name" value={formData.bankName} onChange={v => setFormData({...formData, bankName: v})} />
                 <ProfileInputDark label="Account Number" value={formData.accountNo} onChange={v => setFormData({...formData, accountNo: v})} />
                 <ProfileInputDark label="IFSC Code" value={formData.ifsc} onChange={v => setFormData({...formData, ifsc: v})} />
              </div>
              <p className="text-[9px] text-indigo-300 mt-8 font-bold uppercase tracking-widest border-t border-white/10 pt-6 leading-relaxed">
                Transactions generated under this profile will use these details for digital payments and settlement reconciliation.
              </p>
           </div>

           <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100">
              <div className="flex items-center gap-3 text-amber-600 mb-4">
                 <ShieldCheck size={20} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Accounting Notice</span>
              </div>
              <p className="text-xs text-amber-800 font-bold leading-relaxed">
                Stock, Sales, and Purchase entries are physically partitioned in the database per Pharmacy Profile. Switching profiles updates the accounting context instantly.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const ProfileInput = ({label, value, onChange, icon}: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">{icon}</div>}
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className={`w-full ${icon ? 'pl-11' : 'px-4'} py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
      />
    </div>
  </div>
);

const ProfileInputDark = ({label, value, onChange}: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-black text-white focus:bg-white/10 outline-none transition-all"
    />
  </div>
);
