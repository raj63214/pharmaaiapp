
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  Search, 
  ArrowUpRight, 
  Scale, 
  AlertCircle,
  ChevronDown,
  Info,
  Archive,
  FileArchive,
  CheckCircle,
  Lock,
  ExternalLink,
  FolderOpen,
  Server,
  Monitor,
  X
} from 'lucide-react';

type ReportType = 'GST_SUMMARY' | 'SCHEDULE_REGISTER' | 'SALES_REGISTER' | 'INSPECTOR_EXPORT' | 'REPORT_ARCHIVE';
type SaveDestination = 'VAULT' | 'NETWORK' | 'DOWNLOAD';

interface ComplianceProps {
  onTriggerJob?: (name: string) => void;
  // Fix: Added activePharmacy to ComplianceProps to match usage in App.tsx
  activePharmacy?: any;
}

interface SavedReport {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  status: 'SIGNED' | 'PENDING';
  hash: string;
}

export const CompliancePage: React.FC<ComplianceProps> = ({ onTriggerJob, activePharmacy }) => {
  const [activeReport, setActiveReport] = useState<ReportType>('GST_SUMMARY');
  const [dateRange, setDateRange] = useState({ from: '2025-01-01', to: '2025-01-31' });
  const [showSaveAs, setShowSaveAs] = useState(false);
  const [destination, setDestination] = useState<SaveDestination>('VAULT');
  const [networkPath, setNetworkPath] = useState('\\\\PHARMA-SERVER\\Compliance_Reports\\2025');

  // Simulated archive of saved reports
  const [savedReports] = useState<SavedReport[]>([
    { id: '1', name: 'GSTR1_SUMMARY_JAN_2025.pdf', type: 'GST', date: '2025-01-25 10:30', size: '1.2 MB', status: 'SIGNED', hash: 'e3b0c4...42ef' },
    { id: '2', name: 'SCHEDULE_H1_LOG_JAN_WEEK3.xlsx', type: 'NARCOTIC', date: '2025-01-22 14:15', size: '450 KB', status: 'SIGNED', hash: '8f9a2b...11c4' },
    { id: '3', name: 'INSPECTOR_BUNDLE_V20_SIGNED.zip', type: 'GOVT', date: '2025-01-15 09:00', size: '12.8 MB', status: 'SIGNED', hash: '2d3c4e...8f9a' },
  ]);

  const handleRunExport = () => {
    setShowSaveAs(true);
  };

  const confirmExport = () => {
    setShowSaveAs(false);
    if (onTriggerJob) {
      const destText = destination === 'VAULT' ? 'Internal Vault' : destination === 'NETWORK' ? `LAN (${networkPath})` : 'Browser Download';
      onTriggerJob(`Generating ${activeReport} -> Destination: ${destText}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Compliance Desk</h2>
          <p className="text-slate-500 text-sm font-medium">Official registers, regulatory exports, and the central Report Vault.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
            <Calendar size={16} className="text-slate-400" />
            <input type="date" value={dateRange.from} onChange={e => setDateRange({...dateRange, from: e.target.value})} className="text-xs font-black bg-transparent outline-none text-slate-700" />
            <span className="text-slate-300 font-bold">-</span>
            <input type="date" value={dateRange.to} onChange={e => setDateRange({...dateRange, to: e.target.value})} className="text-xs font-black bg-transparent outline-none text-slate-700" />
          </div>
          <button 
            onClick={handleRunExport}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <Download size={18} /> Run Export
          </button>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95">
            <Printer size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
          <ReportTab 
            id="GST_SUMMARY" 
            label="GST Tax Summary" 
            active={activeReport === 'GST_SUMMARY'} 
            onClick={() => setActiveReport('GST_SUMMARY')} 
            icon={<Scale size={18} />} 
          />
          <ReportTab 
            id="SCHEDULE_REGISTER" 
            label="Schedule Drug Register" 
            active={activeReport === 'SCHEDULE_REGISTER'} 
            onClick={() => setActiveReport('SCHEDULE_REGISTER')} 
            icon={<ShieldCheck size={18} />} 
          />
          <ReportTab 
            id="SALES_REGISTER" 
            label="Daily Sales Register" 
            active={activeReport === 'SALES_REGISTER'} 
            onClick={() => setActiveReport('SALES_REGISTER')} 
            icon={<FileText size={18} />} 
          />
          <ReportTab 
            id="INSPECTOR_EXPORT" 
            label="Inspector Command" 
            active={activeReport === 'INSPECTOR_EXPORT'} 
            onClick={() => setActiveReport('INSPECTOR_EXPORT')} 
            icon={<AlertCircle size={18} />} 
          />
          
          <div className="py-2"></div>
          
          <ReportTab 
            id="REPORT_ARCHIVE" 
            label="Report Archive (Vault)" 
            active={activeReport === 'REPORT_ARCHIVE'} 
            onClick={() => setActiveReport('REPORT_ARCHIVE')} 
            icon={<Archive size={18} />} 
          />

          <div className="mt-8 p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-700 mb-2">
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Regulatory Notice</span>
            </div>
            <p className="text-[10px] text-indigo-600 leading-relaxed font-bold uppercase tracking-tighter">
              All exports are cryptographically signed. Verification tokens are appended to footers to prevent document tampering.
            </p>
          </div>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            {activeReport === 'GST_SUMMARY' && <GSTReport />}
            {activeReport === 'SCHEDULE_REGISTER' && <ScheduleRegister />}
            {activeReport === 'INSPECTOR_EXPORT' && <InspectorExport onTriggerJob={onTriggerJob} onExportRequest={handleRunExport} />}
            {activeReport === 'REPORT_ARCHIVE' && <ReportArchive reports={savedReports} />}
          </div>
        </div>
      </div>

      {/* Save As Modal */}
      {showSaveAs && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Export Destination</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Select where to save the generated report</p>
              </div>
              <button onClick={() => setShowSaveAs(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-4">
              <DestinationOption 
                id="VAULT" 
                icon={<Lock className="text-emerald-500" size={20} />} 
                title="Internal Secure Vault" 
                desc="Encrypted storage within the ERP database system." 
                active={destination === 'VAULT'} 
                onClick={() => setDestination('VAULT')} 
              />
              <DestinationOption 
                id="NETWORK" 
                icon={<Server className="text-blue-500" size={20} />} 
                title="Network Shared Drive" 
                desc="Save directly to a mapped LAN/WiFi server path." 
                active={destination === 'NETWORK'} 
                onClick={() => setDestination('NETWORK')} 
              />
              {destination === 'NETWORK' && (
                <div className="px-6 pb-2 animate-in slide-in-from-top-2 duration-300">
                  <div className="relative">
                    <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input 
                      type="text" 
                      value={networkPath}
                      onChange={e => setNetworkPath(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-600 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="\\SERVER\Path\To\Folder"
                    />
                  </div>
                </div>
              )}
              <DestinationOption 
                id="DOWNLOAD" 
                icon={<Monitor className="text-slate-600" size={20} />} 
                title="Direct Download" 
                desc="Send file to this workstation's local Downloads folder." 
                active={destination === 'DOWNLOAD'} 
                onClick={() => setDestination('DOWNLOAD')} 
              />
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setShowSaveAs(false)}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmExport}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
              >
                Confirm & Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DestinationOption: React.FC<{id: SaveDestination, icon: React.ReactNode, title: string, desc: string, active: boolean, onClick: () => void}> = ({icon, title, desc, active, onClick}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-5 rounded-[1.5rem] border transition-all text-left ${
      active ? 'bg-white border-emerald-500 shadow-xl shadow-emerald-900/5 ring-1 ring-emerald-500' : 'bg-white border-slate-100 hover:border-slate-300'
    }`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active ? 'bg-emerald-50' : 'bg-slate-50'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <p className={`font-black uppercase tracking-tight text-xs ${active ? 'text-emerald-900' : 'text-slate-800'}`}>{title}</p>
      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{desc}</p>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`}>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
    </div>
  </button>
);

const ReportTab: React.FC<{id: string, label: string, active: boolean, onClick: () => void, icon: React.ReactNode}> = ({label, active, onClick, icon}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-black tracking-tight transition-all ${
      active ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-[1.02]' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
    }`}
  >
    {icon}
    {label}
  </button>
);

const GSTReport = () => (
  <div className="flex flex-col h-full">
    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
      <h3 className="font-black text-slate-800 uppercase tracking-tight">GST Tax Liability Summary (GSTR-1 Ready)</h3>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">L1 Cache: Hit (4ms)</div>
    </div>
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <TaxBox label="5% Slab" taxable="1,24,000" cgst="3,100" sgst="3,100" />
      <TaxBox label="12% Slab" taxable="4,80,500" cgst="28,830" sgst="28,830" />
      <TaxBox label="18% Slab" taxable="82,000" cgst="7,380" sgst="7,380" />
    </div>
    <div className="flex-1 px-8 pb-8 overflow-x-auto">
      <table className="w-full text-xs text-left border rounded-[2rem] overflow-hidden">
        <thead className="bg-slate-50 border-b text-slate-400 font-black uppercase tracking-tighter">
          <tr>
            <th className="p-5">HSN Code</th>
            <th className="p-5">Description</th>
            <th className="p-5 text-right">Taxable Val</th>
            <th className="p-5 text-right">CGST</th>
            <th className="p-5 text-right">SGST</th>
            <th className="p-5 text-right">Total Tax</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          <tr className="hover:bg-slate-50 transition-colors">
             <td className="p-5 font-mono">3004</td>
             <td className="p-5">Medicaments for Therapeutic Uses</td>
             <td className="p-5 text-right font-black">4,12,000.00</td>
             <td className="p-5 text-right text-slate-500">24,720.00</td>
             <td className="p-5 text-right text-slate-500">24,720.00</td>
             <td className="p-5 text-right font-black text-emerald-600">49,440.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const TaxBox = ({label, taxable, cgst, sgst}: any) => (
  <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-lg transition-all">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{label}</p>
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500 font-bold tracking-tight">Taxable Value</span>
        <span className="font-black text-slate-900">₹{taxable}</span>
      </div>
      <div className="flex justify-between text-xs pt-2 border-t border-slate-50">
        <span className="text-slate-500 font-bold tracking-tight">CGST / SGST</span>
        <span className="font-black text-slate-900">₹{cgst} / ₹{sgst}</span>
      </div>
    </div>
  </div>
);

const ScheduleRegister = () => (
  <div className="flex flex-col h-full">
    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-red-50/30">
      <div>
        <h3 className="font-black text-red-800 uppercase tracking-tight">Schedule H1 / X Register</h3>
        <p className="text-[10px] text-red-600/70 font-black uppercase mt-1 tracking-[0.15em]">Official drug control log</p>
      </div>
      <ShieldCheck className="text-red-600" size={24} />
    </div>
    <div className="flex-1 overflow-x-auto">
      <table className="w-full text-[10px] text-left border-collapse">
        <thead className="bg-slate-900 text-slate-400 font-black uppercase tracking-tighter">
          <tr>
            <th className="p-5 border-r border-slate-800">Date</th>
            <th className="p-5 border-r border-slate-800">Medicine Item</th>
            <th className="p-5 border-r border-slate-800">Batch / Exp</th>
            <th className="p-5 border-r border-slate-800">Qty</th>
            <th className="p-5 border-r border-slate-800">Patient Identity</th>
            <th className="p-5">Prescriber (Reg No.)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          <tr className="hover:bg-red-50/30 transition-colors">
            <td className="p-5 font-black text-slate-600">12-Jan-2025</td>
            <td className="p-5 font-black text-slate-900">Azithromycin 500mg (H1)</td>
            <td className="p-5 font-mono text-slate-400">B0122 / 12-26</td>
            <td className="p-5 font-black">03</td>
            <td className="p-5">
               <p className="font-black text-slate-800">Rahul Mishra</p>
               <p className="text-[9px] text-slate-400 font-bold">MOBILE: 98XXX-XXXXX</p>
            </td>
            <td className="p-5">
               <p className="font-black text-slate-800">Dr. K. Saxena</p>
               <p className="text-[9px] text-slate-400 font-bold">MCI-8842</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const InspectorExport = ({ onTriggerJob, onExportRequest }: any) => (
  <div className="p-16 flex flex-col items-center justify-center text-center space-y-8">
    <div className="w-28 h-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-3">
       <AlertCircle className="text-white" size={56} />
    </div>
    <div className="max-w-md">
       <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Drug Inspector Command Console</h3>
       <p className="text-slate-500 mt-4 text-sm font-medium leading-relaxed">
          Generate an immutable, signed PDF bundle of all purchase records, sales logs, and schedule registers for submission to the Drug Control Department.
       </p>
    </div>
    <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
       <button 
        onClick={() => onExportRequest ? onExportRequest() : onTriggerJob && onTriggerJob("Bundling Purchase Logs (Form 20/21)")}
        className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all text-left group"
       >
          <Download className="text-slate-300 group-hover:text-emerald-500 mb-6 transition-colors" size={32} />
          <p className="font-black text-slate-800 text-xs uppercase tracking-widest">Purchase Log Bundle</p>
          <p className="text-[10px] text-slate-400 mt-2 uppercase font-black">Form 20/21 Compliance</p>
       </button>
       <button 
        onClick={() => onExportRequest ? onExportRequest() : onTriggerJob && onTriggerJob("Compiling Schedule Drug Logs (H1/X)")}
        className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:border-red-500 hover:shadow-2xl hover:shadow-red-900/10 transition-all text-left group"
       >
          <ShieldCheck className="text-slate-300 group-hover:text-red-500 mb-6 transition-colors" size={32} />
          <p className="font-black text-slate-800 text-xs uppercase tracking-widest">Schedule Drug Log</p>
          <p className="text-[10px] text-slate-400 mt-2 uppercase font-black">H1/X Narcotics Clear</p>
       </button>
    </div>
  </div>
);

const ReportArchive: React.FC<{reports: SavedReport[]}> = ({ reports }) => (
  <div className="flex flex-col h-full bg-slate-50/30">
    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
      <div>
        <h3 className="font-black text-slate-800 uppercase tracking-tight">Report Archive (Secure Vault)</h3>
        <p className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-widest">History of all generated regulatory documents</p>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-black uppercase">
        <Lock size={12} /> Encrypted Storage
      </div>
    </div>
    
    <div className="p-8 flex-1">
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
        <table className="w-full text-[11px] text-left">
          <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-tighter border-b">
            <tr>
              <th className="p-5 pl-8">Document Name</th>
              <th className="p-5">Type</th>
              <th className="p-5">Generated On</th>
              <th className="p-5">Size</th>
              <th className="p-5 text-center">Status</th>
              <th className="p-5 text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {reports.map(report => (
              <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-5 pl-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <FileArchive size={16} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800">{report.name}</p>
                      <p className="text-[8px] font-mono text-slate-400 uppercase tracking-tighter">SHA-256: {report.hash}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">
                    {report.type}
                  </span>
                </td>
                <td className="p-5 text-slate-500 font-bold">{report.date}</td>
                <td className="p-5 text-slate-400 font-mono">{report.size}</td>
                <td className="p-5 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-black uppercase tracking-tighter">
                    <CheckCircle size={12} /> {report.status}
                  </div>
                </td>
                <td className="p-5 text-right pr-8">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                      <Download size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                      <Printer size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);