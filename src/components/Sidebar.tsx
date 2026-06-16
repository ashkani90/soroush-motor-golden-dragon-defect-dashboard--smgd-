import React from 'react';
import { LayoutDashboard, Calendar, FileText, AlertOctagon, Users, Settings, LogOut, ChevronRight, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../locales';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  language: Language;
  onLogout: () => void;
  currentUser: User;
}

export default function Sidebar({
  currentView,
  setCurrentView,
  language,
  onLogout,
  currentUser
}: SidebarProps) {
  const t = translations[language];

  // Sidebar Menu Configuration
  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'calendar', label: t.calendar, icon: Calendar },
    { id: 'forms', label: t.non_compliance_form, icon: FileText },
    { id: 'defects', label: t.defect_reports, icon: AlertOctagon },
    { id: 'users', label: t.user_management, icon: Users },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <aside className="no-print bg-slate-900 text-slate-300 w-64 h-full hidden lg:flex flex-col border-r border-slate-800 shadow-xl flex-shrink-0">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
          <ShieldCheck className="h-9 w-9 text-orange-500" />
        </div>
        <h2 className="text-sm font-bold text-white tracking-wide text-center leading-tight">
          {language === 'fa' ? 'ام‌جی‌دی سروش موتور' : 'SMGD PORTAL'}
        </h2>
        <span className="text-[10px] text-slate-500 font-semibold uppercase mt-1">
          {language === 'fa' ? 'سامانه کنترل و ثبت نقص کیفی' : 'Defect Track & Audit'}
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/10'
                  : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-100'}`} />
              <span className="flex-1 text-right">{item.label}</span>
              {isActive && (
                language === 'fa' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile metadata & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-slate-800/20 border border-slate-800/40 mb-3">
          <div className="h-8 w-8 rounded-full bg-orange-600/10 flex items-center justify-center font-bold text-orange-500 text-xs border border-orange-600/20">
            {currentUser.fullName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 text-right">
            <h4 className="text-xs font-semibold text-slate-300 truncate">{currentUser.fullName}</h4>
            <span className="text-[9px] text-slate-500 block truncate">
              {currentUser.email}
            </span>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-rose-600/10 text-rose-400 border border-rose-600/20 hover:bg-rose-600 hover:text-white transition-all duration-300 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>{t.logout}</span>
        </button>
      </div>

    </aside>
  );
}
