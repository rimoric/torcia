// PhaseStatus.tsx - Indicatore Status Fase
import React from 'react';
import { Clock, CheckCircle, AlertCircle, Play, Pause } from 'lucide-react';

interface PhaseStatusProps {
  status: 'waiting' | 'ready' | 'in-progress' | 'completed' | 'error' | 'timer';
  message: string;
  progress?: number; // 0-100 per progress bar
  timeRemaining?: number; // secondi rimanenti
  showIcon?: boolean;
}

const PhaseStatus: React.FC<PhaseStatusProps> = ({
  status,
  message,
  progress,
  timeRemaining,
  showIcon = true
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'waiting':
        return {
          bgClass: 'bg-gradient-to-r from-slate-100 to-slate-200',
          textClass: 'text-slate-600',
          borderClass: 'border-slate-300',
          icon: Clock,
          iconColor: 'text-slate-500'
        };
      case 'ready':
        return {
          bgClass: 'bg-gradient-to-r from-blue-100 to-blue-200',
          textClass: 'text-blue-800',
          borderClass: 'border-blue-300',
          icon: Play,
          iconColor: 'text-blue-600'
        };
      case 'in-progress':
        return {
          bgClass: 'bg-gradient-to-r from-indigo-100 to-indigo-200',
          textClass: 'text-indigo-800',
          borderClass: 'border-indigo-300',
          icon: Play,
          iconColor: 'text-indigo-600'
        };
      case 'timer':
        return {
          bgClass: 'bg-gradient-to-r from-amber-100 to-amber-200',
          textClass: 'text-amber-800',
          borderClass: 'border-amber-300',
          icon: Clock,
          iconColor: 'text-amber-600'
        };
      case 'completed':
        return {
          bgClass: 'bg-gradient-to-r from-emerald-100 to-emerald-200',
          textClass: 'text-emerald-800',
          borderClass: 'border-emerald-300',
          icon: CheckCircle,
          iconColor: 'text-emerald-600'
        };
      case 'error':
        return {
          bgClass: 'bg-gradient-to-r from-red-100 to-red-200',
          textClass: 'text-red-800',
          borderClass: 'border-red-300',
          icon: AlertCircle,
          iconColor: 'text-red-600'
        };
      default:
        return {
          bgClass: 'bg-gradient-to-r from-slate-100 to-slate-200',
          textClass: 'text-slate-600',
          borderClass: 'border-slate-300',
          icon: Clock,
          iconColor: 'text-slate-500'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`p-3 rounded-xl border shadow-sm transition-all duration-300 ${config.bgClass} ${config.borderClass}`}>
      <div className="flex items-center gap-3">
        {showIcon && (
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${config.iconColor} ${status === 'in-progress' ? 'animate-pulse' : ''}`} />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${config.textClass}`}>
            {message}
          </div>
          
          {timeRemaining !== undefined && (
            <div className={`text-xs ${config.textClass} opacity-75 mt-0.5`}>
              {timeRemaining > 0 ? `${timeRemaining}s rimanenti` : 'Completato'}
            </div>
          )}
        </div>

        {status === 'in-progress' && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="mt-2">
          <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                status === 'completed' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                status === 'error' ? 'bg-gradient-to-r from-red-400 to-red-500' :
                status === 'timer' ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                'bg-gradient-to-r from-indigo-400 to-indigo-500'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            >
              <div className="h-full bg-gradient-to-r from-white/20 via-white/40 to-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className={`text-xs ${config.textClass} opacity-75 mt-1 text-right`}>
            {Math.round(progress)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseStatus;
