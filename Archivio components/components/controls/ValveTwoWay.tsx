import React from 'react';

// Configurazione valvola (facilmente modificabile)
const VALVE_CONFIG = {
  // Dimensioni base
  width: 60,
  height: 30,
  
  // Colori con gradiente 3D - versione brillante
  colors: {
    on: {
      primary: "#00BFFF",    // blu elettrico brillante
      secondary: "#0080FF",  // blu intenso
      highlight: "#80DFFF",  // blu molto chiaro e brillante
      shadow: "#003D7A"      // blu navy profondo
    },
    off: {
      primary: "#FF6600",    // arancione brillante
      secondary: "#FF4500",  // rosso-arancione intenso
      highlight: "#FFB366",  // arancione chiaro brillante
      shadow: "#CC3300"      // rosso scuro
    },
    border: "#1F2937",       // grigio molto scuro
    text: "#1F2937",
    connection: "#4B5563"    // grigio medio scuro
  },
  
  // Testo e etichette
  showStateText: true,
  showLabel: true,
  
  // Stili 3D
  borderRadius: 6,
  strokeWidth: 2,
  shadowOffset: 3,
  fontSize: {
    state: 10,
    label: 12
  }
};

type FlowDirection = 'left' | 'right' | 'up' | 'down';

interface Valve2WayProps {
  // Stato della valvola
  isOpen: boolean;
  
  // Configurazione
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  flowDirection?: FlowDirection; // Nuova prop per direzione flusso
  
  // Controlli
  manualControlEnabled?: boolean;
  onToggle?: () => void;
  
  // Styling opzionale
  width?: number;
  height?: number;
  className?: string;
}

