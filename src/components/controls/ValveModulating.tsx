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

        {/* Linee di connessione con effetto metallico */}
        {isVertical ? (
          <>
            {/* Connessione superiore */}
            <line
              x1={centerX}
              y1={10}
              x2={centerX}
              y2={centerY - valveHeight/2}
              stroke={VALVE_MODULATING_CONFIG.colors.connection}
              strokeWidth={VALVE_MODULATING_CONFIG.strokeWidth + 1}
              opacity={Math.max(0.4, displayValue/100)}
            />
            <line
              x1={centerX-1}
              y1={10}
              x2={centerX-1}
              y2={centerY - valveHeight/2}
              stroke="white"
              strokeWidth={1}
              opacity={0.4}
            />
            {/* Connessione inferiore */}
            <line
              x1={centerX}
              y1={centerY + valveHeight/2}
              x2={centerX}
              y2={svgHeight - 30}
              stroke={VALVE_MODULATING_CONFIG.colors.connection}
              strokeWidth={VALVE_MODULATING_CONFIG.strokeWidth + 1}
              opacity={Math.max(0.4, displayValue/100)}
            />
            <line
              x1={centerX-1}
              y1={centerY + valveHeight/2}
              x2={centerX-1}
              y2={svgHeight - 30}
              stroke="white"
              strokeWidth={1}
              opacity={0.4}
            />
          </>
        ) : (
          <>
            {/* Connessione sinistra */}
            <line
              x1={10}
              y1={centerY}
              x2={centerX - valveWidth/2}
              y2={centerY}
              stroke={VALVE_MODULATING_CONFIG.colors.connection}
              strokeWidth={VALVE_MODULATING_CONFIG.strokeWidth + 1}
              opacity={Math.max(0.4, displayValue/100)}
            />
            <line
              x1={10}
              y1={centerY-1}
              x2={centerX - valveWidth/2}
              y2={centerY-1}
              stroke="white"
              strokeWidth={1}
              opacity={0.4}
            />
            {/* Connessione destra */}
            <line
              x1={centerX + valveWidth/2}
              y1={centerY}
              x2={svgWidth - 10}
              y2={centerY}
              stroke={VALVE_MODULATING_CONFIG.colors.connection}
              strokeWidth={VALVE_MODULATING_CONFIG.strokeWidth + 1}
              opacity={Math.max(0.4, displayValue/100)}
            />
            <line
              x1={centerX + valveWidth/2}
              y1={centerY-1}
              x2={svgWidth - 10}
              y2={centerY-1}
              stroke="white"
              strokeWidth={1}
              opacity={0.4}
            />
          </>
        )}

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
        
        {/* Indicatore controllo manuale abilitato */}
        {manualControlEnabled && (
          <g>
            <circle
              cx={svgWidth - 13}
              cy={17}
              r={6}
              fill="#059669"
              opacity={0.4}
            />
            <circle
              cx={svgWidth - 15}
              cy={15}
              r={6}
              fill="#10B981"
              stroke="#047857"
              strokeWidth={1}
            />
            <circle
              cx={svgWidth - 16}
              cy={14}
              r={2}
              fill="white"
              opacity={0.8}
            />
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

// Componente Demo per mostrare entrambi gli orientamenti
const ValveModulatingDemo: React.FC = () => {
  const [valve1Value, setValve1Value] = useState(25);
  const [valve2Value, setValve2Value] = useState(55);
  const [valve3Value, setValve3Value] = useState(85);
  const [valve4Value, setValve4Value] = useState(10);
  const [manualControlEnabled, setManualControlEnabled] = useState(false);

  // Simulazione variazione automatica
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    if (autoMode) {
      const interval = setInterval(() => {
        setValve1Value(prev => Math.min(100, prev + Math.random() * 4 - 2));
        setValve2Value(prev => Math.max(0, Math.min(100, prev + Math.random() * 6 - 3)));
        setValve3Value(prev => Math.max(0, prev - Math.random() * 2));
        setValve4Value(prev => Math.min(100, prev + Math.random() * 3));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoMode]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Controlli Valvola Modulante - Dashboard Industriale
        </h1>
        
        {/* Pannello controlli */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Controlli Globali</h2>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={manualControlEnabled}
                onChange={(e) => setManualControlEnabled(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Abilita Comandi Manuali</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoMode}
                onChange={(e) => setAutoMode(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Simulazione Automatica</span>
            </label>
            {manualControlEnabled && (
              <span className="text-xs text-green-600 font-medium">
                Controllo manuale attivo - cliccare sulle valvole per regolarle
              </span>
            )}
          </div>
        </div>

        {/* Griglia delle valvole modulanti */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Valvola Orizzontale - Range CHIUSA */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Orizzontale - Chiusa
            </h3>
            <div className="flex justify-center">
              <ValveModulating
                value={valve1Value}
                label="VM001"
                orientation="horizontal"
                manualControlEnabled={manualControlEnabled}
                onChange={setValve1Value}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-600">
                Valore: <span className="font-semibold text-red-600">{Math.round(valve1Value)}%</span>
              </div>
              <div className="text-gray-600">
                Stato: <span className="font-semibold text-red-600">CHIUSA</span>
              </div>
            </div>
          </div>

          {/* Valvola Orizzontale - Range PARZIALE */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Orizzontale - Parziale
            </h3>
            <div className="flex justify-center">
              <ValveModulating
                value={valve2Value}
                label="VM002"
                orientation="horizontal"
                manualControlEnabled={manualControlEnabled}
                onChange={setValve2Value}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-600">
                Valore: <span className="font-semibold text-yellow-600">{Math.round(valve2Value)}%</span>
              </div>
              <div className="text-gray-600">
                Stato: <span className="font-semibold text-yellow-600">PARZIALE</span>
              </div>
            </div>
          </div>

          {/* Valvola Verticale - Range APERTA */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Verticale - Aperta
            </h3>
            <div className="flex justify-center">
              <ValveModulating
                value={valve3Value}
                label="VM003"
                orientation="vertical"
                manualControlEnabled={manualControlEnabled}
                onChange={setValve3Value}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-600">
                Valore: <span className="font-semibold text-green-600">{Math.round(valve3Value)}%</span>
              </div>
              <div className="text-gray-600">
                Stato: <span className="font-semibold text-green-600">APERTA</span>
              </div>
            </div>
          </div>

          {/* Valvola Verticale - Range CHIUSA */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Verticale - Chiusa
            </h3>
            <div className="flex justify-center">
              <ValveModulating
                value={valve4Value}
                label="VM004"
                orientation="vertical"
                manualControlEnabled={manualControlEnabled}
                onChange={setValve4Value}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-600">
                Valore: <span className="font-semibold text-red-600">{Math.round(valve4Value)}%</span>
              </div>
              <div className="text-gray-600">
                Stato: <span className="font-semibold text-red-600">CHIUSA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Esempi con dimensioni diverse */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Varianti Dimensionali</h2>
          <div className="flex flex-wrap gap-8 items-center justify-center">
            
            <div className="text-center">
              <ValveModulating
                value={75}
                label="Small"
                orientation="horizontal"
                width={50}
                height={25}
                manualControlEnabled={manualControlEnabled}
                onChange={() => {}}
              />
              <p className="text-xs text-gray-600 mt-2">Piccola (50x25)</p>
            </div>

            <div className="text-center">
              <ValveModulating
                value={45}
                label="Normal"
                orientation="horizontal"
                manualControlEnabled={manualControlEnabled}
                onChange={() => {}}
              />
              <p className="text-xs text-gray-600 mt-2">Normale (70x35)</p>
            </div>

            <div className="text-center">
              <ValveModulating
                value={90}
                label="Large"
                orientation="vertical"
                width={90}
                height={45}
                manualControlEnabled={manualControlEnabled}
                onChange={() => {}}
              />
              <p className="text-xs text-gray-600 mt-2">Grande (90x45)</p>
            </div>
          </div>
        </div>

        {/* Informazioni tecniche */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Caratteristiche Valvola Modulante</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Range di Colori:</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span><strong>0-30%:</strong> CHIUSA (Rosso)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span><strong>31-70%:</strong> PARZIALE (Giallo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span><strong>71-100%:</strong> APERTA (Verde)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Effetti Dinamici:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Animazione graduale</strong> dei valori</div>
                <div>• <strong>Freccia variabile</strong> per intensità flusso</div>
                <div>• <strong>Barra di riempimento</strong> interna</div>
                <div>• <strong>Tacche di riferimento</strong> a 25%, 50%, 75%</div>
                <div>• <strong>Connessioni</strong> con opacità dinamica</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Controlli:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Precisione:</strong> Step 1%</div>
                <div>• <strong>Range:</strong> 0-100%</div>
                <div>• <strong>Slider popup</strong> per controllo manuale</div>
                <div>• <strong>Visualizzazione:</strong> Valore % e stato</div>
                <div>• <strong>Orientamenti:</strong> Orizzontale e verticale</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValveModulatingDemo;
