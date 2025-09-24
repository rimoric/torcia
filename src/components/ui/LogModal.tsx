// LogModal.tsx - System Log Modal Component
import React from 'react';
import { X, FileText } from 'lucide-react';

interface LogModalProps {
  logModalOpen: boolean;
  setLogModalOpen: (open: boolean) => void;
  log: string[];
  setLog: (log: string[]) => void;
}

export default function LogModal({
  logModalOpen,
  setLogModalOpen,
  log,
  setLog
}: LogModalProps) {
  if (!logModalOpen) return null;

  const getEntryStyle = (entry: string) => {
    if (entry.includes('Errore')) {
      return 'bg-gradient-to-r from-red-50 to-red-100 border-red-400 text-red-800';
    }
    if (entry.includes('OK') || entry.includes('completat')) {
      return 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-400 text-emerald-800';
    }
    if (entry.includes('avviat') || entry.includes('Passaggio')) {
      return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 text-blue-800';
    }
    return 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-400 text-slate-700';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => setLogModalOpen(false)} 
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Log Eventi Sistema
              </h3>
              <p className="text-sm text-slate-500">{log.length} eventi registrati</p>
            </div>
          </div>
          <button
            onClick={() => setLogModalOpen(false)}
            className="p-2 hover:bg-white/80 rounded-xl transition-all duration-200 hover:shadow-lg"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50 to-white">
          <div className="space-y-3">
            {log.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg">Nessun evento registrato</p>
              </div>
            ) : (
              log.map((entry, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl shadow-sm border-l-4 transition-all duration-200 hover:shadow-md ${getEntryStyle(entry)}`}
                >
                  <span className="font-mono text-sm leading-relaxed">{entry}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 flex justify-between items-center">
          <div className="text-sm text-slate-600">
            <span className="font-medium">{log.length}</span> eventi totali
          </div>
          <button
            onClick={() => setLog([])}
            className="px-4 py-2 bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 rounded-lg transition-all duration-200 text-slate-700 font-medium shadow-sm hover:shadow-md"
          >
            🗑️ Cancella Log
          </button>
        </div>
      </div>
    </div>
  );
}
