import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, CheckCircle, Clock, Save, Printer, ArrowUpDown, ChevronDown, CheckSquare } from 'lucide-react';
import { Language, DefectReport } from '../types';
import { translations } from '../locales';

interface DefectReportsViewProps {
  language: Language;
  defects: DefectReport[];
  onUpdateStatus: (id: number, status: 'draft' | 'pending' | 'in_progress' | 'resolved') => void;
  onDeleteDefect: (id: number) => void;
}

export default function DefectReportsView({
  language,
  defects,
  onUpdateStatus,
  onDeleteDefect
}: DefectReportsViewProps) {
  const t = translations[language];

  // Table parameters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  
  // Selected single report for detailed modal / printable certificate
  const [selectedReport, setSelectedReport] = useState<DefectReport | null>(null);

  // Filter application
  const filteredDefects = defects.filter((defect) => {
    const matchesSearch =
      defect.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defect.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defect.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defect.reporterName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || defect.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || defect.severity === severityFilter;
    const matchesLocation = locationFilter === 'all' || defect.location === locationFilter;

    return matchesSearch && matchesStatus && matchesSeverity && matchesLocation;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[9px] font-bold border border-rose-200">{t.critical}</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold border border-amber-200">{t.high}</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[9px] font-bold border border-blue-200">{t.medium}</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-850 text-[9px] font-bold border border-emerald-200">{t.low}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
            <CheckCircle className="h-3 w-3" />
            <span>{t.resolved}</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
            <Clock className="h-3 w-3 animate-spin" strokeWidth={2.5} />
            <span>{t.in_progress}</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
            <ShieldAlert className="h-3 w-3 animate-pulse" />
            <span>{t.pending}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
            <Save className="h-3 w-3" />
            <span>{t.draft}</span>
          </span>
        );
    }
  };

  // Triggers print browser overlay
  const handlePrint = (defect: DefectReport) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const locName = t[defect.location as keyof typeof t] || defect.location;
    const sevName = t[defect.severity as keyof typeof t] || defect.severity;
    const statName = t[defect.status as keyof typeof t] || defect.status;

    printWindow.document.write(`
      <html>
        <head>
          <title>${defect.serialNumber} - Soroush Motor Gorgan</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap');
            body {
              font-family: 'Vazirmatn', sans-serif;
              direction: rtl;
              text-align: right;
              padding: 40px;
              color: #1e293b;
            }
            .header-banner {
              border-bottom: 3px double #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .title {
              font-size: 22px;
              font-weight: bold;
              color: #f97316;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            .meta-item {
              border: 1px solid #e2e8f0;
              padding: 12px;
              border-radius: 8px;
              background-color: #f8fafc;
            }
            .label {
              font-size: 11px;
              color: #64748b;
              font-weight: bold;
              margin-bottom: 4px;
            }
            .val {
              font-size: 13px;
              font-weight: bold;
            }
            .description {
              border: 1px solid #e2e8f0;
              padding: 20px;
              border-radius: 8px;
              line-height: 1.8;
              font-size: 13px;
              background-color: #fff;
              margin-bottom: 30px;
            }
            .footer-info {
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
            }
            .signature {
              width: 150px;
              height: 60px;
              border-bottom: 1px dashed #cbd5e1;
              text-align: center;
              line-height: 60px;
              font-style: italic;
              color: #94a3b8;
            }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header-banner">
            <div>
              <div class="title">برگه ثبت عدم انطباق کیفی محصول</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">شرکت تولیدی و صنعتی سروش موتور گرگان</div>
            </div>
            <div style="font-size: 14px; font-weight: bold; font-family: monospace;">${defect.serialNumber}</div>
          </div>
          
          <div class="meta-grid">
            <div class="meta-item">
              <div class="label">موضوع مغایرت / نقص</div>
              <div class="val">${defect.title}</div>
            </div>
            <div class="meta-item">
              <div class="label">تاریخ ثبت گزارش در سامانه</div>
              <div class="val" style="font-family: monospace;">${defect.reportDate}</div>
            </div>
            <div class="meta-item">
              <div class="label">واحد صنعتی صادرکننده</div>
              <div class="val">${locName}</div>
            </div>
            <div class="meta-item">
              <div class="label">رتبه خطای کیفی (شدت)</div>
              <div class="val">${sevName}</div>
            </div>
            <div class="meta-item">
              <div class="label">نام بازرس صادرکننده</div>
              <div class="val">${defect.reporterName}</div>
            </div>
            <div class="meta-item">
              <div class="label">وضعیت پیگیری فعلی</div>
              <div class="val">${statName}</div>
            </div>
          </div>

          <div style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">شرح دقیق فنی مغایرت و اقدامات پیشنهادی</div>
          <div class="description">
            ${defect.description.replace(/\n/g, '<br/>')}
          </div>

          <div class="footer-info">
            <div>تاریخ چاپ برگ: ${new Date().toLocaleDateString('fa-IR')}</div>
            <div>
              امضا و تائید بازرس کیفیت
              <div class="signature">سروش موتور</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 select-none font-vazir">
      
      {/* Search and Quick Header */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
        <div className="text-right">
          <h2 className="text-lg font-bold text-slate-800">{t.defect_reports}</h2>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">NON-CONVENTIONAL INSPECTIONS PANEL</span>
        </div>
        
        {/* Search Input bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.search_placeholder}
            className="w-full text-xs px-3.5 py-2 pl-9 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-orange-600 focus:outline-none text-right"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Roster Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-wrap md:flex-nowrap gap-4 justify-end text-right">
        
        {/* Unit Location Filter */}
        <div className="w-full sm:w-auto">
          <label className="block text-[10px] font-bold text-slate-400 mb-1">{t.nc_dept_label}</label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50/50 text-right cursor-pointer focus:outline-none"
          >
            <option value="all">کلیه واحدها (All)</option>
            <option value="assembly">{t.assembly}</option>
            <option value="paint">{t.paint}</option>
            <option value="warehouse">{t.warehouse}</option>
            <option value="quality">{t.quality}</option>
            <option value="maintenance">{t.maintenance}</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div className="w-full sm:w-auto">
          <label className="block text-[10px] font-bold text-slate-400 mb-1">شدت بحران (Severity)</label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50/50 text-right cursor-pointer focus:outline-none"
          >
            <option value="all">کلیه شدت‌ها (All)</option>
            <option value="low">{t.low}</option>
            <option value="medium">{t.medium}</option>
            <option value="high">{t.high}</option>
            <option value="critical">{t.critical}</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <label className="block text-[10px] font-bold text-slate-400 mb-1">وضعیت پیگیری (Status)</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50/50 text-right cursor-pointer focus:outline-none"
          >
            <option value="all">کلیه وضعیت‌ها (All)</option>
            <option value="pending">{t.pending}</option>
            <option value="in_progress">{t.in_progress}</option>
            <option value="resolved">{t.resolved}</option>
            <option value="draft">{t.draft}</option>
          </select>
        </div>

      </div>

      {/* Roster of Defects table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold">
              <tr>
                <th className="p-4 text-center">شماره رهگیری</th>
                <th className="p-4">موضوع و عنوان عدم انطباق</th>
                <th className="p-4">واحد مربوطه</th>
                <th className="p-4">شدت</th>
                <th className="p-4">گزارش‌دهنده</th>
                <th className="p-4">وضعیت پیگیری</th>
                <th className="p-4 text-center no-print">عملیات تصحیح کارتابل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredDefects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-450 text-[11px]">
                    هیچ مورد منطبق با فیلترها در لیست نقص ها یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredDefects.map((defect) => (
                  <tr key={defect.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-center font-mono font-semibold text-slate-500">{defect.serialNumber}</td>
                    <td className="p-4 font-bold text-slate-900">
                      <div>{defect.title}</div>
                      <div className="text-[10px] font-normal text-slate-400 truncate max-w-sm mt-0.5">{defect.description}</div>
                    </td>
                    <td className="p-4">{t[defect.location as keyof typeof t] || defect.location}</td>
                    <td className="p-4">{getSeverityBadge(defect.severity)}</td>
                    <td className="p-4 text-slate-500">{defect.reporterName}</td>
                    <td className="p-4">{getStatusBadge(defect.status)}</td>
                    <td className="p-4 no-print text-center flex items-center justify-center gap-1.5">
                      
                      {defect.status !== 'resolved' && (
                        <button
                          onClick={() => onUpdateStatus(defect.id, defect.status === 'pending' ? 'in_progress' : 'resolved')}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-transparent transition-all cursor-pointer font-bold text-[10px]"
                          title="تغییر وضعیت گام پیگیری"
                        >
                          {defect.status === 'pending' ? 'شروع پیگیری' : 'حل این مغایرت'}
                        </button>
                      )}

                      <button
                        onClick={() => handlePrint(defect)}
                        className="p-1 px-1.5 rounded border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all cursor-pointer"
                        title="چاپ شناسنامه نقص فنی"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
