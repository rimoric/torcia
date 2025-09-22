// AutomaticProcessPanel.tsx - Step 7: Automatic Process and Shutdown Component
import React from 'react';
import { Fase } from '../../types/process';

interface ChecklistItems {
  pressioni: boolean;
  valvole: boolean;
  torcia: boolean;
  bombole: boolean;
  utenze: boolean;
  strumenti: boolean;
}

interface AutomaticProcessPanelProps {
  processoAutomaticoStarted: boolean;
  setProcessoAutomaticoStarted: (value: boolean) => void;
  processoAutomaticoCompleto: boolean;
  setProcessoAutomaticoCompleto: (value: boolean) => void;
  geShutdownDone: boolean;
  setGeShutdownDone: (value: boolean) => void;
  timer: number;
  startTimer: (seconds: number) => void;
  setFase: (value: Fase) => void;
  setGeOn: (value: boolean) => void;
  setGeRpm: (value: number) => void;
  checklistItems: ChecklistItems;
  setChecklistItems: (value: ChecklistItems | ((prev: ChecklistItems) => ChecklistItems)) => void;
  pushLog: (message: string) => void;
}

export default function AutomaticProcessPanel({
  processoAutomaticoStarted,
  setProcessoAutomaticoStarted,
  processoAutomaticoCompleto,
  setProcessoAutomaticoCompleto,
  geShutdownDone,
  setGeShutdownDone,
  timer,
  startTimer,
  setFase,
  setGeOn,
  setGeRpm,
  checklistItems,
  setChecklistItems,
  pushLog
}: AutomaticProcessPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-xl border border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-6 text-lg">🔄 Processo Automatico e Spegnimento</h4>
        
        <div className="space-y-4">
          {/* Start automatic process */}
          {!processoAutomaticoStarted && (
            <button
              onClick={() => {
                setProcessoAutomaticoStarted(true);
                startTimer(30); // Simulated combined process time
                setFase("Stasi");
                pushLog("Avviato processo automatico: Stasi → Depressurizzazione → Scarico linee → Scarico generatore");
              }}
              className="w-full px-6 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-semibold shadow-lg"
            >
              🚀 AVVIA Processo Automatico
            </button>
          )}

          {/* Process progress */}
          {processoAutomaticoStarted && !processoAutomaticoCompleto && (
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-slate-700 font-semibold">Processo automatico in corso...</p>
                <p className="text-sm text-slate-600">{timer}s rimanenti</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-slate-500 to-slate-600 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${((30 - timer) / 30) * 100}%` }}
                />
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>• Stasi stabilizzazione pressione</div>
                <div>• Depressurizzazione automatica verso torcia</div>
                <div>• Scarico automatico linee</div>
                <div>• Scarico linea generatore</div>
              </div>
            </div>
          )}

          {/* Process completed - GE shutdown */}
          {timer === 0 && processoAutomaticoStarted && !processoAutomaticoCompleto && (
            <div className="space-y-3">
              <button
                onClick={() => {
                  setProcessoAutomaticoCompleto(true);
                  pushLog("Processo automatico completato");
                }}
                className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                ✅ Conferma Processo Completato
              </button>
            </div>
          )}

          {/* GE shutdown button */}
          {processoAutomaticoCompleto && !geShutdownDone && (
            <div className="space-y-3">
              <div className="text-center p-3 bg-green-100 rounded-lg border border-green-400">
                <p className="text-green-800 font-semibold">✅ Processo automatico completato</p>
              </div>
              <button
                onClick={() => {
                  setGeShutdownDone(true);
                  setGeOn(false);
                  setGeRpm(0);
                  pushLog("Gruppo Elettrogeno spento");
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg"
              >
                🛑 SPEGNI Gruppo Elettrogeno
              </button>
            </div>
          )}

          {/* All done */}
          {geShutdownDone && (
            <div className="text-center p-4 bg-blue-100 rounded-lg border border-blue-400">
              <p className="text-blue-800 font-bold text-lg">🎯 Processo Completato</p>
              <p className="text-blue-600 text-sm">Tutte le operazioni automatiche completate e GE spento</p>
            </div>
          )}

          {/* Final checklist */}
          {geShutdownDone && (
            <div className="mt-6 p-4 bg-slate-100 rounded-lg border border-slate-300">
              <h5 className="font-semibold text-slate-700 mb-3">Checklist finale - Verificare:</h5>
              <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={checklistItems.pressioni} 
                    onChange={(e) => setChecklistItems(prev => ({...prev, pressioni: e.target.checked}))} 
                  />
                  <span>📊 Pressioni = 0</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={checklistItems.valvole} 
                    onChange={(e) => setChecklistItems(prev => ({...prev, valvole: e.target.checked}))} 
                  />
                  <span>🔧 Tutte le valvole chiuse</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={checklistItems.torcia} 
                    onChange={(e) => setChecklistItems(prev => ({...prev, torcia: e.target.checked}))} 
                  />
                  <span>🔥 Torcia smontata e riposta</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={checklistItems.bombole} 
                    onChange={(e) => setChecklistItems(prev => ({...prev, bombole: e.target.checked}))} 
                  />
                  <span>🗜️ Bombole chiuse</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={checklistItems.utenze} 
                    onChange={(e) => setChecklistItems(prev => ({...prev, utenze: e.target.checked}))} 
                  />
                  <span>⚡ Utenze spente</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={checklistItems.strumenti} 
                    onChange={(e) => setChecklistItems(prev => ({...prev, strumenti: e.target.checked}))} 
                  />
                  <span>🔋 Vallen/PLC/monitor spenti; batteria disattivata</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
