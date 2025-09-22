import React, { useState } from 'react';

// Configurazione pressostato differenziale (facilmente modificabile)
const PRESSURE_SWITCH_DIFF_CONFIG = {
  // Dimensioni base
  width: 50,
  height: 50,
  
  // Colori per stati
  colors: {
    clean: {
      primary: "#10B981",    // verde intenso
      secondary: "#059669",  // verde scuro
      highlight: "#6EE7B7",  // verde chiaro
      shadow: "#047857"      // verde molto scuro
    },
    dirty: {
      primary: "#DC2626",    // rosso intenso
      secondary: "#B91C1C",  // rosso scuro
      highlight: "#F87171",  // rosso chiaro
      shadow: "#7F1D1D"      // rosso molto scuro
    },
    border: "#1F2937",       // grigio molto scuro
    text: "#1F2937",
    connection: "#4B5563",   // grigio medio scuro
    symbol: "#FFFFFF"        // bianco per simboli
  },
  
  // Simboli per stati
  symbols: {
    clean: "✓",              // Filtro pulito
    dirty: "⚠",              // Filtro sporco
    differential: "ΔP"       // Simbolo differenziale
  },
  
  // Testo e etichette
  showStateText: true,
  showLabel: true,
  showSymbol: true,
  
  // Stili 3D
  borderRadius: 8,
  strokeWidth: 2,
  shadowOffset: 3,
  fontSize: {
    symbol: 14,
    state: 9,
    label: 11,
    differential: 10
  }
};

interface PressureSwitchDifferentialProps {
  // Stato del pressostato (true = filtro pulito, false = filtro sporco)
  isClean: boolean;
  
  // Configurazione
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  
  // Controlli (solo per simulazione demo, normalmente dal PLC)
  manualControlEnabled?: boolean;
  onToggle?: () => void;
  
  // Styling opzionale
  size?: number;
  className?: string;
}

