// NumericInput.tsx - Campo input numerico con tastiera virtuale
import React, { useState, useRef } from 'react';
import VirtualKeyboard from './VirtualKeyboard';

interface NumericInputProps {
  value: number | string;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
  decimals?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  label,
  unit = "",
  min,
  max,
  decimals = 2,
  step = 0.1,
  placeholder,
  className = "",
  disabled = false,
  required = false
}) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardPosition, setKeyboardPosition] = useState<{ x: number; y: number } | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputClick = () => {
    if (disabled) return;
    
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setKeyboardPosition({
        x: rect.left,
        y: rect.bottom + window.scrollY
      });
    }
    setIsKeyboardOpen(true);
  };

  const handleKeyboardValueChange = (newValue: string) => {
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const handleDirectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === "") {
      onChange(0);
      return;
    }
    
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const displayValue = typeof value === 'number' ? value.toString() : value;

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="number"
          value={displayValue}
          onChange={handleDirectInput}
          onClick={handleInputClick}
          step={step}
          min={min}
          max={max}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border border-slate-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-all duration-200 font-mono text-right
            ${unit ? 'pr-20' : 'pr-12'}
            ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white cursor-pointer hover:border-blue-400'}
            ${className}
          `}
          readOnly // Forza l'uso della tastiera virtuale
        />
        
        {/* Unità di misura */}
        {unit && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm pointer-events-none font-normal">
            {unit}
          </div>
        )}

        {/* Icona tastiera */}
        <button
          type="button"
          onClick={handleInputClick}
          disabled={disabled}
          className={`
            absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors
            ${disabled 
              ? 'text-slate-400 cursor-not-allowed' 
              : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
            }
          `}
          title="Apri tastiera numerica"
        >
          🧮
        </button>
      </div>

      {/* Indicatori range */}
      {(min !== undefined || max !== undefined) && (
        <div className="mt-1 text-xs text-slate-500">
          Range: {min ?? '−∞'} - {max ?? '∞'} {unit}
        </div>
      )}

      {/* Tastiera virtuale */}
      <VirtualKeyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onValueChange={handleKeyboardValueChange}
        initialValue={displayValue}
        label={label || "Inserisci valore"}
        unit={unit}
        min={min}
        max={max}
        decimals={decimals}
        position={keyboardPosition}
      />
    </div>
  );
};

export default NumericInput;
