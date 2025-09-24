import React, { useState, useEffect } from 'react';

// Configurazione serbatoio GPL (facilmente modificabile) - DIMENSIONI RIDOTTE
const LPG_TANK_CONFIG = {
  // Dimensioni base - ridotte del 25%
  width: 240,     // Ridotto da 320 a 240
  height: 120,    // Ridotto da 160 a 120
  
  // Colori per temperatura
  tempColors: {
    normal: { min: 10, max: 40, colors: {
      primary: "#10B981",    // verde intenso
      secondary: "#059669",  // verde scuro
      highlight: "#6EE7B7",  // verde chiaro
      shadow: "#047857"      // verde molto scuro
    }},
    warning: { min: 41, max: 60, colors: {
      primary: "#F59E0B",    // giallo intenso
      secondary: "#D97706",  // giallo scuro
      highlight: "#FCD34D",  // giallo chiaro
      shadow: "#92400E"      // marrone scuro
    }},
    danger: { colors: {
      primary: "#DC2626",    // rosso intenso
      secondary: "#B91C1C",  // rosso scuro
      highlight: "#F87171",  // rosso chiaro
      shadow: "#7F1D1D"      // rosso molto scuro
    }}
  },
  
  // Colori per riempimento GPL (azzurro graduato)
  fillColors: {
    empty: "#E0F2FE",        // azzurro molto sbiadito
    low: "#7DD3FC",          // azzurro chiaro
    medium: "#38BDF8",       // azzurro medio
    high: "#0EA5E9",         // azzurro intenso
    full: "#0284C7"          // azzurro molto intenso
  },
  
  // Colori strutturali
  colors: {
    tank: "#D1D5DB",         // grigio metallico
    tankHighlight: "#F3F4F6", // grigio chiaro per riflessi
    tankShadow: "#6B7280",   // grigio scuro per ombra
    border: "#1F2937",       // grigio molto scuro
    text: "#1F2937",
    support: "#8B5CF6",      // viola per supporti
    valve: "#4B5563"         // grigio per valvole
  },
  
  // Testo e etichette
  showTemperature: true,
  showFillLevel: true,
  showLabel: true,
  
  // Stili 3D - ridotti proporzionalmente
  borderRadius: 23,        // Ridotto da 30
  strokeWidth: 1.5,        // Ridotto da 2
  shadowOffset: 3,         // Ridotto da 4
  fontSize: {
    temperature: 14,       // Ridotto da 18
    fillLevel: 14,         // Ridotto da 18
    label: 12,             // Ridotto da 16
    units: 9               // Ridotto da 12
  }
};

interface LPGTankProps {
  // Dati del serbatoio
  temperature: number;      // Temperatura in °C
  fillLevel: number;        // Livello riempimento 0-100%
  
  // Configurazione
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  
  // Controlli (solo per demo)
  manualControlEnabled?: boolean;
  onTemperatureChange?: (temp: number) => void;
  onFillLevelChange?: (level: number) => void;
  
  // Styling opzionale
  size?: number;
  className?: string;
}