const Valve2Way: React.FC<Valve2WayProps> = ({
  isOpen,
  label = "V001",
  orientation = 'horizontal',
  flowDirection = 'right', // Default: destra per orizzontale, giù per verticale
  manualControlEnabled = false,
  onToggle,
  width: customWidth,
  height: customHeight,
  className = ""
}) => {
  // Dimensioni effettive
  const width = customWidth || VALVE_CONFIG.width;
  const height = customHeight || VALVE_CONFIG.height;
  
  // Colori attuali basati sullo stato
  const currentColors = isOpen ? VALVE_CONFIG.colors.on : VALVE_CONFIG.colors.off;
  const stateText = isOpen ? "ON" : "OFF";
  
  // Gestione click
  const handleClick = () => {
    if (manualControlEnabled && onToggle) {
      onToggle();
    }
  };
  
  // Calcolo dimensioni SVG basate sull'orientamento
  const isVertical = orientation === 'vertical';
  const svgWidth = isVertical ? height + 80 : width + 80;
  const svgHeight = isVertical ? width + 80 : height + 80;
  
  // Centro del componente
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  // Dimensioni effettive della valvola (scambiate se verticale)
  const valveWidth = isVertical ? height : width;
  const valveHeight = isVertical ? width : height;

  // Funzione per generare i punti della freccia in base alla direzione
  const getArrowPoints = (direction: FlowDirection) => {
    const arrowSize = 8;
    
    switch (direction) {
      case 'right':
        return {
          main: `${centerX-10},${centerY-arrowSize} ${centerX-10},${centerY+arrowSize} ${centerX+10},${centerY}`,
          inner: `${centerX-8},${centerY-6} ${centerX-8},${centerY+6} ${centerX+8},${centerY}`
        };
      case 'left':
        return {
          main: `${centerX+10},${centerY-arrowSize} ${centerX+10},${centerY+arrowSize} ${centerX-10},${centerY}`,
          inner: `${centerX+8},${centerY-6} ${centerX+8},${centerY+6} ${centerX-8},${centerY}`
        };
      case 'down':
        return {
          main: `${centerX-arrowSize},${centerY-10} ${centerX+arrowSize},${centerY-10} ${centerX},${centerY+10}`,
          inner: `${centerX-6},${centerY-8} ${centerX+6},${centerY-8} ${centerX},${centerY+8}`
        };
      case 'up':
        return {
          main: `${centerX-arrowSize},${centerY+10} ${centerX+arrowSize},${centerY+10} ${centerX},${centerY-10}`,
          inner: `${centerX-6},${centerY+8} ${centerX+6},${centerY+8} ${centerX},${centerY-8}`
        };
      default:
        return getArrowPoints('right');
    }
  };

  // Determina la direzione effettiva del flusso
  const getEffectiveFlowDirection = (): FlowDirection => {
    // Se è specificata una direzione, usala
    if (flowDirection) return flowDirection;
    
    // Altrimenti usa default basati sull'orientamento
    return isVertical ? 'down' : 'right';
  };

  const effectiveDirection = getEffectiveFlowDirection();
  const arrowPoints = getArrowPoints(effectiveDirection);

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={svgWidth} 
        height={svgHeight}
        className={`${manualControlEnabled ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={handleClick}
      >
        {/* Definizione gradienti 3D */}
        <defs>
          {/* Gradiente ON (Blu) */}
          <linearGradient id={`gradient-on-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentColors.highlight} />
            <stop offset="30%" stopColor={currentColors.primary} />
            <stop offset="70%" stopColor={currentColors.secondary} />
            <stop offset="100%" stopColor={currentColors.shadow} />
          </linearGradient>
          
          {/* Gradiente OFF (Arancione brillante) */}
          <linearGradient id={`gradient-off-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB366" />
            <stop offset="30%" stopColor="#FF6600" />
            <stop offset="70%" stopColor="#FF4500" />
            <stop offset="100%" stopColor="#CC3300" />
          </linearGradient>

          {/* Gradiente per highlight superiore - più sottile */}
          <linearGradient id={`highlight-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
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

        {/* Ombra del corpo valvola */}
        <rect
          x={centerX - valveWidth/2 + VALVE_CONFIG.shadowOffset}
          y={centerY - valveHeight/2 + VALVE_CONFIG.shadowOffset}
          width={valveWidth}
          height={valveHeight}
          fill={currentColors.shadow}
          opacity={0.3}
          rx={VALVE_CONFIG.borderRadius}
          ry={VALVE_CONFIG.borderRadius}
        />
        
        {/* Corpo della valvola con gradiente 3D */}
        <rect
          x={centerX - valveWidth/2}
          y={centerY - valveHeight/2}
          width={valveWidth}
          height={valveHeight}
          fill={`url(#gradient-${isOpen ? 'on' : 'off'}-${label})`}
          stroke={VALVE_CONFIG.colors.border}
          strokeWidth={VALVE_CONFIG.strokeWidth}
          rx={VALVE_CONFIG.borderRadius}
          ry={VALVE_CONFIG.borderRadius}
          filter={`url(#shadow-${label})`}
        />

        {/* Highlight superiore per effetto 3D - ridotto */}
        <rect
          x={centerX - valveWidth/2 + 2}
          y={centerY - valveHeight/2 + 2}
          width={valveWidth - 4}
          height={valveHeight/3}
          fill={`url(#highlight-${label})`}
          rx={VALVE_CONFIG.borderRadius - 1}
          ry={VALVE_CONFIG.borderRadius - 1}
        />
        
        {/* Indicatore di flusso (freccia) - solo quando aperta con direzione controllabile */}
        {isOpen && (
          <g>
            {/* Freccia principale */}
            <polygon
              points={arrowPoints.main}
              fill="white"
              stroke={VALVE_CONFIG.colors.border}
              strokeWidth={1.5}
              opacity={0.9}
            />
            {/* Freccia interna per effetto gradiente */}
            <polygon
              points={arrowPoints.inner}
              fill={currentColors.highlight}
              opacity={0.8}
            />
          </g>
        )}
        
        {/* Testo stato ON/OFF con ombra */}
        {VALVE_CONFIG.showStateText && (
          <g>
            {/* Ombra del testo */}
            <text
              x={centerX + 1}
              y={centerY + 4}
              textAnchor="middle"
              fontSize={VALVE_CONFIG.fontSize.state}
              fontWeight="bold"
              fill="black"
              opacity={0.3}
            >
              {stateText}
            </text>
            {/* Testo principale */}
            <text
              x={centerX}
              y={centerY + 3}
              textAnchor="middle"
              fontSize={VALVE_CONFIG.fontSize.state}
              fontWeight="bold"
              fill="white"
              stroke={VALVE_CONFIG.colors.border}
              strokeWidth={0.5}
            >
              {stateText}
            </text>
          </g>
        )}
        
        {/* Etichetta della valvola con ombra */}
        {VALVE_CONFIG.showLabel && (
          <g>
            {/* Ombra dell'etichetta */}
            <text
              x={centerX + 1}
              y={isVertical ? svgHeight - 3 : centerY + valveHeight/2 + 21}
              textAnchor="middle"
              fontSize={VALVE_CONFIG.fontSize.label}
              fontWeight="bold"
              fill="black"
              opacity={0.3}
            >
              {label}
            </text>
            {/* Etichetta principale */}
            <text
              x={centerX}
              y={isVertical ? svgHeight - 5 : centerY + valveHeight/2 + 20}
              textAnchor="middle"
              fontSize={VALVE_CONFIG.fontSize.label}
              fontWeight="bold"
              fill={VALVE_CONFIG.colors.text}
            >
              {label}
            </text>
          </g>
        )}
        
        {/* Indicatore controllo manuale abilitato con effetto 3D */}
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
    </div>
  );
};

