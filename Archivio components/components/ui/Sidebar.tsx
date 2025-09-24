// Sidebar.tsx - Sidebar Navigation Component
import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface SidebarProps {
  STEP_TITLES: readonly string[];
  uiStep: number;
  setUiStep: (step: number) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidebarRef: React.RefObject<HTMLDivElement>;
  activeStepRef: React.RefObject<HTMLButtonElement>;
}

export default function Sidebar({
  STEP_TITLES,
  uiStep,
  setUiStep,
  sidebarCollapsed,
  setSidebarCollapsed,
  sidebarRef,
  activeStepRef
}: SidebarProps) {
  return (
    <div className={`bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 h-full flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-80'}`}>
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!sidebarCollapsed && <h2 className="text-lg font-bold">Fasi Processo</h2>}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-slate-700 rounded-lg">
          <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      <div ref={sidebarRef} className="flex-1 overflow-y-auto scrollbar-thin">
        {STEP_TITLES.map((titolo, idx) => {
          const isActive = idx === uiStep;
          const isCompleted = idx < uiStep;
          
          return (
            <button
              key={idx}
              ref={isActive ? activeStepRef : null}
              className={`w-full p-4 text-left border-b border-slate-700/50 hover:bg-slate-700/50 transition-all duration-200 ${
                isActive ? 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg' : 
                isCompleted ? 'bg-slate-700/30' : ''
              }`}
              onClick={() => setUiStep(idx)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-br from-white to-slate-100 text-indigo-600 shadow-lg shadow-white/20' 
                    : isCompleted 
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-400/30'
                      : 'bg-gradient-to-br from-slate-600 to-slate-700 text-slate-300'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-sm leading-tight font-medium">{titolo}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
