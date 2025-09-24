import React, { useState, useEffect } from 'react';

// Configurazione compressore azoto (facilmente modificabile)
const NITROGEN_COMPRESSOR_CONFIG = {
  // Dimensioni base - ottimizzate
  tankWidth: 200,
  tankHeight: 90,
  motorWidth: 60,
  motorHeight: 60,
  
  // Stati operativi
  states: {
    stopped: {
      name: "FERMO",
      colors: {
        primary: "#6B7280",
        secondary: "#4B5563",
        highlight: "#9CA3AF",
        shadow: "#374151"
      }
    },
    running: {
      name: "RUN",
      colors: {
        primary: "#10B981",
        secondary: "#059669",
        highlight: "#6EE7B7",
        shadow: "#047857"
      }
    },
    standby: {
      name: "STANDBY",
      colors: {
        primary: "#F59E0B",
        secondary: "#D97706",
        highlight: "#FCD34D",
        shadow: "#92400E"
      }
    },
    alarm: {
      name: "ALLARME",
      colors: {
        primary: "#DC2626",
        secondary: "#B91C1C",
        highlight: "#F87171",
        shadow: "#7F1D1D"
      }
    }
  },
  
  // Colori strutturali
  colors: {
    tank: "#C0C0C0",
    tankHighlight: "#E8E8E8",
    tankShadow: "#808080",
    motor: "#2D3748",
    motorHighlight: "#4A5568",
    border: "#1F2937",
    text: "#1F2937",
    pipe: "#6B7280"
  },
  
  // Parametri di pressione
  pressureRange: { min: 0, max: 15 },
  units: "bar",
  decimals: 1,
  
  // Testo e etichette
  showPressure: true,
  showTemperature: true,
  showLabel: true,
  
  // Stili 3D
  strokeWidth: 2,
  shadowOffset: 4,
  fontSize: {
    pressure: 14,
    temperature: 10,
    state: 10,
    label: 12
  }
};

type CompressorState = 'stopped' | 'running' | 'standby' | 'alarm';
type PipeExitSide = 'right' | 'left' | 'top' | 'bottom';

interface NitrogenCompressorProps {
  state: CompressorState;
  pressure: number;
  temperature: number;
  label?: string;
  pipeExitSide?: PipeExitSide;
  manualControlEnabled?: boolean;
  onStart?: () => void;
  onStop?: () => void;
  size?: number;
  className?: string;
}

