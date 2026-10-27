import React, { useState } from 'react';
import { phpCodeFiles, CodeFile } from '../data/phpCodeFiles';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Copy, Check, Download, FileCode, Terminal, Database, Server } from 'lucide-react';

interface BackendCodeViewerProps {
  currentLang: Language;
}

export const BackendCodeViewer: React.FC<BackendCodeViewerProps> = ({ currentLang }) => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(phpCodeFiles[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1 font-mono">
              <Server className="w-4 h-4" />
              <span>Full-Stack Architecture & Standalone Codebase</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              PHP 8+ / PDO Backend & MySQL Schema Inspector
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              These production-ready scripts implement strict prepared-statement security, 16-digit Rwandan Indangamuntu verification, 9-digit TIN rules, and bilingual response models.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300">
              MySQL 8.0+
            </span>
            <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300">
              PHP 8.2+ PDO
            </span>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Sidebar: File List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-3 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            Project Files / Dosiyé
          </div>

          {phpCodeFiles.map((file) => {
            const isSelected = selectedFile.filename === file.filename;
            return (
              <button
                key={file.filename}
                onClick={() => { setSelectedFile(file); setCopied(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-50 text-sky-900 font-bold border border-sky-200 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {file.language === 'sql' ? (
                    <Database className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <FileCode className="w-4 h-4 text-sky-700 shrink-0" />
                  )}
                  <span className="truncate">{file.filename}</span>
                </div>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100 px-3 text-[11px] text-slate-500 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-600" />
              <span>Local Quick Setup:</span>
            </div>
            <code className="block p-2 bg-slate-100 rounded text-[10px] font-mono text-slate-700 select-all">
              mysql -u root &lt; schema.sql
            </code>
            <code className="block p-2 bg-slate-100 rounded text-[10px] font-mono text-slate-700 select-all">
              php -S localhost:8000
            </code>
          </div>
        </div>

        {/* Code View Area */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          
          {/* File Header & Action Controls */}
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 text-xs">{selectedFile.filename}</span>
                <span className="text-[11px] text-slate-400 font-mono">({selectedFile.language.toUpperCase()})</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{selectedFile.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-1.5 transition-colors"
                title="Download file directly"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Syntax Highlighted Box */}
          <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto max-h-[600px] leading-relaxed select-all">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
