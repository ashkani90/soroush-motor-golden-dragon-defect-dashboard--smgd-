import React, { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, Calendar as CalendarIcon, FileText, AlertOctagon, Users as UsersIcon, Settings as SettingsIcon, LogOut, Key, ShieldCheck, Sparkles } from 'lucide-react';
import { User, DefectReport, CalendarEvent, Notification, Language } from './types';
import { translations } from './locales';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import CalendarView from './components/CalendarView';
import FormsView from './components/FormsView';
import DefectReportsView from './components/DefectReportsView';
import UsersView from './components/UsersView';
import SettingsView from './components/SettingsView';

// Default initial data for seeding local storage on first mount
const initialUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    fullName: 'ناظر ارشد سیستم (ادمین اصلی)',
    email: 'admin@soroushmotor.com',
    department: 'admin_dept',
    role: 'admin',
    profile_image: 'admin.jpg',
    status: 'active',
    createdAt: '2026-01-10'
  },
  {
    id: 2,
    username: 'anbar',
    fullName: 'کاربر انبار توزیع و توالی قطعه',
    email: 'warehouse@soroushmotor.com',
    department: 'warehouse',
    role: 'operator',
    profile_image: 'انبار.png', // Persian characters to check encoding and path construction!
    status: 'active',
    createdAt: '2526-02-15'
  },
  {
    id: 3,
    username: 'ahmadi_qc',
    fullName: 'جواد احمدی (سرممیز تالار رنگ)',
    email: 'ahmadi@soroushmotor.com',
    department: 'quality',
    role: 'inspector',
    profile_image: 'inspector.jpg',
    status: 'active',
    createdAt: '2026-03-22'
  }
];

const initialDefects: DefectReport[] = [
  {
    id: 1,
    serialNumber: 'SMGD-309102',
    title: 'خراش عمیق پوشش رنگ جانبی پیشرانه',
    type: 'paint',
    severity: 'medium',
    location: 'paint',
    description: 'پس از پاشش لایه بیس‌کوت در استیشن ۴ سالن غبار، ذرات پودری بر روی سطح نشسته و منجر به ایجاد زبری و به اصطلاح پوست‌پرتقالی شدید و خراش گردیده است.',
    reporterName: 'جواد احمدی (سرممیز تالار رنگ)',
    status: 'in_progress',
    reportDate: '2026-06-12',
    attachments: ['scratch_01.jpg', 'inspection_report.pdf']
  },
  {
    id: 2,
    serialNumber: 'SMGD-401292',
    title: 'افت ولتاژ باتری لیتیومی حین نمونه‌گیری دینامو',
    type: 'electrical',
    severity: 'high',
    location: 'assembly',
    description: 'در تست استاتیکی تستر باتری هوشمند خط نهایی مونتاژ، سلول شماره ۳ افت جریان شدیدی نشان داده که نشان‌دهنده خطای تخلیه خود به خودی در قطعه مونتاژ شده است.',
    reporterName: 'جواد احمدی (سرممیز تالار رنگ)',
    status: 'pending',
    reportDate: '2026-06-15',
    attachments: ['battery_volts.csv']
  },
  {
    id: 3,
    serialNumber: 'SMGD-891023',
    title: 'لقی کانکتور رگولاتور پمپ سوخت‌رسانی',
    type: 'mechanical',
    severity: 'low',
    location: 'maintenance',
    description: 'کانکتورهای نگهدارنده برنجی سوپاپ ورودی در بخش اتصالات لقی ۲ میلی‌متری دارند که منجر به تولید لرزش نامتعارف موتور در ریتم دور درج شده است و احتیاج به پرسکاری ثانویه دارد.',
    reporterName: 'ناظر ارشد سیستم (ادمین اصلی)',
    status: 'resolved',
    reportDate: '2026-06-08',
    attachments: []
  }
];

const initialEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'ممیزی جامع موازنه خط رنگ شاسی',
    start: '2026-06-18',
    end: '2026-06-19',
    description: 'ممیزی دوره ای استانداردهای پوشش دهی کوره با حضور کارشناسان کیفیت کشور',
    category: 'audit'
  },
  {
    id: 2,
    title: 'تست ترمز خلأ نمونه‌های هیدرولیکی',
    start: '2026-06-20',
    end: '2026-06-20',
    description: 'تست فشرده پایداری سنسور فشار ترمز محور جلو بر روی نمونه های موتورهای جدید',
    category: 'inspection'
  },
  {
    id: 3,
    title: 'روان‌کاری زنجیر نوار نقاله بخش مونتاژ',
    start: '2026-06-22',
    end: '2026-06-23',
    description: 'نت پیشگیرانه سراسری گیربکس موتور کانوایر شماره ۲',
    category: 'maintenance'
  }
];

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'New QC defect report logged',
    title_fa: 'ثبت مغایرت کیفی جدید',
    text: 'A defect report with high severity has been registered on the assembly workshop.',
    text_fa: 'یک گزارش مغایرت فنی با سرفصل شدید در بخش سلول‌های خورشیدی موتور ثبت گردید.',
    time: '۱۰ دقیقه پیش',
    isRead: false,
    type: 'warning'
  },
  {
    id: 2,
    title: 'SQL Database connected',
    title_fa: 'اتصال دیتابیس مرکزی برقرار شد',
    text: 'Web portal connected to local sql storage securely.',
    text_fa: 'ارتباط امن با پایگاه داده موتور گنج برقرار شد و همگام‌سازی آغاز گردید.',
    time: '۲ ساعت پیش',
    isRead: true,
    type: 'success'
  }
];

