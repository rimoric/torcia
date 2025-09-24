// PressureTargetPanel.tsx - Step 1: Pressure Target Selection Component
import React from 'react';
import NumericInput from '../../NumericInput';
import { SettingsLimits } from '../../Settings';

interface PressureTargetPanelProps {
  Pfinale: number | "";
  setPfinale: (value: number | "") => void;
  presetPressureLevel: string;
  setPresetPressureLevel: (value: string) => void;
  settingsLimits: SettingsLimits;
}

export default function PressureTargetPanel({
  Pfinale,
  setPfinale,
  presetPressureLevel,
  setPresetPressureLevel,
  settingsLimits
}: PressureTargetPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
        <h4 className="font-semibold text-indigo-800 mb-6 text-lg">🎯 Selezionare Pressione Target</h4>
        
        <div className="space-y-6">
          {/* Preset levels */}
          <div>
            <p className="text-indigo-700 text-sm mb-3 font-medium">Livelli prefissati</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[12, 14, 16].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setPresetPressureLevel(level.toString());
                    setPfinale(level);
                  }}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    presetPressureLevel === level.toString()
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white border-2 border-indigo-200 text-indigo-600 hover:border-indigo-400'
                  }`}
                >
                  {level} bar
                </button>
              ))}
            </div>
          </div>

          {/* Custom input */}
          <div>
            <label className="flex items-center gap-3 mb-3 cursor-pointer">
              <input
                type="radio"
                name="pressureSelection"
                checked={presetPressureLevel === "custom"}
                onChange={() => setPresetPressureLevel("custom")}
                className="w-4 h-4"
              />
              <span className="text-indigo-700 text-sm font-medium">Pressione personalizzata [bar]</span>
            </label>
            
            {presetPressureLevel === "custom" && (
              <NumericInput
                value={Pfinale || 0}
                onChange={setPfinale}
                label="Pressione finale personalizzata"
                unit="bar"
                min={settingsLimits.Pfinale.min}
                max={settingsLimits.Pfinale.max}
                decimals={1}
                step={0.5}
              />
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-indigo-100 rounded-lg border border-indigo-300">
          <p className="text-indigo-800 text-sm font-medium">
            Target selezionato: <strong>{Pfinale} bar</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
