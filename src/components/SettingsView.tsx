import React, { useState } from 'react';
import { Settings, Shield, Key, Database, Building2, Terminal, Info, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales';

interface SettingsViewProps {
  language: Language;
}

export default function SettingsView({ language }: SettingsViewProps) {
  const t = translations[language];

  // Passwords States
  const [currPwd, setCurrPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwdSuccess, setShowPwdSuccess] = useState(false);

  // App settings state
  const [companyName, setCompanyName] = useState('شرکت صنعتی و تولیدی سروش موتور گرگان');
  const [appVersion, setAppVersion] = useState('v2.4.1 (Stable Build)');
  const [avatarDir, setAvatarDir] = useState('/images/profiles/');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPwd || !newPwd || !confirmPwd) return;

    if (newPwd !== confirmPwd) {
      alert(t.pwd_mismatch);
      return;
    }

    setShowPwdSuccess(true);
    setCurrPwd('');
    setNewPwd('');
    setConfirmPwd('');
    setTimeout(() => {
      setShowPwdSuccess(false);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none font-vazir text-right">
      
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center justify-end gap-2">
          <span>{t.settings}</span>
          <Settings className="h-5 w-5 text-orange-600" />
        </h2>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">APP CONTROLS & PRIVACY</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Passwords Change block */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-end gap-2">
            <span>{t.change_pwd}</span>
            <Key className="h-4 w-4 text-orange-500" />
          </h3>

          {showPwdSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-end gap-2 text-right">
              <span>{t.pwd_changed}</span>
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-right">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">{t.curr_pwd}</label>
              <input
                type="password"
                required
                value={currPwd}
                onChange={(e) => setCurrPwd(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-right font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">{t.new_pwd}</label>
              <input
                type="password"
                required
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-right font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">{t.confirm_pwd}</label>
              <input
                type="password"
                required
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-right font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-lg transition-all cursor-pointer"
            >
              ثبت بازنشانی رمز عبور
            </button>
          </form>
        </div>

        {/* Global Settings Configuration */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-end gap-2">
            <span>{t.system_settings_title}</span>
            <Building2 className="h-4 w-4 text-blue-500" />
          </h3>

          <div className="space-y-4 text-right">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">{t.company_name}</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-right bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">{t.avatar_dir_setting}</label>
              <input
                type="text"
                value={avatarDir}
                onChange={(e) => setAvatarDir(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 direction-ltr text-left font-mono"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-250/50 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] border-b border-slate-200 pb-1.5">
                <span className="font-bold text-indigo-600 font-mono">{appVersion}</span>
                <span className="font-semibold text-slate-500">{t.app_version}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span>{t.connected}</span>
                  <Database className="h-3.5 w-3.5" />
                </span>
                <span className="font-semibold text-slate-500">{t.database_status}</span>
              </div>
            </div>

            <div className="my-2 p-3 rounded-lg bg-orange-50 border border-orange-100 text-orange-950 text-[10px] leading-relaxed">
              تغییرات این بخش بلافاصله بر دپارتمان‌های ممیزی اعمال شده و برگه چاپی گزارش مغایرت‌ها نیز با الگو و نام شرکت جاری صادر خواهد شد.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
