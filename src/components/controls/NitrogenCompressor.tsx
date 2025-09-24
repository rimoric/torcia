import React, { useState, useEffect } from 'react';

// Configurazione compressore azoto (facilmente modificabile) - DIMENSIONI RIDOTTE
const NITROGEN_COMPRESSOR_CONFIG = {
  // Dimensioni base - ridotte di 1/4 (25% delle dimensioni originali)
  tankWidth: 150,    // Ridotto da 200 a 150
  tankHeight: 67,    // Ridotto da 90 a 67 
  motorWidth: 45,    // Ridotto da 60 a 45
  motorHeight: 45,   // Ridotto da 60 a 45
  
  // Stati operativi
  states: {
    stopped: {
      name: "FERMO",
      colors: {
        primary: "#6B7280",    // grigio
        secondary: "#4B5563",  // grigio scuro
        highlight: "#9CA3AF",  // grigio chiaro
        shadow: "#374151"      // grigio molto scuro
      }
    },
    running: {
      name: "RUN",
      colors: {
        primary: "#10B981",    // verde intenso
        secondary: "#059669",  // verde scuro
        highlight: "#6EE7B7",  // verde chiaro
        shadow: "#047857"      // verde molto scuro
      }
    },
    standby: {
      name: "STANDBY",
      colors: {
        primary: "#F59E0B",    // giallo intenso
        secondary: "#D97706",  // giallo scuro
        highlight: "#FCD34D",  // giallo chiaro
        shadow: "#92400E"      // marrone scuro
      }
    },
    alarm: {
      name: "ALLARME",
      colors: {
        primary: "#DC2626",    // rosso intenso
        secondary: "#B91C1C",  // rosso scuro
        highlight: "#F87171",  // rosso chiaro
        shadow: "#7F1D1D"      // rosso molto scuro
      }
    }
  },
  
  // Colori strutturali
  colors: {
    tank: "#C0C0C0",          // argento per serbatoio
    tankHighlight: "#E8E8E8", // argento chiaro
    tankShadow: "#808080",    // argento scuro
    motor: "#2D3748",         // grigio scuro per motore
    motorHighlight: "#4A5568", // grigio medio
    border: "#1F2937",        // bordi
    text: "#1F2937",
    pipe: "#6B7280"           // grigio per tubazioni
  },
  
  // Parametri di pressione
  pressureRange: { min: 0, max: 15 },
  units: "bar",
  decimals: 1,
  
  // Testo e etichette
  showPressure: true,
  showTemperature: true,
  showLabel: true,
  
  // Stili 3D - ridotti proporzionalmente
  strokeWidth: 1.5,         // Ridotto da 2
  shadowOffset: 3,          // Ridotto da 4
  fontSize: {
    pressure: 11,           // Ridotto da 14
    temperature: 8,         // Ridotto da 10
    state: 8,              // Ridotto da 10
    label: 9               // Ridotto da 12
  }
};

type CompressorState = 'stopped' | 'running' | 'standby' | 'alarm';
type PipeExitSide = 'right' | 'left' | 'top' | 'bottom';

interface NitrogenCompressorProps {
  // Stato del compressore
  state: CompressorState;
  pressure: number;        // Pressione di uscita in bar
  temperature: number;     // Temperatura in °C
  
  // Configurazione
  label?: string;
  pipeExitSide?: PipeExitSide; // Lato di uscita del tubo
  
  // Controlli (solo per demo)
  manualControlEnabled?: boolean;
  onStart?: () => void;
  onStop?: () => void;
  
  // Styling opzionale
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

  // Dimensioni tubazione - ridotte proporzionalmente
  const pipeDefaultDiameter = 15 * size;  // Ridotto da 20
  const pipeLength = 30 * size;           // Ridotto da 40

  // Dimensioni scalate
  const tankWidth = NITROGEN_COMPRESSOR_CONFIG.tankWidth * size;
  const tankHeight = NITROGEN_COMPRESSOR_CONFIG.tankHeight * size;
  const motorWidth = NITROGEN_COMPRESSOR_CONFIG.motorWidth * size;
  const motorHeight = NITROGEN_COMPRESSOR_CONFIG.motorHeight * size;
  
  // Colori attuali basati sullo stato
  const currentState = NITROGEN_COMPRESSOR_CONFIG.states[state];
  const currentColors = currentState.colors;
  
  // Calcolo dimensioni SVG (aggiustato per il tubo di uscita) - ridotte
  const svgWidth = tankWidth + 60 + (pipeExitSide === 'left' || pipeExitSide === 'right' ? pipeLength : 0);
  const svgHeight = tankHeight + 90 + (pipeExitSide === 'top' || pipeExitSide === 'bottom' ? pipeLength : 0);
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  // Posizioni componenti
  const tankX = centerX - tankWidth/2;
  const tankY = centerY - tankHeight/2;
  const motorX = tankX + tankWidth - motorWidth - 11; // Motore all'interno del serbatoio - ridotto da 15
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
      <svg 
        width={svgWidth} 
        height={svgHeight}
      >
        {/* Definizione gradienti 3D */}
        <defs>
          {/* Gradiente serbatoio */}
          <linearGradient id={`tank-gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.tankHighlight} />
            <stop offset="50%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.tank} />
            <stop offset="100%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.tankShadow} />
          </linearGradient>

          {/* Gradiente motore */}
          <linearGradient id={`motor-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.motorHighlight} />
            <stop offset="50%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.motor} />
            <stop offset="100%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.tankShadow} />
          </linearGradient>