const PressureSwitchDifferential: React.FC<PressureSwitchDifferentialProps> = ({
  isClean,
  label = "FD001",
  orientation = 'horizontal',
  manualControlEnabled = false,
  onToggle,
  size = 1,
  className = ""
}) => {
  // Dimensioni scalate
  const width = PRESSURE_SWITCH_DIFF_CONFIG.width * size;
  const height = PRESSURE_SWITCH_DIFF_CONFIG.height * size;
  
  // Colori attuali basati sullo stato
  const currentColors = isClean ? 
    PRESSURE_SWITCH_DIFF_CONFIG.colors.clean : 
    PRESSURE_SWITCH_DIFF_CONFIG.colors.dirty;
  
  const stateText = isClean ? "PULITO" : "SPORCO";
  const stateSymbol = isClean ? 
    PRESSURE_SWITCH_DIFF_CONFIG.symbols.clean : 
    PRESSURE_SWITCH_DIFF_CONFIG.symbols.dirty;
  
  // Gestione click (solo per demo, normalmente gestito dal PLC)
  const handleClick = () => {
    if (manualControlEnabled && onToggle) {
      onToggle();
    }
  };
  
  // Calcolo dimensioni SVG basate sull'orientamento
  const isVertical = orientation === 'vertical';
  const svgSize = Math.max(width, height) + 80;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  
  // Posizioni delle connessioni basate sull'orientamento
  const getConnectionPoints = () => {
    if (isVertical) {
      return {
        input1: { x: centerX - width/4, y: centerY - height/2 - 20 },
        input2: { x: centerX + width/4, y: centerY - height/2 - 20 },
        conn1: { x: centerX - width/4, y: centerY - height/2 },
        conn2: { x: centerX + width/4, y: centerY - height/2 }
      };
    } else {
      return {
        input1: { x: centerX - width/2 - 20, y: centerY - height/4 },
        input2: { x: centerX - width/2 - 20, y: centerY + height/4 },
        conn1: { x: centerX - width/2, y: centerY - height/4 },
        conn2: { x: centerX - width/2, y: centerY + height/4 }
      };
    }
  };
  
  const connections = getConnectionPoints();

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={svgSize} 
        height={svgSize}
        className={`${manualControlEnabled ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={handleClick}
      >
        {/* Definizione gradienti 3D */}
        <defs>
          {/* Gradiente PULITO (Verde) */}
          <linearGradient id={`gradient-clean-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={PRESSURE_SWITCH_DIFF_CONFIG.colors.clean.highlight} />
            <stop offset="30%" stopColor={PRESSURE_SWITCH_DIFF_CONFIG.colors.clean.primary} />
            <stop offset="70%" stopColor={PRESSURE_SWITCH_DIFF_CONFIG.colors.clean.secondary} />
            <stop offset="100%" stopColor={PRESSURE_SWITCH_DIFF_CONFIG.colors.clean.shadow} />
          </linearGradient>
          
          {/* Gradiente SPORCO (Rosso) */}
          <linearGradient id={`gradient-dirty-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={PRESSURE_SWITCH_DIFF_CONFIG.colors.dirty.highlight} />
            <stop offset="30%" stopColor={PRESSURE_SWITCH_DIFF_CONFIG.colors.dirty.primary} />
            <stop offset="70%" stopColor={PRESSURE_SWITCH_DIFF_CONFIG.colors.dirty.secondary} />
            <stop offset="100%" stopColor={PRESSURE_SWITCH_DIFF_CONFIG.colors.dirty.shadow} />
          </linearGradient>

          {/* Highlight per effetto 3D */}
          <radialGradient id={`highlight-diff-${label}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="70%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Ombra */}
          <filter id={`shadow-diff-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="3" dy="3" result="offset" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>

        {/* Linee di connessione differenziali con effetto metallico */}
        <g>
          {/* Connessione input 1 (pressione alta) */}
          <line
            x1={connections.input1.x}
            y1={connections.input1.y}
            x2={connections.conn1.x}
            y2={connections.conn1.y}
            stroke={PRESSURE_SWITCH_DIFF_CONFIG.colors.connection}
            strokeWidth={PRESSURE_SWITCH_DIFF_CONFIG.strokeWidth + 1}
          />
          <line
            x1={connections.input1.x + (isVertical ? -1 : 0)}
            y1={connections.input1.y + (isVertical ? 0 : -1)}
            x2={connections.conn1.x + (isVertical ? -1 : 0)}
            y2={connections.conn1.y + (isVertical ? 0 : -1)}
            stroke="white"
            strokeWidth={1}
            opacity={0.5}
          />
          
          {/* Connessione input 2 (pressione bassa) */}
          <line
            x1={connections.input2.x}
            y1={connections.input2.y}
            x2={connections.conn2.x}
            y2={connections.conn2.y}
            stroke={PRESSURE_SWITCH_DIFF_CONFIG.colors.connection}
            strokeWidth={PRESSURE_SWITCH_DIFF_CONFIG.strokeWidth + 1}
          />
          <line
            x1={connections.input2.x + (isVertical ? 1 : 0)}
            y1={connections.input2.y + (isVertical ? 0 : 1)}
            x2={connections.conn2.x + (isVertical ? 1 : 0)}
            y2={connections.conn2.y + (isVertical ? 0 : 1)}
            stroke="white"
            strokeWidth={1}
            opacity={0.5}
          />

          {/* Etichette P+ e P- per le connessioni */}
          <text
            x={connections.input1.x}
            y={connections.input1.y - 8}
            textAnchor="middle"
            fontSize={8}
            fontWeight="bold"
            fill={PRESSURE_SWITCH_DIFF_CONFIG.colors.text}
          >
            P+
          </text>
          <text
            x={connections.input2.x}
            y={connections.input2.y + (isVertical ? -8 : 15)}
            textAnchor="middle"
            fontSize={8}
            fontWeight="bold"
            fill={PRESSURE_SWITCH_DIFF_CONFIG.colors.text}
          >
            P-
          </text>
        </g>

        {/* Ombra del corpo pressostato */}
        <polygon
          points={`${centerX - width/2 + PRESSURE_SWITCH_DIFF_CONFIG.shadowOffset},${centerY + PRESSURE_SWITCH_DIFF_CONFIG.shadowOffset} ${centerX + PRESSURE_SWITCH_DIFF_CONFIG.shadowOffset},${centerY - height/2 + PRESSURE_SWITCH_DIFF_CONFIG.shadowOffset} ${centerX + width/2 + PRESSURE_SWITCH_DIFF_CONFIG.shadowOffset},${centerY + PRESSURE_SWITCH_DIFF_CONFIG.shadowOffset} ${centerX + PRESSURE_SWITCH_DIFF_CONFIG.shadowOffset},${centerY + height/2 + PRESSURE_SWITCH_DIFF_CONFIG.shadowOffset}`}
          fill={currentColors.shadow}
          opacity={0.4}
        />
        
        {/* Corpo principale del pressostato (forma rombo P&ID) */}
        <polygon
          points={`${centerX - width/2},${centerY} ${centerX},${centerY - height/2} ${centerX + width/2},${centerY} ${centerX},${centerY + height/2}`}
          fill={`url(#gradient-${isClean ? 'clean' : 'dirty'}-${label})`}
          stroke={PRESSURE_SWITCH_DIFF_CONFIG.colors.border}
          strokeWidth={PRESSURE_SWITCH_DIFF_CONFIG.strokeWidth}
          filter={`url(#shadow-diff-${label})`}
        />

        {/* Highlight superiore per effetto 3D */}
        <polygon
          points={`${centerX - width/2 + 8},${centerY} ${centerX},${centerY - height/2 + 8} ${centerX + width/2 - 8},${centerY} ${centerX},${centerY + height/2 - 8}`}
          fill={`url(#highlight-diff-${label})`}
        />

        {/* Simbolo ΔP (Delta P) */}
        {PRESSURE_SWITCH_DIFF_CONFIG.showSymbol && (
          <g>
            {/* Ombra del simbolo */}
            <text
              x={centerX + 1}
              y={centerY - 8}
              textAnchor="middle"
              fontSize={PRESSURE_SWITCH_DIFF_CONFIG.fontSize.differential}
              fontWeight="bold"
              fill="black"
              opacity={0.3}
            >
              {PRESSURE_SWITCH_DIFF_CONFIG.symbols.differential}
            </text>
            {/* Simbolo principale */}
            <text
              x={centerX}
              y={centerY - 9}
              textAnchor="middle"
              fontSize={PRESSURE_SWITCH_DIFF_CONFIG.fontSize.differential}
              fontWeight="bold"
              fill={PRESSURE_SWITCH_DIFF_CONFIG.colors.symbol}
              stroke={PRESSURE_SWITCH_DIFF_CONFIG.colors.border}
              strokeWidth={0.5}
            >
              {PRESSURE_SWITCH_DIFF_CONFIG.symbols.differential}
            </text>
          </g>
        )}
        
        {/* Simbolo di stato (✓ o ⚠) */}
        <g>
          {/* Ombra del simbolo di stato */}
          <text
            x={centerX + 1}
            y={centerY + 8}
            textAnchor="middle"
            fontSize={PRESSURE_SWITCH_DIFF_CONFIG.fontSize.symbol}
            fontWeight="bold"
            fill="black"
            opacity={0.4}
          >
            {stateSymbol}
          </text>
          {/* Simbolo di stato principale */}
          <text
            x={centerX}
            y={centerY + 7}
            textAnchor="middle"
            fontSize={PRESSURE_SWITCH_DIFF_CONFIG.fontSize.symbol}
            fontWeight="bold"
            fill={PRESSURE_SWITCH_DIFF_CONFIG.colors.symbol}
            stroke={PRESSURE_SWITCH_DIFF_CONFIG.colors.border}
            strokeWidth={0.5}
          >
            {stateSymbol}
          </text>
        </g>
        
        {/* Testo stato con ombra */}
        {PRESSURE_SWITCH_DIFF_CONFIG.showStateText && (
          <g>
            {/* Ombra del testo */}
            <text
              x={centerX + 1}
              y={centerY + height/2 + 16}
              textAnchor="middle"
              fontSize={PRESSURE_SWITCH_DIFF_CONFIG.fontSize.state}
              fontWeight="bold"
              fill="black"
              opacity={0.3}
            >
              {stateText}
            </text>
            {/* Testo principale */}
            <text
              x={centerX}
              y={centerY + height/2 + 15}
              textAnchor="middle"
              fontSize={PRESSURE_SWITCH_DIFF_CONFIG.fontSize.state}
              fontWeight="bold"
              fill={currentColors.primary}
            >
              {stateText}
            </text>
          </g>
        )}
        
        {/* Indicatore di stato LED */}
        <g>
          {/* Ombra dell'indicatore LED */}
          <circle
            cx={centerX + width/2 - 5}
            cy={centerY - height/2 + 7}
            r={4}
            fill={currentColors.shadow}
            opacity={0.4}
          />
          {/* Indicatore LED principale */}
          <circle
            cx={centerX + width/2 - 8}
            cy={centerY - height/2 + 5}
            r={4}
            fill={`url(#gradient-${isClean ? 'clean' : 'dirty'}-${label})`}
            stroke={PRESSURE_SWITCH_DIFF_CONFIG.colors.border}
            strokeWidth={1}
          />
          {/* Riflesso LED */}
          <circle
            cx={centerX + width/2 - 9}
            cy={centerY - height/2 + 4}
            r={1.5}
            fill="white"
            opacity={0.8}
          />
        </g>
        
        {/* Etichetta del pressostato con ombra */}
        {PRESSURE_SWITCH_DIFF_CONFIG.showLabel && (
          <g>
            {/* Ombra dell'etichetta */}
            <text
              x={centerX + 1}
              y={svgSize - 14}
              textAnchor="middle"
              fontSize={PRESSURE_SWITCH_DIFF_CONFIG.fontSize.label}
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
              fontSize={PRESSURE_SWITCH_DIFF_CONFIG.fontSize.label}
              fontWeight="bold"
              fill={PRESSURE_SWITCH_DIFF_CONFIG.colors.text}
            >
              {label}
            </text>
          </g>
        )}
        
        {/* Indicatore controllo manuale abilitato (solo per demo) */}
        {manualControlEnabled && (
          <g>
            <circle
              cx={svgSize - 13}
              cy={17}
              r={6}
              fill="#059669"
              opacity={0.4}
            />
            <circle
              cx={svgSize - 15}
              cy={15}
              r={6}
              fill="#10B981"
              stroke="#047857"
              strokeWidth={1}
            />
            <circle
              cx={svgSize - 16}
              cy={14}
              r={2}
              fill="white"
              opacity={0.8}
            />
            {/* Testo "DEMO" */}
            <text
              x={svgSize - 15}
              y={30}
              textAnchor="middle"
              fontSize={6}
              fill="#059669"
              fontWeight="bold"
            >
              DEMO
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

// Componente Demo per mostrare entrambi gli orientamenti
const PressureSwitchDifferentialDemo: React.FC = () => {
  const [ps1Clean, setPs1Clean] = useState(true);
  const [ps2Clean, setPs2Clean] = useState(false);
  const [ps3Clean, setPs3Clean] = useState(true);
  const [ps4Clean, setPs4Clean] = useState(false);
  const [manualControlEnabled, setManualControlEnabled] = useState(false);

  // Simulazione automatica
  const [autoMode, setAutoMode] = useState(false);

  React.useEffect(() => {
    if (autoMode) {
      const interval = setInterval(() => {
        // Simula cambiamento stato filtri nel tempo
        if (Math.random() > 0.8) {
          setPs1Clean(prev => !prev);
        }
        if (Math.random() > 0.85) {
          setPs2Clean(prev => !prev);
        }
        if (Math.random() > 0.9) {
          setPs3Clean(prev => !prev);
        }
        if (Math.random() > 0.87) {
          setPs4Clean(prev => !prev);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoMode]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Pressostato Differenziale - Controllo Filtri
        </h1>
        
        {/* Pannello controlli */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Controlli Demo</h2>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={manualControlEnabled}
                onChange={(e) => setManualControlEnabled(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Abilita Controlli Demo</span>
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
                ● Demo attiva - cliccare sui pressostati per simulare
              </span>
            )}
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <strong>Nota:</strong> In produzione, gli stati vengono forniti automaticamente dal PLC.
          </div>
        </div>

        {/* Griglia dei pressostati differenziali */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Pressostato Orizzontale - Pulito */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Orizzontale - Filtro Pulito
            </h3>
            <div className="flex justify-center">
              <PressureSwitchDifferential
                isClean={ps1Clean}
                label="FD001"
                orientation="horizontal"
                manualControlEnabled={manualControlEnabled}
                onToggle={() => setPs1Clean(!ps1Clean)}
                size={0.9}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-600">
                Differenziale: <span className={`font-semibold ${ps1Clean ? 'text-green-600' : 'text-red-600'}`}>
                  {ps1Clean ? 'NORMALE' : 'ELEVATO'}
                </span>
              </div>
              <div className="text-gray-600">
                Filtro: <span className={`font-semibold ${ps1Clean ? 'text-green-600' : 'text-red-600'}`}>
                  {ps1Clean ? 'PULITO' : 'SPORCO'}
                </span>
              </div>
            </div>
          </div>

          {/* Pressostato Orizzontale - Sporco */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Orizzontale - Filtro Sporco
            </h3>
            <div className="flex justify-center">
              <PressureSwitchDifferential
                isClean={ps2Clean}
                label="FD002"
                orientation="horizontal"
                manualControlEnabled={manualControlEnabled}
                onToggle={() => setPs2Clean(!ps2Clean)}
                size={0.9}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-600">
                Differenziale: <span className={`font-semibold ${ps2Clean ? 'text-green-600' : 'text-red-600'}`}>
                  {ps2Clean ? 'NORMALE' : 'ELEVATO'}
                </span>
              </div>
              <div className="text-gray-600">
                Filtro: <span className={`font-semibold ${ps2Clean ? 'text-green-600' : 'text-red-600'}`}>
                  {ps2Clean ? 'PULITO' : 'SPORCO'}
                </span>
              </div>
            </div>
          </div>

          {/* Pressostato Verticale - Pulito */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Verticale - Filtro Pulito
            </h3>
            <div className="flex justify-center">
              <PressureSwitchDifferential
                isClean={ps3Clean}
                label="FD003"
                orientation="vertical"
                manualControlEnabled={manualControlEnabled}
                onToggle={() => setPs3Clean(!ps3Clean)}
                size={0.9}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-600">
                Differenziale: <span className={`font-semibold ${ps3Clean ? 'text-green-600' : 'text-red-600'}`}>
                  {ps3Clean ? 'NORMALE' : 'ELEVATO'}
                </span>
              </div>
              <div className="text-gray-600">
                Filtro: <span className={`font-semibold ${ps3Clean ? 'text-green-600' : 'text-red-600'}`}>
                  {ps3Clean ? 'PULITO' : 'SPORCO'}
                </span>
              </div>
            </div>
          </div>

          {/* Pressostato Verticale - Sporco */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Verticale - Filtro Sporco
            </h3>
            <div className="flex justify-center">
              <PressureSwitchDifferential
                isClean={ps4Clean}
                label="FD004"
                orientation="vertical"
                manualControlEnabled={manualControlEnabled}
                onToggle={() => setPs4Clean(!ps4Clean)}
                size={0.9}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-600">
                Differenziale: <span className={`font-semibold ${ps4Clean ? 'text-green-600' : 'text-red-600'}`}>
                  {ps4Clean ? 'NORMALE' : 'ELEVATO'}
                </span>
              </div>
              <div className="text-gray-600">
                Filtro: <span className={`font-semibold ${ps4Clean ? 'text-green-600' : 'text-red-600'}`}>
                  {ps4Clean ? 'PULITO' : 'SPORCO'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Varianti dimensionali */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Varianti Dimensionali</h2>
          <div className="flex flex-wrap gap-8 items-center justify-center">
            
            <div className="text-center">
              <PressureSwitchDifferential
                isClean={true}
                label="Small"
                orientation="horizontal"
                size={0.7}
                manualControlEnabled={manualControlEnabled}
                onToggle={() => {}}
              />
              <p className="text-xs text-gray-600 mt-2">Piccolo (70%)</p>
            </div>

            <div className="text-center">
              <PressureSwitchDifferential
                isClean={false}
                label="Normal"
                orientation="horizontal"
                size={1.0}
                manualControlEnabled={manualControlEnabled}
                onToggle={() => {}}
              />
              <p className="text-xs text-gray-600 mt-2">Normale (100%)</p>
            </div>

            <div className="text-center">
              <PressureSwitchDifferential
                isClean={true}
                label="Large"
                orientation="vertical"
                size={1.3}
                manualControlEnabled={manualControlEnabled}
                onToggle={() => {}}
              />
              <p className="text-xs text-gray-600 mt-2">Grande (130%)</p>
            </div>
          </div>
        </div>

        {/* Stato sistema filtri */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Stato Sistema Filtri</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'FD001', clean: ps1Clean },
              { label: 'FD002', clean: ps2Clean },
              { label: 'FD003', clean: ps3Clean },
              { label: 'FD004', clean: ps4Clean }
            ].map((filter, index) => (
              <div key={index} className={`p-3 rounded-lg border-2 ${
                filter.clean ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}>
                <div className="text-sm font-semibold text-gray-700">{filter.label}</div>
                <div className={`text-xs ${filter.clean ? 'text-green-600' : 'text-red-600'}`}>
                  {filter.clean ? '✓ Filtro OK' : '⚠ Filtro da sostituire'}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-sm font-semibold text-blue-800">
              Sistema Complessivo: {[ps1Clean, ps2Clean, ps3Clean, ps4Clean].every(Boolean) ? 
                '✓ Tutti i filtri sono puliti' : 
                '⚠ Alcuni filtri necessitano manutenzione'}
            </div>
          </div>
        </div>

        {/* Informazioni tecniche */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Pressostato Differenziale - Specifiche</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Funzionamento:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>P+ - P-:</strong> Misura differenza pressione</div>
                <div>• <strong>Filtro pulito:</strong> ΔP bassa = Verde</div>
                <div>• <strong>Filtro sporco:</strong> ΔP alta = Rosso</div>
                <div>• <strong>Controllo PLC:</strong> Stati automatici</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Visualizzazione:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Forma rombo P&ID</strong> standard</div>
                <div>• <strong>Simbolo ΔP</strong> differenziale</div>
                <div>• <strong>LED colorato</strong> per stato</div>
                <div>• <strong>Simboli ✓/⚠</strong> intuitivi</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Caratteristiche:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>2 orientamenti:</strong> H/V</div>
                <div>• <strong>Connessioni P+/P-</strong> etichettate</div>
                <div>• <strong>Effetti 3D</strong> avanzati</div>
                <div>• <strong>Dimensioni scalabili</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressureSwitchDifferentialDemo;
