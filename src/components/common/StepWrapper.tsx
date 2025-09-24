// StepWrapper.tsx - Common Panel Wrapper Component
import React from 'react';

interface StepWrapperProps {
  title: string;
  description?: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  gradient?: 'blue' | 'indigo' | 'amber' | 'green' | 'purple' | 'slate';
}

export default function StepWrapper({
  title,
  description,
  icon,
  children,
  className = '',
  gradient = 'blue'
}: StepWrapperProps) {
  const gradientClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
    indigo: 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200',
    amber: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200',
    green: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
    purple: 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200',
    slate: 'bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200'
  };

  const titleColors = {
    blue: 'text-blue-800',
    indigo: 'text-indigo-800',
    amber: 'text-amber-800',
    green: 'text-green-800',
    purple: 'text-purple-800',
    slate: 'text-slate-800'
  };

  const descColors = {
    blue: 'text-blue-600',
    indigo: 'text-indigo-600',
    amber: 'text-amber-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    slate: 'text-slate-600'
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className={`p-6 rounded-xl border ${gradientClasses[gradient]}`}>
        <div className="mb-6">
          <h4 className={`font-semibold text-lg mb-2 ${titleColors[gradient]}`}>
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </h4>
          {description && (
            <p className={`text-sm ${descColors[gradient]}`}>
              {description}
            </p>
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
}
