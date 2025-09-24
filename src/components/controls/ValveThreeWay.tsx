import React, { useState } from 'react';

// Configurazione valvola 3 vie (facilmente modificabile)
const VALVE_3WAY_CONFIG = {
  // Dimensioni base
  bodyWidth: 40,
  bodyHeight: 40,
  pipeLength: 30,
  
  // Colori con gradiente 3D
  colors: {
    active: {
      primary: "#0EA5E9",    // blu intenso
      secondary: "#0284C7",  // blu scuro
      highlight: "#7DD3FC",  // blu chiaro per highlight
      shadow: "#0C4A6E"      // blu molto scuro per ombra
    },
    inactive: {
      primary: "#6B7280",    // grigio
      secondary: "#4B5563",  // grigio scuro
      highlight: "#9CA3AF",  // grigio chiaro
      shadow: "#374151"      // grigio molto scuro
    },
    border: "#1F2937",       // grigio molto scuro
    text: "#1F2937",
    connection: "#4B5563",   // grigio medio scuro
    blocked: "#DC2626"       // rosso per vie bloccate
  },
  
  // Testo e etichette
  showStateText: true,
  showPortLabels: true,
  
  // Stili 3D
  borderRadius: 8,
  strokeWidth: 2,
  shadowOffset: 3,
  fontSize: {
    state: 9,
    label: 10,
    port: 8
  }
};

type Valve3WayState = 'IN_TO_OUT1' | 'IN_TO_OUT2';
type Valve3WayOrientation = 'horizontal-up' | 'horizontal-down' | 'vertical-left' | 'vertical-right';

interface Valve3WayProps {
  // Stato della valvola
  state: Valve3WayState;
  
  // Configurazione
  label?: string;
  orientation?: Valve3WayOrientation;
  
  // Controlli
  manualControlEnabled?: boolean;
  onToggle?: () => void;
  
  // Styling opzionale
  size?: number;
  className?: string;
}

