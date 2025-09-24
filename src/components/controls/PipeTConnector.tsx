import React from 'react';

// Configurazione connettore a T (seguendo lo stile dei componenti esistenti) - DIMENSIONI RIDOTTE
const PIPE_T_CONNECTOR_CONFIG = {
  // Dimensioni base - ridotte del 50%
  pipeWidth: 10,           // Ridotto da 20 a 10
  connectorSize: 15,       // Ridotto da 30 a 15
  flangeSize: 4,           // Ridotto da 8 a 4
  
  // Colori (coerenti con NitrogenPipe)
  colors: {
    pipe: "#4A90E2",         // blu per tubazione
    pipeHighlight: "#7BB3F0", // blu chiaro per riflessi
    pipeShadow: "#2C5282",   // blu scuro per ombre
    flange: "#708090",       // grigio ardesia per flange
    flangeHighlight: "#C0C0C0", // argento per riflessi flange
    border: "#1F2937",       // grigio molto scuro per bordi
    text: "#1F2937"
  },
  
  // Stili 3D - ridotti proporzionalmente
  strokeWidth: 1.5,        // Ridotto da 2
  shadowOffset: 2,         // Ridotto da 3
  fontSize: {
    label: 8               // Ridotto da 10
  }
};

const PipeTConnector = ({
  x,
  y,
  orientation = 'top',
  flowStates = { main1: true, main2: true, branch: true },
  label,
  showFlange = true,
  size = 1,
  pipeLength = 40,
  className = ""
}) => {
  // Dimensioni scalate
  const pipeWidth = PIPE_T_CONNECTOR_CONFIG.pipeWidth * size;
  const connectorSize = PIPE_T_CONNECTOR_CONFIG.connectorSize * size;
  const flangeSize = PIPE_T_CONNECTOR_CONFIG.flangeSize * size;
  const scaledPipeLength = pipeLength * size;
  
  // Calcola le posizioni dei tre rami basandosi sull'orientamento
  const getBranchPositions = () => {
    switch (orientation) {
      case 'top':
        return {
          main1: { x1: x - scaledPipeLength, y1: y, x2: x, y2: y },
          main2: { x1: x, y1: y, x2: x + scaledPipeLength, y2: y },
          branch: { x1: x, y1: y, x2: x, y2: y - scaledPipeLength }
        };
      case 'bottom':
        return {
          main1: { x1: x - scaledPipeLength, y1: y, x2: x, y2: y },
          main2: { x1: x, y1: y, x2: x + scaledPipeLength, y2: y },
          branch: { x1: x, y1: y, x2: x, y2: y + scaledPipeLength }
        };
      case 'left':
        return {
          main1: { x1: x, y1: y - scaledPipeLength, x2: x, y2: y },
          main2: { x1: x, y1: y, x2: x, y2: y + scaledPipeLength },
          branch: { x1: x, y1: y, x2: x - scaledPipeLength, y2: y }
        };
      case 'right':
        return {
          main1: { x1: x, y1: y - scaledPipeLength, x2: x, y2: y },
          main2: { x1: x, y1: y, x2: x, y2: y + scaledPipeLength },
          branch: { x1: x, y1: y, x2: x + scaledPipeLength, y2: y }
        };
    }
  };
  
  const branches = getBranchPositions();
  
  // Componente Flangia
  const Flange = ({ cx, cy, isVertical = false }) => (
    <g>
      <ellipse
        cx={cx + PIPE_T_CONNECTOR_CONFIG.shadowOffset}
        cy={cy + PIPE_T_CONNECTOR_CONFIG.shadowOffset}
        rx={isVertical ? pipeWidth/2 + flangeSize : flangeSize}
        ry={isVertical ? flangeSize : pipeWidth/2 + flangeSize}
        fill={PIPE_T_CONNECTOR_CONFIG.colors.pipeShadow}
        opacity={0.4}
      />
      <ellipse
        cx={cx}
        cy={cy}
        rx={isVertical ? pipeWidth/2 + flangeSize : flangeSize}
        ry={isVertical ? flangeSize : pipeWidth/2 + flangeSize}
        fill={PIPE_T_CONNECTOR_CONFIG.colors.flange}
        stroke={PIPE_T_CONNECTOR_CONFIG.colors.border}
        strokeWidth={1}
      />
      <ellipse
        cx={cx - 2}
        cy={cy - 2}
        rx={isVertical ? pipeWidth/4 + flangeSize/2 : flangeSize/2}
        ry={isVertical ? flangeSize/2 : pipeWidth/4 + flangeSize/2}
        fill={PIPE_T_CONNECTOR_CONFIG.colors.flangeHighlight}
        opacity={0.6}
      />
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const boltRadius = flangeSize * 0.7;
        const boltX = cx + Math.cos(rad) * boltRadius;
        const boltY = cy + Math.sin(rad) * boltRadius;
        return (
          <circle
            key={i}
            cx={boltX}
            cy={boltY}
            r={1.5} // Ridotto da 2
            fill={PIPE_T_CONNECTOR_CONFIG.colors.pipeShadow}
            stroke={PIPE_T_CONNECTOR_CONFIG.colors.border}
            strokeWidth={0.5}
          />
        );
      })}
    </g>
  );
  
  // Componente Tubo
  const Pipe = ({ x1, y1, x2, y2, hasFlow }) => {
    const isVertical = x1 === x2;
    const length = isVertical ? Math.abs(y2 - y1) : Math.abs(x2 - x1);
    const startX = Math.min(x1, x2);
    const startY = Math.min(y1, y2);
    
    return (
      <g>
        <rect
          x={isVertical ? startX - pipeWidth/2 + PIPE_T_CONNECTOR_CONFIG.shadowOffset : startX + PIPE_T_CONNECTOR_CONFIG.shadowOffset}
          y={isVertical ? startY + PIPE_T_CONNECTOR_CONFIG.shadowOffset : startY - pipeWidth/2 + PIPE_T_CONNECTOR_CONFIG.shadowOffset}
          width={isVertical ? pipeWidth : length}
          height={isVertical ? length : pipeWidth}
          fill={PIPE_T_CONNECTOR_CONFIG.colors.pipeShadow}
          opacity={0.4}
        />
        <rect
          x={isVertical ? startX - pipeWidth/2 : startX}
          y={isVertical ? startY : startY - pipeWidth/2}
          width={isVertical ? pipeWidth : length}
          height={isVertical ? length : pipeWidth}
          fill={`url(#pipe-gradient-${label || 'default'})`}
          stroke={PIPE_T_CONNECTOR_CONFIG.colors.border}
          strokeWidth={PIPE_T_CONNECTOR_CONFIG.strokeWidth}
        />
        <rect
          x={isVertical ? startX - pipeWidth/2 + 2 : startX + 2}
          y={isVertical ? startY + 2 : startY - pipeWidth/2 + 2}
          width={isVertical ? pipeWidth/4 : length - 4}
          height={isVertical ? length - 4 : pipeWidth/4}
          fill="white"
          opacity={0.4}
        />
      </g>
    );
  };
  
  // Calcola dimensioni SVG - ridotte
  const svgSize = (scaledPipeLength + connectorSize) * 2 + 30; // Ridotto da 40
  
  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={svgSize} 
        height={svgSize}
        viewBox={`${x - svgSize/2} ${y - svgSize/2} ${svgSize} ${svgSize}`}
      >
        {/* Definizioni gradienti */}
        <defs>
          <linearGradient id={`pipe-gradient-${label || 'default'}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={PIPE_T_CONNECTOR_CONFIG.colors.pipeHighlight} />
            <stop offset="50%" stopColor={PIPE_T_CONNECTOR_CONFIG.colors.pipe} />
            <stop offset="100%" stopColor={PIPE_T_CONNECTOR_CONFIG.colors.pipeShadow} />
          </linearGradient>
          <filter id={`shadow-t-connector-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/> {/* Ridotto da 2 */}
            <feOffset dx="2" dy="2" result="offset" /> {/* Ridotto da 3,3 */}
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Tre rami della T */}
        <Pipe {...branches.main1} hasFlow={flowStates.main1} />
        <Pipe {...branches.main2} hasFlow={flowStates.main2} />
        <Pipe {...branches.branch} hasFlow={flowStates.branch} />
        
        {/* Connettore centrale */}
        <circle
          cx={x + PIPE_T_CONNECTOR_CONFIG.shadowOffset}
          cy={y + PIPE_T_CONNECTOR_CONFIG.shadowOffset}
          r={connectorSize/2}
          fill={PIPE_T_CONNECTOR_CONFIG.colors.pipeShadow}
          opacity={0.4}
        />
        <circle
          cx={x}
          cy={y}
          r={connectorSize/2}
          fill={`url(#pipe-gradient-${label || 'default'})`}
          stroke={PIPE_T_CONNECTOR_CONFIG.colors.border}
          strokeWidth={PIPE_T_CONNECTOR_CONFIG.strokeWidth}
          filter={`url(#shadow-t-connector-${label})`}
        />
        
        {/* Riflesso centrale */}
        <ellipse
          cx={x - connectorSize/4}
          cy={y - connectorSize/4}
          rx={connectorSize/4}
          ry={connectorSize/6}
          fill="white"
          opacity={0.5}
        />
        
        {/* Flange opzionali */}
        {showFlange && (
          <>
            <Flange cx={branches.main1.x1} cy={branches.main1.y1} isVertical={branches.main1.x1 === branches.main1.x2} />
            <Flange cx={branches.main2.x2} cy={branches.main2.y2} isVertical={branches.main2.x1 === branches.main2.x2} />
            <Flange cx={branches.branch.x2} cy={branches.branch.y2} isVertical={branches.branch.x1 === branches.branch.x2} />
          </>
        )}
        
        {/* Etichetta opzionale */}
        {label && (
          <text
            x={x}
            y={y + connectorSize/2 + 15} // Ridotto da 20
            textAnchor="middle"
            fontSize={PIPE_T_CONNECTOR_CONFIG.fontSize.label}
            fontWeight="bold"
            fill={PIPE_T_CONNECTOR_CONFIG.colors.text}
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
};

export default PipeTConnector;