const NitrogenCompressor: React.FC<NitrogenCompressorProps> = ({
  state,
  pressure,
  temperature,
  label = "NC001",
  pipeExitSide = 'right',
  manualControlEnabled = false,
  onStart,
  onStop,
  size = 1,
  className = ""
}) => {
  const [displayPressure, setDisplayPressure] = useState(pressure);
  const [displayTemp, setDisplayTemp] = useState(temperature);
  const [vibration, setVibration] = useState(0);

  // Animazione graduale dei valori
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayPressure(prev => {
        const diff = pressure - prev;
        if (Math.abs(diff) < 0.05) return pressure;
        return prev + (diff > 0 ? Math.min(0.1, diff) : Math.max(-0.1, diff));
      });
      
      setDisplayTemp(prev => {
        const diff = temperature - prev;
        if (Math.abs(diff) < 0.1) return temperature;
        return prev + (diff > 0 ? Math.min(0.2, diff) : Math.max(-0.2, diff));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [pressure, temperature]);

  // Animazione vibrazioni quando in funzione
  useEffect(() => {
    if (state === 'running') {
      const interval = setInterval(() => {
        setVibration(Math.random() * 2 - 1);
      }, 150);
      return () => clearInterval(interval);
    } else {
      setVibration(0);
    }
  }, [state]);

  // Dimensioni tubazione
  const pipeDefaultDiameter = 20 * size;
  const pipeLength = 40 * size;

  // Dimensioni scalate
  const tankWidth = NITROGEN_COMPRESSOR_CONFIG.tankWidth * size;
  const tankHeight = NITROGEN_COMPRESSOR_CONFIG.tankHeight * size;
  const motorWidth = NITROGEN_COMPRESSOR_CONFIG.motorWidth * size;
  const motorHeight = NITROGEN_COMPRESSOR_CONFIG.motorHeight * size;
  
  // Colori attuali basati sullo stato
  const currentState = NITROGEN_COMPRESSOR_CONFIG.states[state];
  const currentColors = currentState.colors;
  
  // Calcolo dimensioni SVG
  const svgWidth = tankWidth + 80 + (pipeExitSide === 'left' || pipeExitSide === 'right' ? pipeLength : 0);
  const svgHeight = tankHeight + 120 + (pipeExitSide === 'top' || pipeExitSide === 'bottom' ? pipeLength : 0);
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  // Posizioni componenti
  const tankX = centerX - tankWidth/2;
  const tankY = centerY - tankHeight/2;
  const motorX = tankX + tankWidth - motorWidth - 15;
  const motorY = tankY + (tankHeight - motorHeight)/2;

  // Calcolo posizione del tubo di uscita
  const getPipePosition = () => {
    switch (pipeExitSide) {
      case 'right':
        return {
          x: tankX + tankWidth,
          y: tankY + tankHeight/2 - pipeDefaultDiameter/2,
          width: pipeLength,
          height: pipeDefaultDiameter,
          isVertical: false
        };
      case 'left':
        return {
          x: tankX - pipeLength,
          y: tankY + tankHeight/2 - pipeDefaultDiameter/2,
          width: pipeLength,
          height: pipeDefaultDiameter,
          isVertical: false
        };
      case 'top':
        return {
          x: tankX + tankWidth/2 - pipeDefaultDiameter/2,
          y: tankY - pipeLength,
          width: pipeDefaultDiameter,
          height: pipeLength,
          isVertical: true
        };
      case 'bottom':
        return {
          x: tankX + tankWidth/2 - pipeDefaultDiameter/2,
          y: tankY + tankHeight,
          width: pipeDefaultDiameter,
          height: pipeLength,
          isVertical: true
        };
    }
  };

  const pipePosition = getPipePosition();

  // Gestione comandi manuali
  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (manualControlEnabled && onStart) {
      onStart();
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (manualControlEnabled && onStop) {
      onStop();
    }
  };

  return (
    <div className={`inline-block ${className}`}>
      <svg width={svgWidth} height={svgHeight}>
        {/* Definizione gradienti 3D */}
        <defs>
          <linearGradient id={`tank-gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.tankHighlight} />
            <stop offset="50%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.tank} />
            <stop offset="100%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.tankShadow} />
          </linearGradient>

          <linearGradient id={`motor-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.motorHighlight} />
            <stop offset="50%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.motor} />
            <stop offset="100%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.tankShadow} />
          </linearGradient>

          <radialGradient id={`state-gradient-${label}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor={currentColors.highlight} />
            <stop offset="70%" stopColor={currentColors.primary} />
            <stop offset="100%" stopColor={currentColors.secondary} />
          </radialGradient>

          <filter id={`shadow-comp-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="4" dy="4" result="offset" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>

        {/* Ombra serbatoio */}
        <rect
          x={tankX + NITROGEN_COMPRESSOR_CONFIG.shadowOffset + vibration}
          y={tankY + NITROGEN_COMPRESSOR_CONFIG.shadowOffset + vibration}
          width={tankWidth}
          height={tankHeight}
          fill={NITROGEN_COMPRESSOR_CONFIG.colors.tankShadow}
          opacity={0.4}
          rx={15}
        />

        {/* Serbatoio principale */}
        <rect
          x={tankX + vibration}
          y={tankY + vibration}
          width={tankWidth}
          height={tankHeight}
          fill={`url(#tank-gradient-${label})`}
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={NITROGEN_COMPRESSOR_CONFIG.strokeWidth}
          rx={15}
          filter={`url(#shadow-comp-${label})`}
        />

        {/* Riflesso metallico sul serbatoio */}
        <rect
          x={tankX + 10 + vibration}
          y={tankY + 8 + vibration}
          width={tankWidth - 20}
          height={tankHeight/3}
          fill="white"
          opacity={0.4}
          rx={8}
        />

        {/* Tubo di uscita */}
        <g>
          <rect
            x={pipePosition.x + NITROGEN_COMPRESSOR_CONFIG.shadowOffset}
            y={pipePosition.y + NITROGEN_COMPRESSOR_CONFIG.shadowOffset}
            width={pipePosition.width}
            height={pipePosition.height}
            fill={NITROGEN_COMPRESSOR_CONFIG.colors.tankShadow}
            opacity={0.4}
          />
          
          <rect
            x={pipePosition.x}
            y={pipePosition.y}
            width={pipePosition.width}
            height={pipePosition.height}
            fill={state === 'running' ? "#4A90E2" : "#9CA3AF"}
            stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
            strokeWidth={1}
          />

          <rect
            x={pipePosition.x + (pipePosition.isVertical ? 2 : 3)}
            y={pipePosition.y + (pipePosition.isVertical ? 3 : 2)}
            width={pipePosition.isVertical ? pipePosition.width/3 : pipePosition.width - 6}
            height={pipePosition.isVertical ? pipePosition.height - 6 : pipePosition.height/3}
            fill="white"
            opacity={0.4}
          />

          {state === 'running' && (
            <rect
              x={pipePosition.x + (pipePosition.isVertical ? pipePosition.width/2 - 1 : 5)}
              y={pipePosition.y + (pipePosition.isVertical ? 5 : pipePosition.height/2 - 1)}
              width={pipePosition.isVertical ? 2 : pipePosition.width - 10}
              height={pipePosition.isVertical ? pipePosition.height - 10 : 2}
              fill="#00BFFF"
              opacity={0.8}
            >
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </rect>
          )}
        </g>

        {/* Motore elettrico */}
        <rect
          x={motorX + vibration}
          y={motorY + vibration}
          width={motorWidth}
          height={motorHeight}
          fill={`url(#motor-gradient-${label})`}
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={NITROGEN_COMPRESSOR_CONFIG.strokeWidth}
          rx={8}
          filter={`url(#shadow-comp-${label})`}
        />

        {/* Ventola di raffreddamento */}
        <circle
          cx={motorX + motorWidth/2 + vibration}
          cy={motorY + motorHeight/2 + vibration}
          r={20}
          fill="none"
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={2}
        />

        {/* Pale della ventola */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rotation = state === 'running' ? 
            angle + (Date.now() / 50) % 360 : angle;
          const radians = (rotation * Math.PI) / 180;
          const x1 = motorX + motorWidth/2 + Math.cos(radians) * 5 + vibration;
          const y1 = motorY + motorHeight/2 + Math.sin(radians) * 5 + vibration;
          const x2 = motorX + motorWidth/2 + Math.cos(radians) * 18 + vibration;
          const y2 = motorY + motorHeight/2 + Math.sin(radians) * 18 + vibration;
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
              strokeWidth={2}
            />
          );
        })}

        {/* Manometro */}
        <circle
          cx={tankX + 15 + vibration}
          cy={tankY + 20 + vibration}
          r={12}
          fill="white"
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={2}
        />
        
        <circle
          cx={tankX + 15 + vibration}
          cy={tankY + 20 + vibration}
          r={8}
          fill={`url(#state-gradient-${label})`}
        />

        {/* Lancetta manometro */}
        <line
          x1={tankX + 15 + vibration}
          y1={tankY + 20 + vibration}
          x2={tankX + 15 + 6 + vibration}
          y2={tankY + 20 - 2 + vibration}
          stroke="white"
          strokeWidth={2}
        />

        {/* Display pressione */}
        {NITROGEN_COMPRESSOR_CONFIG.showPressure && (
          <g>
            <rect
              x={tankX + 10 + vibration}
              y={tankY - 60 + vibration}
              width={80}
              height={25}
              fill={currentColors.primary}
              stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
              strokeWidth={1}
              rx={4}
            />
            
            <text
              x={tankX + 50 + vibration}
              y={tankY - 42 + vibration}
              textAnchor="middle"
              fontSize={NITROGEN_COMPRESSOR_CONFIG.fontSize.pressure}
              fontWeight="bold"
              fill="white"
            >
              {displayPressure.toFixed(NITROGEN_COMPRESSOR_CONFIG.decimals)} {NITROGEN_COMPRESSOR_CONFIG.units}
            </text>
          </g>
        )}

        {/* Display temperatura */}
        {NITROGEN_COMPRESSOR_CONFIG.showTemperature && (
          <g>
            <rect
              x={tankX + 10 + vibration}
              y={tankY - 30 + vibration}
              width={50}
              height={18}
              fill="#E5E7EB"
              stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
              strokeWidth={1}
              rx={3}
            />
            
            <text
              x={tankX + 35 + vibration}
              y={tankY - 17 + vibration}
              textAnchor="middle"
              fontSize={NITROGEN_COMPRESSOR_CONFIG.fontSize.temperature}
              fontWeight="bold"
              fill={NITROGEN_COMPRESSOR_CONFIG.colors.text}
            >
              {Math.round(displayTemp)}°C
            </text>
          </g>
        )}

        {/* Testo stato */}
        <text
          x={centerX}
          y={tankY + tankHeight + 25}
          textAnchor="middle"
          fontSize={NITROGEN_COMPRESSOR_CONFIG.fontSize.state}
          fontWeight="bold"
          fill={currentColors.primary}
        >
          {currentState.name}
        </text>

        {/* Simbolo NC */}
        <text
          x={tankX + 50 + vibration}
          y={tankY + tankHeight/2 + 5 + vibration}
          textAnchor="middle"
          fontSize={18}
          fontWeight="bold"
          fill="white"
          opacity={0.7}
        >
          NC
        </text>
        
        {/* Etichetta del compressore */}
        {NITROGEN_COMPRESSOR_CONFIG.showLabel && (
          <text
            x={centerX}
            y={svgHeight - 15}
            textAnchor="middle"
            fontSize={NITROGEN_COMPRESSOR_CONFIG.fontSize.label}
            fontWeight="bold"
            fill={NITROGEN_COMPRESSOR_CONFIG.colors.text}
          >
            {label} - N₂ COMPRESSOR
          </text>
        )}

        {/* Controlli manuali */}
        {manualControlEnabled && (
          <g>
            <rect
              x={centerX - 40}
              y={svgHeight - 50}
              width={30}
              height={20}
              fill="#10B981"
              stroke="#047857"
              strokeWidth={1}
              rx={3}
              className="cursor-pointer"
              onClick={handleStart}
            />
            <text
              x={centerX - 25}
              y={svgHeight - 37}
              textAnchor="middle"
              fontSize={8}
              fontWeight="bold"
              fill="white"
            >
              START
            </text>

            <rect
              x={centerX + 10}
              y={svgHeight - 50}
              width={30}
              height={20}
              fill="#DC2626"
              stroke="#B91C1C"
              strokeWidth={1}
              rx={3}
              className="cursor-pointer"
              onClick={handleStop}
            />
            <text
              x={centerX + 25}
              y={svgHeight - 37}
              textAnchor="middle"
              fontSize={8}
              fontWeight="bold"
              fill="white"
            >
              STOP
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default NitrogenCompressor;
