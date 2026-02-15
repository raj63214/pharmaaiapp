
import React, { useState } from 'react';
import { Users, UserPlus, Shield, Terminal, Mail, Phone, MoreVertical, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface AppUser {
  id: string;
  name: string;
  role: 'ADMIN' | 'PHARMACIST' | 'CASHIER';
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastActive: string;
  terminal: string;
}

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([
    { id: '1', name: 'Dr. Aditi Verma', role: 'ADMIN', email: 'aditi@astra.pharmacy', phone: '+91 98765 43210', status: 'ACTIVE', lastActive: '2 mins ago', terminal: 'MAIN-SRV-01' },
    { id: '2', name: 'Rahul Khanna', role: 'PHARMACIST', email: 'rahul@astra.pharmacy', phone: '+91 98765 43211', status: 'ACTIVE', lastActive: '1 hr ago', terminal: 'POS-TERM-02' },
    { id: '3', name: 'Sita Sharma', role: 'CASHIER', email: 'sita@astra.pharmacy', phone: '+91 98765 43212', status: 'INACTIVE', lastActive: '2 days ago', terminal: 'POS-TERM-03' },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">User Administration</h2>
          <p className="text-slate-500 text-sm font-medium">Manage system access, assign roles, and audit terminal activities.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95">
          <UserPlus size={18} /> Create New Account
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Users size={20} />
             </div>
             <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{users.length} Active System Users</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tighter text-slate-400">
                <Terminal size={12} /> Sync: 100%
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-tighter border-b text-[10px]">
              <tr>
                <th className="p-6 pl-10">System User</th>
                <th className="p-6">Access Level</th>
                <th className="p-6">Contact Channels</th>
                <th className="p-6">Terminal Binding</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-center pr-10">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-all group cursor-default">
                  <td className="p-6 pl-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${
                        user.role === 'ADMIN' ? 'bg-indigo-600 shadow-lg shadow-indigo-900/20' : 
                        user.role === 'PHARMACIST' ? 'bg-emerald-600 shadow-lg shadow-emerald-900/20' : 'bg-slate-500 shadow-lg shadow-slate-900/20'
                      }`}>
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight">{user.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Last Active: {user.lastActive}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest border ${
                      user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                      user.role === 'PHARMACIST' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                        <Mail size={10} className="text-slate-300" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                        <Phone size={10} className="text-slate-300" /> {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                       <Terminal size={14} className="text-slate-400" />
                       <span className="font-mono text-[10px] font-bold text-slate-600 tracking-tighter">{user.terminal}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-tight ${user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {user.status === 'ACTIVE' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {user.status}
                    </div>
                  </td>
                  <td className="p-6 text-center pr-10">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                          <Edit2 size={16} />
                       </button>
                       <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                          <Trash2 size={16} />
                       </button>
                       <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                          <MoreVertical size={16} />
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
};
