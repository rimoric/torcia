// SavePanel.tsx - Step 8: Save/Print/Terminate (i18n)
import React from 'react';
import { useTranslation } from '../../i18n';

interface SavePanelProps {
  handleExportPDF: () => void;
  salvataggioRichiesto: boolean;
  setSalvataggioRichiesto: (value: boolean) => void;
  pushLog: (message: string) => void;
  settingsLimits: any;
}

export default function SavePanel({
  handleExportPDF,
  salvataggioRichiesto,
  setSalvataggioRichiesto,
  pushLog,
  settingsLimits
}: SavePanelProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <h4 className="font-semibold text-green-800 mb-6 text-lg">
          💾 {t('savePanel.title')}
        </h4>
        
        <div className="space-y-4">
          {/* Save button - Row 1 */}
          <div className="w-full">
            <button 
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-semibold text-lg shadow-lg"
              onClick={() => {
                handleExportPDF();
                pushLog(t('messages.dataSaved'));
              }}
            >
              💾 {t('savePanel.saveData')}
            </button>
          </div>

          {/* Print button - Row 2 */}
          <div className="w-full">
            <button 
              className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors font-semibold text-lg shadow-lg"
              onClick={() => {
                window.print();
                pushLog(t('messages.printStarted'));
              }}
            >
              🖨️ {t('savePanel.printReport')}
            </button>
          </div>

          {/* Terminate button - Row 3 */}
          <div className="w-full">
            <button 
              className="w-full px-6 py-4 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-colors font-semibold text-lg shadow-lg"
              onClick={() => {
                setSalvataggioRichiesto(true);
                pushLog(t('messages.processTerminated'));
              }}
            >
              🎯 {t('savePanel.terminateProcess')}
            </button>
          </div>
        </div>

        {salvataggioRichiesto && (
          <div className="mt-6 text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-blue-800 mb-2">
              {t('savePanel.successTitle')}
            </h3>
            <p className="text-blue-600">{t('savePanel.successMessage')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
