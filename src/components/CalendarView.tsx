import React, { useState } from 'react';
import { Plus, Trash, Edit3, Calendar as CalendarIcon, Tag, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Language, CalendarEvent } from '../types';
import { translations } from '../locales';

interface CalendarViewProps {
  language: Language;
  events: CalendarEvent[];
  onAddEvent: (evt: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: number) => void;
}

export default function CalendarView({
  language,
  events,
  onAddEvent,
  onDeleteEvent
}: CalendarViewProps) {
  const t = translations[language];

  // Forms states
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'inspection' | 'maintenance' | 'audit' | 'meeting' | 'urgent'>('inspection');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !start) return;

    onAddEvent({
      title,
      start,
      end: end || start, // default to start date
      description,
      category,
    });

    // Reset fields
    setTitle('');
    setStart('');
    setEnd('');
    setDescription('');
    setCategory('inspection');
    setShowAddForm(false);
  };

  const getCategoryDetails = (cat: string) => {
    switch (cat) {
      case 'urgent':
        return { color: 'bg-rose-50 border-rose-200 text-rose-700', label: t.urgent, bullet: 'bg-rose-500' };
      case 'maintenance':
        return { color: 'bg-amber-50 border-amber-200 text-amber-700', label: t.maintenance_evt, bullet: 'bg-amber-500' };
      case 'audit':
        return { color: 'bg-purple-50 border-purple-200 text-purple-700', label: t.audit, bullet: 'bg-purple-500' };
      case 'meeting':
        return { color: 'bg-blue-50 border-blue-200 text-blue-700', label: t.meeting, bullet: 'bg-blue-500' };
      default:
        return { color: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: t.inspection, bullet: 'bg-emerald-500' };
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h2 className="text-lg font-bold text-slate-800">{t.calendar_title}</h2>
          <p className="text-[11px] text-slate-500 font-medium">
            {language === 'fa' ? 'مدیریت و برنامه‌ریزی ممیزی‌های خط تولید سروش موتور گرگان' : 'Management of Soroush Motor Gorgan workflow inspection processes'}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer shadow-md shadow-orange-600/10"
        >
          <Plus className="h-4 w-4" />
          <span>{t.add_event}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Events Schedule List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <CalendarIcon className="h-4 w-4 text-slate-400" />
              <span>{language === 'fa' ? 'رویدادهای ثبت شده جاری' : 'Registered Quality Audits'}</span>
            </h3>

            {events.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {language === 'fa' ? 'هیچ رویدادی در این بخش برنامه‌ریزی نشده است.' : 'No audit events registered in current cycle.'}
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((evt) => {
                  const catInfo = getCategoryDetails(evt.category);
                  return (
                    <div
                      key={evt.id}
                      className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-all hover:translate-x-[-2px] ${catInfo.color}`}
                    >
                      <div className="flex-1 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-xs font-bold text-slate-800">{evt.title}</span>
                          <span className={`h-2 w-2 rounded-full ${catInfo.bullet}`}></span>
                        </div>
                        {evt.description && (
                          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                            {evt.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 justify-end text-[10px] text-slate-400 font-mono">
                          <span>{t.start_date}: {evt.start}</span>
                          <span>{t.end_date}: {evt.end}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/80 font-bold border border-slate-200/50">
                          {catInfo.label}
                        </span>
                        <button
                          onClick={() => onDeleteEvent(evt.id)}
                          className="p-1 rounded-lg bg-white/80 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200/50 transition-all cursor-pointer"
                          title={t.delete_user}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Add Calendar Event Side Widget */}
        <div className="space-y-4">
          
          {showAddForm && (
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
              <h3 className="text-xs font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 text-right">
                {t.add_event}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3.5 text-right font-vazir">
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    {t.event_title_label} *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={language === 'fa' ? 'مثال: ممیزی بدنه خودرو مینی‌بوس الوند' : 'e.g. Paint lab annual review'}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 bg-slate-50/50 text-right"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      {t.start_date} *
                    </label>
                    <input
                      type="date"
                      required
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                      className="w-full text-xs px-2 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 bg-slate-50/50 direction-ltr text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      {t.end_date}
                    </label>
                    <input
                      type="date"
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                      className="w-full text-xs px-2 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 bg-slate-50/50 direction-ltr text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    {t.event_category}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 bg-slate-50/50 text-right"
                  >
                    <option value="inspection">{t.inspection}</option>
                    <option value="maintenance">{t.maintenance_evt}</option>
                    <option value="audit">{t.audit}</option>
                    <option value="meeting">{t.meeting}</option>
                    <option value="urgent">{t.urgent}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    {t.event_desc}
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={language === 'fa' ? 'جزییات ممیزی یا موارد ایمنی...' : 'Additional details...'}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 bg-slate-50/50 text-right"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs py-2 rounded-lg transition-all cursor-pointer"
                  >
                    {t.save_user}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 text-xs transition-all cursor-pointer"
                  >
                    انصراف
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Quick Informational Panel card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
            <h3 className="text-xs font-bold mb-3 text-right">💡 نکات ممیزی زمان‌بندی شده</h3>
            <p className="text-[10px] text-slate-400 leading-relaxed text-right">
              بر اساس استانداردهای بازرسی کارگاهی شرکت سروش موتور گرگان، ثبت ممیزی‌ها برای تمامی تکنسین‌های خط اول و مدیران دپارتمان‌ها به صورت ایمیل و نوتیفیکیشن صادر می‌شود.
            </p>
            <div className="mt-4 border-t border-slate-800 pt-3 space-y-2 text-right">
              <div className="flex items-center justify-end gap-2 text-[9px] text-rose-400">
                <span>تثبیت اقدامات اصلاحی بر دوش واحد QC</span>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
              </div>
              <div className="flex items-center justify-end gap-2 text-[9px] text-amber-400">
                <span>تست پایداری ۲۴ ساعته تجهیزات الکتریکال</span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
