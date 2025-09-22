// BottleSelectionPanel.tsx - Step 2: Bottle Selection Component
import React from 'react';
import NumericInput from '../NumericInput';

interface BottleConfig {
  used: boolean;
  pressure: number;
  volume: number;
}

interface BottleSelectionPanelProps {
  bombola1: BottleConfig;
  setBombola1: (value: BottleConfig | ((prev: BottleConfig) => BottleConfig)) => void;
  bombola2: BottleConfig;
  setBombola2: (value: BottleConfig | ((prev: BottleConfig) => BottleConfig)) => void;
  bombola3: BottleConfig;
  setBombola3: (value: BottleConfig | ((prev: BottleConfig) => BottleConfig)) => void;
}

export default function BottleSelectionPanel({
  bombola1,
  setBombola1,
  bombola2,
  setBombola2,
  bombola3,
  setBombola3
}: BottleSelectionPanelProps) {
  const BottleCard = ({ 
    bottle, 
    setBottle, 
    index 
  }: { 
    bottle: BottleConfig; 
    setBottle: (value: BottleConfig | ((prev: BottleConfig) => BottleConfig)) => void;
    index: number; 
  }) => (
    <div className="bg-white p-4 rounded-lg border border-amber-200">
      <div className="flex items-center gap-3 mb-4">
        <input
          type="checkbox"
          checked={bottle.used}
          onChange={(e) => setBottle(prev => ({...prev, used: e.target.checked}))}
          className="w-5 h-5"
        />
        <h5 className="font-semibold text-amber-800">Bombola {index}</h5>
      </div>
      
      {bottle.used && (
        <div className="space-y-3 pl-8">
          <div>
            <label className="text-amber-700 text-sm font-medium">Pressione attuale [bar]</label>
            <NumericInput
              value={bottle.pressure}
              onChange={(v) => setBottle(prev => ({...prev, pressure: v}))}
              label={`Pressione bombola ${index}`}
              unit="bar"
              min={0}
              max={300}
              decimals={0}
              step={5}
            />
          </div>
          <div>
            <label className="text-amber-700 text-sm font-medium">Capacità (volume) [L]</label>
            <NumericInput
              value={bottle.volume}
              onChange={(v) => setBottle(prev => ({...prev, volume: v}))}
              label={`Volume bombola ${index}`}
              unit="L"
              min={10}
              max={100}
              decimals={0}
              step={1}
            />
          </div>
        </div>
      )}
    </div>
  );

  const usedBottles = [bombola1.used, bombola2.used, bombola3.used].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
        <h4 className="font-semibold text-amber-800 mb-6 text-lg">🗜️ Scelta Bombole</h4>
        
        <div className="space-y-6">
          <BottleCard bottle={bombola1} setBottle={setBombola1} index={1} />
          <BottleCard bottle={bombola2} setBottle={setBombola2} index={2} />
          <BottleCard bottle={bombola3} setBottle={setBombola3} index={3} />
        </div>

        <div className="mt-6 p-4 bg-amber-100 rounded-lg border border-amber-300">
          <p className="text-amber-800 text-sm font-medium">
            Bombole selezionate: {usedBottles}/3
          </p>
        </div>
      </div>
    </div>
  );
}
