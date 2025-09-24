import React, { useState, useEffect } from 'react';

// Configurazione tubazioni dritte azoto (semplificata)
const NITROGEN_STRAIGHT_PIPE_CONFIG = {
  // Dimensioni base
  defaultLength: 120,
  defaultDiameter: 20,
  
  // Colori per stati
  colors: {
    withFlow: {
      pipe: "#4A90E2",         // blu per tubazione con flusso
      pipeHighlight: "#7BB3F0", // blu chiaro per riflessi
      pipeShadow: "#2C5282",   // blu scuro per ombre
      flow: "#00BFFF",         // azzurro per flusso animato
      flowParticle: "#87CEEB"  // azzurro chiaro per particelle
    },
    noFlow: {
      pipe: "#9CA3AF",         // grigio per tubazione senza flusso
      pipeHighlight: "#D1D5DB", // grigio chiaro per riflessi
      pipeShadow: "#6B7280",   // grigio scuro per ombre
    },
    border: "#1F2937"         // grigio molto scuro per bordi
  },
  
  // Animazione flusso
  flowSpeed: 2,
  particleCount: 4,
  particleSize: 3,
  
  // Stili
  strokeWidth: 2,
  shadowOffset: 3
};

type StraightOrientation = 'horizontal' | 'vertical';

interface NitrogenStraightPipeProps {
  // Orientamento
  orientation: StraightOrientation;
  
  // Stato del flusso
  hasFlow: boolean;
  
  // Configurazione dimensioni
  length?: number;
  
  // Styling opzionale
  size?: number;
  className?: string;
}

