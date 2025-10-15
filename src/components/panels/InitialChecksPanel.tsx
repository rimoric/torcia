// InitialChecksPanel.tsx - Step 3: Initial Verifications (i18n)
import React from 'react';
import { useTranslation } from '../../i18n';

interface InitialChecksPanelProps {
  setupVallenLoaded: boolean;
  setSetupVallenLoaded: (value: boolean) => void;
  sensorsInstalled: boolean;
  setSensorsInstalled: (value: boolean) => void;
  sensorsWorking: boolean;
  setSensorsWorking: (value: boolean) => void;
  backgroundNoiseMonitored: boolean;
  setBackgroundNoiseMonitored: (value: boolean) => void;
}

export default function InitialChecksPanel({
  setupVallenLoaded,
  setSetupVallenLoaded,
  sensorsInstalled,
  setSensorsInstalled,
  sensorsWorking,
  setSensorsWorking,
  backgroundNoiseMonitored,
  setBackgroundNoiseMonitored
}: InitialChecksPanelProps) {
  const { t } = useTranslation();
  
  const checks = [
    { value: setupVallenLoaded, setter: setSetupVallenLoaded, text: `1. ${t('initialChecks.check1')}` },
    { value: sensorsInstalled, setter: setSensorsInstalled, text: `2. ${t('initialChecks.check2')}` },
    { value: sensorsWorking, setter: setSensorsWorking, text: `3. ${t('initialChecks.check3')}` },
    { value: backgroundNoiseMonitored, setter: setBackgroundNoiseMonitored, text: `4. ${t('initialChecks.check4')}` }
  ];

  const completedChecks = checks.filter(check => check.value).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <h4 className="font-semibold text-green-800 mb-6 text-lg">
          ✅ {t('initialChecks.title')}
        </h4>
        
        <div className="space-y-4">
          {checks.map((check, index) => (
            <label 
              key={index}
              className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg shadow-sm border hover:bg-green-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={check.value}
                onChange={(e) => check.setter(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-green-800 font-medium">{check.text}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-300">
          <p className="text-green-800 text-sm font-medium">
            {t('initialChecks.completed')}: {completedChecks}/4
          </p>
        </div>
      </div>
    </div>
  );
}
