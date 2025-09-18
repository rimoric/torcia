// Settings.tsx - Pannello impostazioni limiti min/max
import React, { useState } from 'react';
import { X, Save, RotateCcw, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import NumericInput from './NumericInput';

export interface SettingsLimits {
  P0: { min: number; max: number };
  Pfinale: { min: number; max: number };
  volumeProdotto: { min: number; max: number };
  temperatura: { min: number; max: number };
  riempPerc: { min: number; max: number };
  geRpm: { min: number; max: number };
  warmupTime: { min: number; max: number };
  timerStasi: { min: number; max: number };
  timerDep: { min: number; max: number };
  P_bombole: { min: number; max: number };
}

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  limits: SettingsLimits;
  onSave: (newLimits: SettingsLimits) => void;
}

const defaultLimits: SettingsLimits = {
  P0: { min: 0.5, max: 2.0 },
  Pfinale: { min: 1.0, max: 50.0 },
  volumeProdotto: { min: 100, max: 10000 },
  temperatura: { min: -20, max: 80 },
  riempPerc: { min: 10, max: 95 },
  geRpm: { min: 1500, max: 3000 },
  warmupTime: { min: 30, max: 300 },
  timerStasi: { min: 60, max: 1800 },
  timerDep: { min: 30, max: 600 },
  P_bombole: { min: 150, max: 300 }
};

export const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  limits,
  onSave
}) => {
  const [localLimits, setLocalLimits] = useState<SettingsLimits>(limits);
  const [hasChanges, setHasChanges] = useState(false);

  if (!isOpen) return null;

  const updateLimit = (
    parameter: keyof SettingsLimits,
    type: 'min' | 'max',
    value: number
  ) => {
    setLocalLimits(prev => ({
      ...prev,
      [parameter]: {
        ...prev[parameter],
        [type]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(localLimits);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalLimits(defaultLimits);
    setHasChanges(true);
  };

  const settingsGroups = [
    {
      title: "Parametri Processo",
      icon: "🎯",
      items: [
        { key: 'P0' as keyof SettingsLimits, label: 'Pressione Iniziale (bar)', unit: 'bar' },
        { key: 'Pfinale' as keyof SettingsLimits, label: 'Pressione Finale (bar)', unit: 'bar' },
        { key: 'volumeProdotto' as keyof SettingsLimits, label: 'Volume Prodotto (L)', unit: 'L' },
        { key: 'temperatura' as keyof SettingsLimits, label: 'Temperatura (°C)', unit: '°C' },
        { key: 'riempPerc' as keyof SettingsLimits, label: 'Riempimento (%)', unit: '%' }
      ]
    },
    {
      title: "Equipaggiamenti",
      icon: "⚙️",
      items: [
        { key: 'geRpm' as keyof SettingsLimits, label: 'RPM Gruppo Elettrogeno', unit: 'rpm' },
        { key: 'warmupTime' as keyof SettingsLimits, label: 'Tempo Riscaldamento', unit: 's' },
        { key: 'P_bombole' as keyof SettingsLimits, label: 'Pressione Bombole', unit: 'bar' }
      ]
    },
    {
      title: "Timer Processo",
      icon: "⏱️",
      items: [
        { key: 'timerStasi' as keyof SettingsLimits, label: 'Timer Stasi', unit: 's' },
        { key: 'timerDep' as keyof SettingsLimits, label: 'Timer Depressurizzazione', unit: 's' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <SettingsIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Impostazioni Sistema</h2>
                <p className="text-slate-200 text-sm">Configura limiti minimi e massimi per tutti i parametri</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {hasChanges && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div className="text-amber-800">
                <div className="font-medium">Modifiche non salvate</div>
                <div className="text-sm">Ricorda di salvare le modifiche prima di chiudere</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {settingsGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{group.icon}</span>
                  <h3 className="font-semibold text-slate-800">{group.title}</h3>
                </div>

                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div key={item.key} className="bg-white rounded-lg p-4 border">
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        {item.label}
                      </label>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {/* Min Value */}
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Minimo</label>
                          <NumericInput
                            value={localLimits[item.key].min}
                            onChange={(value) => updateLimit(item.key, 'min', value)}
                            unit={item.unit}
                            decimals={1}
                          />
                        </div>

                        {/* Max Value */}
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Massimo</label>
                          <NumericInput
                            value={localLimits[item.key].max}
                            onChange={(value) => updateLimit(item.key, 'max', value)}
                            unit={item.unit}
                            decimals={1}
                          />
                        </div>
                      </div>

                      {/* Range Indicator */}
                      <div className="mt-2 text-xs text-slate-500 text-center">
                        Range: {localLimits[item.key].min} - {localLimits[item.key].max} {item.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-slate-50 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Ripristina Default
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`
                  px-6 py-2 rounded-lg flex items-center gap-2 transition-colors
                  ${hasChanges 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }
                `}
              >
                <Save className="w-4 h-4" />
                Salva Modifiche
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