          {/* Gradiente stato */}
          <radialGradient id={`state-gradient-${label}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor={currentColors.highlight} />
            <stop offset="70%" stopColor={currentColors.primary} />
            <stop offset="100%" stopColor={currentColors.secondary} />
          </radialGradient>

          {/* Ombra */}
          <filter id={`shadow-comp-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/> {/* Ridotta da 3 */}
            <feOffset dx="3" dy="3" result="offset" /> {/* Ridotta da 4,4 */}
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
          x={tankX + NITROGEN_COMPRESSOR_CONFIG.shadowOffset}
          y={tankY + NITROGEN_COMPRESSOR_CONFIG.shadowOffset}
          width={tankWidth}
          height={tankHeight}
          fill={NITROGEN_COMPRESSOR_CONFIG.colors.tankShadow}
          opacity={0.4}
          rx={11} // Ridotto da 15
        />

        {/* Serbatoio principale (rettangolare con angoli arrotondati) */}
        <rect
          x={tankX}
          y={tankY}
          width={tankWidth}
          height={tankHeight}
          fill={`url(#tank-gradient-${label})`}
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={NITROGEN_COMPRESSOR_CONFIG.strokeWidth}
          rx={11} // Ridotto da 15
          filter={`url(#shadow-comp-${label})`}
        />

        {/* Riflesso metallico sul serbatoio */}
        <rect
          x={tankX + 8} // Ridotto da 10
          y={tankY + 6} // Ridotto da 8
          width={tankWidth - 16}    // Ridotto da 20
          height={tankHeight/3}
          fill="white"
          opacity={0.4}
          rx={6} // Ridotto da 8
        />

        {/* Tubo di uscita con diametro standard delle tubazioni */}
        <g>
          {/* Ombra tubo */}
          <rect
            x={pipePosition.x + NITROGEN_COMPRESSOR_CONFIG.shadowOffset}
            y={pipePosition.y + NITROGEN_COMPRESSOR_CONFIG.shadowOffset}
            width={pipePosition.width}
            height={pipePosition.height}
            fill={NITROGEN_COMPRESSOR_CONFIG.colors.tankShadow}
            opacity={0.4}
          />
          
          {/* Tubo principale - senza arrotondamenti */}
          <rect
            x={pipePosition.x}
            y={pipePosition.y}
            width={pipePosition.width}
            height={pipePosition.height}
            fill={state === 'running' ? "#4A90E2" : "#9CA3AF"} // Blu se in funzione, grigio se fermo
            stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
            strokeWidth={1}
          />

          {/* Riflesso metallico sul tubo */}
          <rect
            x={pipePosition.x + (pipePosition.isVertical ? 2 : 2)} // Ridotto da 3
            y={pipePosition.y + (pipePosition.isVertical ? 2 : 2)} // Ridotto da 3
            width={pipePosition.isVertical ? pipePosition.width/3 : pipePosition.width - 4} // Ridotto da 6
            height={pipePosition.isVertical ? pipePosition.height - 4 : pipePosition.height/3} // Ridotto da 6
            fill="white"
            opacity={0.4}
          />

          {/* Indicatore di flusso (quando in funzione) */}
          {state === 'running' && (
            <rect
              x={pipePosition.x + (pipePosition.isVertical ? pipePosition.width/2 - 1 : 4)} // Ridotto da 5
              y={pipePosition.y + (pipePosition.isVertical ? 4 : pipePosition.height/2 - 1)} // Ridotto da 5
              width={pipePosition.isVertical ? 2 : pipePosition.width - 8} // Ridotto da 10
              height={pipePosition.isVertical ? pipePosition.height - 8 : 2} // Ridotto da 10
              fill="#00BFFF"
              opacity={0.8}
            >
              {/* Animazione flusso */}
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </rect>
          )}
        </g>

        {/* Motore elettrico - posizionato all'interno del serbatoio */}
        <rect
          x={motorX}
          y={motorY}
          width={motorWidth}
          height={motorHeight}
          fill={`url(#motor-gradient-${label})`}
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={NITROGEN_COMPRESSOR_CONFIG.strokeWidth}
          rx={6} // Ridotto da 8
          filter={`url(#shadow-comp-${label})`}
        />

        {/* Ventola di raffreddamento */}
        <circle
          cx={motorX + motorWidth/2}
          cy={motorY + motorHeight/2}
          r={15} // Ridotto da 20
          fill="none"
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={1.5} // Ridotto da 2
        />

        {/* Pale della ventola (animate se in funzione) */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rotation = state === 'running' ? 
            angle + (Date.now() / 50) % 360 : angle;
          const radians = (rotation * Math.PI) / 180;
          const x1 = motorX + motorWidth/2 + Math.cos(radians) * 4; // Ridotto da 5
          const y1 = motorY + motorHeight/2 + Math.sin(radians) * 4; // Ridotto da 5
          const x2 = motorX + motorWidth/2 + Math.cos(radians) * 13; // Ridotto da 18
          const y2 = motorY + motorHeight/2 + Math.sin(radians) * 13; // Ridotto da 18
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
              strokeWidth={1.5} // Ridotto da 2
            />
          );
        })}

        {/* Manometro - vicino al bordo sinistro del serbatoio */}
        <circle
          cx={tankX + 11} // Ridotto da 15
          cy={tankY + 15}  // Ridotto da 20
          r={9} // Ridotto da 12
          fill="white"
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={1.5} // Ridotto da 2
        />
        
        <circle
          cx={tankX + 11} // Ridotto da 15
          cy={tankY + 15}  // Ridotto da 20
          r={6} // Ridotto da 8
          fill={`url(#state-gradient-${label})`}
        />

        {/* Lancetta manometro */}
        <line
          x1={tankX + 11} // Ridotto da 15
          y1={tankY + 15}  // Ridotto da 20
          x2={tankX + 11 + 5} // Ridotto da 6
          y2={tankY + 15 - 2}
          stroke="white"
          strokeWidth={1.5} // Ridotto da 2
        />

        {/* Display pressione - spostato più a sinistra e ridotto */}
        {NITROGEN_COMPRESSOR_CONFIG.showPressure && (
          <g>
            <rect
              x={tankX + 8} // Ridotto da 10
              y={tankY - 45} // Ridotto da 60
              width={60} // Ridotto da 80
              height={19} // Ridotto da 25
              fill={currentColors.primary}
              stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
              strokeWidth={1}
              rx={3} // Ridotto da 4
            />
            
            <text
              x={tankX + 38} // Ridotto da 50
              y={tankY - 32} // Ridotto da 42
              textAnchor="middle"
              fontSize={NITROGEN_COMPRESSOR_CONFIG.fontSize.pressure}
              fontWeight="bold"
              fill="white"
            >
              {displayPressure.toFixed(NITROGEN_COMPRESSOR_CONFIG.decimals)} {NITROGEN_COMPRESSOR_CONFIG.units}
            </text>
          </g>
        )}

        {/* Display temperatura - sotto il display pressione */}
        {NITROGEN_COMPRESSOR_CONFIG.showTemperature && (
          <g>
            <rect
              x={tankX + 8} // Ridotto da 10
              y={tankY - 23} // Ridotto da 30
              width={38} // Ridotto da 50
              height={14} // Ridotto da 18
              fill="#E5E7EB"
              stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
              strokeWidth={1}
              rx={2} // Ridotto da 3
            />
            
            <text
              x={tankX + 27} // Ridotto da 35
              y={tankY - 13} // Ridotto da 17
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
          y={tankY + tankHeight + 19} // Ridotto da 25
          textAnchor="middle"
          fontSize={NITROGEN_COMPRESSOR_CONFIG.fontSize.state}
          fontWeight="bold"
          fill={currentColors.primary}
        >
          {currentState.name}
        </text>

        {/* Simbolo NC - spostato nella parte sinistra del serbatoio */}
        <text
          x={tankX + 38} // Ridotto da 50
          y={tankY + tankHeight/2 + 4} // Ridotto da 5
          textAnchor="middle"
          fontSize={14} // Ridotto da 18
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
            y={svgHeight - 11} // Ridotto da 15
            textAnchor="middle"
            fontSize={NITROGEN_COMPRESSOR_CONFIG.fontSize.label}
            fontWeight="bold"
            fill={NITROGEN_COMPRESSOR_CONFIG.colors.text}
          >
            {label} - N₂ COMPRESSOR
          </text>
        )}

        {/* Controlli manuali (se abilitati) */}
        {manualControlEnabled && (
          <g>
            {/* Pulsante START */}
            <rect
              x={centerX - 30} // Ridotto da 40
              y={svgHeight - 38} // Ridotto da 50
              width={23} // Ridotto da 30
              height={15} // Ridotto da 20
              fill="#10B981"
              stroke="#047857"
              strokeWidth={1}
              rx={2} // Ridotto da 3
              className="cursor-pointer"
              onClick={handleStart}
            />
            <text
              x={centerX - 18.5} // Ridotto da 25
              y={svgHeight - 28} // Ridotto da 37
              textAnchor="middle"
              fontSize={6} // Ridotto da 8
              fontWeight="bold"
              fill="white"
            >
              START
            </text>

            {/* Pulsante STOP */}
            <rect
              x={centerX + 7} // Ridotto da 10
              y={svgHeight - 38} // Ridotto da 50
              width={23} // Ridotto da 30
              height={15} // Ridotto da 20
              fill="#DC2626"
              stroke="#B91C1C"
              strokeWidth={1}
              rx={2} // Ridotto da 3
              className="cursor-pointer"
              onClick={handleStop}
            />
            <text
              x={centerX + 18.5} // Ridotto da 25
              y={svgHeight - 28} // Ridotto da 37
              textAnchor="middle"
              fontSize={6} // Ridotto da 8
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
