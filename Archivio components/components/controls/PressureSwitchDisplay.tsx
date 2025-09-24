import React, { useState, useEffect } from 'react';

// Configurazione pressostato con display (facilmente modificabile)
const PRESSURE_SWITCH_DISPLAY_CONFIG = {
  // Dimensioni base
  bodyRadius: 35,
  displayWidth: 80,
  displayHeight: 30,
  
  // Range di pressione e colori
  ranges: {
    normal: { min: 0, max: 6, colors: {
      primary: "#10B981",    // verde intenso
      secondary: "#059669",  // verde scuro
      highlight: "#6EE7B7",  // verde chiaro
      shadow: "#047857"      // verde molto scuro
    }},
    warning: { min: 6.1, max: 8, colors: {
      primary: "#F59E0B",    // giallo intenso
      secondary: "#D97706",  // giallo scuro
      highlight: "#FCD34D",  // giallo chiaro
      shadow: "#92400E"      // marrone scuro
    }},
    alarm: { min: 8.1, max: 15, colors: {
      primary: "#DC2626",    // rosso intenso
      secondary: "#B91C1C",  // rosso scuro
      highlight: "#F87171",  // rosso chiaro
      shadow: "#7F1D1D"      // rosso molto scuro
    }}
  },
  
  // Colori base
  colors: {
    body: "#D1D5DB",         // grigio metallico
    bodyHighlight: "#F3F4F6", // grigio chiaro
    bodyShadow: "#6B7280",   // grigio scuro
    border: "#1F2937",       // grigio molto scuro
    text: "#1F2937",
    connection: "#4B5563",   // grigio per connessioni
    display: "#000000"       // nero per display LCD
  },
  
  // Impostazioni misura
  units: "bar",
  decimals: 1,
  
  // Testo e etichette
  showLabel: true,
  showUnits: true,
  
  // Stili 3D
  strokeWidth: 2,
  shadowOffset: 3,
  fontSize: {
    value: 14,
    units: 8,
    label: 11
  }
};

type PressureConnectionOrientation = 'bottom' | 'right' | 'left';

interface PressureSwitchDisplayProps {
  // Valore di pressione
  pressure: number;
  
  // Configurazione
  label?: string;
  connectionOrientation?: PressureConnectionOrientation;
  
  // Controlli (solo per demo)
  manualControlEnabled?: boolean;
  onPressureChange?: (pressure: number) => void;
  
  // Styling opzionale
  size?: number;
  className?: string;
}