// Componente demo per testare le direzioni
const Valve2WayDemo = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Valvola 2 Vie con Controllo Direzione Flusso</h1>
        
        {/* Controllo globale */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-6 py-2 text-white rounded font-semibold ${
              isOpen ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isOpen ? 'CHIUDI TUTTE' : 'APRI TUTTE'}
          </button>
        </div>

        {/* Valvole orizzontali */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Valvole Orizzontali</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-lg mb-4">Flusso verso Destra →</h3>
              <Valve2Way
                isOpen={isOpen}
                label="V001"
                orientation="horizontal"
                flowDirection="right"
                manualControlEnabled={true}
                onToggle={() => setIsOpen(!isOpen)}
              />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg mb-4">Flusso verso Sinistra ←</h3>
              <Valve2Way
                isOpen={isOpen}
                label="V002"
                orientation="horizontal"
                flowDirection="left"
                manualControlEnabled={true}
                onToggle={() => setIsOpen(!isOpen)}
              />
            </div>
          </div>
        </div>

        {/* Valvole verticali */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Valvole Verticali</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-lg mb-4">Flusso verso il Basso ↓</h3>
              <Valve2Way
                isOpen={isOpen}
                label="V003"
                orientation="vertical"
                flowDirection="down"
                manualControlEnabled={true}
                onToggle={() => setIsOpen(!isOpen)}
              />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg mb-4">Flusso verso l'Alto ↑</h3>
              <Valve2Way
                isOpen={isOpen}
                label="V004"
                orientation="vertical"
                flowDirection="up"
                manualControlEnabled={true}
                onToggle={() => setIsOpen(!isOpen)}
              />
            </div>
          </div>
        </div>

        {/* Combinazioni miste */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Combinazioni Miste</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-lg mb-4">Orizzontale - Flusso Su ↑</h3>
              <Valve2Way
                isOpen={isOpen}
                label="V005"
                orientation="horizontal"
                flowDirection="up"
                manualControlEnabled={true}
                onToggle={() => setIsOpen(!isOpen)}
              />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg mb-4">Verticale - Flusso Destra →</h3>
              <Valve2Way
                isOpen={isOpen}
                label="V006"
                orientation="vertical"
                flowDirection="right"
                manualControlEnabled={true}
                onToggle={() => setIsOpen(!isOpen)}
              />
            </div>
          </div>
        </div>

        {/* Info stato */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Stato Valvole:</h3>
          <p className={`font-semibold ${isOpen ? 'text-cyan-600' : 'text-orange-600'}`}>
            {isOpen ? 'APERTE (ON)' : 'CHIUSE (OFF)'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Valve2WayDemo;
