// PressurizationPanel.tsx - Step 6: Pressurization (i18n)
import React from 'react';
import { Fase } from '../../types/process';
import { useTranslation } from '../../i18n';

interface PressurizationPanelProps {
  pressurizzazioneProgress: number;
  setPressurizzazioneProgress: (value: number) => void;
  pressurizzazioneDuration: number;
  setFase: (value: Fase) => void;
  P_serb: number;
  pushLog: (message: string) => void;
  settingsLimits: any;
}

export default function PressurizationPanel({
  pressurizzazioneProgress,
  setPressurizzazioneProgress,
  pressurizzazioneDuration,
  setFase,
  P_serb,
  pushLog,
  settingsLimits
}: PressurizationPanelProps) {
  const { t } = useTranslation();
  
  const startPressurization = () => {
    setFase("Pressurizzazione");
    pushLog(t('messages.pressurizationStarted'));
    
    // Start progress bar
    const duration = pressurizzazioneDuration * 1000; // ms
    const interval = 100; // update every 100ms
    const increment = (interval / duration) * 100;
    
    const progressTimer = setInterval(() => {
      setPressurizzazioneProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          pushLog(t('messages.pressurizationComplete'));
          return 100;
        }
        return newProgress;
      });
    }, interval);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
        <h4 className="font-semibold text-indigo-800 mb-4">
          {t('pressurization.title')}
        </h4>
        <p className="text-indigo-700 text-sm mb-4">
          {t('pressurization.description')}
        </p>
        
        {pressurizzazioneProgress === 0 && (
          <button 
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105" 
            onClick={startPressurization}
          >
            🚀 {t('pressurization.startPressurization')}
          </button>
        )}
        
        {pressurizzazioneProgress > 0 && pressurizzazioneProgress < 100 && (
          <div className="space-y-3">
            <div className="text-center text-indigo-700 font-semibold">
              ⚡ {t('pressurization.inProgress')}
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-4 shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 h-4 rounded-full transition-all duration-100 shadow-lg relative overflow-hidden"
                style={{ width: `${pressurizzazioneProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 animate-pulse" />
              </div>
            </div>
            <div className="text-center text-sm text-indigo-600">
              {Math.round(pressurizzazioneProgress)}% - {t('pressurization.estimatedTime')}: {Math.round(pressurizzazioneDuration * (100 - pressurizzazioneProgress) / 100)}{t('common.seconds')}
            </div>
          </div>
        )}
        
        {pressurizzazioneProgress >= 100 && (
          <div className="text-center p-3 bg-green-100 rounded-lg border border-green-400">
            <span className="text-green-800 font-semibold">
              ✅ {t('pressurization.completed')}
            </span>
            <div className="text-sm text-green-700 mt-1">
              P_serb = {P_serb.toFixed(1)} {t('common.bar')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
