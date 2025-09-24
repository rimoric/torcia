import React, { useState, useEffect } from 'react';

// Configurazione valvola modulante (facilmente modificabile)
const VALVE_MODULATING_CONFIG = {
  // Dimensioni base
  width: 70,
  height: 35,
  
  // Range colori per percentuali
  colorRanges: {
    closed: { min: 0, max: 30, colors: {
      primary: "#DC2626",    // rosso intenso
      secondary: "#B91C1C",  // rosso scuro
      highlight: "#F87171",  // rosso chiaro
      shadow: "#7F1D1D"      // rosso molto scuro
    }},
    partial: { min: 31, max: 70, colors: {
      primary: "#F59E0B",    // arancione/giallo intenso
      secondary: "#D97706",  // arancione scuro
      highlight: "#FCD34D",  // giallo chiaro
      shadow: "#92400E"      // marrone scuro
    }},
    open: { min: 71, max: 100, colors: {
      primary: "#10B981",    // verde intenso
      secondary: "#059669",  // verde scuro
      highlight: "#6EE7B7",  // verde chiaro
      shadow: "#047857"      // verde molto scuro
    }}
  },
  
  // Colori base
  colors: {
    border: "#1F2937",       // grigio molto scuro
    text: "#1F2937",
    connection: "#4B5563",   // grigio medio scuro
    tick: "#374151"          // grigio per tacche
  },
  
  // Testo e etichette
  showPercentage: true,
  showLabel: true,
  showTicks: true,
  
  // Stili 3D
  borderRadius: 6,
  strokeWidth: 2,
  shadowOffset: 3,
  fontSize: {
    percentage: 11,
    label: 12,
    state: 8
  },
  
  // Controllo
  step: 1 // Step di controllo 1%
};

interface ValveModulatingProps {
  // Valore della valvola (0-100%)
  value: number;
  
  // Configurazione
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  
  // Controlli
  manualControlEnabled?: boolean;
  onChange?: (value: number) => void;
  
  // Styling opzionale
  width?: number;
  height?: number;
  className?: string;
}

