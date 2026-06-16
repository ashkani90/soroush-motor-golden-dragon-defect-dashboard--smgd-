import React, { useState } from 'react';
import { User as UserIcon, Trash, Plus, ShieldAlert, Sparkles, Check, Edit2, Key, RefreshCw, AlertTriangle, Image } from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../locales';

interface UsersViewProps {
  language: Language;
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onDeleteUser: (id: number) => void;
  onUpdateUserAvatar: (id: number, filename: string) => void;
}

export default function UsersView({
  language,
  users,
  onAddUser,
  onDeleteUser,
  onUpdateUserAvatar
}: UsersViewProps) {
  const t = translations[language];

  // Forms states
  const [showAddForm, setShowAddForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('quality');
  const [role, setRole] = useState('inspector');
  const [profileImage, setProfileImage] = useState('admin.jpg');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Selected User for Diagnostics
  const [selectedDiagnosticUser, setSelectedDiagnosticUser] = useState<User | null>(users[0] || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email) return;

    onAddUser({
      fullName,
      username,
      email,
      department,
      role,
      profile_image: profileImage,
      status
    });

    // Reset
    setFullName('');
    setUsername('');
    setEmail('');
    setProfileImage('admin.jpg');
    setShowAddForm(false);
  };

  const getRoleLabel = (r: string) => {
    switch (r) {
      case 'admin':
        return t.admin;
      case 'inspector':
        return t.inspector;
      default:
        return t.operator;
    }
  };

  const getDeptLabel = (d: string) => {
    switch (d) {
      case 'assembly':
        return t.assembly;
      case 'paint':
        return t.paint;
      case 'warehouse':
        return t.warehouse;
      case 'quality':
        return t.quality;
      case 'maintenance':
        return t.maintenance;
      default:
        return t.admin_dept;
    }
  };

  return (
    <div className="space-y-6 select-none font-vazir text-right">
      
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{t.user_management}</h2>
          <p className="text-[11px] text-slate-500 font-medium">پسوندهای مجاز شامل jpg و png تعریف شده و تصاویر در مسیر فیزیکی قرار دارند.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs py-2 px-3.5 rounded-xl cursor-pointer transition-all shadow-md shadow-orange-600/10"
        >
          <Plus className="h-4 w-4" />
          <span>{t.add_user}</span>
        </button>
      </div>

      {/* Visual Diagnostic Playground specifically teaching they how to fix dynamic loading bugs */}
      {selectedDiagnosticUser && (
        <div className="bg-gradient-to-l from-slate-900 to-indigo-950 text-white rounded-3xl p-5 md:p-6 shadow-lg border border-indigo-900/50">
          <div className="flex items-center gap-2 mb-3 justify-end">
            <h3 className="text-sm font-bold text-indigo-200">🔍 دباگ و ردیابی فایل آواتار در هدر سیستم</h3>
            <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Left side detail info explaining the fix */}
            <div className="md:col-span-2 text-right text-xs text-slate-305 leading-relaxed space-y-2">
              <p>
                در دیتابیس صرفاً رشته خام <code className="bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded font-mono text-[11px]">{selectedDiagnosticUser.profile_image}</code> ذخیره شده است.
              </p>
              <p className="text-[11px] text-slate-400">
                در هدر اصلی پروژه، از هر صفحه‌ای (در هر رتبه عمقی از پوشه‌ها) برای عدم مواجهه با ارور ۴۰۴ تصویر، آدرس باید به شکل مطلق <code className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-[11px]">{"/images/profiles/"}</code> با نام فایل ترکیب شود.
              </p>
              <div className="pt-2">
                <label className="block text-[10px] font-bold text-slate-400 mb-1">چرخه ویرایش نام فایل در دیتابیس برای این کاربر:</label>
                <div className="flex gap-2 justify-end">
                  <input
                    type="text"
                    value={selectedDiagnosticUser.profile_image}
                    onChange={(e) => {
                      onUpdateUserAvatar(selectedDiagnosticUser.id, e.target.value);
                      setSelectedDiagnosticUser({ ...selectedDiagnosticUser, profile_image: e.target.value });
                    }}
                    placeholder="مثال: anbar.png"
                    className="w-48 text-xs font-mono px-2 py-1 border border-indigo-800/80 rounded bg-slate-800/50 text-emerald-300 text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Right side representation of the resulting generated image block */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-indigo-950 flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-slate-800 border-2 border-indigo-500 shadow-inner overflow-hidden mb-2 relative flex items-center justify-center">
                {/* Simulated header URL resolution inside our fixed system */}
                <img
                  src={`/images/profiles/${selectedDiagnosticUser.profile_image}`}
                  alt={selectedDiagnosticUser.fullName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback to SVG representation
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-indigo-400 font-bold text-md absolute">
                  {selectedDiagnosticUser.fullName.charAt(0)}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-100">{selectedDiagnosticUser.fullName}</span>
              <span className="text-[9px] text-slate-450 mt-1 font-mono bg-slate-950 px-2 py-0.5 rounded">
                {"/images/profiles/" + selectedDiagnosticUser.profile_image}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Roster list and creation dialogs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Users list roster table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-3">{language === 'fa' ? 'لیست کاربران فعال صنعتی' : 'System Quality accounts'}</h3>
          
          <div className="space-y-3">
            {users.map((u) => u.username !== 'placeholder' && (
              <div
                key={u.id}
                onClick={() => setSelectedDiagnosticUser(u)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  selectedDiagnosticUser?.id === u.id
                    ? 'border-indigo-500 bg-indigo-50/10'
                    : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (u.id === 1) {
                        alert('حذف کاربر ادمین اصلی امکان‌پذیر نمی‌باشد.');
                        return;
                      }
                      onDeleteUser(u.id);
                      if (selectedDiagnosticUser?.id === u.id) {
                        setSelectedDiagnosticUser(users[0]);
                      }
                    }}
                    className="p-1 px-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                    title={t.delete_user}
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
                
                <div className="flex-1 text-right flex items-center gap-3 justify-end-row">
                  <div className="text-right">
                    <h4 className="text-xs font-bold text-slate-900">{u.fullName}</h4>
                    <span className="text-[10px] text-slate-450 font-mono block mt-0.5">{u.email}</span>
                  </div>
                  
                  {/* Avatar path indicator */}
                  <div className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={`/images/profiles/${u.profile_image}`}
                      alt={u.fullName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120';
                      }}
                    />
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="text-[10px] bg-slate-100/80 border border-slate-200/50 text-slate-600 px-2 py-0.5 rounded-full font-bold block">
                    {getRoleLabel(u.role)}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-1 block">
                    {getDeptLabel(u.department)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add user form sidebar */}
        <div>
          {showAddForm ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
              <h3 className="text-xs font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">{t.add_user}</h3>
              <form onSubmit={handleSubmit} className="space-y-4 font-vazir text-right">
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">{t.fullname} *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="امیر علوی"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-right bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">{t.username} *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="alavi_qc"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-right bg-slate-50/50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">{t.email} *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alavi@smgd.com"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-right bg-slate-50/50 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">{t.department}</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full text-[11px] px-2 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                    >
                      <option value="quality">{t.quality}</option>
                      <option value="assembly">{t.assembly}</option>
                      <option value="paint">{t.paint}</option>
                      <option value="warehouse">{t.warehouse}</option>
                      <option value="maintenance">{t.maintenance}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">{t.role}</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full text-[11px] px-2 py-2 border border-slate-200 rounded-lg bg-slate-50/50"
                    >
                      <option value="admin">{t.admin}</option>
                      <option value="inspector">{t.inspector}</option>
                      <option value="operator">{t.operator}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">{t.user_avatar} (نام فایل)</label>
                  <input
                    type="text"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="مثال: alavi.jpg"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-right bg-slate-50/50 font-mono"
                  />
                  <span className="text-[9px] text-slate-400 mt-1 block">نام فایل عکس ذخیره شده در آدرس /images/profiles/</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs py-2 rounded-lg cursor-pointer"
                  >
                    {t.save_user}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 text-xs cursor-pointer"
                  >
                    انصراف
                  </button>
                </div>

              </form>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 border-dashed p-6 text-center text-slate-450 text-xs">
              برای افزودن اکانت همکار جدید روی افزونه بالا کلیک فرمایید.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
