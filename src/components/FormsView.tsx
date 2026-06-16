import React, { useState, useRef } from 'react';
import { FileText, Upload, ShieldAlert, Sparkles, CheckCircle2, FileUp, ClipboardList } from 'lucide-react';
import { Language, DefectReport } from '../types';
import { translations } from '../locales';

interface FormsViewProps {
  language: Language;
  onAddDefect: (defect: Omit<DefectReport, 'id' | 'serialNumber' | 'reportDate'>) => void;
  currentUserFullName: string;
}

export default function FormsView({
  language,
  onAddDefect,
  currentUserFullName
}: FormsViewProps) {
  const t = translations[language];

  // Form input states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('mechanical');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [location, setLocation] = useState('assembly');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop mechanics
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).map((f: any) => f.name);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files).map((f: any) => f.name);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    // Trigger state insert
    onAddDefect({
      title,
      type,
      severity,
      location,
      description,
      reporterName: currentUserFullName,
      status: 'pending',
      attachments
    });

    const randomTicket = 'SMGD-' + Math.floor(100000 + Math.random() * 900000);
    setGeneratedId(randomTicket);
    setShowSuccess(true);

    // Reset fields
    setTitle('');
    setType('mechanical');
    setSeverity('medium');
    setLocation('assembly');
    setDescription('');
    setAttachments([]);
  };

  const handleSaveDraft = () => {
    if (!title) return;
    onAddDefect({
      title,
      type,
      severity,
      location,
      description: description || '(بدون شرح جزییات ممیزی)',
      reporterName: currentUserFullName,
      status: 'draft',
      attachments
    });

    alert(t.success_draft_save);
    
    // Reset
    setTitle('');
    setDescription('');
    setAttachments([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none font-vazir">
      
      <div className="text-right pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center justify-end gap-2">
          <span>{t.non_compliance_form}</span>
          <FileText className="h-5 w-5 text-orange-600" />
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {t.form_subtitle}
        </p>
      </div>

      {showSuccess ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center shadow-lg animate-fade-in space-y-5">
          <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-emerald-950">ثبت با موفقیت انجام شد!</h3>
            <p className="text-xs text-emerald-700 max-w-lg mx-auto">
              {t.success_form_submit}
            </p>
          </div>
          <div className="bg-white py-3 px-6 rounded-2xl border border-emerald-100 inline-block">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">کد پیگیری گزارش (Ticket Code)</span>
            <span className="text-lg font-black text-slate-800 font-mono tracking-widest">{generatedId}</span>
          </div>
          <div>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/10"
            >
              ثبت فرم مجدد
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
            
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t.nc_title_label} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'fa' ? 'مثال: خطای ضخامت ترانسفورماتور یا خراشیدگی باک سوخت موتور سیکلت' : 'e.g. Engine cover paint scratch'}
                className="w-full text-xs px-3 py-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-orange-600 focus:outline-none bg-slate-50/50 text-right font-medium"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t.nc_type_label}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs px-3 py-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-orange-600 focus:outline-none bg-slate-50/50 text-right cursor-pointer"
              >
                <option value="mechanical">{language === 'fa' ? 'مکانیکی و شاسی (Mechanical)' : 'Mechanical'}</option>
                <option value="electrical">{language === 'fa' ? 'سیم‌کشی و التریکال (Electrical)' : 'Electrical'}</option>
                <option value="paint">{language === 'fa' ? 'رنگ و پولیش (Paint & Workshop)' : 'Paint Shop'}</option>
                <option value="quality">{language === 'fa' ? 'تکنیکال و بدنه (Bodywork)' : 'Quality Standard'}</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center justify-end gap-1">
                <span>{t.nc_severity_label}</span>
                <ShieldAlert className="h-3.5 w-3.5 text-orange-500" />
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full text-xs px-3 py-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-orange-600 focus:outline-none bg-slate-50/50 text-right cursor-pointer"
              >
                <option value="low">{t.low}</option>
                <option value="medium">{t.medium}</option>
                <option value="high">{t.high}</option>
                <option value="critical">{t.critical}</option>
              </select>
            </div>

            {/* Location (Department) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t.nc_dept_label}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'assembly', label: t.assembly },
                  { id: 'paint', label: t.paint },
                  { id: 'warehouse', label: t.warehouse },
                  { id: 'quality', label: t.quality },
                  { id: 'maintenance', label: t.maintenance },
                  { id: 'admin_dept', label: t.admin_dept },
                ].map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setLocation(dept.id)}
                    className={`p-3 text-xs border rounded-xl font-medium transition-all cursor-pointer ${
                      location === dept.id
                        ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {dept.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t.nc_desc_label} *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={language === 'fa' ? 'جزییات فنی بروز عدم انطباق اعم از اندازه خطا، قطعات درگیر و شماره کارتن محموله را ثبت کنید...' : 'Enter details here...'}
                className="w-full text-xs px-3 py-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-orange-600 focus:outline-none bg-slate-50/50 text-right font-medium"
              />
            </div>

            {/* File Drag & Drop conforming to UI file upload guidelines */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                {t.nc_attach_label}
              </label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragActive
                    ? 'border-orange-500 bg-orange-50/50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <FileUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">{t.drag_drop_files}</p>
                  <p className="text-[10px] text-slate-400 mt-1">پشتیبانی از فرمت‌های JPG, PNG, PDF, DOCX (حداکثر ۱۰ مگابایت)</p>
                </div>
              </div>

              {/* Attached Files List */}
              {attachments.length > 0 && (
                <div className="mt-3.5 space-y-1.5 text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">سندهای ضمیمه شده:</span>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="py-1 px-3 rounded-lg bg-orange-50 border border-orange-100 text-[11px] text-orange-900 flex items-center gap-2"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(idx)}
                          className="hover:text-rose-600 font-bold transition-colors cursor-pointer"
                        >
                          ✕
                        </button>
                        <span className="font-medium font-mono">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

          <div className="h-[1px] bg-slate-150 my-6"></div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-orange-600/15"
            >
              {t.submit_nc_btn}
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={!title}
              className={`px-4 text-xs border border-slate-200 rounded-xl transition-all font-semibold ${
                title
                  ? 'hover:bg-slate-50 text-slate-700 cursor-pointer'
                  : 'opacity-50 text-slate-400 cursor-not-allowed'
              }`}
            >
              {t.save_draft_btn}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
