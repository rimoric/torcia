import React, { useState, useEffect } from 'react';

// Configurazione curve azoto (semplificata)
const NITROGEN_ELBOW_CONFIG = {
  // Dimensioni base
  defaultDiameter: 20,
  defaultRadius: 40,
  
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
  particleCount: 3,
  particleSize: 3,
  
  // Stili
  strokeWidth: 2,
  shadowOffset: 3
};

type ElbowDirection = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface NitrogenElbowProps {
  // Direzione della curva
  direction: ElbowDirection;
  
  // Stato del flusso
  hasFlow: boolean;
  
  // Configurazione dimensioni
  // diameter?: number;
  // radius?: number;
  
  // Styling opzionale
  size?: number;
  className?: string;
}

const NitrogenElbow: React.FC<NitrogenElbowProps> = ({
  direction,
  hasFlow,
  // diameter: customDiameter,
  // radius: customRadius,
  size = 1,
  className = ""
}) => {
  const [flowOffset, setFlowOffset] = useState(0);

  // Animazione flusso
  useEffect(() => {
    if (hasFlow) {
      const interval = setInterval(() => {
        setFlowOffset(prev => (prev + NITROGEN_ELBOW_CONFIG.flowSpeed) % 100);
      }, 50);
      return () => clearInterval(interval);
    } else {
      setFlowOffset(0);
    }
  }, [hasFlow]);

  // Dimensioni scalate
  const diameter = (/* customDiameter || */ NITROGEN_ELBOW_CONFIG.defaultDiameter) * size;
  const radius = (/* customRadius || */ NITROGEN_ELBOW_CONFIG.defaultRadius) * size;
  
  // Colori attuali basati sullo stato
  const currentColors = hasFlow ? 
    NITROGEN_ELBOW_CONFIG.colors.withFlow : 
    NITROGEN_ELBOW_CONFIG.colors.noFlow;
  
  // Calcolo dimensioni SVG
  const svgWidth = radius * 2 + diameter + 40;
  const svgHeight = radius * 2 + diameter + 40;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Calcolo angoli per le diverse direzioni
  const getAngles = () => {
    switch (direction) {
      case 'top-right':
        return { startAngle: 180, endAngle: 270 }; // Da sinistra a su
      case 'top-left':
        return { startAngle: 270, endAngle: 0 };   // Da su a destra
      case 'bottom-left':
        return { startAngle: 0, endAngle: 90 };    // Da destra a giù
      case 'bottom-right':
        return { startAngle: 90, endAngle: 180 };  // Da giù a sinistra
      default:
        return { startAngle: 180, endAngle: 270 }; // Default case
    }
  };

  const angles = getAngles();
  const startAngle = angles.startAngle;
  const endAngle = angles.endAngle;

  // Path della curva
  const startX = centerX + Math.cos(startAngle * Math.PI / 180) * radius;
  const startY = centerY + Math.sin(startAngle * Math.PI / 180) * radius;
  const endX = centerX + Math.cos(endAngle * Math.PI / 180) * radius;
  const endY = centerY + Math.sin(endAngle * Math.PI / 180) * radius;
  const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

  // Componente Particella Flusso per curve - SOLO lungo la curva 90°
  const CurveFlowParticle = ({ offset }: { offset: number }) => {
    // Progresso lungo la curva (0 = inizio curva, 1 = fine curva)
    const curveProgress = ((flowOffset + offset * 30) % 100) / 100;
    
    // Gestione degli angoli (alcuni attraversano lo zero)
    let actualStartAngle = startAngle;
    let actualEndAngle = endAngle;
    
    // Per curve che attraversano 0° (es. top-left: 270° -> 0°)
    if (endAngle < startAngle) {
      actualEndAngle = endAngle + 360;
    }
    
    // Calcola l'angolo corrente lungo SOLO la curva
    const currentAngle = actualStartAngle + (actualEndAngle - actualStartAngle) * curveProgress;
    
    // Normalizza l'angolo
    const normalizedAngle = currentAngle > 360 ? currentAngle - 360 : currentAngle;
    
    const x = centerX + Math.cos(normalizedAngle * Math.PI / 180) * radius;
    const y = centerY + Math.sin(normalizedAngle * Math.PI / 180) * radius;
    
    return (
      <circle
        cx={x}
        cy={y}
        r={NITROGEN_ELBOW_CONFIG.particleSize * 0.7}
        fill={NITROGEN_ELBOW_CONFIG.colors.withFlow.flowParticle}
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
  };

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={svgWidth} 
        height={svgHeight}
      >
        {/* Definizione gradienti 3D */}
        <defs>
          {/* Gradiente tubazione */}
          <linearGradient id={`elbow-gradient-${direction}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={currentColors.pipeHighlight} />
            <stop offset="50%" stopColor={currentColors.pipe} />
            <stop offset="100%" stopColor={currentColors.pipeShadow} />
          </linearGradient>

          {/* Gradiente flusso animato */}
          <linearGradient id="elbow-flow-gradient">
            <stop offset="0%" stopColor={NITROGEN_ELBOW_CONFIG.colors.withFlow.flow} stopOpacity="0" />
            <stop offset="50%" stopColor={NITROGEN_ELBOW_CONFIG.colors.withFlow.flow} stopOpacity="0.6" />
            <stop offset="100%" stopColor={NITROGEN_ELBOW_CONFIG.colors.withFlow.flow} stopOpacity="0" />
          </linearGradient>

          {/* Ombra */}
          <filter id="elbow-shadow" x="-50%" y="-50%" width="200%" height="200%">
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

        {/* Ombra curva */}
        <path
          d={pathData}
          fill="none"
          stroke={currentColors.pipeShadow}
          strokeWidth={diameter}
          strokeLinecap="butt"
          opacity={0.4}
          transform={`translate(${NITROGEN_ELBOW_CONFIG.shadowOffset}, ${NITROGEN_ELBOW_CONFIG.shadowOffset})`}
        />
        
        {/* Tubazione curva principale */}
        <path
          d={pathData}
          fill="none"
          stroke={`url(#elbow-gradient-${direction})`}
          strokeWidth={diameter}
          strokeLinecap="butt"
        />
        
        {/* Bordo curva */}
        <path
          d={pathData}
          fill="none"
          stroke={NITROGEN_ELBOW_CONFIG.colors.border}
          strokeWidth={2}
          strokeLinecap="butt"
        />

        {/* Riflesso curva */}
        <path
          d={pathData}
          fill="none"
          stroke="white"
          strokeWidth={diameter/3}
          strokeLinecap="butt"
          opacity={0.4}
        />

        {/* Flusso animato curva - solo interno */}
        {hasFlow && (
          <g>
            {/* Linea di flusso animata interna */}
            <path
              d={pathData}
              fill="none"
              stroke={NITROGEN_ELBOW_CONFIG.colors.withFlow.flow}
              strokeWidth={diameter/4}
              strokeLinecap="butt"
              opacity={0.7}
              strokeDasharray="8 4"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;12"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </path>
            
            {/* Particelle animate lungo la curva interna */}
            {Array.from({ length: NITROGEN_ELBOW_CONFIG.particleCount }, (_, i) => (
              <CurveFlowParticle
                key={i}
                offset={i * 0.4}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
};

export default NitrogenElbow;
