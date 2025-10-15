// TankDataPanel.tsx - Step 0: Tank Data Input Component (i18n)
import React from 'react';
import NumericInput from '../../NumericInput';
import { SettingsLimits } from '../../Settings';
import { useTranslation } from '../../i18n';

interface TankDataPanelProps {
  P0: number;
  setP0: (value: number) => void;
  setP_serb: (value: number) => void;
  volumeProdotto: number | "";
  setVolumeProdotto: (value: number | "") => void;
  temperatura: number | "";
  setTemperatura: (value: number | "") => void;
  riempPerc: number | "";
  setRiempPerc: (value: number | "") => void;
  pushLog: (message: string) => void;
  settingsLimits: SettingsLimits;
}

export default function TankDataPanel({
  P0,
  setP0,
  setP_serb,
  volumeProdotto,
  setVolumeProdotto,
  temperatura,
  setTemperatura,
  riempPerc,
  setRiempPerc,
  pushLog,
  settingsLimits
}: TankDataPanelProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-4 text-lg">
          📊 {t('tankData.title')}
        </h4>
        
        <div className="space-y-6">
          {/* Pressione iniziale */}
          <div>
            <p className="text-blue-700 text-sm mb-2 font-medium">
              {t('tankData.initialPressure')} P₀ [{t('common.bar')}]
            </p>
            <NumericInput
              value={P0}
              onChange={(v) => { setP0(v); setP_serb(v); }}
              label=""
              unit={t('common.bar')}
              min={settingsLimits.P0.min}
              max={settingsLimits.P0.max}
              decimals={1}
              step={0.1}
            />
          </div>

          {/* Capacità serbatoio */}
          <div>
            <p className="text-blue-700 text-sm mb-2 font-medium">
              {t('tankData.capacity')}
            </p>
            <NumericInput
              value={volumeProdotto || 0}
              onChange={setVolumeProdotto}
              label=""
              unit={t('common.liters')}
              min={settingsLimits.volumeProdotto.min}
              max={settingsLimits.volumeProdotto.max}
              decimals={0}
              step={1}
            />
          </div>
          
          {/* Temperatura serbatoio */}
          <div>
            <p className="text-blue-700 text-sm mb-2 font-medium">
              {t('tankData.temperature')}
            </p>
            <NumericInput
              value={temperatura || 0}
              onChange={setTemperatura}
              label=""
              unit={t('common.celsius')}
              min={settingsLimits.temperatura.min}
              max={settingsLimits.temperatura.max}
              decimals={1}
              step={0.5}
            />
          </div>
          
          {/* Riempimento */}
          <div>
            <p className="text-blue-700 text-sm mb-2 font-medium">
              {t('tankData.fillLevel')}
            </p>
            <NumericInput
              value={riempPerc || 0}
              onChange={setRiempPerc}
              label=""
              unit={t('common.percent')}
              min={settingsLimits.riempPerc.min}
              max={settingsLimits.riempPerc.max}
              decimals={0}
              step={1}
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-300">
          <p className="text-blue-800 text-sm font-medium">
            📋 {t('tankData.insertAllParams')}
          </p>
        </div>
      </div>
    </div>
  );
}