export default function App() {
  const [language, setLanguage] = useState<Language>('fa');
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Authenticated User Selection (defaults to User 1)
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);

  // Persistent States Hydrated from LocalStorage
  const [users, setUsers] = useState<User[]>(() => {
    const raw = localStorage.getItem('smgd_users');
    return raw ? JSON.parse(raw) : initialUsers;
  });

  const [defects, setDefects] = useState<DefectReport[]>(() => {
    const raw = localStorage.getItem('smgd_defects');
    return raw ? JSON.parse(raw) : initialDefects;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const raw = localStorage.getItem('smgd_events');
    return raw ? JSON.parse(raw) : initialEvents;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const raw = localStorage.getItem('smgd_notifications');
    return raw ? JSON.parse(raw) : initialNotifications;
  });

  // LocalStorage synchronizations
  useEffect(() => {
    localStorage.setItem('smgd_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('smgd_defects', JSON.stringify(defects));
  }, [defects]);

  useEffect(() => {
    localStorage.setItem('smgd_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('smgd_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Synchronize current active user in case they edit their name or profile filenames inside management page
  useEffect(() => {
    const activeInList = users.find(u => u.id === currentUser.id);
    if (activeInList) {
      setCurrentUser(activeInList);
    }
  }, [users, currentUser.id]);

  // Layout text directions toggles
  const isRtl = language === 'fa';
  const t = translations[language];

  // Helper additions logic
  const handleAddDefect = (newDefect: Omit<DefectReport, 'id' | 'serialNumber' | 'reportDate'>) => {
    const defect: DefectReport = {
      ...newDefect,
      id: Date.now(),
      serialNumber: 'SMGD-' + Math.floor(100000 + Math.random() * 900000),
      reportDate: new Date().toLocaleDateString('fa-IR'),
    };
    
    // Unread notification triggering on submit
    const notif: Notification = {
      id: Date.now(),
      title: 'New report submitted: ' + defect.title,
      title_fa: 'ثبت گزارش جدید: ' + defect.title,
      text: `Reporter: ${defect.reporterName}. Status: Pending review`,
      text_fa: `توسط بازرس صادر گردید: ${defect.reporterName}. در انتظار تایید ممیز فنی.`,
      time: 'هم‌اکنون',
      isRead: false,
      type: defect.severity === 'critical' ? 'danger' : 'warning'
    };

    setDefects(prev => [defect, ...prev]);
    setNotifications(prev => [notif, ...prev]);
  };

  const handleUpdateDefectStatus = (id: number, status: 'draft' | 'pending' | 'in_progress' | 'resolved') => {
    setDefects(prev => prev.map(d => d.id === id ? { ...d, status } : d));

    // notification alert
    const target = defects.find(d => d.id === id);
    if (!target) return;
    
    const notif: Notification = {
      id: Date.now(),
      title: 'Ticket updated: ' + target.serialNumber,
      title_fa: 'تغییر وضعیت پیگیری بلیت: ' + target.serialNumber,
      text: `Status shifted to ${status}`,
      text_fa: `مراحل کار برای مغایرت کیفی با موفقیت تغییر کرد.`,
      time: 'چند ثانیه پیش',
      isRead: false,
      type: 'success'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const handleDeleteDefect = (id: number) => {
    setDefects(prev => prev.filter(d => d.id !== id));
  };

  const handleAddUser = (newUser: Omit<User, 'id' | 'createdAt'>) => {
    const user: User = {
      ...newUser,
      id: Date.now(),
      createdAt: new Date().toLocaleDateString('fa-IR')
    };
    setUsers(prev => [...prev, user]);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleUpdateAvatar = (id: number, filename: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, profile_image: filename } : u));
  };

  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const evt: CalendarEvent = {
      ...newEvent,
      id: Date.now()
    };
    setEvents(prev => [...prev, evt]);
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = (usernameVal: string) => {
    const matched = users.find(u => u.username === usernameVal);
    if (matched) {
      setCurrentUser(matched);
      setIsLoggedIn(true);
    } else {
      alert(language === 'fa' ? 'اطلاعات وارد شده همخوانی ندارد کلمه عبور پیش‌فرض admin است.' : 'Default username is "admin"');
    }
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden text-slate-800 ${isRtl ? 'lang-fa' : 'lang-en'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {!isLoggedIn ? (
        /* Login screen */
        <div className="flex-1 flex items-center justify-center bg-slate-900 p-6 font-vazir text-right">
          <div className="bg-white p-8 rounded-3xl shrink-0 w-full max-w-md shadow-2xl border border-slate-100 space-y-6">
            <div className="text-center space-y-2">
              <div className="h-14 w-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mx-auto border border-orange-200">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-md font-bold text-slate-900">ورود به پرتال هوشمند کنترل کیفی سروش موتور</h2>
              <p className="text-[10px] text-slate-400">سامانه متمرکز ثبت گزارش‌های ممیزی دپارتمان‌ها (SMGD)</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">دسترسی و نقش پرسنلی (بای‌پس برای تماشا)</label>
                <div className="space-y-2.5">
                  {users.map((u) => u.username !== 'placeholder' && (
                    <button
                      key={u.id}
                      onClick={() => handleLogin(u.username)}
                      className="w-full p-3.5 border border-slate-205 rounded-xl hover:border-orange-500 hover:bg-orange-50/10 flex items-center justify-between text-right cursor-pointer transition-all"
                    >
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono font-medium">{u.username}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">{u.fullName}</span>
                        <div className="h-7 w-7 rounded-full bg-slate-150 overflow-hidden border border-slate-250">
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
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono select-none">
              Soroush Motor Gorgan Co. © 2026
            </div>
          </div>
        </div>
      ) : (
        /* Main Application layout structure */
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          
          {/* Header controls top bar */}
          <Header
            currentUser={currentUser}
            language={language}
            setLanguage={setLanguage}
            notifications={notifications}
            markAllNotificationsAsRead={markAllNotificationsAsRead}
            onLogout={handleLogout}
            setCurrentView={setCurrentView}
          />

          <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar menu drawer panels */}
            <Sidebar
              currentView={currentView}
              setCurrentView={setCurrentView}
              language={language}
              currentUser={currentUser}
              onLogout={handleLogout}
            />

            {/* View contents area wrapper */}
            <main className="flex-1 p-6 overflow-y-auto relative bg-slate-50">
              
              {/* Render dynamic view selection */}
              {currentView === 'dashboard' && (
                <DashboardView
                  language={language}
                  defects={defects}
                  activeUsersCount={users.length}
                  setCurrentView={setCurrentView}
                />
              )}

              {currentView === 'calendar' && (
                <CalendarView
                  language={language}
                  events={events}
                  onAddEvent={handleAddEvent}
                  onDeleteEvent={handleDeleteEvent}
                />
              )}

              {currentView === 'forms' && (
                <FormsView
                  language={language}
                  onAddDefect={handleAddDefect}
                  currentUserFullName={currentUser.fullName}
                />
              )}

              {currentView === 'defects' && (
                <DefectReportsView
                  language={language}
                  defects={defects.filter(d => d.status !== 'draft')}
                  onUpdateStatus={handleUpdateDefectStatus}
                  onDeleteDefect={handleDeleteDefect}
                />
              )}

              {currentView === 'users' && (
                <UsersView
                  language={language}
                  users={users}
                  onAddUser={handleAddUser}
                  onDeleteUser={handleDeleteUser}
                  onUpdateUserAvatar={handleUpdateAvatar}
                />
              )}

              {currentView === 'settings' && (
                <SettingsView language={language} />
              )}

            </main>

          </div>

          {/* Quick mobile bottom navigation menu if iframe shrinks */}
          <footer className="no-print lg:hidden h-14 bg-slate-900 border-t border-slate-800 flex items-center justify-around text-slate-400 text-[10px] select-none shrink-0">
            <button onClick={() => setCurrentView('dashboard')} className={`flex flex-col items-center gap-1 cursor-pointer ${currentView === 'dashboard' ? 'text-white font-bold' : ''}`}>
              <LayoutDashboard className="h-4.5 w-4.5" />
              <span>{t.dashboard && 'داشبورد'}</span>
            </button>
            <button onClick={() => setCurrentView('calendar')} className={`flex flex-col items-center gap-1 cursor-pointer ${currentView === 'calendar' ? 'text-white font-bold' : ''}`}>
              <CalendarIcon className="h-4.5 w-4.5" />
              <span>{t.calendar && 'تقویم'}</span>
            </button>
            <button onClick={() => setCurrentView('forms')} className={`flex flex-col items-center gap-1 cursor-pointer ${currentView === 'forms' ? 'text-white font-bold' : ''}`}>
              <FileText className="h-4.5 w-4.5" />
              <span>{t.non_compliance_form && 'ثبت فرم'}</span>
            </button>
            <button onClick={() => setCurrentView('defects')} className={`flex flex-col items-center gap-1 cursor-pointer ${currentView === 'defects' ? 'text-white font-bold' : ''}`}>
              <AlertOctagon className="h-4.5 w-4.5" />
              <span>{t.defect_reports && 'گزارش‌ها'}</span>
            </button>
            <button onClick={() => setCurrentView('users')} className={`flex flex-col items-center gap-1 cursor-pointer ${currentView === 'users' ? 'text-white font-bold' : ''}`}>
              <UsersIcon className="h-4.5 w-4.5" />
              <span>{t.user_management && 'کاربران'}</span>
            </button>
          </footer>

        </div>
      )}

    </div>
  );
}
