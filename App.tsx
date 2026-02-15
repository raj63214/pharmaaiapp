
import React, { useState, useEffect, createContext, useContext, Suspense, lazy, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileBarChart, 
  Settings as SettingsIcon, 
  LogOut, 
  Bell, 
  Search,
  Plus,
  Printer,
  ChevronRight,
  AlertCircle,
  FileUp,
  Brain,
  Zap,
  TrendingUp,
  History,
  ShieldCheck,
  FileText,
  Database,
  RefreshCw,
  ShieldAlert,
  Fingerprint,
  Lock,
  Gauge,
  Loader2,
  X,
  CheckCircle,
  UserPlus,
  Building2,
  MapPin,
  ChevronDown,
  ClipboardList
} from 'lucide-react';

// Lazy Load Pages
const DashboardPage = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.DashboardPage })));
// Added explicit typing to resolve property 'activePharmacy' inference errors
const BillingPage = lazy<React.ComponentType<{ activePharmacy: any }>>(() => import('./pages/Billing').then(m => ({ default: m.BillingPage })));
const InventoryPage = lazy(() => import('./pages/Inventory').then(m => ({ default: m.InventoryPage })));
const PurchaseEntryPage = lazy(() => import('./pages/PurchaseEntry').then(m => ({ default: m.PurchaseEntryPage })));
const ImportOCRPage = lazy(() => import('./pages/ImportOCR').then(m => ({ default: m.ImportOCRPage })));
// Added explicit typing to resolve property 'activePharmacy' inference errors
const AIInsightsPage = lazy<React.ComponentType<{ activePharmacy: any }>>(() => import('./pages/AIInsights').then(m => ({ default: m.AIInsightsPage })));
const CompliancePage = lazy(() => import('./pages/Compliance').then(m => ({ default: m.CompliancePage })));
const SettingsPage = lazy(() => import('./pages/Settings').then(m => ({ default: m.SettingsPage })));
const UpdatesPage = lazy(() => import('./pages/Updates').then(m => ({ default: m.UpdatesPage })));
const SecurityCenterPage = lazy(() => import('./pages/SecurityCenter').then(m => ({ default: m.SecurityCenterPage })));
const PerformanceMonitorPage = lazy(() => import('./pages/PerformanceMonitor').then(m => ({ default: m.PerformanceMonitorPage })));
const UserManagementPage = lazy(() => import('./pages/UserManagement').then(m => ({ default: m.UserManagementPage })));
const OrganizationProfilePage = lazy(() => import('./pages/OrganizationProfile').then(m => ({ default: m.OrganizationProfilePage })));
import { LoginPage } from './pages/Login';

// --- Contexts ---
interface User {
  id: string;
  username: string;
  role: 'ADMIN' | 'PHARMACIST' | 'CASHIER';
  permissions: string[];
}

interface PharmacyProfile {
  id: string;
  name: string;
  legalName?: string;
  gstin: string;
  address: string;
  dlNo?: string;
}

interface AppContextType {
  user: User | null;
  activePharmacy: PharmacyProfile | null;
  pharmacies: PharmacyProfile[];
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  setActivePharmacy: (pharmacy: PharmacyProfile) => void;
  addPharmacy: (pharmacy: PharmacyProfile) => void;
}

const AppContext = createContext<AppContextType | null>(null);
export const useApp = () => useContext(AppContext)!;

export interface BackgroundJob {
  id: string;
  name: string;
  progress: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}

