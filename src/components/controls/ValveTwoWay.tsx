import React from 'react';

// Configurazione valvola (facilmente modificabile)
const VALVE_CONFIG = {
  // Dimensioni base
  width: 60,
  height: 30,
  
  // Colori con gradiente 3D
  colors: {
    on: {
      primary: "#0EA5E9",    // blu intenso
      secondary: "#0284C7",  // blu scuro
      highlight: "#7DD3FC",  // blu chiaro per highlight
      shadow: "#0C4A6E"      // blu molto scuro per ombra
    },
    off: {
      primary: "#F59E0B",    // arancione/giallo intenso
      secondary: "#D97706",  // arancione scuro
      highlight: "#FCD34D",  // giallo chiaro per highlight
      shadow: "#92400E"      // marrone scuro per ombra
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

interface Valve2WayProps {
  // Stato della valvola
  isOpen: boolean;
  
  // Configurazione
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  
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
          
          {/* Gradiente OFF (Arancione) */}
          <linearGradient id={`gradient-off-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={VALVE_CONFIG.colors.off.highlight} />
            <stop offset="30%" stopColor={VALVE_CONFIG.colors.off.primary} />
            <stop offset="70%" stopColor={VALVE_CONFIG.colors.off.secondary} />
            <stop offset="100%" stopColor={VALVE_CONFIG.colors.off.shadow} />
          </linearGradient>

          {/* Gradiente per highlight superiore */}
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

        {/* Linee di connessione con effetto metallico */}
        {isVertical ? (
          <>
            {/* Connessione superiore */}
            <line
              x1={centerX}
              y1={10}
              x2={centerX}
              y2={centerY - valveHeight/2}
              stroke={VALVE_CONFIG.colors.connection}
              strokeWidth={VALVE_CONFIG.strokeWidth + 1}
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
              y2={svgHeight - 10}
              stroke={VALVE_CONFIG.colors.connection}
              strokeWidth={VALVE_CONFIG.strokeWidth + 1}
            />
            <line
              x1={centerX-1}
              y1={centerY + valveHeight/2}
              x2={centerX-1}
              y2={svgHeight - 10}
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
              stroke={VALVE_CONFIG.colors.connection}
              strokeWidth={VALVE_CONFIG.strokeWidth + 1}
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
              stroke={VALVE_CONFIG.colors.connection}
              strokeWidth={VALVE_CONFIG.strokeWidth + 1}
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

        {/* Highlight superiore per effetto 3D */}
        <rect
          x={centerX - valveWidth/2 + 2}
          y={centerY - valveHeight/2 + 2}
          width={valveWidth - 4}
          height={valveHeight/2}
          fill={`url(#highlight-${label})`}
          rx={VALVE_CONFIG.borderRadius - 1}
          ry={VALVE_CONFIG.borderRadius - 1}
        />
        
        {/* Indicatore di flusso (freccia) - solo quando aperta con effetto 3D */}
        {isOpen && (
          <g>
            {isVertical ? (
              // Freccia verticale con gradiente
              <>
                <polygon
                  points={`${centerX-8},${centerY-10} ${centerX+8},${centerY-10} ${centerX},${centerY+10}`}
                  fill="white"
                  stroke={VALVE_CONFIG.colors.border}
                  strokeWidth={1.5}
                  opacity={0.9}
                />
                <polygon
                  points={`${centerX-6},${centerY-8} ${centerX+6},${centerY-8} ${centerX},${centerY+8}`}
                  fill={currentColors.highlight}
                  opacity={0.8}
                />
              </>
            ) : (
              // Freccia orizzontale con gradiente
              <>
                <polygon
                  points={`${centerX-10},${centerY-8} ${centerX-10},${centerY+8} ${centerX+10},${centerY}`}
                  fill="white"
                  stroke={VALVE_CONFIG.colors.border}
                  strokeWidth={1.5}
                  opacity={0.9}
                />
                <polygon
                  points={`${centerX-8},${centerY-6} ${centerX-8},${centerY+6} ${centerX+8},${centerY}`}
                  fill={currentColors.highlight}
                  opacity={0.8}
                />
              </>
            )}
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
        
        {/* Indicatore di stato 3D (pallino) */}
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
            fill={`url(#gradient-${isOpen ? 'on' : 'off'}-${label})`}
            stroke={VALVE_CONFIG.colors.border}
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

export default Valve2Way;