const Valve3Way: React.FC<Valve3WayProps> = ({
  state,
  label = "V3W001",
  orientation = 'horizontal-up',
  manualControlEnabled = false,
  onToggle,
  size = 1,
  className = ""
}) => {
  // Dimensioni scalate
  const bodyWidth = VALVE_3WAY_CONFIG.bodyWidth * size;
  const bodyHeight = VALVE_3WAY_CONFIG.bodyHeight * size;
  const pipeLength = VALVE_3WAY_CONFIG.pipeLength * size;
  
  // Calcolo dimensioni SVG e posizioni basate sull'orientamento
  const svgSize = Math.max(bodyWidth, bodyHeight) + (pipeLength * 2) + 60;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  
  // Posizioni delle porte basate sull'orientamento
  const getPortPositions = () => {
    const half = bodyWidth / 2;
    switch (orientation) {
      case 'horizontal-up':
        return {
          IN: { x: centerX - half - pipeLength, y: centerY, conn: { x: centerX - half, y: centerY } },
          OUT1: { x: centerX + half + pipeLength, y: centerY, conn: { x: centerX + half, y: centerY } },
          OUT2: { x: centerX, y: centerY - half - pipeLength, conn: { x: centerX, y: centerY - half } }
        };
      case 'horizontal-down':
        return {
          IN: { x: centerX - half - pipeLength, y: centerY, conn: { x: centerX - half, y: centerY } },
          OUT1: { x: centerX + half + pipeLength, y: centerY, conn: { x: centerX + half, y: centerY } },
          OUT2: { x: centerX, y: centerY + half + pipeLength, conn: { x: centerX, y: centerY + half } }
        };
      case 'vertical-left':
        return {
          IN: { x: centerX, y: centerY - half - pipeLength, conn: { x: centerX, y: centerY - half } },
          OUT1: { x: centerX, y: centerY + half + pipeLength, conn: { x: centerX, y: centerY + half } },
          OUT2: { x: centerX - half - pipeLength, y: centerY, conn: { x: centerX - half, y: centerY } }
        };
      case 'vertical-right':
        return {
          IN: { x: centerX, y: centerY - half - pipeLength, conn: { x: centerX, y: centerY - half } },
          OUT1: { x: centerX, y: centerY + half + pipeLength, conn: { x: centerX, y: centerY + half } },
          OUT2: { x: centerX + half + pipeLength, y: centerY, conn: { x: centerX + half, y: centerY } }
        };
    }
  };
  
  const ports = getPortPositions();
  
  // Definizione dello stato attivo
  const isOut1Active = state === 'IN_TO_OUT1';
  const isOut2Active = state === 'IN_TO_OUT2';
  
  // Gestione click
  const handleClick = () => {
    if (manualControlEnabled && onToggle) {
      onToggle();
    }
  };
  
  // Componente freccia direzionale
  const Arrow = ({ from, to, isActive }: { from: {x: number, y: number}, to: {x: number, y: number}, isActive: boolean }) => {
    if (!isActive) return null;
    
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    
    return (
      <g transform={`translate(${midX}, ${midY}) rotate(${angle})`}>
        <polygon
          points="-8,-4 -8,4 8,0"
          fill="white"
          stroke={VALVE_3WAY_CONFIG.colors.border}
          strokeWidth={1.5}
          opacity={0.9}
        />
        <polygon
          points="-6,-3 -6,3 6,0"
          fill={VALVE_3WAY_CONFIG.colors.active.highlight}
          opacity={0.8}
        />
      </g>
    );
  };
  
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
          {/* Gradiente attivo (Blu) */}
          <linearGradient id={`gradient-active-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={VALVE_3WAY_CONFIG.colors.active.highlight} />
            <stop offset="30%" stopColor={VALVE_3WAY_CONFIG.colors.active.primary} />
            <stop offset="70%" stopColor={VALVE_3WAY_CONFIG.colors.active.secondary} />
            <stop offset="100%" stopColor={VALVE_3WAY_CONFIG.colors.active.shadow} />
          </linearGradient>
          
          {/* Gradiente inattivo (Grigio) */}
          <linearGradient id={`gradient-inactive-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={VALVE_3WAY_CONFIG.colors.inactive.highlight} />
            <stop offset="30%" stopColor={VALVE_3WAY_CONFIG.colors.inactive.primary} />
            <stop offset="70%" stopColor={VALVE_3WAY_CONFIG.colors.inactive.secondary} />
            <stop offset="100%" stopColor={VALVE_3WAY_CONFIG.colors.inactive.shadow} />
          </linearGradient>

          {/* Highlight per effetto 3D */}
          <linearGradient id={`highlight-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="50%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Ombra */}
          <filter id={`shadow-${label}`} x="-50%" y="-50%" width="200%" height="200%">
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
        </defs>

        {/* Connessioni tubolari con effetto metallico */}
        {Object.entries(ports).map(([portName, port]) => {
          const isActive = (portName === 'IN') || 
                          (portName === 'OUT1' && isOut1Active) || 
                          (portName === 'OUT2' && isOut2Active);
          
          return (
            <g key={portName}>
              {/* Linea principale */}
              <line
                x1={port.x}
                y1={port.y}
                x2={port.conn.x}
                y2={port.conn.y}
                stroke={isActive ? VALVE_3WAY_CONFIG.colors.connection : VALVE_3WAY_CONFIG.colors.inactive.primary}
                strokeWidth={VALVE_3WAY_CONFIG.strokeWidth + 1}
              />
              {/* Highlight metallico */}
              <line
                x1={port.x + (port.x < port.conn.x ? 1 : port.x > port.conn.x ? -1 : 0)}
                y1={port.y + (port.y < port.conn.y ? 1 : port.y > port.conn.y ? -1 : 0)}
                x2={port.conn.x + (port.x < port.conn.x ? 1 : port.x > port.conn.x ? -1 : 0)}
                y2={port.conn.y + (port.y < port.conn.y ? 1 : port.y > port.conn.y ? -1 : 0)}
                stroke="white"
                strokeWidth={1}
                opacity={0.4}
              />
            </g>
          );
        })}
        
        {/* Ombra del corpo valvola */}
        <rect
          x={centerX - bodyWidth/2 + VALVE_3WAY_CONFIG.shadowOffset}
          y={centerY - bodyHeight/2 + VALVE_3WAY_CONFIG.shadowOffset}
          width={bodyWidth}
          height={bodyHeight}
          fill={VALVE_3WAY_CONFIG.colors.active.shadow}
          opacity={0.3}
          rx={VALVE_3WAY_CONFIG.borderRadius}
          ry={VALVE_3WAY_CONFIG.borderRadius}
        />
        
        {/* Corpo principale della valvola con gradiente 3D */}
        <rect
          x={centerX - bodyWidth/2}
          y={centerY - bodyHeight/2}
          width={bodyWidth}
          height={bodyHeight}
          fill={`url(#gradient-active-${label})`}
          stroke={VALVE_3WAY_CONFIG.colors.border}
          strokeWidth={VALVE_3WAY_CONFIG.strokeWidth}
          rx={VALVE_3WAY_CONFIG.borderRadius}
          ry={VALVE_3WAY_CONFIG.borderRadius}
          filter={`url(#shadow-${label})`}
        />

        {/* Highlight superiore per effetto 3D */}
        <rect
          x={centerX - bodyWidth/2 + 3}
          y={centerY - bodyHeight/2 + 3}
          width={bodyWidth - 6}
          height={bodyHeight/2}
          fill={`url(#highlight-${label})`}
          rx={VALVE_3WAY_CONFIG.borderRadius - 1}
          ry={VALVE_3WAY_CONFIG.borderRadius - 1}
        />

        {/* Frecce direzionali per flusso attivo */}
        <Arrow 
          from={ports.IN.conn} 
          to={ports.OUT1.conn} 
          isActive={isOut1Active} 
        />
        <Arrow 
          from={ports.IN.conn} 
          to={ports.OUT2.conn} 
          isActive={isOut2Active} 
        />
        
        {/* Indicatori di stato per ogni porta */}
        {Object.entries(ports).map(([portName, port]) => {
          const isActive = (portName === 'IN') || 
                          (portName === 'OUT1' && isOut1Active) || 
                          (portName === 'OUT2' && isOut2Active);
          const colors = isActive ? VALVE_3WAY_CONFIG.colors.active : VALVE_3WAY_CONFIG.colors.inactive;
          
          return (
            <g key={`indicator-${portName}`}>
              {/* Ombra indicatore */}
              <circle
                cx={port.x + 2}
                cy={port.y + 2}
                r={4}
                fill={colors.shadow}
                opacity={0.4}
              />
              {/* Indicatore principale */}
              <circle
                cx={port.x}
                cy={port.y}
                r={4}
                fill={`url(#gradient-${isActive ? 'active' : 'inactive'}-${label})`}
                stroke={VALVE_3WAY_CONFIG.colors.border}
                strokeWidth={1}
              />
              {/* Highlight indicatore */}
              <circle
                cx={port.x - 1}
                cy={port.y - 1}
                r={1.5}
                fill="white"
                opacity={0.7}
              />
              
              {/* Etichette delle porte */}
              {VALVE_3WAY_CONFIG.showPortLabels && (
                <text
                  x={port.x}
                  y={port.y + (portName === 'OUT2' && (orientation === 'horizontal-up' || orientation === 'vertical-left' || orientation === 'vertical-right') ? -15 : 15)}
                  textAnchor="middle"
                  fontSize={VALVE_3WAY_CONFIG.fontSize.port}
                  fontWeight="bold"
                  fill={VALVE_3WAY_CONFIG.colors.text}
                >
                  {portName}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Testo stato centrale con ombra */}
        {VALVE_3WAY_CONFIG.showStateText && (
          <g>
            {/* Ombra del testo */}
            <text
              x={centerX + 1}
              y={centerY + 4}
              textAnchor="middle"
              fontSize={VALVE_3WAY_CONFIG.fontSize.state}
              fontWeight="bold"
              fill="black"
              opacity={0.3}
            >
              {isOut1Active ? "1" : "2"}
            </text>
            {/* Testo principale */}
            <text
              x={centerX}
              y={centerY + 3}
              textAnchor="middle"
              fontSize={VALVE_3WAY_CONFIG.fontSize.state}
              fontWeight="bold"
              fill="white"
              stroke={VALVE_3WAY_CONFIG.colors.border}
              strokeWidth={0.5}
            >
              {isOut1Active ? "1" : "2"}
            </text>
          </g>
        )}
        
        {/* Etichetta della valvola */}
        <text
          x={centerX}
          y={svgSize - 10}
          textAnchor="middle"
          fontSize={VALVE_3WAY_CONFIG.fontSize.label}
          fontWeight="bold"
          fill={VALVE_3WAY_CONFIG.colors.text}
        >
          {label}
        </text>
        
        {/* Indicatore controllo manuale abilitato */}
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
          </g>
        )}
      </svg>
    </div>
  );
};

// Componente Demo per mostrare tutti gli orientamenti
const Valve3WayDemo: React.FC = () => {
  const [valve1State, setValve1State] = useState<Valve3WayState>('IN_TO_OUT1');
  const [valve2State, setValve2State] = useState<Valve3WayState>('IN_TO_OUT2');
  const [valve3State, setValve3State] = useState<Valve3WayState>('IN_TO_OUT1');
  const [valve4State, setValve4State] = useState<Valve3WayState>('IN_TO_OUT2');
  const [manualControlEnabled, setManualControlEnabled] = useState(false);

  const toggleValve1 = () => setValve1State(valve1State === 'IN_TO_OUT1' ? 'IN_TO_OUT2' : 'IN_TO_OUT1');
  const toggleValve2 = () => setValve2State(valve2State === 'IN_TO_OUT1' ? 'IN_TO_OUT2' : 'IN_TO_OUT1');
  const toggleValve3 = () => setValve3State(valve3State === 'IN_TO_OUT1' ? 'IN_TO_OUT2' : 'IN_TO_OUT1');
  const toggleValve4 = () => setValve4State(valve4State === 'IN_TO_OUT1' ? 'IN_TO_OUT2' : 'IN_TO_OUT1');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Controlli Valvola 3 Vie - Dashboard Industriale
        </h1>
        
        {/* Pannello controlli */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Controlli Globali</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={manualControlEnabled}
                onChange={(e) => setManualControlEnabled(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Abilita Comandi Manuali</span>
            </label>
            {manualControlEnabled && (
              <span className="text-xs text-green-600 font-medium">
                ● Controllo manuale attivo - cliccare sulle valvole per cambiarle
              </span>
            )}
          </div>
        </div>

        {/* Griglia delle valvole - 4 orientamenti */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Orizzontale-Alto */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Orizzontale - Uscita Alto
            </h3>
            <div className="flex justify-center">
              <Valve3Way
                state={valve1State}
                label="V3H-UP"
                orientation="horizontal-up"
                manualControlEnabled={manualControlEnabled}
                onToggle={toggleValve1}
                size={0.8}
              />
            </div>
            <div className="mt-3 text-xs text-center text-gray-600">
              Flusso: <span className="font-semibold text-blue-600">
                IN → {valve1State === 'IN_TO_OUT1' ? 'OUT1' : 'OUT2'}
              </span>
            </div>
          </div>

          {/* Orizzontale-Basso */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Orizzontale - Uscita Basso
            </h3>
            <div className="flex justify-center">
              <Valve3Way
                state={valve2State}
                label="V3H-DN"
                orientation="horizontal-down"
                manualControlEnabled={manualControlEnabled}
                onToggle={toggleValve2}
                size={0.8}
              />
            </div>
            <div className="mt-3 text-xs text-center text-gray-600">
              Flusso: <span className="font-semibold text-blue-600">
                IN → {valve2State === 'IN_TO_OUT1' ? 'OUT1' : 'OUT2'}
              </span>
            </div>
          </div>

          {/* Verticale-Sinistra */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Verticale - Uscita Sinistra
            </h3>
            <div className="flex justify-center">
              <Valve3Way
                state={valve3State}
                label="V3V-LT"
                orientation="vertical-left"
                manualControlEnabled={manualControlEnabled}
                onToggle={toggleValve3}
                size={0.8}
              />
            </div>
            <div className="mt-3 text-xs text-center text-gray-600">
              Flusso: <span className="font-semibold text-blue-600">
                IN → {valve3State === 'IN_TO_OUT1' ? 'OUT1' : 'OUT2'}
              </span>
            </div>
          </div>

          {/* Verticale-Destra */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Verticale - Uscita Destra
            </h3>
            <div className="flex justify-center">
              <Valve3Way
                state={valve4State}
                label="V3V-RT"
                orientation="vertical-right"
                manualControlEnabled={manualControlEnabled}
                onToggle={toggleValve4}
                size={0.8}
              />
            </div>
            <div className="mt-3 text-xs text-center text-gray-600">
              Flusso: <span className="font-semibold text-blue-600">
                IN → {valve4State === 'IN_TO_OUT1' ? 'OUT1' : 'OUT2'}
              </span>
            </div>
          </div>
        </div>

        {/* Esempio con dimensioni diverse */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Varianti Dimensionali</h2>
          <div className="flex flex-wrap gap-8 items-center justify-center">
            
            <div className="text-center">
              <Valve3Way
                state="IN_TO_OUT1"
                label="Small"
                orientation="horizontal-up"
                size={0.6}
                manualControlEnabled={manualControlEnabled}
                onToggle={() => {}}
              />
              <p className="text-xs text-gray-600 mt-2">Piccola (60%)</p>
            </div>

            <div className="text-center">
              <Valve3Way
                state="IN_TO_OUT2"
                label="Normal"
                orientation="horizontal-up"
                size={1.0}
                manualControlEnabled={manualControlEnabled}
                onToggle={() => {}}
              />
              <p className="text-xs text-gray-600 mt-2">Normale (100%)</p>
            </div>

            <div className="text-center">
              <Valve3Way
                state="IN_TO_OUT1"
                label="Large"
                orientation="horizontal-up"
                size={1.4}
                manualControlEnabled={manualControlEnabled}
                onToggle={() => {}}
              />
              <p className="text-xs text-gray-600 mt-2">Grande (140%)</p>
            </div>
          </div>
        </div>

        {/* Schema funzionamento */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Funzionamento Valvola 3 Vie</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Stati di Commutazione:</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span><strong>Stato 1:</strong> IN → OUT1 (OUT2 bloccata)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span><strong>Stato 2:</strong> IN → OUT2 (OUT1 bloccata)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span><strong>Via bloccata:</strong> Nessun flusso (grigio)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Orientamenti Disponibili:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Orizzontale-Alto:</strong> OUT2 verso l'alto</div>
                <div>• <strong>Orizzontale-Basso:</strong> OUT2 verso il basso</div>
                <div>• <strong>Verticale-Sinistra:</strong> OUT2 verso sinistra</div>
                <div>• <strong>Verticale-Destra:</strong> OUT2 verso destra</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <h4 className="font-semibold text-blue-700 mb-2">Caratteristiche Grafiche:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-blue-700">
              <div>
                <strong>Effetti 3D:</strong>
                <ul className="list-disc list-inside mt-1">
                  <li>Gradienti multicolore</li>
                  <li>Ombreggiature proiettate</li>
                  <li>Riflessi metallici</li>
                </ul>
              </div>
              <div>
                <strong>Indicazioni Flusso:</strong>
                <ul className="list-disc list-inside mt-1">
                  <li>Frecce direzionali animate</li>
                  <li>Vie attive colorate</li>
                  <li>Vie bloccate in grigio</li>
                </ul>
              </div>
              <div>
                <strong>Configurabile:</strong>
                <ul className="list-disc list-inside mt-1">
                  <li>4 orientamenti diversi</li>
                  <li>Dimensioni scalabili</li>
                  <li>Etichette personalizzabili</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Valve3WayDemo;