const NitrogenStraightPipe: React.FC<NitrogenStraightPipeProps> = ({
  orientation,
  hasFlow,
  length: customLength,
  size = 1,
  className = ""
}) => {
  const [flowOffset, setFlowOffset] = useState(0);

  // Animazione flusso
  useEffect(() => {
    if (hasFlow) {
      const interval = setInterval(() => {
        setFlowOffset(prev => (prev + NITROGEN_STRAIGHT_PIPE_CONFIG.flowSpeed) % 100);
      }, 50);
      return () => clearInterval(interval);
    } else {
      setFlowOffset(0);
    }
  }, [hasFlow]);

  // Dimensioni scalate
  const length = (customLength || NITROGEN_STRAIGHT_PIPE_CONFIG.defaultLength) * size;
  const diameter = NITROGEN_STRAIGHT_PIPE_CONFIG.defaultDiameter * size;
  
  // Colori attuali basati sullo stato
  const currentColors = hasFlow ? 
    NITROGEN_STRAIGHT_PIPE_CONFIG.colors.withFlow : 
    NITROGEN_STRAIGHT_PIPE_CONFIG.colors.noFlow;
  
  // Calcolo dimensioni SVG
  const svgWidth = orientation === 'horizontal' ? length + 40 : diameter + 40;
  const svgHeight = orientation === 'horizontal' ? diameter + 40 : length + 40;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Componente Particella Flusso
  const FlowParticle = ({ x, y, offset }: { x: number; y: number; offset: number }) => (
    <circle
      cx={x}
      cy={y}
      r={NITROGEN_STRAIGHT_PIPE_CONFIG.particleSize * 0.7}
      fill={NITROGEN_STRAIGHT_PIPE_CONFIG.colors.withFlow.flowParticle}
      opacity={0.9}
    >
      <animate
        attributeName="opacity"
        values="0.4;0.9;0.4"
        dur="1.5s"
        repeatCount="indefinite"
        begin={`${offset}s`}
      />
    </circle>
  );

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={svgWidth} 
        height={svgHeight}
      >
        {/* Definizione gradienti 3D */}
        <defs>
          {/* Gradiente tubazione */}
          <linearGradient id={`straight-pipe-gradient-${orientation}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={currentColors.pipeHighlight} />
            <stop offset="50%" stopColor={currentColors.pipe} />
            <stop offset="100%" stopColor={currentColors.pipeShadow} />
          </linearGradient>

          {/* Gradiente flusso animato */}
          <linearGradient id="straight-flow-gradient">
            <stop offset="0%" stopColor={NITROGEN_STRAIGHT_PIPE_CONFIG.colors.withFlow.flow} stopOpacity="0" />
            <stop offset="50%" stopColor={NITROGEN_STRAIGHT_PIPE_CONFIG.colors.withFlow.flow} stopOpacity="0.6" />
            <stop offset="100%" stopColor={NITROGEN_STRAIGHT_PIPE_CONFIG.colors.withFlow.flow} stopOpacity="0" />
          </linearGradient>

          {/* Ombra */}
          <filter id="straight-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
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

        {orientation === 'horizontal' ? (
          <g>
            {/* Ombra tubazione orizzontale */}
            <rect
              x={centerX - length/2 + NITROGEN_STRAIGHT_PIPE_CONFIG.shadowOffset}
              y={centerY - diameter/2 + NITROGEN_STRAIGHT_PIPE_CONFIG.shadowOffset}
              width={length}
              height={diameter}
              fill={currentColors.pipeShadow}
              opacity={0.4}
            />
            
            {/* Tubazione orizzontale principale */}
            <rect
              x={centerX - length/2}
              y={centerY - diameter/2}
              width={length}
              height={diameter}
              fill={`url(#straight-pipe-gradient-${orientation})`}
              filter="url(#straight-shadow)"
            />

            {/* Bordi laterali orizzontali */}
            <rect
              x={centerX - length/2}
              y={centerY - diameter/2}
              width={length}
              height={2}
              fill={NITROGEN_STRAIGHT_PIPE_CONFIG.colors.border}
            />
            <rect
              x={centerX - length/2}
              y={centerY + diameter/2 - 2}
              width={length}
              height={2}
              fill={NITROGEN_STRAIGHT_PIPE_CONFIG.colors.border}
            />

            {/* Riflesso superiore orizzontale */}
            <rect
              x={centerX - length/2 + 5}
              y={centerY - diameter/2 + 2}
              width={length - 10}
              height={diameter/4}
              fill="white"
              opacity={0.4}
            />

            {/* Flusso animato orizzontale - solo interno */}
            {hasFlow && (
              <g>
                {/* Linea di flusso centrale interna */}
                <rect
                  x={centerX - length/2}
                  y={centerY - 2}
                  width={length}
                  height={4}
                  fill="url(#straight-flow-gradient)"
                  opacity={0.7}
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={`${-length/2};${length/2}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </rect>
                
                {/* Particelle animate orizzontali */}
                {Array.from({ length: NITROGEN_STRAIGHT_PIPE_CONFIG.particleCount }, (_, i) => (
                  <FlowParticle
                    key={i}
                    x={centerX - length/2 + (length / NITROGEN_STRAIGHT_PIPE_CONFIG.particleCount) * i + (flowOffset * length / 100) % length}
                    y={centerY}
                    offset={i * 0.3}
                  />
                ))}
              </g>
            )}
          </g>
        ) : (
          <g>
            {/* Ombra tubazione verticale */}
            <rect
              x={centerX - diameter/2 + NITROGEN_STRAIGHT_PIPE_CONFIG.shadowOffset}
              y={centerY - length/2 + NITROGEN_STRAIGHT_PIPE_CONFIG.shadowOffset}
              width={diameter}
              height={length}
              fill={currentColors.pipeShadow}
              opacity={0.4}
            />
            
            {/* Tubazione verticale principale */}
            <rect
              x={centerX - diameter/2}
              y={centerY - length/2}
              width={diameter}
              height={length}
              fill={`url(#straight-pipe-gradient-${orientation})`}
              filter="url(#straight-shadow)"
            />

            {/* Bordi laterali verticali */}
            <rect
              x={centerX - diameter/2}
              y={centerY - length/2}
              width={2}
              height={length}
              fill={NITROGEN_STRAIGHT_PIPE_CONFIG.colors.border}
            />
            <rect
              x={centerX + diameter/2 - 2}
              y={centerY - length/2}
              width={2}
              height={length}
              fill={NITROGEN_STRAIGHT_PIPE_CONFIG.colors.border}
            />

            {/* Riflesso laterale verticale */}
            <rect
              x={centerX - diameter/2 + 2}
              y={centerY - length/2 + 5}
              width={diameter/4}
              height={length - 10}
              fill="white"
              opacity={0.4}
            />

            {/* Flusso animato verticale - solo interno */}
            {hasFlow && (
              <g>
                {/* Linea di flusso centrale interna */}
                <rect
                  x={centerX - 2}
                  y={centerY - length/2}
                  width={4}
                  height={length}
                  fill="url(#straight-flow-gradient)"
                  opacity={0.7}
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={`0,${-length/2};0,${length/2}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </rect>
                
                {/* Particelle animate verticali */}
                {Array.from({ length: NITROGEN_STRAIGHT_PIPE_CONFIG.particleCount }, (_, i) => (
                  <FlowParticle
                    key={i}
                    x={centerX}
                    y={centerY - length/2 + (length / NITROGEN_STRAIGHT_PIPE_CONFIG.particleCount) * i + (flowOffset * length / 100) % length}
                    offset={i * 0.3}
                  />
                ))}
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};

export default NitrogenStraightPipe;
