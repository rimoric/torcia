// UtilitiesPanel.tsx - Step 5: Utilities Activation Component
import React from 'react';

interface UtilitiesPanelProps {
  allUtilitiesOn: boolean;
  setAllUtilitiesOn: (value: boolean) => void;
  setCompressoreOn: (value: boolean) => void;
  setEssiccatoreOn: (value: boolean) => void;
  setGenN2On: (value: boolean) => void;
  pushLog: (message: string) => void;
}

export default function UtilitiesPanel({
  allUtilitiesOn,
  setAllUtilitiesOn,
  setCompressoreOn,
  setEssiccatoreOn,
  setGenN2On,
  pushLog
}: UtilitiesPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
        <h4 className="font-semibold text-purple-800 mb-6 text-lg">🔧 Attivare Utenze</h4>
        
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
                  pushLog("Tutte le utenze attivate: Compressore, Essiccatore, Generatore N₂");
                } else {
                  pushLog("Tutte le utenze disattivate");
                }
              }}
              className="w-6 h-6"
            />
            <div>
              <span className="text-purple-800 font-semibold text-lg">Attiva tutte le utenze</span>
              <p className="text-purple-600 text-sm">Compressore • Essiccatore • Generatore N₂</p>
            </div>
          </label>

          {allUtilitiesOn && (
            <div className="mt-4 p-4 bg-purple-100 rounded-lg border border-purple-300">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="text-purple-800">
                  <div className="text-2xl">💨</div>
                  <div className="text-sm font-medium">Compressore</div>
                </div>
                <div className="text-purple-800">
                  <div className="text-2xl">🌪️</div>
                  <div className="text-sm font-medium">Essiccatore</div>
                </div>
                <div className="text-purple-800">
                  <div className="text-2xl">🔷</div>
                  <div className="text-sm font-medium">Generatore N₂</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
