// TankDataPanel.tsx - Step 0: Tank Data Input Component
import React from 'react';
import NumericInput from '../../NumericInput';
import { SettingsLimits } from '../../Settings';

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
  settingsLimits
}: TankDataPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-6 text-lg">📊 Dati Serbatoio Completi</h4>
        
        <div className="space-y-6">
          {/* Pressione iniziale */}
          <div>
            <p className="text-blue-700 text-sm mb-3 font-medium">Pressione iniziale P₀ [bar]</p>
            <NumericInput
              value={P0}
              onChange={(v) => { setP0(v); setP_serb(v); }}
              label="Pressione iniziale"
              unit="bar"
              min={settingsLimits.P0.min}
              max={settingsLimits.P0.max}
              decimals={1}
              step={0.1}
            />
          </div>

          {/* Capacità serbatoio */}
          <div>
            <p className="text-blue-700 text-sm mb-3 font-medium">Capacità serbatoio</p>
            <NumericInput
              value={volumeProdotto || 0}
              onChange={setVolumeProdotto}
              unit="L"
              min={settingsLimits.volumeProdotto.min}
              max={settingsLimits.volumeProdotto.max}
              decimals={0}
              step={1}
            />
          </div>
          
          {/* Temperatura serbatoio */}
          <div>
            <p className="text-blue-700 text-sm mb-3 font-medium">Temperatura serbatoio</p>
            <NumericInput
              value={temperatura || 0}
              onChange={setTemperatura}
              unit="°C"
              min={settingsLimits.temperatura.min}
              max={settingsLimits.temperatura.max}
              decimals={1}
              step={0.5}
            />
          </div>
          
          {/* Percentuale riempimento */}
          <div>
            <p className="text-blue-700 text-sm mb-3 font-medium">Percentuale riempimento serbatoio</p>
            <NumericInput
              value={riempPerc || 0}
              onChange={setRiempPerc}
              label=""
              unit="%"
              min={settingsLimits.riempPerc.min}
              max={settingsLimits.riempPerc.max}
              decimals={0}
              step={1}
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-300">
          <p className="text-blue-800 text-sm font-medium">
            📋 Inserire tutti i parametri del serbatoio prima di procedere
          </p>
        </div>
      </div>
    </div>
  );
}
