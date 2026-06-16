import React, { useState, useEffect } from 'react';
import { Bell, Globe, Sparkles, User as UserIcon, Shield, LogOut, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { User, Language, Notification } from '../types';
import { translations } from '../locales';

interface HeaderProps {
  currentUser: User;
  language: Language;
  setLanguage: (lang: Language) => void;
  notifications: Notification[];
  markAllNotificationsAsRead: () => void;
  onLogout: () => void;
  setCurrentView: (view: string) => void;
}

export default function Header({
  currentUser,
  language,
  setLanguage,
  notifications,
  markAllNotificationsAsRead,
  onLogout,
  setCurrentView
}: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  const t = translations[language];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Real-time clock update (fully formatted)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (language === 'fa') {
        // Simple Jalali-equivalent format in Persian
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          calendar: 'persian',
          numberingSystem: 'latn'
        } as any;
        setTimeStr(new Intl.DateTimeFormat('fa-IR', options).format(now));
      } else {
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };
        setTimeStr(new Intl.DateTimeFormat('en-US', options).format(now));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  // Bug Fix Visualization:
  // In the DB, the image is saved only as e.g. "admin.jpg".
  // Inside the user management section, we build the path: "../images/profiles/" + user.profile_image.
  // In the header, we must build: `/images/profiles/${user.profile_image}` to ensure it loads consistently from any page depth!
  const dbFileName = currentUser?.profile_image || 'admin.jpg';
  
  // Clean fallback in case image file does not exist locally inside the virtual sandbox,
  // we fallback to an SVG UI or safe image generator.
  const constructedPath = `/images/profiles/${dbFileName}`;

  // Safe fallback avatar generator (in case physical images are missing or Persian characters block loading on some configurations)
  const [imgError, setImgError] = useState(false);
  
  // If the language or user changes, reset error state to retry loading path
  useEffect(() => {
    setImgError(false);
  }, [currentUser, language]);

  return (
    <header className="no-print bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      
      {/* Search Input and App Logo */}
      <div className="flex items-center gap-4">
        {/* Dynamic Logo Text */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-orange-600/20">
            SM
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm font-bold text-slate-800 leading-none">
              SMGD CO.
            </h1>
            <span className="text-[10px] text-slate-500 font-medium">
              Soroush Motor Gorgan
            </span>
          </div>
        </div>
        
        <div className="h-4 w-[1px] bg-slate-200 hidden md:block"></div>
        
        {/* Localization Indicator */}
        <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] text-slate-600 font-medium">
          <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
          {t.app_title}
        </span>
      </div>

      {/* Right Side Tools */}
      <div className="flex items-center gap-4">
        
        {/* Current Time Display */}
        <div className="hidden md:flex flex-col text-right">
          <span className="text-[10px] font-semibold text-slate-400">
            {t.current_time}
          </span>
          <span className={`text-[12px] font-medium text-slate-700 ${language === 'fa' ? 'font-vazir' : 'font-mono text-xs'}`}>
            {timeStr}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 hidden md:block"></div>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium cursor-pointer"
          title={t.language}
          id="lang-switcher"
        >
          <Globe className="h-3.5 w-3.5 text-blue-500" />
          <span>{language === 'fa' ? 'English' : 'فارسی'}</span>
        </button>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationDropdown(!showNotificationDropdown);
              setShowProfileDropdown(false);
            }}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-all relative cursor-pointer"
            id="notification-bell"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 flex items-center justify-center bg-rose-500 text-white text-[10px] rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotificationDropdown && (
            <div className={`absolute top-12 ${language === 'fa' ? 'left-0' : 'right-0'} w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-55 max-h-96 overflow-hidden flex flex-col`}>
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{t.notifications}</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      markAllNotificationsAsRead();
                      setShowNotificationDropdown(false);
                    }}
                    className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    خوانده شده همه (Read All)
                  </button>
                )}
              </div>
              <div className="overflow-y-auto max-h-72">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    {t.no_activity}
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => setCurrentView('notifications')}
                      className={`p-3.5 border-b border-slate-100 last:border-b-0 flex gap-2.5 hover:bg-slate-50 cursor-pointer transition-all ${
                        !notif.isRead ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'success' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                        {notif.type === 'danger' && <AlertTriangle className="h-4 w-4 text-rose-500" />}
                        {notif.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                        {notif.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-semibold text-slate-700 truncate">
                          {language === 'fa' ? notif.title_fa : notif.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                          {language === 'fa' ? notif.text_fa : notif.text}
                        </p>
                        <span className="text-[8px] text-slate-400 font-mono block mt-1">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with dynamic bug diagnostic displaying database filename and correct URL path */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotificationDropdown(false);
            }}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            id="user-menu-button"
          >
            {/* Header image fix implementation */}
            <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center shadow-inner relative">
              {!imgError ? (
                <img
                  src={constructedPath}
                  alt={currentUser.fullName}
                  className="h-full w-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                /* Dynamic visual fallback styling when the physical mock folder doesn't contain the specific image */
                <span className="text-slate-600 font-bold text-xs">
                  {currentUser.fullName.charAt(0)}
                </span>
              )}
            </div>
            
            <div className="hidden md:flex flex-col text-left items-start">
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                {currentUser.fullName}
              </span>
              <span className="text-[9px] text-slate-500">
                {t[currentUser?.role as keyof typeof t] || currentUser.role}
              </span>
            </div>
          </button>

          {showProfileDropdown && (
            <div className={`absolute top-12 ${language === 'fa' ? 'left-0' : 'right-0'} w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-55 p-4 flex flex-col font-vazir text-right`}>
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="h-12 w-12 rounded-full bg-orange-100/80 border border-orange-200 overflow-hidden flex items-center justify-center text-orange-600 font-bold text-lg">
                  {!imgError ? (
                    <img
                      src={constructedPath}
                      alt={currentUser.fullName}
                      className="h-full w-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    currentUser.fullName.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-800">{currentUser.fullName}</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{currentUser.email}</p>
                </div>
              </div>

              {/* Path and Database Diagnostic Info to explain the bug directly in the app! */}
              <div className="my-3 px-3 py-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-950 text-right">
                <div className="flex items-center gap-1.5 mb-1 justify-end">
                  <span className="text-[10px] font-bold">🔍 اصلاحیه مسیردهی تصویر در هدر</span>
                  <Shield className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed mb-2">
                  {t.avatar_path_info}
                </p>
                <div className="space-y-1 font-mono text-[9px] text-slate-500">
                  <div className="flex justify-between direction-ltr bg-white/70 px-2 py-0.5 rounded border border-indigo-100/50">
                    <span className="font-semibold text-rose-600">{dbFileName}</span>
                    <span className="text-slate-400">نام در دیتابیس:</span>
                  </div>
                  <div className="flex justify-between direction-ltr bg-white/70 px-2 py-0.5 rounded border border-indigo-100/50">
                    <span className="font-semibold text-emerald-600">{constructedPath}</span>
                    <span className="text-slate-400">مسیر تولیدی هدر:</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setCurrentView('settings');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <span className="text-slate-400 font-mono">⌘P</span>
                  <span>{t.settings}</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('users');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <span className="text-slate-400 font-mono">⌘U</span>
                  <span>{t.user_management}</span>
                </button>
                <div className="h-[1px] bg-slate-100 my-2"></div>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-semibold">{t.logout}</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
