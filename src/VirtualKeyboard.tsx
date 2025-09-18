// VirtualKeyboard.tsx - Tastiera virtuale on-screen
import React, { useState, useEffect, useRef } from 'react';

interface VirtualKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onValueChange: (value: string) => void;
  initialValue?: string;
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
  decimals?: number;
  position?: { x: number; y: number };
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  isOpen,
  onClose,
  onValueChange,
  initialValue = "",
  label = "Inserisci valore",
  unit = "",
  min,
  max,
  decimals = 2,
  position
}) => {
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [hasDecimal, setHasDecimal] = useState(false);
  const keyboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDisplayValue(initialValue);
      setHasDecimal(initialValue.includes('.'));
    }
  }, [isOpen, initialValue]);

  // Posizionamento automatico della tastiera
  useEffect(() => {
    if (isOpen && keyboardRef.current && position) {
      const keyboard = keyboardRef.current;
      const rect = keyboard.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      let x = position.x;
      let y = position.y + 50; // Offset sotto il campo

      // Adjust se esce dallo schermo
      if (x + rect.width > viewport.width) {
        x = viewport.width - rect.width - 20;
      }
      if (y + rect.height > viewport.height) {
        y = position.y - rect.height - 10; // Sopra il campo
      }

      keyboard.style.left = `${Math.max(20, x)}px`;
      keyboard.style.top = `${Math.max(20, y)}px`;
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  const handleNumberClick = (num: string) => {
    setDisplayValue(prev => {
      if (prev === "0" && num !== ".") return num;
      return prev + num;
    });
  };

  const handleDecimalClick = () => {
    if (!hasDecimal && decimals > 0) {
      setDisplayValue(prev => prev + ".");
      setHasDecimal(true);
    }
  };

  const handleBackspace = () => {
    setDisplayValue(prev => {
      if (prev.length <= 1) return "0";
      const newValue = prev.slice(0, -1);
      setHasDecimal(newValue.includes('.'));
      return newValue;
    });
  };

  const handleClear = () => {
    setDisplayValue("0");
    setHasDecimal(false);
  };

  const handleConfirm = () => {
    let value = parseFloat(displayValue);
    
    // Validazione range
    if (min !== undefined && value < min) {
      value = min;
    }
    if (max !== undefined && value > max) {
      value = max;
    }

    onValueChange(value.toString());
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Validazione real-time
  const isValidValue = () => {
    const value = parseFloat(displayValue);
    if (isNaN(value)) return false;
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;
    return true;
  };

  const getValidationMessage = () => {
    const value = parseFloat(displayValue);
    if (isNaN(value)) return "Valore non valido";
    if (min !== undefined && value < min) return `Minimo: ${min}`;
    if (max !== undefined && value > max) return `Massimo: ${max}`;
    return "";
  };

  // Layout tastiera numerica
  const keypadLayout = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', '⌫']
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={keyboardRef}
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-80 max-w-[90vw]"
        style={position ? { position: 'fixed' } : {}}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{label}</h3>
              {(min !== undefined || max !== undefined) && (
                <p className="text-blue-100 text-sm">
                  Range: {min ?? '−∞'} - {max ?? '∞'} {unit}
                </p>
              )}
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="p-4 bg-slate-50 border-b">
          <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-slate-800 min-h-[40px] flex items-center justify-end">
                {displayValue || "0"}
                <span className="ml-2 text-lg text-slate-500">{unit}</span>
              </div>
              {!isValidValue() && (
                <div className="text-red-500 text-sm mt-1">
                  {getValidationMessage()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tastiera */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {keypadLayout.map((row, rowIndex) => 
              row.map((key, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => {
                    if (key === '⌫') {
                      handleBackspace();
                    } else if (key === '.') {
                      handleDecimalClick();
                    } else {
                      handleNumberClick(key);
                    }
                  }}
                  disabled={key === '.' && (hasDecimal || decimals === 0)}
                  className={`
                    h-14 rounded-lg font-bold text-lg transition-all duration-150 shadow-sm
                    ${key === '⌫' 
                      ? 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-200' 
                      : key === '.' 
                        ? `bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-200 ${(hasDecimal || decimals === 0) ? 'opacity-50 cursor-not-allowed' : ''}`
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200 hover:shadow-md transform hover:scale-105'
                    }
                  `}
                >
                  {key === '⌫' ? '⌫' : key}
                </button>
              ))
            )}
          </div>

          {/* Pulsanti azione */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleClear}
              className="h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              🗑️ Cancella
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isValidValue()}
              className={`
                h-12 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                ${isValidValue()
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              ✓ Conferma
            </button>
          </div>
        </div>

        {/* Footer con suggerimenti */}
        <div className="px-4 py-2 bg-slate-50 text-xs text-slate-500 text-center border-t">
          Usa la tastiera numerica per inserire valori precisi
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
