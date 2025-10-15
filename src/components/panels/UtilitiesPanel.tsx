// UtilitiesPanel.tsx - Step 5: Utilities Activation (i18n)
import React from 'react';
import { useTranslation } from '../../i18n';

interface UtilitiesPanelProps {
  allUtilitiesOn: boolean;
  setAllUtilitiesOn: (value: boolean) => void;
  setCompressoreOn: (value: boolean) => void;
  setEssiccatoreOn: (value: boolean) => void;
  setGenN2On: (value: boolean) => void;
  pushLog: (message: string) => void;
  settingsLimits: any;
}

export default function UtilitiesPanel({
  allUtilitiesOn,
  setAllUtilitiesOn,
  setCompressoreOn,
  setEssiccatoreOn,
  setGenN2On,
  pushLog,
  settingsLimits
}: UtilitiesPanelProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
        <h4 className="font-semibold text-purple-800 mb-6 text-lg">
          🔧 {t('utilities.title')}
        </h4>
        
        <div className="space-y-4">
          <label className="flex items-center gap-4 cursor-pointer p-4 bg-white rounded-lg shadow-sm border hover:bg-purple-50 transition-colors">
            <input
              type="checkbox"
              checked={allUtilitiesOn}
              onChange={(e) => {
                const checked = e.target.checked;
                setAllUtilitiesOn(checked);
                setCompressoreOn(checked);
                setEssiccatoreOn(checked);
                setGenN2On(checked);
                if (checked) {
                  pushLog(t('messages.allUtilitiesOn'));
                } else {
                  pushLog(t('messages.allUtilitiesOff'));
                }
              }}
              className="w-6 h-6"
            />
            <div>
              <span className="text-purple-800 font-semibold text-lg">
                {t('utilities.activateAll')}
              </span>
              <p className="text-purple-600 text-sm">
                {t('utilities.compressor')} • {t('utilities.dryer')} • {t('utilities.n2Generator')}
              </p>
            </div>
          </label>

          {allUtilitiesOn && (
            <div className="mt-4 p-4 bg-purple-100 rounded-lg border border-purple-300">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="text-purple-800">
                  <div className="text-2xl">💨</div>
                  <div className="text-sm font-medium">{t('utilities.compressor')}</div>
                </div>
                <div className="text-purple-800">
                  <div className="text-2xl">🌪️</div>
                  <div className="text-sm font-medium">{t('utilities.dryer')}</div>
                </div>
                <div className="text-purple-800">
                  <div className="text-2xl">🔷</div>
                  <div className="text-sm font-medium">{t('utilities.n2Generator')}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