const PressureSwitchDisplay: React.FC<PressureSwitchDisplayProps> = ({
  pressure,
  label = "PS001",
  connectionOrientation = 'bottom',
  manualControlEnabled = false,
  onPressureChange,
  size = 1,
  className = ""
}) => {
  const [displayPressure, setDisplayPressure] = useState(pressure);

  // Animazione graduale del valore
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayPressure(prev => {
        const diff = pressure - prev;
        if (Math.abs(diff) < 0.05) return pressure;
        return prev + (diff > 0 ? Math.min(0.1, diff) : Math.max(-0.1, diff));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [pressure]);

  // Dimensioni scalate
  const bodyRadius = PRESSURE_SWITCH_DISPLAY_CONFIG.bodyRadius * size;
  const displayWidth = PRESSURE_SWITCH_DISPLAY_CONFIG.displayWidth * size;
  const displayHeight = PRESSURE_SWITCH_DISPLAY_CONFIG.displayHeight * size;
  
  // Determina il range di colori basato sulla pressione
  const getCurrentRange = (press: number) => {
    const { ranges } = PRESSURE_SWITCH_DISPLAY_CONFIG;
    if (press <= ranges.normal.max) return ranges.normal;
    if (press <= ranges.warning.max) return ranges.warning;
    return ranges.alarm;
  };
  
  const currentRange = getCurrentRange(displayPressure);
  const currentColors = currentRange.colors;
  
  // Calcolo dimensioni SVG e posizioni
  const svgSize = Math.max(displayWidth, bodyRadius * 2) + 80;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  
  // Posizione display (sempre in alto)
  const displayX = centerX;
  const displayY = centerY - bodyRadius - displayHeight/2 - 10;
  
  // Posizione del corpo (sempre al centro)
  const bodyX = centerX;
  const bodyY = centerY;
  
  // Posizioni delle connessioni basate sull'orientamento
  const getConnectionPoint = () => {
    switch (connectionOrientation) {
      case 'bottom':
        return {
          start: { x: bodyX, y: bodyY + bodyRadius },
          end: { x: bodyX, y: bodyY + bodyRadius + 25 }
        };
      case 'right':
        return {
          start: { x: bodyX + bodyRadius, y: bodyY },
          end: { x: bodyX + bodyRadius + 25, y: bodyY }
        };
      case 'left':
        return {
          start: { x: bodyX - bodyRadius, y: bodyY },
          end: { x: bodyX - bodyRadius - 25, y: bodyY }
        };
    }
  };
  
  const connection = getConnectionPoint();

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={svgSize} 
        height={svgSize}
      >
        {/* Definizione gradienti 3D */}
        <defs>
          {/* Gradiente corpo pressostato */}
          <radialGradient id={`body-gradient-${label}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor={PRESSURE_SWITCH_DISPLAY_CONFIG.colors.bodyHighlight} />
            <stop offset="40%" stopColor={PRESSURE_SWITCH_DISPLAY_CONFIG.colors.body} />
            <stop offset="100%" stopColor={PRESSURE_SWITCH_DISPLAY_CONFIG.colors.bodyShadow} />
          </radialGradient>

          {/* Gradiente display LCD */}
          <linearGradient id={`display-gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="50%" stopColor="#000000" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>

          {/* Gradiente LED di stato */}
          <radialGradient id={`led-gradient-${label}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor={currentColors.highlight} />
            <stop offset="70%" stopColor={currentColors.primary} />
            <stop offset="100%" stopColor={currentColors.secondary} />
          </radialGradient>

          {/* Ombra */}
          <filter id={`shadow-ps-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="3" dy="3" result="offset" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>

        {/* Connessione di pressione con effetto metallico */}
        <g>
          <line
            x1={connection.start.x}
            y1={connection.start.y}
            x2={connection.end.x}
            y2={connection.end.y}
            stroke={PRESSURE_SWITCH_DISPLAY_CONFIG.colors.connection}
            strokeWidth={PRESSURE_SWITCH_DISPLAY_CONFIG.strokeWidth + 2}
          />
          <line
            x1={connection.start.x + (connectionOrientation === 'bottom' ? -1 : connectionOrientation === 'right' ? 0 : 0)}
            y1={connection.start.y + (connectionOrientation === 'bottom' ? 0 : connectionOrientation === 'right' ? -1 : 1)}
            x2={connection.end.x + (connectionOrientation === 'bottom' ? -1 : connectionOrientation === 'right' ? 0 : 0)}
            y2={connection.end.y + (connectionOrientation === 'bottom' ? 0 : connectionOrientation === 'right' ? -1 : 1)}
            stroke="white"
            strokeWidth={1}
            opacity={0.5}
          />
          
          {/* Etichetta connessione P */}
          <text
            x={connection.end.x + (connectionOrientation === 'bottom' ? 8 : connectionOrientation === 'right' ? 8 : -8)}
            y={connection.end.y + (connectionOrientation === 'bottom' ? 5 : 3)}
            fontSize={8}
            fontWeight="bold"
            fill={PRESSURE_SWITCH_DISPLAY_CONFIG.colors.text}
            textAnchor={connectionOrientation === 'left' ? 'end' : 'start'}
          >
            P
          </text>
        </g>

        {/* Ombra del corpo */}
        <circle
          cx={bodyX + PRESSURE_SWITCH_DISPLAY_CONFIG.shadowOffset}
          cy={bodyY + PRESSURE_SWITCH_DISPLAY_CONFIG.shadowOffset}
          r={bodyRadius}
          fill={PRESSURE_SWITCH_DISPLAY_CONFIG.colors.bodyShadow}
          opacity={0.4}
        />
        
        {/* Corpo principale del pressostato */}
        <circle
          cx={bodyX}
          cy={bodyY}
          r={bodyRadius}
          fill={`url(#body-gradient-${label})`}
          stroke={PRESSURE_SWITCH_DISPLAY_CONFIG.colors.border}
          strokeWidth={PRESSURE_SWITCH_DISPLAY_CONFIG.strokeWidth}
          filter={`url(#shadow-ps-${label})`}
        />

        {/* Simbolo PS nel corpo */}
        <text
          x={bodyX}
          y={bodyY + 3}
          textAnchor="middle"
          fontSize={12}
          fontWeight="bold"
          fill={PRESSURE_SWITCH_DISPLAY_CONFIG.colors.text}
        >
          PS
        </text>

        {/* Ombra del display */}
        <rect
          x={displayX - displayWidth/2 + PRESSURE_SWITCH_DISPLAY_CONFIG.shadowOffset}
          y={displayY - displayHeight/2 + PRESSURE_SWITCH_DISPLAY_CONFIG.shadowOffset}
          width={displayWidth}
          height={displayHeight}
          fill={PRESSURE_SWITCH_DISPLAY_CONFIG.colors.bodyShadow}
          opacity={0.4}
          rx={4}
        />
        
        {/* Display LCD */}
        <rect
          x={displayX - displayWidth/2}
          y={displayY - displayHeight/2}
          width={displayWidth}
          height={displayHeight}
          fill={`url(#display-gradient-${label})`}
          stroke={PRESSURE_SWITCH_DISPLAY_CONFIG.colors.border}
          strokeWidth={PRESSURE_SWITCH_DISPLAY_CONFIG.strokeWidth}
          rx={4}
          filter={`url(#shadow-ps-${label})`}
        />

        {/* Schermo interno del display */}
        <rect
          x={displayX - displayWidth/2 + 4}
          y={displayY - displayHeight/2 + 4}
          width={displayWidth - 8}
          height={displayHeight - 8}
          fill="#003300"
          rx={2}
        />

        {/* Valore di pressione sul display */}
        <text
          x={displayX}
          y={displayY + 2}
          textAnchor="middle"
          fontSize={PRESSURE_SWITCH_DISPLAY_CONFIG.fontSize.value}
          fontWeight="bold"
          fill={currentColors.primary}
          fontFamily="monospace"
        >
          {displayPressure.toFixed(PRESSURE_SWITCH_DISPLAY_CONFIG.decimals)}
        </text>

        {/* Unità di misura sul display */}
        {PRESSURE_SWITCH_DISPLAY_CONFIG.showUnits && (
          <text
            x={displayX + displayWidth/2 - 20}
            y={displayY - displayHeight/2 + 12}
            fontSize={PRESSURE_SWITCH_DISPLAY_CONFIG.fontSize.units}
            fill={currentColors.highlight}
            fontFamily="monospace"
          >
            {PRESSURE_SWITCH_DISPLAY_CONFIG.units}
          </text>
        )}
        
        {/* LED di stato */}
        <g>
          {/* Ombra LED */}
          <circle
            cx={displayX + displayWidth/2 - 8}
            cy={displayY + displayHeight/2 - 8}
            r={4}
            fill={currentColors.shadow}
            opacity={0.4}
          />
          {/* LED principale */}
          <circle
            cx={displayX + displayWidth/2 - 10}
            cy={displayY + displayHeight/2 - 10}
            r={4}
            fill={`url(#led-gradient-${label})`}
            stroke={PRESSURE_SWITCH_DISPLAY_CONFIG.colors.border}
            strokeWidth={1}
          />
          {/* Riflesso LED */}
          <circle
            cx={displayX + displayWidth/2 - 11}
            cy={displayY + displayHeight/2 - 11}
            r={1.5}
            fill="white"
            opacity={0.8}
          />
        </g>
        
        {/* Etichetta del pressostato */}
        {PRESSURE_SWITCH_DISPLAY_CONFIG.showLabel && (
          <g>
            {/* Ombra dell'etichetta */}
            <text
              x={centerX + 1}
              y={svgSize - 14}
              textAnchor="middle"
              fontSize={PRESSURE_SWITCH_DISPLAY_CONFIG.fontSize.label}
              fontWeight="bold"
              fill="black"
              opacity={0.3}
            >
              {label}
            </text>
            {/* Etichetta principale */}
            <text
              x={centerX}
              y={svgSize - 15}
              textAnchor="middle"
              fontSize={PRESSURE_SWITCH_DISPLAY_CONFIG.fontSize.label}
              fontWeight="bold"
              fill={PRESSURE_SWITCH_DISPLAY_CONFIG.colors.text}
            >
              {label}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

// Componente Demo per mostrare tutti gli orientamenti
const PressureSwitchDisplayDemo: React.FC = () => {
  const [ps1Pressure, setPs1Pressure] = useState(2.5);
  const [ps2Pressure, setPs2Pressure] = useState(7.2);
  const [ps3Pressure, setPs3Pressure] = useState(9.8);
  const [ps4Pressure, setPs4Pressure] = useState(4.1);
  const [ps5Pressure, setPs5Pressure] = useState(6.8);
  const [ps6Pressure, setPs6Pressure] = useState(1.3);

  // Simulazione automatica
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    if (autoMode) {
      const interval = setInterval(() => {
        // Simulazione variazioni pressione realistiche
        setPs1Pressure(prev => Math.max(0, Math.min(15, prev + (Math.random() - 0.5) * 0.3)));
        setPs2Pressure(prev => Math.max(0, Math.min(15, prev + (Math.random() - 0.5) * 0.4)));
        setPs3Pressure(prev => Math.max(0, Math.min(15, prev + (Math.random() - 0.5) * 0.2)));
        setPs4Pressure(prev => Math.max(0, Math.min(15, prev + (Math.random() - 0.5) * 0.5)));
        setPs5Pressure(prev => Math.max(0, Math.min(15, prev + (Math.random() - 0.5) * 0.3)));
        setPs6Pressure(prev => Math.max(0, Math.min(15, prev + (Math.random() - 0.5) * 0.4)));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [autoMode]);

  const getPressureStatus = (pressure: number) => {
    if (pressure <= 6) return { status: 'NORMALE', color: 'text-green-600' };
    if (pressure <= 8) return { status: 'ATTENZIONE', color: 'text-yellow-600' };
    return { status: 'ALLARME', color: 'text-red-600' };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Pressostato con Display - Misure Analogiche
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
                ● Simulazione attiva - variazioni di pressione realistiche
              </span>
            )}
          </div>
        </div>

        {/* Griglia orientamenti connessioni */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Connessione dal basso - Normale */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Connessione dal Basso - Normale
            </h3>
            <div className="flex justify-center">
              <PressureSwitchDisplay
                pressure={ps1Pressure}
                label="PS001"
                connectionOrientation="bottom"
                size={0.9}
              />
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600">
                Pressione: <span className="font-semibold text-green-600">{ps1Pressure.toFixed(1)} bar</span>
              </div>
              <div className={`text-xs font-semibold ${getPressureStatus(ps1Pressure).color}`}>
                {getPressureStatus(ps1Pressure).status}
              </div>
            </div>
          </div>

          {/* Connessione da destra - Attenzione */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Connessione da Destra - Attenzione
            </h3>
            <div className="flex justify-center">
              <PressureSwitchDisplay
                pressure={ps2Pressure}
                label="PS002"
                connectionOrientation="right"
                size={0.9}
              />
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600">
                Pressione: <span className="font-semibold text-yellow-600">{ps2Pressure.toFixed(1)} bar</span>
              </div>
              <div className={`text-xs font-semibold ${getPressureStatus(ps2Pressure).color}`}>
                {getPressureStatus(ps2Pressure).status}
              </div>
            </div>
          </div>

          {/* Connessione da sinistra - Allarme */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Connessione da Sinistra - Allarme
            </h3>
            <div className="flex justify-center">
              <PressureSwitchDisplay
                pressure={ps3Pressure}
                label="PS003"
                connectionOrientation="left"
                size={0.9}
              />
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600">
                Pressione: <span className="font-semibold text-red-600">{ps3Pressure.toFixed(1)} bar</span>
              </div>
              <div className={`text-xs font-semibold ${getPressureStatus(ps3Pressure).color}`}>
                {getPressureStatus(ps3Pressure).status}
              </div>
            </div>
          </div>
        </div>

        {/* Esempi con dimensioni diverse */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Varianti Dimensionali</h2>
          <div className="flex flex-wrap gap-8 items-end justify-center">
            
            <div className="text-center">
              <PressureSwitchDisplay
                pressure={ps4Pressure}
                label="Small"
                connectionOrientation="bottom"
                size={0.7}
              />
              <p className="text-xs text-gray-600 mt-2">Piccolo (70%)</p>
            </div>

            <div className="text-center">
              <PressureSwitchDisplay
                pressure={ps5Pressure}
                label="Normal"
                connectionOrientation="right"
                size={1.0}
              />
              <p className="text-xs text-gray-600 mt-2">Normale (100%)</p>
            </div>

            <div className="text-center">
              <PressureSwitchDisplay
                pressure={ps6Pressure}
                label="Large"
                connectionOrientation="left"
                size={1.3}
              />
              <p className="text-xs text-gray-600 mt-2">Grande (130%)</p>
            </div>
          </div>
        </div>

        {/* Pannello di stato sistema */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Monitoraggio Sistema Pressioni</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'PS001', pressure: ps1Pressure },
              { label: 'PS002', pressure: ps2Pressure },
              { label: 'PS003', pressure: ps3Pressure },
              { label: 'PS004', pressure: ps4Pressure },
              { label: 'PS005', pressure: ps5Pressure },
              { label: 'PS006', pressure: ps6Pressure }
            ].map((ps, index) => {
              const status = getPressureStatus(ps.pressure);
              return (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  status.status === 'ALLARME' ? 'border-red-500 bg-red-50' :
                  status.status === 'ATTENZIONE' ? 'border-yellow-500 bg-yellow-50' :
                  'border-green-500 bg-green-50'
                }`}>
                  <div className="text-sm font-semibold text-gray-700">{ps.label}</div>
                  <div className="text-lg font-bold text-gray-800">
                    {ps.pressure.toFixed(1)} bar
                  </div>
                  <div className={`text-xs font-semibold ${status.color}`}>
                    {status.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informazioni tecniche */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Pressostato Display - Specifiche Tecniche</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Display Digitale:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Precisione:</strong> 0.1 bar</div>
                <div>• <strong>Schermo LCD:</strong> Retroilluminato verde</div>
                <div>• <strong>LED di stato:</strong> Colorato per range</div>
                <div>• <strong>Font:</strong> Monospace per leggibilità</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Range Operativi:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span><strong>0-6 bar:</strong> Normale</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span><strong>6.1-8 bar:</strong> Attenzione</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span><strong>&gt;8 bar:</strong> Allarme</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Connessioni:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>3 orientamenti:</strong> Basso/Destra/Sinistra</div>
                <div>• <strong>Corpo circolare:</strong> Standard P&ID</div>
                <div>• <strong>Simbolo PS:</strong> Identificazione chiara</div>
                <div>• <strong>Dimensioni:</strong> Scalabili per layout</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressureSwitchDisplayDemo;
