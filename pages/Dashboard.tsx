
import React from 'react';
import { TrendingUp, AlertTriangle, Clock, Wallet, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Overview</h2>
          <p className="text-slate-500">Summary for {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all">
          Generate Daily Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Daily Sales" value="₹42,850" sub="12% from yesterday" trend="up" icon={<TrendingUp className="text-emerald-500" />} />
        <StatCard title="Total Bills" value="156" sub="Average ₹274.60/bill" trend="up" icon={<Wallet className="text-blue-500" />} />
        <StatCard title="Low Stock Items" value="12" sub="Requires immediate order" trend="down" icon={<AlertTriangle className="text-amber-500" />} />
        <StatCard title="Expiring Soon" value="08" sub="Within next 30 days" trend="down" icon={<Clock className="text-red-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Recent Transactions</h3>
            <button className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:underline">View All <ChevronRight size={16} /></button>
          </div>
          <div className="space-y-4">
            <TransactionItem name="Rajesh Kumar" type="RETAIL" amount="₹842.00" time="10 mins ago" status="Completed" />
            <TransactionItem name="Apollo Clinic" type="WHOLESALE" amount="₹12,400.00" time="45 mins ago" status="Completed" />
            <TransactionItem name="Anita Sharma" type="RETAIL" amount="₹156.00" time="1 hr ago" status="Completed" />
            <TransactionItem name="Walk-in Customer" type="RETAIL" amount="₹2,100.00" time="2 hrs ago" status="Completed" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Inventory Health</h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Good
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Warning
              </span>
            </div>
          </div>
          <div className="space-y-5">
             <StockStatusItem name="Paracetamol 500mg" stock="450 units" status="emerald" />
             <StockStatusItem name="Azithromycin 250mg" stock="20 units" status="amber" />
             <StockStatusItem name="Amoxicillin Syrup" stock="110 units" status="emerald" />
             <StockStatusItem name="Insulin Glargine" stock="04 units" status="red" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{title: string, value: string, sub: string, icon: React.ReactNode, trend: 'up' | 'down'}> = ({title, value, sub, icon, trend}) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
        {icon}
      </div>
      {trend === 'up' ? <ArrowUpRight className="text-emerald-500" size={18} /> : <ArrowDownRight className="text-red-500" size={18} />}
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h4 className="text-2xl font-black text-slate-800 mt-1">{value}</h4>
    <p className="text-[11px] text-slate-400 mt-2 font-bold uppercase tracking-tight">{sub}</p>
  </div>
);

const TransactionItem: React.FC<{name: string, type: string, amount: string, time: string, status: string}> = ({name, type, amount, time, status}) => (
  <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
        {name[0]}
      </div>
      <div>
        <p className="font-bold text-slate-800 text-sm">{name}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase">{type} • {time}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-black text-slate-900 text-sm">{amount}</p>
      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase">{status}</span>
    </div>
  </div>
);

const StockStatusItem: React.FC<{name: string, stock: string, status: string}> = ({name, stock, status}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-sm">
      <span className="font-bold text-slate-700">{name}</span>
      <span className="text-slate-400 font-medium">{stock}</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full bg-${status}-500 rounded-full`} style={{width: status === 'emerald' ? '85%' : status === 'amber' ? '15%' : '5%'}}></div>
    </div>
  </div>
);