const ValveModulating: React.FC<ValveModulatingProps> = ({
  value,
  label = "VM001",
  orientation = 'horizontal',
  manualControlEnabled = false,
  onChange,
  width: customWidth,
  height: customHeight,
  className = ""
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(value);

  // Animazione graduale del valore
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue(prev => {
        const diff = value - prev;
        if (Math.abs(diff) < 0.5) {
          return value;
        }
        return prev + (diff > 0 ? Math.min(2, diff) : Math.max(-2, diff));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [value]);

  // Dimensioni effettive
  const width = customWidth || VALVE_MODULATING_CONFIG.width;
  const height = customHeight || VALVE_MODULATING_CONFIG.height;
  
  // Determina il range di colori basato sul valore
  const getCurrentColorRange = (val: number) => {
    const { colorRanges } = VALVE_MODULATING_CONFIG;
    if (val <= colorRanges.closed.max) return colorRanges.closed;
    if (val <= colorRanges.partial.max) return colorRanges.partial;
    return colorRanges.open;
  };
  
  const currentRange = getCurrentColorRange(displayValue);
  const currentColors = currentRange.colors;
  
  // Stato testuale
  const getStateText = (val: number) => {
    if (val <= 30) return "CHIUSA";
    if (val <= 70) return "PARZIALE";
    return "APERTA";
  };
  
  // Intensità freccia basata sul valore
  const getArrowIntensity = (val: number) => {
    if (val <= 20) return 0; // Nessuna freccia
    if (val <= 40) return 1; // Sottile
    if (val <= 70) return 2; // Media
    return 3; // Spessa e luminosa
  };

  // Gestione click
  const handleClick = () => {
    if (manualControlEnabled) {
      setSliderValue(displayValue);
      setShowSlider(true);
    }
  };

  const handleSliderChange = (newValue: number) => {
    setSliderValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSliderClose = () => {
    setShowSlider(false);
  };

  // Calcolo dimensioni SVG basate sull'orientamento
  const isVertical = orientation === 'vertical';
  const svgWidth = isVertical ? height + 100 : width + 100;
  const svgHeight = isVertical ? width + 100 : height + 100;
  
  // Centro del componente
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  // Dimensioni effettive della valvola (scambiate se verticale)
  const valveWidth = isVertical ? height : width;
  const valveHeight = isVertical ? width : height;

  const arrowIntensity = getArrowIntensity(displayValue);

  return (
    <div className={`inline-block relative ${className}`}>
      <svg 
        width={svgWidth} 
        height={svgHeight}
        className={`${manualControlEnabled ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={handleClick}
      >
        {/* Definizione gradienti 3D dinamici */}
        <defs>
          {/* Gradiente principale basato sul valore corrente */}
          <linearGradient id={`gradient-main-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentColors.highlight} />
            <stop offset="30%" stopColor={currentColors.primary} />
            <stop offset="70%" stopColor={currentColors.secondary} />
            <stop offset="100%" stopColor={currentColors.shadow} />
          </linearGradient>

          {/* Gradiente per highlight superiore */}
          <linearGradient id={`highlight-mod-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="50%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Ombra */}
          <filter id={`shadow-mod-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="2" dy="2" result="offset" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>

          {/* Gradiente per freccia dinamica */}
          <linearGradient id={`arrow-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="50%" stopColor={currentColors.highlight} stopOpacity="0.8" />
            <stop offset="100%" stopColor={currentColors.primary} stopOpacity="0.7" />
          </linearGradient>
        </defs>


        {/* Tacche di riferimento (25%, 50%, 75%) */}
        {VALVE_MODULATING_CONFIG.showTicks && (
          <g>
            {[25, 50, 75].map(tickValue => {
              const tickRange = getCurrentColorRange(tickValue);
              const tickPos = isVertical ? 
                centerY - valveHeight/2 + (valveHeight * (100 - tickValue) / 100) :
                centerX - valveWidth/2 + (valveWidth * tickValue / 100);
              
              return (
                <g key={tickValue}>
                  <line
                    x1={isVertical ? centerX - valveWidth/2 - 3 : tickPos}
                    y1={isVertical ? tickPos : centerY - valveHeight/2 - 3}
                    x2={isVertical ? centerX - valveWidth/2 + 3 : tickPos}
                    y2={isVertical ? tickPos : centerY - valveHeight/2 + 3}
                    stroke={tickRange.colors.primary}
                    strokeWidth={1}
                    opacity={0.6}
                  />
                  <text
                    x={isVertical ? centerX - valveWidth/2 - 10 : tickPos}
                    y={isVertical ? tickPos + 2 : centerY - valveHeight/2 - 8}
                    textAnchor="middle"
                    fontSize={6}
                    fill={VALVE_MODULATING_CONFIG.colors.tick}
                    opacity={0.7}
                  >
                    {tickValue}
                  </text>
                </g>
              );
            })}
          </g>
        )}
        
        {/* Ombra del corpo valvola */}
        <rect
          x={centerX - valveWidth/2 + VALVE_MODULATING_CONFIG.shadowOffset}
          y={centerY - valveHeight/2 + VALVE_MODULATING_CONFIG.shadowOffset}
          width={valveWidth}
          height={valveHeight}
          fill={currentColors.shadow}
          opacity={0.3}
          rx={VALVE_MODULATING_CONFIG.borderRadius}
          ry={VALVE_MODULATING_CONFIG.borderRadius}
        />
        
        {/* Corpo della valvola con gradiente 3D dinamico */}
        <rect
          x={centerX - valveWidth/2}
          y={centerY - valveHeight/2}
          width={valveWidth}
          height={valveHeight}
          fill={`url(#gradient-main-${label})`}
          stroke={VALVE_MODULATING_CONFIG.colors.border}
          strokeWidth={VALVE_MODULATING_CONFIG.strokeWidth}
          rx={VALVE_MODULATING_CONFIG.borderRadius}
          ry={VALVE_MODULATING_CONFIG.borderRadius}
          filter={`url(#shadow-mod-${label})`}
        />

        {/* Barra di riempimento interna basata sulla percentuale */}
        <rect
          x={centerX - valveWidth/2 + 4}
          y={centerY - valveHeight/2 + 4 + (valveHeight - 8) * (1 - displayValue/100)}
          width={valveWidth - 8}
          height={(valveHeight - 8) * displayValue/100}
          fill={currentColors.primary}
          opacity={0.3}
          rx={2}
          ry={2}
        />

        {/* Highlight superiore per effetto 3D */}
        <rect
          x={centerX - valveWidth/2 + 2}
          y={centerY - valveHeight/2 + 2}
          width={valveWidth - 4}
          height={valveHeight/2}
          fill={`url(#highlight-mod-${label})`}
          rx={VALVE_MODULATING_CONFIG.borderRadius - 1}
          ry={VALVE_MODULATING_CONFIG.borderRadius - 1}
        />
        
        {/* Freccia di flusso dinamica basata sull'intensità */}
        {arrowIntensity > 0 && (
          <g>
            {isVertical ? (
              // Freccia verticale con intensità variabile
              <>
                <polygon
                  points={`${centerX-6*arrowIntensity},${centerY-8} ${centerX+6*arrowIntensity},${centerY-8} ${centerX},${centerY+8}`}
                  fill="white"
                  stroke={VALVE_MODULATING_CONFIG.colors.border}
                  strokeWidth={arrowIntensity * 0.5}
                  opacity={0.9}
                />
                <polygon
                  points={`${centerX-4*arrowIntensity},${centerY-6} ${centerX+4*arrowIntensity},${centerY-6} ${centerX},${centerY+6}`}
                  fill={`url(#arrow-gradient-${label})`}
                  opacity={0.7 + arrowIntensity * 0.1}
                />
              </>
            ) : (
              // Freccia orizzontale con intensità variabile
              <>
                <polygon
                  points={`${centerX-8},${centerY-6*arrowIntensity} ${centerX-8},${centerY+6*arrowIntensity} ${centerX+8},${centerY}`}
                  fill="white"
                  stroke={VALVE_MODULATING_CONFIG.colors.border}
                  strokeWidth={arrowIntensity * 0.5}
                  opacity={0.9}
                />
                <polygon
                  points={`${centerX-6},${centerY-4*arrowIntensity} ${centerX-6},${centerY+4*arrowIntensity} ${centerX+6},${centerY}`}
                  fill={`url(#arrow-gradient-${label})`}
                  opacity={0.7 + arrowIntensity * 0.1}
                />
              </>
            )}
          </g>
        )}
        
        {/* Valore percentuale con ombra */}
        {VALVE_MODULATING_CONFIG.showPercentage && (
          <g>
            {/* Ombra del testo */}
            <text
              x={centerX + 1}
              y={centerY + 2}
              textAnchor="middle"
              fontSize={VALVE_MODULATING_CONFIG.fontSize.percentage}
              fontWeight="bold"
              fill="black"
              opacity={0.3}
            >
              {Math.round(displayValue)}%
            </text>
            {/* Testo principale */}
            <text
              x={centerX}
              y={centerY + 1}
              textAnchor="middle"
              fontSize={VALVE_MODULATING_CONFIG.fontSize.percentage}
              fontWeight="bold"
              fill="white"
              stroke={VALVE_MODULATING_CONFIG.colors.border}
              strokeWidth={0.5}
            >
              {Math.round(displayValue)}%
            </text>
          </g>
        )}

        {/* Stato testuale */}
        <text
          x={centerX}
          y={centerY + valveHeight/2 - 5}
          textAnchor="middle"
          fontSize={VALVE_MODULATING_CONFIG.fontSize.state}
          fontWeight="bold"
          fill="white"
          opacity={0.8}
        >
          {getStateText(displayValue)}
        </text>
        
        {/* Indicatore di stato con gradiente dinamico */}
        <g>
          {/* Ombra dell'indicatore */}
          <circle
            cx={centerX + valveWidth/2 - 6}
            cy={centerY - valveHeight/2 + 10}
            r={5}
            fill={currentColors.shadow}
            opacity={0.4}
          />
          {/* Indicatore principale */}
          <circle
            cx={centerX + valveWidth/2 - 8}
            cy={centerY - valveHeight/2 + 8}
            r={5}
            fill={`url(#gradient-main-${label})`}
            stroke={VALVE_MODULATING_CONFIG.colors.border}
            strokeWidth={1.5}
          />
          {/* Highlight dell'indicatore */}
          <circle
            cx={centerX + valveWidth/2 - 9}
            cy={centerY - valveHeight/2 + 7}
            r={2}
            fill="white"
            opacity={0.6}
          />
        </g>
        
        {/* Etichetta della valvola con ombra */}
        {VALVE_MODULATING_CONFIG.showLabel && (
          <g>
            {/* Ombra dell'etichetta */}
            <text
              x={centerX + 1}
              y={isVertical ? svgHeight - 18 : centerY + valveHeight/2 + 26}
              textAnchor="middle"
              fontSize={VALVE_MODULATING_CONFIG.fontSize.label}
              fontWeight="bold"
              fill="black"
              opacity={0.3}
            >
              {label}
            </text>
            {/* Etichetta principale */}
            <text
              x={centerX}
              y={isVertical ? svgHeight - 20 : centerY + valveHeight/2 + 25}
              textAnchor="middle"
              fontSize={VALVE_MODULATING_CONFIG.fontSize.label}
              fontWeight="bold"
              fill={VALVE_MODULATING_CONFIG.colors.text}
            >
              {label}
            </text>
          </g>
        )}
        
      </svg>

      {/* Slider popup per controllo manuale */}
      {showSlider && manualControlEnabled && (
        <div className="absolute top-0 left-0 bg-white border-2 border-gray-300 rounded-lg p-3 shadow-lg z-10">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-700">
              Controllo {label}: {sliderValue}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step={VALVE_MODULATING_CONFIG.step}
              value={sliderValue}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="w-32"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSliderClose}
                className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Chiudi
              </button>
              <span className={`px-2 py-1 text-xs rounded text-white ${
                getCurrentColorRange(sliderValue) === VALVE_MODULATING_CONFIG.colorRanges.closed ? 'bg-red-500' :
                getCurrentColorRange(sliderValue) === VALVE_MODULATING_CONFIG.colorRanges.partial ? 'bg-yellow-500' :
                'bg-green-500'
              }`}>
                {getStateText(sliderValue)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValveModulating;
