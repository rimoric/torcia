// SettingsPanel.tsx - Pannello Impostazioni con Limiti
import React, { useState } from 'react';
import { X, Save, RotateCcw, AlertTriangle } from 'lucide-react';

export interface Settings {
  pressione: { min: number; max: number };
  volume: { min: number; max: number };
  temperatura: { min: number; max: number };
  riempimento: { min: number; max: number };
  tempoStasi: { min: number; max: number };
  tempoWarmup: { min: number; max: number };
  giriGE: { min: number; max: number };
  pressureBombole: { min: number; max: number };
}

interface SettingsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (newSettings: Settings) => void;
}

const defaultSettings: Settings = {
  pressione: { min: 0.5, max: 25 },
  volume: { min: 100, max: 50000 },
  temperatura: { min: -20, max: 80 },
  riempimento: { min: 0, max: 100 },
  tempoStasi: { min: 5, max: 3600 },
  tempoWarmup: { min: 3, max: 30 },
  giriGE: { min: 1000, max: 4000 },
  pressureBombole: { min: 50, max: 300 }
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isVisible,
  onClose,
  settings,
  onSave
}) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  if (!isVisible) return null;

  const handleSettingChange = (category: keyof Settings, field: 'min' | 'max', value: number) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(localSettings);
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(defaultSettings);
    setHasChanges(true);
  };

  const SettingRow = ({ 
    label, 
    category, 
    unit, 
    description 
  }: { 
    label: string; 
    category: keyof Settings; 
    unit: string;
    description: string;
  }) => (
    <div className="p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-semibold text-slate-800">{label}</h4>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <span className="text-xs text-slate-400 font-mono">{unit}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Minimo</label>
          <input
            type="number"
            value={localSettings[category].min}
            onChange={(e) => handleSettingChange(category, 'min', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Massimo</label>
          <input
            type="number"
            value={localSettings[category].max}
            onChange={(e) => handleSettingChange(category, 'max', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            step="0.1"
          />
        </div>
      </div>
      
      {localSettings[category].min >= localSettings[category].max && (
        <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
          <AlertTriangle className="w-3 h-3" />
          <span>Attenzione: il minimo deve essere inferiore al massimo</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <X className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Impostazioni Sistema
              </h2>
              <p className="text-sm text-slate-500">Configura i limiti operativi del processo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-xl transition-all duration-200 hover:shadow-lg"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50 to-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingRow
              label="Pressione"
              category="pressione"
              unit="bar"
              description="Limiti di pressione del sistema"
            />
            
            <SettingRow
              label="Volume Serbatoio"
              category="volume"
              unit="L"
              description="Capacità minima e massima serbatoio"
            />
            
            <SettingRow
              label="Temperatura"
              category="temperatura"
              unit="°C"
              description="Range temperatura di esercizio"
            />
            
            <SettingRow
              label="Riempimento"
              category="riempimento"
              unit="%"
              description="Percentuale di riempimento serbatoio"
            />
            
            <SettingRow
              label="Tempo Stasi"
              category="tempoStasi"
              unit="s"
              description="Durata minima e massima stasi"
            />
            
            <SettingRow
              label="Tempo Warm-up"
              category="tempoWarmup"
              unit="s"
              description="Durata warm-up gruppo elettrogeno"
            />
            
            <SettingRow
              label="Giri GE"
              category="giriGE"
              unit="rpm"
              description="Regime di rotazione gruppo elettrogeno"
            />
            
            <SettingRow
              label="Pressione Bombole"
              category="pressureBombole"
              unit="bar"
              description="Pressione pacco bombole N₂"
            />
          </div>

          {/* Warning Area */}
          {hasChanges && (
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Modifiche non salvate</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Ricorda di salvare le modifiche prima di chiudere il pannello.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gradient-to-r from-slate-100 to-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 
                rounded-lg transition-all duration-200 text-slate-700 font-medium shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Ripristina Default
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 
                rounded-lg transition-all duration-200 text-slate-700 font-medium shadow-sm hover:shadow-md"
            >
              Annulla
            </button>
            
            <button
              onClick={handleSave}
              className={`px-6 py-2 rounded-lg font-medium shadow-lg transition-all duration-200 flex items-center gap-2 ${
                hasChanges 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:shadow-xl'
                  : 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-500 cursor-not-allowed'
              }`}
              disabled={!hasChanges}
            >
              <Save className="w-4 h-4" />
              Salva Impostazioni
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