const LPGTank: React.FC<LPGTankProps> = ({
  temperature,
  fillLevel,
  label = "TK001",
  orientation = 'horizontal',
  manualControlEnabled = false,
  onTemperatureChange,
  onFillLevelChange,
  size = 1,
  className = ""
}) => {
  const [displayTemp, setDisplayTemp] = useState(temperature);
  const [displayFill, setDisplayFill] = useState(fillLevel);

  // Animazione graduale dei valori
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTemp(prev => {
        const diff = temperature - prev;
        if (Math.abs(diff) < 0.1) return temperature;
        return prev + (diff > 0 ? Math.min(0.5, diff) : Math.max(-0.5, diff));
      });
      
      setDisplayFill(prev => {
        const diff = fillLevel - prev;
        if (Math.abs(diff) < 0.5) return fillLevel;
        return prev + (diff > 0 ? Math.min(1, diff) : Math.max(-1, diff));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [temperature, fillLevel]);

  // Dimensioni scalate
  const width = LPG_TANK_CONFIG.width * size;
  const height = LPG_TANK_CONFIG.height * size;
  
  // Determina colori temperatura
  const getTempColorRange = (temp: number) => {
    const { tempColors } = LPG_TANK_CONFIG;
    if (temp < tempColors.normal.min || temp > tempColors.warning.max) {
      return tempColors.danger;
    }
    if (temp <= tempColors.normal.max) return tempColors.normal;
    return tempColors.warning;
  };
  
  const tempRange = getTempColorRange(displayTemp);
  const tempColors = tempRange.colors;
  
  // Calcola colore riempimento basato su percentuale
  const getFillColor = (level: number) => {
    const { fillColors } = LPG_TANK_CONFIG;
    if (level <= 0) return fillColors.empty;
    if (level <= 25) return fillColors.low;
    if (level <= 50) return fillColors.medium;
    if (level <= 75) return fillColors.high;
    return fillColors.full;
  };
  
  const fillColor = getFillColor(displayFill);
  
  // Calcolo dimensioni SVG - ridotte
  const isVertical = orientation === 'vertical';
  const svgWidth = isVertical ? height + 75 : width + 75;    // Ridotto da 100
  const svgHeight = isVertical ? width + 105 : height + 105; // Ridotto da 140
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  // Dimensioni effettive del serbatoio
  const tankWidth = isVertical ? height : width;
  const tankHeight = isVertical ? width : height;

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={svgWidth} 
        height={svgHeight}
      >
        {/* Definizione gradienti 3D */}
        <defs>
          {/* Gradiente serbatoio metallico */}
          <linearGradient id={`tank-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={LPG_TANK_CONFIG.colors.tankHighlight} />
            <stop offset="30%" stopColor={LPG_TANK_CONFIG.colors.tank} />
            <stop offset="70%" stopColor={LPG_TANK_CONFIG.colors.tankShadow} />
            <stop offset="100%" stopColor={LPG_TANK_CONFIG.colors.tankShadow} />
          </linearGradient>

          {/* Gradiente riempimento GPL */}
          <linearGradient id={`fill-gradient-${label}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.9" />
            <stop offset="50%" stopColor={fillColor} stopOpacity="0.7" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.5" />
          </linearGradient>

          {/* Gradiente superficie liquido */}
          <linearGradient id={`surface-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.3" />
            <stop offset="50%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.3" />
          </linearGradient>

          {/* Gradiente temperatura */}
          <radialGradient id={`temp-gradient-${label}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={tempColors.highlight} />
            <stop offset="70%" stopColor={tempColors.primary} />
            <stop offset="100%" stopColor={tempColors.secondary} />
          </radialGradient>

          {/* Riflessi metallici */}
          <linearGradient id={`reflection-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="30%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Ombra */}
          <filter id={`shadow-tank-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/> {/* Ridotto da 4 */}
            <feOffset dx="3" dy="3" result="offset" /> {/* Ridotto da 4,4 */}
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>

        {/* Supporti del serbatoio */}
        {!isVertical && (
          <g>
            {/* Supporto sinistro */}
            <rect
              x={centerX - tankWidth/2 + 8} // Ridotto da 10
              y={centerY + tankHeight/2 - 4} // Ridotto da 5
              width={11}                     // Ridotto da 15
              height={15}                    // Ridotto da 20
              fill={LPG_TANK_CONFIG.colors.support}
              stroke={LPG_TANK_CONFIG.colors.border}
              strokeWidth={1}
              rx={2}                         // Ridotto da 3
            />
            {/* Supporto destro */}
            <rect
              x={centerX + tankWidth/2 - 19} // Ridotto da 25
              y={centerY + tankHeight/2 - 4} // Ridotto da 5
              width={11}                     // Ridotto da 15
              height={15}                    // Ridotto da 20
              fill={LPG_TANK_CONFIG.colors.support}
              stroke={LPG_TANK_CONFIG.colors.border}
              strokeWidth={1}
              rx={2}                         // Ridotto da 3
            />
          </g>
        )}

        {/* Ombra del serbatoio */}
        <rect
          x={centerX - tankWidth/2 + LPG_TANK_CONFIG.shadowOffset}
          y={centerY - tankHeight/2 + LPG_TANK_CONFIG.shadowOffset}
          width={tankWidth}
          height={tankHeight}
          fill={LPG_TANK_CONFIG.colors.tankShadow}
          opacity={0.3}
          rx={isVertical ? tankWidth/6 : LPG_TANK_CONFIG.borderRadius}
          ry={isVertical ? LPG_TANK_CONFIG.borderRadius : tankHeight/6}
        />
        
        {/* Corpo principale del serbatoio */}
        <rect
          x={centerX - tankWidth/2}
          y={centerY - tankHeight/2}
          width={tankWidth}
          height={tankHeight}
          fill={`url(#tank-gradient-${label})`}
          stroke={LPG_TANK_CONFIG.colors.border}
          strokeWidth={LPG_TANK_CONFIG.strokeWidth}
          rx={isVertical ? tankWidth/6 : LPG_TANK_CONFIG.borderRadius}
          ry={isVertical ? LPG_TANK_CONFIG.borderRadius : tankHeight/6}
          filter={`url(#shadow-tank-${label})`}
        />

        {/* Riempimento GPL */}
        {displayFill > 0 && (
          <g>
            {/* Calcolo altezza/larghezza riempimento */}
            {(() => {
              const fillRatio = displayFill / 100;
              const fillWidth = isVertical ? tankWidth - 6 : tankWidth - 6;   // Ridotto da 8
              const fillHeight = isVertical ? (tankHeight - 6) * fillRatio : tankHeight - 6; // Ridotto da 8
              const fillX = centerX - fillWidth/2;
              const fillY = isVertical ? 
                centerY + tankHeight/2 - 3 - fillHeight :  // Ridotto da 4
                centerY - fillHeight/2;
              
              return (
                <g>
                  {/* Liquido GPL */}
                  <rect
                    x={fillX}
                    y={fillY}
                    width={fillWidth}
                    height={fillHeight}
                    fill={`url(#fill-gradient-${label})`}
                    rx={isVertical ? fillWidth/6 - 2 : Math.min(fillHeight/2, LPG_TANK_CONFIG.borderRadius - 3)} // Ridotto da 4
                    ry={isVertical ? Math.min(fillHeight/2, LPG_TANK_CONFIG.borderRadius - 3) : fillHeight/6 - 2} // Ridotto da 4
                  />
                  
                  {/* Superficie del liquido (effetto ondulato) */}
                  <rect
                    x={fillX}
                    y={isVertical ? fillY : fillY}
                    width={fillWidth}
                    height={2} // Ridotto da 3
                    fill={`url(#surface-gradient-${label})`}
                  />
                </g>
              );
            })()}
          </g>
        )}

        {/* Riflessi metallici sul serbatoio */}
        <rect
          x={centerX - tankWidth/2 + 4}  // Ridotto da 5
          y={centerY - tankHeight/2 + 4} // Ridotto da 5
          width={tankWidth/3}
          height={tankHeight - 8}        // Ridotto da 10
          fill={`url(#reflection-${label})`}
          rx={isVertical ? tankWidth/8 : LPG_TANK_CONFIG.borderRadius/2}
          ry={isVertical ? LPG_TANK_CONFIG.borderRadius/2 : tankHeight/8}
        />

        {/* Bocchettone di riempimento/svuotamento */}
        <g>
          {(() => {
            const nozzleX = isVertical ? centerX + tankWidth/2 + 4 : centerX;   // Ridotto da 5
            const nozzleY = isVertical ? centerY : centerY - tankHeight/2 - 11; // Ridotto da 15
            const nozzleWidth = isVertical ? 15 : 11;  // Ridotto da 20 e 15
            const nozzleHeight = isVertical ? 11 : 15; // Ridotto da 15 e 20
            
            return (
              <g>
                {/* Tubo del bocchettone */}
                <rect
                  x={nozzleX - nozzleWidth/2}
                  y={nozzleY - nozzleHeight/2}
                  width={nozzleWidth}
                  height={nozzleHeight}
                  fill={LPG_TANK_CONFIG.colors.valve}
                  stroke={LPG_TANK_CONFIG.colors.border}
                  strokeWidth={1}
                  rx={2} // Ridotto da 3
                />
                
                {/* Valvola del bocchettone */}
                <circle
                  cx={nozzleX}
                  cy={nozzleY + (isVertical ? -nozzleHeight/2 - 4 : nozzleHeight/2 + 4)} // Ridotto da 5
                  r={5} // Ridotto da 6
                  fill={LPG_TANK_CONFIG.colors.valve}
                  stroke={LPG_TANK_CONFIG.colors.border}
                  strokeWidth={1}
                />
                
                {/* Etichetta bocchettone */}
                <text
                  x={nozzleX}
                  y={nozzleY + (isVertical ? -nozzleHeight/2 - 15 : nozzleHeight/2 + 19)} // Ridotto da 20 e 25
                  textAnchor="middle"
                  fontSize={5} // Ridotto da 7
                  fontWeight="bold"
                  fill={LPG_TANK_CONFIG.colors.text}
                >
                  FILL/DRAIN
                </text>
              </g>
            );
          })()}
        </g>

        {/* Manometro di pressione */}
        <g>
          {(() => {
            const gaugeX = isVertical ? centerX - tankWidth/2 - 15 : centerX + tankWidth/2 - 11; // Ridotto da 20 e 15
            const gaugeY = isVertical ? centerY - 8 : centerY - tankHeight/2 + 8;                  // Ridotto da 10
            
            return (
              <g>
                <circle
                  cx={gaugeX}
                  cy={gaugeY}
                  r={9} // Ridotto da 12
                  fill="white"
                  stroke={LPG_TANK_CONFIG.colors.border}
                  strokeWidth={1.5} // Ridotto da 2
                />
                <circle
                  cx={gaugeX}
                  cy={gaugeY}
                  r={6} // Ridotto da 8
                  fill="none"
                  stroke={tempColors.primary}
                  strokeWidth={1}
                />
                {/* Lancetta */}
                <line
                  x1={gaugeX}
                  y1={gaugeY}
                  x2={gaugeX + 4} // Ridotto da 6
                  y2={gaugeY - 2}
                  stroke={tempColors.primary}
                  strokeWidth={1.5} // Ridotto da 2
                />
                <text
                  x={gaugeX}
                  y={gaugeY + 15} // Ridotto da 20
                  textAnchor="middle"
                  fontSize={4}    // Ridotto da 6
                  fill={LPG_TANK_CONFIG.colors.text}
                >
                  BAR
                </text>
              </g>
            );
          })()}
        </g>

        {/* Indicatore di livello esterno */}
        <g>
          {(() => {
            const indicatorX = isVertical ? centerX + tankWidth/2 + 11 : centerX + tankWidth/2 + 8; // Ridotto da 15 e 10
            const indicatorY = centerY;
            const indicatorHeight = isVertical ? tankHeight - 15 : tankHeight - 8; // Ridotto da 20 e 10
            
            return (
              <g>
                {/* Scala graduata */}
                <rect
                  x={indicatorX}
                  y={indicatorY - indicatorHeight/2}
                  width={6} // Ridotto da 8
                  height={indicatorHeight}
                  fill="white"
                  stroke={LPG_TANK_CONFIG.colors.border}
                  strokeWidth={1}
                  rx={1} // Ridotto da 2
                />
                
                {/* Riempimento indicatore */}
                <rect
                  x={indicatorX + 1}
                  y={indicatorY + indicatorHeight/2 - 1 - (indicatorHeight - 2) * displayFill/100}
                  width={4} // Ridotto da 6
                  height={(indicatorHeight - 2) * displayFill/100}
                  fill={fillColor}
                  rx={1}
                />
                
                {/* Tacche percentuali */}
                {[0, 25, 50, 75, 100].map(tick => (
                  <g key={tick}>
                    <line
                      x1={indicatorX + 6}    // Ridotto da 8
                      y1={indicatorY + indicatorHeight/2 - (indicatorHeight * tick/100)}
                      x2={indicatorX + 9}    // Ridotto da 12
                      y2={indicatorY + indicatorHeight/2 - (indicatorHeight * tick/100)}
                      stroke={LPG_TANK_CONFIG.colors.border}
                      strokeWidth={1}
                    />
                    <text
                      x={indicatorX + 11} // Ridotto da 15
                      y={indicatorY + indicatorHeight/2 - (indicatorHeight * tick/100) + 2}
                      fontSize={4}        // Ridotto da 6
                      fill={LPG_TANK_CONFIG.colors.text}
                    >
                      {tick}
                    </text>
                  </g>
                ))}
              </g>
            );
          })()}
        </g>

        {/* Display temperatura */}
        {LPG_TANK_CONFIG.showTemperature && (
          <g>
            {(() => {
              const tempDisplayX = centerX;
              const tempDisplayY = centerY - 19; // Ridotto da 25
              
              return (
                <g>
                  {/* Background display (ridimensionato per stare dentro il serbatoio) */}
                  <rect
                    x={tempDisplayX - 30} // Ridotto da 40
                    y={tempDisplayY - 9}  // Ridotto da 12
                    width={60}            // Ridotto da 80
                    height={18}           // Ridotto da 24
                    fill={`url(#temp-gradient-${label})`}
                    stroke={LPG_TANK_CONFIG.colors.border}
                    strokeWidth={1.5}     // Ridotto da 2
                    rx={5}                // Ridotto da 6
                  />
                  
                  {/* Valore temperatura */}
                  <text
                    x={tempDisplayX}
                    y={tempDisplayY + 4}  // Ridotto da 5
                    textAnchor="middle"
                    fontSize={LPG_TANK_CONFIG.fontSize.temperature}
                    fontWeight="bold"
                    fill="white"
                    stroke={LPG_TANK_CONFIG.colors.border}
                    strokeWidth={0.2}     // Ridotto da 0.3
                  >
                    {Math.round(displayTemp)}°C
                  </text>
                </g>
              );
            })()}
          </g>
        )}

        {/* Display livello riempimento */}
        {LPG_TANK_CONFIG.showFillLevel && (
          <g>
            {(() => {
              const fillDisplayX = centerX;
              const fillDisplayY = centerY + 8; // Ridotto da 10
              
              return (
                <g>
                  {/* Background display (ridimensionato per stare dentro il serbatoio) */}
                  <rect
                    x={fillDisplayX - 30} // Ridotto da 40
                    y={fillDisplayY - 9}  // Ridotto da 12
                    width={60}            // Ridotto da 80
                    height={18}           // Ridotto da 24
                    fill={fillColor}
                    stroke={LPG_TANK_CONFIG.colors.border}
                    strokeWidth={1.5}     // Ridotto da 2
                    rx={5}                // Ridotto da 6
                  />
                  
                  {/* Valore riempimento */}
                  <text
                    x={fillDisplayX}
                    y={fillDisplayY + 4}  // Ridotto da 5
                    textAnchor="middle"
                    fontSize={LPG_TANK_CONFIG.fontSize.fillLevel}
                    fontWeight="bold"
                    fill="white"
                    stroke={LPG_TANK_CONFIG.colors.border}
                    strokeWidth={0.2}     // Ridotto da 0.3
                  >
                    {Math.round(displayFill)}%
                  </text>
                </g>
              );
            })()}
          </g>
        )}
        
        {/* Etichetta del serbatoio */}
        {LPG_TANK_CONFIG.showLabel && (
          <g>
            <text
              x={centerX}
              y={svgHeight - 15} // Ridotto da 20
              textAnchor="middle"
              fontSize={LPG_TANK_CONFIG.fontSize.label}
              fontWeight="bold"
              fill={LPG_TANK_CONFIG.colors.text}
            >
              {label} - GPL TANK
            </text>
            
            {/* Stato complessivo */}
            <text
              x={centerX}
              y={svgHeight - 4} // Ridotto da 5
              textAnchor="middle"
              fontSize={LPG_TANK_CONFIG.fontSize.units}
              fill={tempColors.primary}
              fontWeight="bold"
            >
{/*              {displayTemp < 10 || displayTemp > 60 ? 'ALLARME' : 
               displayTemp > 40 ? 'ATTENZIONE' : 'NORMALE'} */}
            </text>
          </g>
        )}

        {/* Simbolo GPL (posizionato in basso per non interferire con i display) */}
        <text
          x={centerX}
          y={centerY + 34} // Ridotto da 45
          textAnchor="middle"
          fontSize={15}    // Ridotto da 20
          fontWeight="bold"
          fill="white"
          opacity={0.5}
          stroke={LPG_TANK_CONFIG.colors.border}
          strokeWidth={0.4} // Ridotto da 0.5
        >
          GPL
        </text>
      </svg>
    </div>
  );
};

export default LPGTank;