const PageLoader = () => (
  <div className="h-full w-full flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
    <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Astra Core Optimizing...</p>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [pharmacies, setPharmacies] = useState<PharmacyProfile[]>([
    { id: '1', name: 'Astra Vashi Main', legalName: 'Astra Medicals Pvt Ltd', gstin: '27AAACR9981M1Z', address: 'Sector 18, Vashi', dlNo: 'MH-Z5-21-99801' },
    { id: '2', name: 'Astra Nerul Branch', legalName: 'Astra Retail Pharmacy', gstin: '27AAACR9981M2Z', address: 'Sector 4, Nerul', dlNo: 'MH-Z5-21-99802' },
  ]);
  const [activePharmacy, setActivePharmacy] = useState<PharmacyProfile | null>(pharmacies[0]);
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<BackgroundJob[]>([]);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  const login = async (creds: any) => {
    setLoading(true);
    setTimeout(() => {
      const role: any = creds.username.toUpperCase() === 'PHARMACIST' ? 'PHARMACIST' : 
                        creds.username.toUpperCase() === 'CASHIER' ? 'CASHIER' : 'ADMIN';
      
      setUser({
        id: '1',
        username: creds.username || 'admin_pharmacy',
        role: role,
        permissions: role === 'ADMIN' ? ['*'] : role === 'PHARMACIST' ? ['sales.create', 'inventory.manage', 'ocr.import'] : ['sales.create']
      });
      setLoading(false);
    }, 1000);
  };

  const logout = () => setUser(null);

  const addPharmacy = (p: PharmacyProfile) => {
    setPharmacies(prev => [...prev, p]);
  };

  const addJob = (name: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setJobs(prev => [{ id, name, progress: 0, status: 'RUNNING' }, ...prev]);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) {
        clearInterval(interval);
        setJobs(prev => prev.map(j => j.id === id ? { ...j, progress: 100, status: 'COMPLETED' } : j));
        setTimeout(() => setJobs(prev => prev.filter(j => j.id !== id)), 5000);
      } else {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, progress: Math.floor(p) } : j));
      }
    }, 800);
  };

  const renderedPage = useMemo(() => {
    if (!user) return null;
    switch(activePage) {
      case 'dashboard': return <DashboardPage activePharmacy={activePharmacy} />;
      case 'billing': return <BillingPage activePharmacy={activePharmacy} />;
      case 'purchase': return <PurchaseEntryPage activePharmacy={activePharmacy} />;
      case 'inventory': return <InventoryPage onTriggerJob={addJob} role={user.role} activePharmacy={activePharmacy} />;
      case 'import': return <ImportOCRPage activePharmacy={activePharmacy} />;
      case 'ai-insights': return <AIInsightsPage activePharmacy={activePharmacy} />;
      case 'compliance': return <CompliancePage onTriggerJob={addJob} activePharmacy={activePharmacy} />;
      case 'settings': return <SettingsPage onTriggerJob={addJob} />;
      case 'updates': return <UpdatesPage />;
      case 'security': return <SecurityCenterPage />;
      case 'performance': return <PerformanceMonitorPage />;
      case 'users': return <UserManagementPage />;
      case 'profile': return <OrganizationProfilePage onTriggerJob={addJob} />;
      default: return <DashboardPage activePharmacy={activePharmacy} />;
    }
  }, [activePage, user, activePharmacy]);

  if (!user) return <LoginPage onLogin={login} isLoading={loading} />;

  const isAdmin = user.role === 'ADMIN';
  const isPharmacist = user.role === 'PHARMACIST' || isAdmin;

  return (
    <AppContext.Provider value={{ user, activePharmacy, pharmacies, login, logout, setActivePharmacy, addPharmacy }}>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20 border-r border-slate-800">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Package className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">AstraPharmacy</span>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
            <NavItem icon={<ShoppingCart size={20}/>} label="Sales Billing" active={activePage === 'billing'} onClick={() => setActivePage('billing')} />
            
            {isPharmacist && (
              <>
                <NavItem icon={<ClipboardList size={20}/>} label="Purchase Entry" active={activePage === 'purchase'} onClick={() => setActivePage('purchase')} />
                <NavItem icon={<Package size={20}/>} label="Inventory Master" active={activePage === 'inventory'} onClick={() => setActivePage('inventory')} />
                <NavItem icon={<FileUp size={20}/>} label="OCR Import" active={activePage === 'import'} onClick={() => setActivePage('import')} />
              </>
            )}

            {isAdmin && (
              <>
                <div className="pt-4 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Intelligence</div>
                <NavItem icon={<Brain size={20}/>} label="AI Insights" active={activePage === 'ai-insights'} onClick={() => setActivePage('ai-insights')} />
                <NavItem icon={<ShieldCheck size={20}/>} label="Compliance" active={activePage === 'compliance'} onClick={() => setActivePage('compliance')} />
                <div className="pt-4 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Enterprise Management</div>
                <NavItem icon={<Building2 size={20}/>} label="Branch Profiles" active={activePage === 'profile'} onClick={() => setActivePage('profile')} />
                <NavItem icon={<Users size={20}/>} label="User Accounts" active={activePage === 'users'} onClick={() => setActivePage('users')} />
                <NavItem icon={<ShieldAlert size={20}/>} label="Security Center" active={activePage === 'security'} onClick={() => setActivePage('security')} />
                <div className="pt-4 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">System Engine</div>
                <NavItem icon={<Gauge size={20}/>} label="Performance" active={activePage === 'performance'} onClick={() => setActivePage('performance')} />
                <NavItem icon={<Database size={20}/>} label="Backup & Data" active={activePage === 'settings'} onClick={() => setActivePage('settings')} />
                <NavItem icon={<RefreshCw size={20}/>} label="Update Center" active={activePage === 'updates'} onClick={() => setActivePage('updates')} />
              </>
            )}
          </nav>

          <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-900/50">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white ring-2 ring-emerald-500/30">
                {user.username[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate">{user.username}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                   <Lock size={10} className="text-emerald-500" /> {user.role}
                </p>
              </div>
              <button onClick={logout} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500 transition-all">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm">
            <div className="flex items-center gap-6 flex-1">
              <div className="relative">
                <button 
                  onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
                  className="flex items-center gap-3 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all group shadow-sm"
                >
                  <Building2 size={18} className="text-indigo-600" />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Accounting Context</p>
                    <p className="text-xs font-black text-slate-900 mt-0.5 flex items-center gap-2">
                      {activePharmacy?.name} <ChevronDown size={12} className={`transition-transform ${showProfileSwitcher ? 'rotate-180' : ''}`} />
                    </p>
                  </div>
                </button>
                
                {showProfileSwitcher && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileSwitcher(false)}></div>
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95">
                      {pharmacies.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => { setActivePharmacy(p); setShowProfileSwitcher(false); }}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activePharmacy?.id === p.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50'}`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activePharmacy?.id === p.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <Building2 size={18} />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-900 truncate">{p.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{p.gstin}</p>
                          </div>
                          {activePharmacy?.id === p.id && <CheckCircle size={14} className="text-indigo-600 shrink-0" />}
                        </button>
                      ))}
                      <div className="border-t border-slate-100 mt-2 pt-2">
                        <button 
                          onClick={() => { setActivePage('profile'); setShowProfileSwitcher(false); }}
                          className="w-full flex items-center gap-3 p-3 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 rounded-xl"
                        >
                          <Plus size={14} /> Add New Profile
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative max-w-md w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Global Command Search (ALT+K)..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl text-sm transition-all outline-none font-medium"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button onClick={() => setActivePage('billing')} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-black shadow-xl shadow-slate-900/20 transition-all active:scale-95">
                <ShoppingCart size={18} /> SELL
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-8 custom-scrollbar relative">
            <Suspense fallback={<PageLoader />}>
              {renderedPage}
            </Suspense>
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
};

const NavItem: React.FC<{icon: React.ReactNode, label: string, active?: boolean, onClick: () => void}> = React.memo(({icon, label, active, onClick}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
      active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
      {icon}
    </span>
    {label}
  </button>
));

export default App;
