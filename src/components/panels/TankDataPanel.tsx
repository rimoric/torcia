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
  tipoSerbatoio: 'standard' | 'speciale';
  setTipoSerbatoio: (value: 'standard' | 'speciale') => void;
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
  tipoSerbatoio,
  setTipoSerbatoio,
  settingsLimits
}: TankDataPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-4 text-lg">📊 Dati Serbatoio Completi</h4>
        
        {/* Toggle per tipo serbatoio */}
        <div className="mb-6">
          <p className="text-blue-700 text-sm mb-2 font-medium">Tipo serbatoio</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setTipoSerbatoio('standard')}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                tipoSerbatoio === 'standard'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
              }`}
            >
              🔹 Standard
            </button>
            <button
              onClick={() => setTipoSerbatoio('speciale')}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                tipoSerbatoio === 'speciale'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
              }`}
            >
              ⭐ Speciale
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Pressione iniziale */}
          <div>
            <p className="text-blue-700 text-sm mb-2 font-medium">Pressione iniziale P₀ [bar]</p>
            <NumericInput
              value={P0}
              onChange={(v) => { setP0(v); setP_serb(v); }}
              label=""
              unit="bar"
              min={settingsLimits.P0.min}
              max={settingsLimits.P0.max}
              decimals={1}
              step={0.1}
            />
          </div>

          {/* Capacità serbatoio */}
          <div>
            <p className="text-blue-700 text-sm mb-2 font-medium">Capacità</p>
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
            <p className="text-blue-700 text-sm mb-2 font-medium">Temperatura</p>
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
          
          {/* Riempimento */}
          <div>
            <p className="text-blue-700 text-sm mb-2 font-medium">Riempimento</p>
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
