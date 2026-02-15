
import React, { useState } from 'react';
import { 
  Gauge, 
  Zap, 
  Database, 
  Cpu, 
  Activity, 
  TrendingUp, 
  Search, 
  AlertCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  Brain,
  HardDrive,
  MousePointer2
} from 'lucide-react';

export const PerformanceMonitorPage: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runOptimizer = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Performance Engineering Console</h2>
          <p className="text-slate-500 text-sm font-medium">Monitoring L1/L2 Caching, Query Latency & Worker Throughput.</p>
        </div>
        <button 
          onClick={runOptimizer}
          disabled={isAnalyzing}
          className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {isAnalyzing ? <RefreshCw className="animate-spin" size={18} /> : <Brain size={18} />}
          {isAnalyzing ? "Analyzing Plans..." : "Run AI Query Optimizer"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard label="Cache Hit Rate" value="94.2%" trend="+2.1%" color="emerald" icon={<Zap />} />
        <MetricCard label="Avg Query Time" value="12ms" trend="-4ms" color="blue" icon={<Activity />} />
        <MetricCard label="Worker Utilization" value="18%" trend="Stable" color="indigo" icon={<Cpu />} />
        <MetricCard label="DB Size (Heap)" value="4.2 GB" trend="Optimal" color="slate" icon={<Database />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cache Visualization */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-tight">L1 In-Memory Caching</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Lookups for Fast Billing</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-black text-slate-600 uppercase">Real-time Stream</span>
               </div>
            </div>
            
            <div className="p-8">
               <div className="space-y-6">
                  <CacheItem label="Medicine Master Lookups" hit={98} total={12044} />
                  <CacheItem label="GST Slab Reference" hit={100} total={842} />
                  <CacheItem label="Customer Credit Index" hit={86} total={4201} />
                  <CacheItem label="Audit Trace Buffer" hit={45} total={55020} />
               </div>

               <div className="mt-10 p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex gap-4">
                  <Brain className="text-indigo-600 shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-black text-indigo-900">AI Pre-fetching Insight</p>
                    <p className="text-[10px] text-indigo-700 leading-relaxed font-medium mt-1">
                      Astra AI has detected that "Antipyretics" are searched 4x more between 09:00 AM - 11:00 AM. 
                      System has automatically pre-loaded the top 50 relevant batches into the hot-cache.
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h4 className="text-xl font-black mb-6 tracking-tight uppercase flex items-center gap-3">
               <MousePointer2 className="text-emerald-500" size={24} /> 
               Slow Query Inspector
            </h4>
            <div className="space-y-4">
               <SlowQuery time="428ms" query="SELECT * FROM sales_items JOIN medicine_batch..." action="INDEX SUGGESTED" />
               <SlowQuery time="185ms" query="UPDATE inventory SET current_stock = current_stock..." action="LOCK OPTIMIZED" />
               <SlowQuery time="110ms" query="SELECT SUM(net_amount) FROM sales_headers WHERE..." action="CACHEABLE" />
            </div>
          </div>
        </div>

        {/* System Health / Index Review */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <HardDrive className="text-slate-900" size={24} />
                  <h3 className="font-black text-slate-800 uppercase tracking-tight">Index Efficiency</h3>
               </div>
               <span className="text-[10px] font-black text-slate-400">PG_STAT_USER_INDEXES</span>
            </div>

            <div className="space-y-5">
               <IndexBar label="idx_med_name" usage={92} />
               <IndexBar label="idx_bill_no" usage={88} />
               <IndexBar label="idx_batch_exp" usage={45} />
               <IndexBar label="idx_customer_mob" usage={76} />
               <IndexBar label="idx_gst_hsn" usage={99} />
            </div>

            <div className="mt-auto pt-8 border-t border-slate-100 space-y-4">
               <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="flex items-center gap-3 text-amber-600 mb-2">
                     <AlertCircle size={16} />
                     <span className="text-[10px] font-black uppercase tracking-wider">Optimization Alert</span>
                  </div>
                  <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                     Sequential scan detected on 'sales_items' table. Database size exceeded 500k rows. 
                     Applying PARTIAL INDEX on 'batch_id' is recommended.
                  </p>
               </div>
               <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20">
                  Apply Structural Optimizations
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({label, value, trend, color, icon}: any) => {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100'
  };

  return (
    <div className={`p-6 rounded-[2rem] border shadow-sm flex flex-col items-center text-center hover:scale-[1.02] transition-all bg-white`}>
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors[color]}`}>{icon}</div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
       <h4 className="text-2xl font-black text-slate-900 mt-1">{value}</h4>
       <div className={`text-[10px] font-bold mt-2 ${trend.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
          {trend} vs Last Period
       </div>
    </div>
  );
};

const CacheItem = ({label, hit, total}: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
       <span className="text-xs font-bold text-slate-700">{label}</span>
       <span className="text-[10px] font-black text-slate-400">{hit}% Hit Rate ({total} req)</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
       <div className={`h-full bg-emerald-500 transition-all duration-1000`} style={{width: `${hit}%`}}></div>
    </div>
  </div>
);

const SlowQuery = ({time, query, action}: any) => (
  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
     <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-3 mb-1">
           <span className="text-red-400 text-[10px] font-black">{time}</span>
           <span className="text-slate-500 text-[10px] font-mono truncate">{query}</span>
        </div>
        <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">{action}</p>
     </div>
     <button className="text-slate-600 hover:text-white transition-colors">
        <ChevronRight size={16} />
     </button>
  </div>
);

const IndexBar = ({label, usage}: any) => (
  <div className="flex items-center gap-4">
     <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono font-bold text-slate-600 truncate">{label}</p>
        <div className="h-1 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
           <div className="h-full bg-slate-900" style={{width: `${usage}%`}}></div>
        </div>
     </div>
     <span className="text-[10px] font-black text-slate-400">{usage}%</span>
  </div>
);
