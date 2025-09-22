import React, { useState, useEffect } from 'react';

// Configurazione serbatoio GPL (facilmente modificabile)
const LPG_TANK_CONFIG = {
  // Dimensioni base (raddoppiate per ottima leggibilità)
  width: 320,
  height: 160,
  
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
  
  // Stili 3D
  borderRadius: 30,  // Per estremità arrotondate
  strokeWidth: 2,
  shadowOffset: 4,
  fontSize: {
    temperature: 18,    // Proporzionato alle nuove dimensioni
    fillLevel: 18,      // Proporzionato alle nuove dimensioni
    label: 16,
    units: 12           // Proporzionato alle nuove dimensioni
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
  
  // Calcolo dimensioni SVG
  const isVertical = orientation === 'vertical';
  const svgWidth = isVertical ? height + 100 : width + 100;
  const svgHeight = isVertical ? width + 140 : height + 140;
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
            <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
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

        {/* Supporti del serbatoio */}
        {!isVertical && (
          <g>
            {/* Supporto sinistro */}
            <rect
              x={centerX - tankWidth/2 + 10}
              y={centerY + tankHeight/2 - 5}
              width={15}
              height={20}
              fill={LPG_TANK_CONFIG.colors.support}
              stroke={LPG_TANK_CONFIG.colors.border}
              strokeWidth={1}
              rx={3}
            />
            {/* Supporto destro */}
            <rect
              x={centerX + tankWidth/2 - 25}
              y={centerY + tankHeight/2 - 5}
              width={15}
              height={20}
              fill={LPG_TANK_CONFIG.colors.support}
              stroke={LPG_TANK_CONFIG.colors.border}
              strokeWidth={1}
              rx={3}
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
              const fillWidth = isVertical ? tankWidth - 8 : tankWidth - 8;
              const fillHeight = isVertical ? (tankHeight - 8) * fillRatio : tankHeight - 8;
              const fillX = centerX - fillWidth/2;
              const fillY = isVertical ? 
                centerY + tankHeight/2 - 4 - fillHeight :
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
                    rx={isVertical ? fillWidth/6 - 2 : Math.min(fillHeight/2, LPG_TANK_CONFIG.borderRadius - 4)}
                    ry={isVertical ? Math.min(fillHeight/2, LPG_TANK_CONFIG.borderRadius - 4) : fillHeight/6 - 2}
                  />
                  
                  {/* Superficie del liquido (effetto ondulato) */}
                  <rect
                    x={fillX}
                    y={isVertical ? fillY : fillY}
                    width={fillWidth}
                    height={3}
                    fill={`url(#surface-gradient-${label})`}
                  />
                </g>
              );
            })()}
          </g>
        )}

        {/* Riflessi metallici sul serbatoio */}
        <rect
          x={centerX - tankWidth/2 + 5}
          y={centerY - tankHeight/2 + 5}
          width={tankWidth/3}
          height={tankHeight - 10}
          fill={`url(#reflection-${label})`}
          rx={isVertical ? tankWidth/8 : LPG_TANK_CONFIG.borderRadius/2}
          ry={isVertical ? LPG_TANK_CONFIG.borderRadius/2 : tankHeight/8}
        />

        {/* Bocchettone di riempimento/svuotamento */}
        <g>
          {(() => {
            const nozzleX = isVertical ? centerX + tankWidth/2 + 5 : centerX;
            const nozzleY = isVertical ? centerY : centerY - tankHeight/2 - 15;
            const nozzleWidth = isVertical ? 20 : 15;
            const nozzleHeight = isVertical ? 15 : 20;
            
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
                  rx={3}
                />
                
                {/* Valvola del bocchettone */}
                <circle
                  cx={nozzleX}
                  cy={nozzleY + (isVertical ? -nozzleHeight/2 - 5 : nozzleHeight/2 + 5)}
                  r={6}
                  fill={LPG_TANK_CONFIG.colors.valve}
                  stroke={LPG_TANK_CONFIG.colors.border}
                  strokeWidth={1}
                />
                
                {/* Etichetta bocchettone */}
                <text
                  x={nozzleX}
                  y={nozzleY + (isVertical ? -nozzleHeight/2 - 20 : nozzleHeight/2 + 25)}
                  textAnchor="middle"
                  fontSize={7}
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
            const gaugeX = isVertical ? centerX - tankWidth/2 - 20 : centerX + tankWidth/2 - 15;
            const gaugeY = isVertical ? centerY - 10 : centerY - tankHeight/2 + 10;
            
            return (
              <g>
                <circle
                  cx={gaugeX}
                  cy={gaugeY}
                  r={12}
                  fill="white"
                  stroke={LPG_TANK_CONFIG.colors.border}
                  strokeWidth={2}
                />
                <circle
                  cx={gaugeX}
                  cy={gaugeY}
                  r={8}
                  fill="none"
                  stroke={tempColors.primary}
                  strokeWidth={1}
                />
                {/* Lancetta */}
                <line
                  x1={gaugeX}
                  y1={gaugeY}
                  x2={gaugeX + 6}
                  y2={gaugeY - 2}
                  stroke={tempColors.primary}
                  strokeWidth={2}
                />
                <text
                  x={gaugeX}
                  y={gaugeY + 20}
                  textAnchor="middle"
                  fontSize={6}
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
            const indicatorX = isVertical ? centerX + tankWidth/2 + 15 : centerX + tankWidth/2 + 10;
            const indicatorY = centerY;
            const indicatorHeight = isVertical ? tankHeight - 20 : tankHeight - 10;
            
            return (
              <g>
                {/* Scala graduata */}
                <rect
                  x={indicatorX}
                  y={indicatorY - indicatorHeight/2}
                  width={8}
                  height={indicatorHeight}
                  fill="white"
                  stroke={LPG_TANK_CONFIG.colors.border}
                  strokeWidth={1}
                  rx={2}
                />
                
                {/* Riempimento indicatore */}
                <rect
                  x={indicatorX + 1}
                  y={indicatorY + indicatorHeight/2 - 1 - (indicatorHeight - 2) * displayFill/100}
                  width={6}
                  height={(indicatorHeight - 2) * displayFill/100}
                  fill={fillColor}
                  rx={1}
                />
                
                {/* Tacche percentuali */}
                {[0, 25, 50, 75, 100].map(tick => (
                  <g key={tick}>
                    <line
                      x1={indicatorX + 8}
                      y1={indicatorY + indicatorHeight/2 - (indicatorHeight * tick/100)}
                      x2={indicatorX + 12}
                      y2={indicatorY + indicatorHeight/2 - (indicatorHeight * tick/100)}
                      stroke={LPG_TANK_CONFIG.colors.border}
                      strokeWidth={1}
                    />
                    <text
                      x={indicatorX + 15}
                      y={indicatorY + indicatorHeight/2 - (indicatorHeight * tick/100) + 2}
                      fontSize={6}
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
              const tempDisplayY = centerY - 25;
              
              return (
                <g>
                  {/* Background display (ridimensionato per stare dentro il serbatoio) */}
                  <rect
                    x={tempDisplayX - 40}
                    y={tempDisplayY - 12}
                    width={80}
                    height={24}
                    fill={`url(#temp-gradient-${label})`}
                    stroke={LPG_TANK_CONFIG.colors.border}
                    strokeWidth={2}
                    rx={6}
                  />
                  
                  {/* Valore temperatura */}
                  <text
                    x={tempDisplayX}
                    y={tempDisplayY + 5}
                    textAnchor="middle"
                    fontSize={LPG_TANK_CONFIG.fontSize.temperature}
                    fontWeight="bold"
                    fill="white"
                    stroke={LPG_TANK_CONFIG.colors.border}
                    strokeWidth={0.3}
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
              const fillDisplayY = centerY + 10;
              
              return (
                <g>
                  {/* Background display (ridimensionato per stare dentro il serbatoio) */}
                  <rect
                    x={fillDisplayX - 40}
                    y={fillDisplayY - 12}
                    width={80}
                    height={24}
                    fill={fillColor}
                    stroke={LPG_TANK_CONFIG.colors.border}
                    strokeWidth={2}
                    rx={6}
                  />
                  
                  {/* Valore riempimento */}
                  <text
                    x={fillDisplayX}
                    y={fillDisplayY + 5}
                    textAnchor="middle"
                    fontSize={LPG_TANK_CONFIG.fontSize.fillLevel}
                    fontWeight="bold"
                    fill="white"
                    stroke={LPG_TANK_CONFIG.colors.border}
                    strokeWidth={0.3}
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
              y={svgHeight - 20}
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
              y={svgHeight - 5}
              textAnchor="middle"
              fontSize={LPG_TANK_CONFIG.fontSize.units}
              fill={tempColors.primary}
              fontWeight="bold"
            >
              {displayTemp < 10 || displayTemp > 60 ? 'ALLARME' : 
               displayTemp > 40 ? 'ATTENZIONE' : 'NORMALE'}
            </text>
          </g>
        )}

        {/* Simbolo GPL (posizionato in basso per non interferire con i display) */}
        <text
          x={centerX}
          y={centerY + 45}
          textAnchor="middle"
          fontSize={20}
          fontWeight="bold"
          fill="white"
          opacity={0.5}
          stroke={LPG_TANK_CONFIG.colors.border}
          strokeWidth={0.5}
        >
          GPL
        </text>
      </svg>
    </div>
  );
};

// Componente Demo per mostrare entrambi gli orientamenti
const LPGTankDemo: React.FC = () => {
  const [tank1Temp, setTank1Temp] = useState(25);
  const [tank1Fill, setTank1Fill] = useState(75);
  const [tank2Temp, setTank2Temp] = useState(45);
  const [tank2Fill, setTank2Fill] = useState(30);
  const [tank3Temp, setTank3Temp] = useState(15);
  const [tank3Fill, setTank3Fill] = useState(90);
  const [tank4Temp, setTank4Temp] = useState(65);
  const [tank4Fill, setTank4Fill] = useState(10);

  // Simulazione automatica
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    if (autoMode) {
      const interval = setInterval(() => {
        // Simulazione consumo e variazioni temperatura
        setTank1Fill(prev => Math.max(0, prev - Math.random() * 0.5));
        setTank1Temp(prev => prev + (Math.random() - 0.5) * 2);
        
        setTank2Fill(prev => Math.max(0, prev - Math.random() * 0.3));
        setTank2Temp(prev => Math.min(70, Math.max(10, prev + (Math.random() - 0.5) * 3)));
        
        setTank3Fill(prev => Math.max(0, prev - Math.random() * 0.2));
        setTank3Temp(prev => Math.max(5, prev + (Math.random() - 0.5) * 1));
        
        setTank4Fill(prev => Math.max(0, prev - Math.random() * 0.8));
        setTank4Temp(prev => Math.min(80, prev + Math.random() * 2));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [autoMode]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Serbatoio GPL - Dashboard Industriale
        </h1>
        
        {/* Pannello controlli */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Controlli Demo</h2>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoMode}
                onChange={(e) => setAutoMode(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Simulazione Automatica</span>
            </label>
            {autoMode && (
              <span className="text-xs text-green-600 font-medium">
                ● Simulazione attiva - consumo e variazioni temperatura
              </span>
            )}
          </div>
        </div>

        {/* Griglia serbatoi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Serbatoio Orizzontale - Normale */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Serbatoio Orizzontale - Stato Normale
            </h3>
            <div className="flex justify-center">
              <LPGTank
                temperature={tank1Temp}
                fillLevel={tank1Fill}
                label="TK001"
                orientation="horizontal"
                size={0.8}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="text-center">
                <div className="text-gray-600">Temperatura</div>
                <div className={`font-semibold ${tank1Temp > 40 ? 'text-yellow-600' : tank1Temp < 10 ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.round(tank1Temp)}°C
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Livello</div>
                <div className="font-semibold text-blue-600">
                  {Math.round(tank1Fill)}%
                </div>
              </div>
            </div>
          </div>

          {/* Serbatoio Orizzontale - Attenzione */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Serbatoio Orizzontale - Attenzione
            </h3>
            <div className="flex justify-center">
              <LPGTank
                temperature={tank2Temp}
                fillLevel={tank2Fill}
                label="TK002"
                orientation="horizontal"
                size={0.8}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="text-center">
                <div className="text-gray-600">Temperatura</div>
                <div className={`font-semibold ${tank2Temp > 40 ? 'text-yellow-600' : tank2Temp < 10 ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.round(tank2Temp)}°C
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Livello</div>
                <div className="font-semibold text-blue-600">
                  {Math.round(tank2Fill)}%
                </div>
              </div>
            </div>
          </div>

          {/* Serbatoio Verticale - Normale */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Serbatoio Verticale - Stato Normale
            </h3>
            <div className="flex justify-center">
              <LPGTank
                temperature={tank3Temp}
                fillLevel={tank3Fill}
                label="TK003"
                orientation="vertical"
                size={0.8}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="text-center">
                <div className="text-gray-600">Temperatura</div>
                <div className={`font-semibold ${tank3Temp > 40 ? 'text-yellow-600' : tank3Temp < 10 ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.round(tank3Temp)}°C
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Livello</div>
                <div className="font-semibold text-blue-600">
                  {Math.round(tank3Fill)}%
                </div>
              </div>
            </div>
          </div>

          {/* Serbatoio Verticale - Allarme */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Serbatoio Verticale - Allarme
            </h3>
            <div className="flex justify-center">
              <LPGTank
                temperature={tank4Temp}
                fillLevel={tank4Fill}
                label="TK004"
                orientation="vertical"
                size={0.8}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="text-center">
                <div className="text-gray-600">Temperatura</div>
                <div className={`font-semibold ${tank4Temp > 40 ? 'text-yellow-600' : tank4Temp < 10 ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.round(tank4Temp)}°C
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Livello</div>
                <div className="font-semibold text-blue-600">
                  {Math.round(tank4Fill)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pannello di stato sistema */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Stato Sistema Serbatoi GPL</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'TK001', temp: tank1Temp, fill: tank1Fill },
              { label: 'TK002', temp: tank2Temp, fill: tank2Fill },
              { label: 'TK003', temp: tank3Temp, fill: tank3Fill },
              { label: 'TK004', temp: tank4Temp, fill: tank4Fill }
            ].map((tank, index) => {
              const tempStatus = tank.temp > 60 || tank.temp < 10 ? 'ALLARME' : 
                                tank.temp > 40 ? 'ATTENZIONE' : 'NORMALE';
              const tempColor = tempStatus === 'ALLARME' ? 'text-red-600' :
                               tempStatus === 'ATTENZIONE' ? 'text-yellow-600' : 'text-green-600';
              
              return (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  tempStatus === 'ALLARME' ? 'border-red-500 bg-red-50' :
                  tempStatus === 'ATTENZIONE' ? 'border-yellow-500 bg-yellow-50' :
                  'border-green-500 bg-green-50'
                }`}>
                  <div className="text-sm font-semibold text-gray-700">{tank.label}</div>
                  <div className="text-xs text-gray-600">
                    Temp: <span className={tempColor}>{Math.round(tank.temp)}°C</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Livello: <span className="text-blue-600">{Math.round(tank.fill)}%</span>
                  </div>
                  <div className={`text-xs font-semibold ${tempColor}`}>
                    {tempStatus}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informazioni tecniche */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Serbatoio GPL - Specifiche Tecniche</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Visualizzazione:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Temperatura:</strong> Display digitale °C</div>
                <div>• <strong>Livello:</strong> Azzurro graduato 0-100%</div>
                <div>• <strong>Manometro:</strong> Pressione integrato</div>
                <div>• <strong>Indicatore esterno:</strong> Scala graduata</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Allarmi Temperatura:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span><strong>10-40°C:</strong> Normale</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span><strong>41-60°C:</strong> Attenzione</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span><strong>&lt;10°C o &gt;60°C:</strong> Allarme</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Caratteristiche:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Orientamenti:</strong> Orizzontale/Verticale</div>
                <div>• <strong>Bocchettone:</strong> Fill/Drain integrato</div>
                <div>• <strong>Supporti:</strong> Strutturali realistici</div>
                <div>• <strong>Riflessi:</strong> Superficie metallica 3D</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LPGTankDemo;