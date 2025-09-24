// GeneratorPanel.tsx - Step 4: Generator Startup Component
import React from 'react';

interface GeneratorPanelProps {
  geStarted: boolean;
  setGeStarted: (value: boolean) => void;
  geWarmupComplete: boolean;
  setGeWarmupComplete: (value: boolean) => void;
  geOperational: boolean;
  setGeOperational: (value: boolean) => void;
  geRpm: number;
  setGeRpm: (value: number) => void;
  warmup: number;
  startWarmup: () => void;
  pushLog: (message: string) => void;
}

export default function GeneratorPanel({
  geStarted,
  setGeStarted,
  geWarmupComplete,
  setGeWarmupComplete,
  geOperational,
  setGeOperational,
  geRpm,
  setGeRpm,
  warmup,
  startWarmup,
  pushLog
}: GeneratorPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-6 text-lg">⚡ Gruppo Elettrogeno</h4>
        
        <div className="space-y-4">
          {/* Start button */}
          {!geStarted && (
            <button
              onClick={() => {
                setGeStarted(true);
                setGeRpm(1500);
                startWarmup();
                pushLog("GE avviato a 1500 giri/min - Iniziato riscaldamento");
              }}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg"
            >
              🚀 START - Avvia Gruppo Elettrogeno
            </button>
          )}

          {/* Warmup progress */}
          {geStarted && !geWarmupComplete && (
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-blue-700 font-semibold">GE a 1500 giri/min - Riscaldamento in corso</p>
                <p className="text-sm text-blue-600">{warmup}s rimanenti</p>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-6 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-6 rounded-full transition-all duration-1000 relative overflow-hidden"
                  style={{ width: `${((10 - warmup) / 10) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 animate-pulse" />
                </div>
              </div>
              <div className="text-center text-xs text-blue-600">
                Progresso riscaldamento: {Math.round(((10 - warmup) / 10) * 100)}%
              </div>
            </div>
          )}

          {/* 3000 rpm activation */}
          {geStarted && warmup === 0 && !geOperational && (
            <div className="space-y-3">
              <div className="text-center p-3 bg-green-100 rounded-lg border border-green-400">
                <p className="text-green-800 font-semibold">Riscaldamento completato</p>
              </div>
              <button
                onClick={() => {
                  setGeRpm(3000);
                  setGeOperational(true);
                  setGeWarmupComplete(true);
                  pushLog("GE portato a 3000 giri/min - Regime operativo");
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg"
              >
                ⚡ Funzionamento 3000 giri/min
              </button>
            </div>
          )}

          {/* Operational status */}
          {geOperational && (
            <div className="text-center p-4 bg-green-100 rounded-lg border border-green-400">
              <p className="text-green-800 font-bold text-lg">✅ GE Operativo a 3000 giri/min</p>
              <p className="text-green-600 text-sm">Pronto per il passo successivo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
