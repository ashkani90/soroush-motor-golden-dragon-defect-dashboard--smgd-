import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AlertCircle, FileSpreadsheet, ShieldAlert, Users, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language, DefectReport } from '../types';
import { translations } from '../locales';

interface DashboardViewProps {
  language: Language;
  defects: DefectReport[];
  activeUsersCount: number;
  setCurrentView: (view: string) => void;
}

export default function DashboardView({
  language,
  defects,
  activeUsersCount,
  setCurrentView
}: DashboardViewProps) {
  const t = translations[language];

  // Derive quantitative parameters
  const totalCount = defects.length;
  const pendingCount = defects.filter(d => d.status === 'pending').length;
  const inProgressCount = defects.filter(d => d.status === 'in_progress').length;
  const draftCount = defects.filter(d => d.status === 'draft').length;
  const resolvedCount = defects.filter(d => d.status === 'resolved').length;

  // Color mappings for chart cell slices
  const COLORS = {
    low: '#10b981',      // Emerald
    medium: '#3b82f6',   // Blue
    high: '#f59e0b',     // Amber
    critical: '#ef4444'  // Rose
  };

  // Severity count for Pie Chart
  const severityData = [
    { name: t.low, value: defects.filter(d => d.severity === 'low').length, color: COLORS.low },
    { name: t.medium, value: defects.filter(d => d.severity === 'medium').length, color: COLORS.medium },
    { name: t.high, value: defects.filter(d => d.severity === 'high').length, color: COLORS.high },
    { name: t.critical, value: defects.filter(d => d.severity === 'critical').length, color: COLORS.critical },
  ].filter(s => s.value > 0);

  // Fallback if data is empty (prevents rendering crash)
  const safeSeverityData = severityData.length > 0 ? severityData : [
    { name: t.low, value: 5, color: COLORS.low },
    { name: t.medium, value: 3, color: COLORS.medium },
    { name: t.high, value: 2, color: COLORS.high },
  ];

  // Monthly trends data
  const trendData = [
    { month: language === 'fa' ? 'اسفند' : 'Feb', mechanical: 12, paint: 5, electrical: 8 },
    { month: language === 'fa' ? 'فروردین' : 'Mar', mechanical: 18, paint: 9, electrical: 14 },
    { month: language === 'fa' ? 'اردیبهشت' : 'Apr', mechanical: 15, paint: 12, electrical: 11 },
    { month: language === 'fa' ? 'خرداد' : 'May', mechanical: 25, paint: 8, electrical: 19 },
    { month: language === 'fa' ? 'تیر' : 'Jun', mechanical: totalCount + 4, paint: inProgressCount + 3, electrical: pendingCount + 2 },
  ];

  // Recent system logs
  const activities = [
    { id: 1, text_fa: "تائیدیه ممیزی استاندارد سالن رنگ توسط مدیر سیستم صادر شد.", text: "Standard paint workshop audit approval issued by admin.", time_fa: "۱۰ دقیقه پیش", time: "10m ago", type: 'success' },
    { id: 2, text_fa: "یک فرم عدم انطباق با شدت بحرانی (بخش مونتاژ نهایی) ثبت گردید.", text: "Critical severity NC form logged for Final Assembly Line.", time_fa: "۲ ساعت پیش", time: "2h ago", type: 'urgent' },
    { id: 3, text_fa: "تغییر کلمه عبور کاربر «انبار مرکزی» توسط بخش نظارتی انجام شد.", text: "Credentials updated for 'Warehouse Operator' by support.", time_fa: "دیروز", time: "Yesterday", type: 'info' },
    { id: 4, text_fa: "پیش‌نویس جدید بازرسی بدنه خودرو در دیتابیس ثبت و بایگانی شد.", text: "New draft for Auto Body inspection stored in cloud.", time_fa: "۲ روز پیش", time: "2 days ago", type: 'draft' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title Header banner */}
      <div className="bg-gradient-to-l from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-xl flex items-center justify-between overflow-hidden relative border border-slate-700">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none scale-150">
          <TrendingUp className="h-44 w-44" />
        </div>
        <div className="relative z-10 text-right">
          <h2 className="text-xl font-bold mb-1 tracking-tight">
            {language === 'fa' ? 'میز کار هوشمند کنترل کیفیت و گزارش مغایرت‌ها' : 'Smart Quality Control Workspace'}
          </h2>
          <p className="text-xs text-slate-400 font-medium max-w-2xl">
            {language === 'fa' 
              ? 'به سامانه پایش و ثبت مغایرت‌های کیفی شرکت سروش موتور گرگان خوش آمدید. آمارها و داده‌های بازرسی به صورت زنده به نمایش گذاشته شده‌اند.'
              : 'Welcome to the defect & non-compliance logging ecosystem of Soroush Motor Gorgan. Localized factory indicators and statistics are being streamed live.'}
          </p>
        </div>
        <button
          onClick={() => setCurrentView('forms')}
          className="hidden md:flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-orange-600/35 cursor-pointer border border-orange-500"
        >
          <Sparkles className="h-4 w-4" />
          <span>{t.add_user && t.submit_nc_btn}</span>
        </button>
      </div>

      {/* Metrics Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div onClick={() => setCurrentView('defects')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between cursor-pointer group">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">
              {t.total_defects}
            </span>
            <span className="text-2xl font-bold text-slate-800 font-mono">
              {totalCount}
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div onClick={() => setCurrentView('defects')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between cursor-pointer group">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">
              {t.pending_inspection}
            </span>
            <span className="text-2xl font-bold text-rose-600 font-mono">
              {pendingCount}
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div onClick={() => setCurrentView('calendar')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between cursor-pointer group">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">
              {t.active_audits}
            </span>
            <span className="text-2xl font-bold text-indigo-600 font-mono">
              {de_event_counter()}
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div onClick={() => setCurrentView('users')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between cursor-pointer group">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">
              {t.system_users}
            </span>
            <span className="text-2xl font-bold text-emerald-600 font-mono">
              {activeUsersCount}
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            <Users className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart (Mechanical, paint and wiring defects) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="text-xs font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span className="text-slate-400 text-[10px] font-medium font-mono">QC DEVIATIONS TREND</span>
            <span>{t.trends_chart}</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMechanical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorElectrical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', direction: language === 'fa' ? 'rtl' : 'ltr' }} />
                <Area type="monotone" name={language === 'fa' ? 'مونتاژ و بدنه' : 'Mechanical'} dataKey="mechanical" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorMechanical)" />
                <Area type="monotone" name={language === 'fa' ? 'الکتریکال و سیم‌کشی' : 'Electrical'} dataKey="electrical" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorElectrical)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Pie Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span className="text-slate-400 text-[10px] font-medium font-mono">SEVERITY DENSITY</span>
            <span>{t.severity_distribution}</span>
          </h3>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={safeSeverityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {safeSeverityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} مورد`, 'تعداد']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
            <div className="p-1 rounded bg-rose-50 border border-rose-100 text-rose-700">
              {defects.filter(d => d.severity === 'critical').length} {language === 'fa' ? 'بحرانی' : 'Critical'}
            </div>
            <div className="p-1 rounded bg-amber-50 border border-amber-100 text-amber-700">
              {defects.filter(d => d.severity === 'high').length} {language === 'fa' ? 'شدید' : 'High'}
            </div>
          </div>
        </div>

      </div>

      {/* Recent activity timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 mb-5 border-b border-slate-100 pb-3">
          {t.recent_activity}
        </h3>
        <div className="space-y-4">
          {activities.map((act) => (
            <div key={act.id} className="flex gap-4 hover:bg-slate-50 p-2 rounded-xl transition-all">
              <div className="flex flex-col items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  act.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  act.type === 'urgent' ? 'bg-rose-100 text-rose-600' :
                  act.type === 'info' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="w-[1.5px] bg-slate-150 flex-1 min-h-[16px]"></div>
              </div>
              <div className="flex-1 min-w-0 text-right">
                <p className="text-xs text-slate-700 font-medium">
                  {language === 'fa' ? act.text_fa : act.text}
                </p>
                <span className="text-[9px] text-slate-400 font-mono block mt-1">
                  {language === 'fa' ? act.time_fa : act.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );

  // Simple hardcoded count for audits representing state
  function de_event_counter() {
    return 4;
  }
}
