import React, { useState, useEffect } from 'react';

// Configurazione tubazioni azoto (facilmente modificabile)
const NITROGEN_PIPE_CONFIG = {
  // Dimensioni base
  defaultLength: 120,
  defaultDiameter: 20,
  defaultRadius: 40,
  flangeSize: 8,
  
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
    flange: "#708090",         // grigio ardesia per flange
    flangeHighlight: "#C0C0C0", // argento per riflessi flange
    border: "#1F2937",         // grigio molto scuro per bordi
    text: "#1F2937"
  },
  
  // Animazione flusso
  flowSpeed: 2, // velocità particelle
  particleCount: 5,
  particleSize: 3,
  
  // Testo e etichette
  showLabel: true,
  showFlowIndicator: true,
  
  // Stili 3D
  strokeWidth: 2,
  shadowOffset: 3,
  fontSize: {
    label: 10,
    status: 8
  }
};

type PipeType = 'straight' | 'curve';
type StraightOrientation = 'horizontal' | 'vertical';
type CurveDirection = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface NitrogenPipeProps {
  // Tipo di tubazione
  type: PipeType;
  
  // Orientamento per dritte
  orientation?: StraightOrientation;
  
  // Direzione per curve
  direction?: CurveDirection;
  
  // Stato del flusso
  hasFlow: boolean;
  
  // Configurazione dimensioni
  length?: number;
  diameter?: number;
  radius?: number;
  
  // Configurazione
  label?: string;
  
  // Styling opzionale
  size?: number;
  className?: string;
}

const NitrogenPipe: React.FC<NitrogenPipeProps> = ({
  type,
  orientation = 'horizontal',
  direction = 'top-right',
  hasFlow,
  length: customLength,
  diameter: customDiameter,
  radius: customRadius,
  label,
  size = 1,
  className = ""
}) => {
  const [flowOffset, setFlowOffset] = useState(0);

  // Animazione flusso
  useEffect(() => {
    if (hasFlow) {
      const interval = setInterval(() => {
        setFlowOffset(prev => (prev + NITROGEN_PIPE_CONFIG.flowSpeed) % 100);
      }, 50);
      return () => clearInterval(interval);
    } else {
      setFlowOffset(0);
    }
  }, [hasFlow]);

  // Dimensioni scalate
  const length = (customLength || NITROGEN_PIPE_CONFIG.defaultLength) * size;
  const diameter = (customDiameter || NITROGEN_PIPE_CONFIG.defaultDiameter) * size;
  const radius = (customRadius || NITROGEN_PIPE_CONFIG.defaultRadius) * size;
  const flangeSize = NITROGEN_PIPE_CONFIG.flangeSize * size;
  
  // Colori attuali basati sullo stato
  const currentColors = hasFlow ? 
    NITROGEN_PIPE_CONFIG.colors.withFlow : 
    NITROGEN_PIPE_CONFIG.colors.noFlow;
  
  // Calcolo dimensioni SVG
  const getSVGDimensions = () => {
    if (type === 'straight') {
      if (orientation === 'horizontal') {
        return {
          width: length + flangeSize * 2 + 40,
          height: diameter + 60
        };
      } else {
        return {
          width: diameter + 60,
          height: length + flangeSize * 2 + 40
        };
      }
    } else {
      // curve
      return {
        width: radius * 2 + diameter + 60,
        height: radius * 2 + diameter + 60
      };
    }
  };
  
  const { width: svgWidth, height: svgHeight } = getSVGDimensions();
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Componente Flangia
  const Flange = ({ x, y, isVertical = false }: { x: number; y: number; isVertical?: boolean }) => (
    <g>
      {/* Ombra flangia */}
      <ellipse
        cx={x + NITROGEN_PIPE_CONFIG.shadowOffset}
        cy={y + NITROGEN_PIPE_CONFIG.shadowOffset}
        rx={isVertical ? diameter/2 + flangeSize : flangeSize}
        ry={isVertical ? flangeSize : diameter/2 + flangeSize}
        fill={NITROGEN_PIPE_CONFIG.colors.pipeShadow}
        opacity={0.4}
      />
      
      {/* Flangia principale */}
      <ellipse
        cx={x}
        cy={y}
        rx={isVertical ? diameter/2 + flangeSize : flangeSize}
        ry={isVertical ? flangeSize : diameter/2 + flangeSize}
        fill={NITROGEN_PIPE_CONFIG.colors.flange}
        stroke={NITROGEN_PIPE_CONFIG.colors.border}
        strokeWidth={1}
      />
      
      {/* Riflesso flangia */}
      <ellipse
        cx={x - 2}
        cy={y - 2}
        rx={isVertical ? diameter/4 + flangeSize/2 : flangeSize/2}
        ry={isVertical ? flangeSize/2 : diameter/4 + flangeSize/2}
        fill={NITROGEN_PIPE_CONFIG.colors.flangeHighlight}
        opacity={0.6}
      />
      
      {/* Bulloni */}
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const boltRadius = isVertical ? flangeSize * 0.7 : flangeSize * 0.7;
        const boltX = x + Math.cos(rad) * boltRadius;
        const boltY = y + Math.sin(rad) * boltRadius;
        
        return (
          <circle
            key={i}
            cx={boltX}
            cy={boltY}
            r={2}
            fill={NITROGEN_PIPE_CONFIG.colors.pipeShadow}
            stroke={NITROGEN_PIPE_CONFIG.colors.border}
            strokeWidth={0.5}
          />
        );
      })}
    </g>
  );

  // Componente Particella Flusso
  const FlowParticle = ({ x, y, offset }: { x: number; y: number; offset: number }) => (
    <circle
      cx={x}
      cy={y}
      r={NITROGEN_PIPE_CONFIG.particleSize}
      fill={NITROGEN_PIPE_CONFIG.colors.flowParticle}
      opacity={0.8}
    >
      <animate
        attributeName="opacity"
        values="0.3;0.8;0.3"
        dur="1s"
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
          <linearGradient id={`pipe-gradient-${label}-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={currentColors.pipeHighlight} />
            <stop offset="50%" stopColor={currentColors.pipe} />
            <stop offset="100%" stopColor={currentColors.pipeShadow} />
          </linearGradient>

          {/* Gradiente flusso animato */}
          <linearGradient id={`flow-gradient-${label}`}>
            <stop offset="0%" stopColor={NITROGEN_PIPE_CONFIG.colors.flow} stopOpacity="0" />
            <stop offset="50%" stopColor={NITROGEN_PIPE_CONFIG.colors.flow} stopOpacity="0.6" />
            <stop offset="100%" stopColor={NITROGEN_PIPE_CONFIG.colors.flow} stopOpacity="0" />
          </linearGradient>

          {/* Ombra */}
          <filter id={`shadow-pipe-${label}`} x="-50%" y="-50%" width="200%" height="200%">
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

        {type === 'straight' ? (
          <g>
            {/* Tubazione dritta */}
            {orientation === 'horizontal' ? (
              <g>
                {/* Ombra tubazione orizzontale */}
                <rect
                  x={centerX - length/2 + NITROGEN_PIPE_CONFIG.shadowOffset}
                  y={centerY - diameter/2 + NITROGEN_PIPE_CONFIG.shadowOffset}
                  width={length}
                  height={diameter}
                  fill={currentColors.pipeShadow}
                  opacity={0.4}
                  rx={diameter/2}
                />
                
                {/* Tubazione orizzontale */}
                <rect
                  x={centerX - length/2}
                  y={centerY - diameter/2}
                  width={length}
                  height={diameter}
                  fill={`url(#pipe-gradient-${label}-${type})`}
                  stroke={NITROGEN_PIPE_CONFIG.colors.border}
                  strokeWidth={NITROGEN_PIPE_CONFIG.strokeWidth}
                  rx={diameter/2}
                  filter={`url(#shadow-pipe-${label})`}
                />

                {/* Riflesso superiore orizzontale */}
                <rect
                  x={centerX - length/2 + 5}
                  y={centerY - diameter/2 + 2}
                  width={length - 10}
                  height={diameter/4}
                  fill="white"
                  opacity={0.4}
                  rx={diameter/8}
                />

                {/* Flusso animato orizzontale */}
                {hasFlow && (
                  <g>
                    {/* Linea di flusso centrale */}
                    <rect
                      x={centerX - length/2}
                      y={centerY - 2}
                      width={length}
                      height={4}
                      fill={`url(#flow-gradient-${label})`}
                      opacity={0.6}
                      rx={2}
                    >
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values={`${-length};${length}`}
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </rect>
                    
                    {/* Particelle animate */}
                    {Array.from({ length: NITROGEN_PIPE_CONFIG.particleCount }, (_, i) => (
                      <FlowParticle
                        key={i}
                        x={centerX - length/2 + (length / NITROGEN_PIPE_CONFIG.particleCount) * i + (flowOffset * length / 100) % length}
                        y={centerY}
                        offset={i * 0.2}
                      />
                    ))}
                  </g>
                )}

                {/* Flange orizzontali */}
                <Flange x={centerX - length/2 - flangeSize} y={centerY} />
                <Flange x={centerX + length/2 + flangeSize} y={centerY} />
              </g>
            ) : (
              <g>
                {/* Ombra tubazione verticale */}
                <rect
                  x={centerX - diameter/2 + NITROGEN_PIPE_CONFIG.shadowOffset}
                  y={centerY - length/2 + NITROGEN_PIPE_CONFIG.shadowOffset}
                  width={diameter}
                  height={length}
                  fill={currentColors.pipeShadow}
                  opacity={0.4}
                  rx={diameter/2}
                />
                
                {/* Tubazione verticale */}
                <rect
                  x={centerX - diameter/2}
                  y={centerY - length/2}
                  width={diameter}
                  height={length}
                  fill={`url(#pipe-gradient-${label}-${type})`}
                  stroke={NITROGEN_PIPE_CONFIG.colors.border}
                  strokeWidth={NITROGEN_PIPE_CONFIG.strokeWidth}
                  rx={diameter/2}
                  filter={`url(#shadow-pipe-${label})`}
                />

                {/* Riflesso laterale verticale */}
                <rect
                  x={centerX - diameter/2 + 2}
                  y={centerY - length/2 + 5}
                  width={diameter/4}
                  height={length - 10}
                  fill="white"
                  opacity={0.4}
                  rx={diameter/8}
                />

                {/* Flusso animato verticale */}
                {hasFlow && (
                  <g>
                    {/* Linea di flusso centrale */}
                    <rect
                      x={centerX - 2}
                      y={centerY - length/2}
                      width={4}
                      height={length}
                      fill={`url(#flow-gradient-${label})`}
                      opacity={0.6}
                      rx={2}
                    >
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values={`0,${-length};0,${length}`}
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </rect>
                    
                    {/* Particelle animate */}
                    {Array.from({ length: NITROGEN_PIPE_CONFIG.particleCount }, (_, i) => (
                      <FlowParticle
                        key={i}
                        x={centerX}
                        y={centerY - length/2 + (length / NITROGEN_PIPE_CONFIG.particleCount) * i + (flowOffset * length / 100) % length}
                        offset={i * 0.2}
                      />
                    ))}
                  </g>
                )}

                {/* Flange verticali */}
                <Flange x={centerX} y={centerY - length/2 - flangeSize} isVertical={true} />
                <Flange x={centerX} y={centerY + length/2 + flangeSize} isVertical={true} />
              </g>
            )}
          </g>
        ) : (
          <g>
            {/* Tubazione curva 90° */}
            {(() => {
              const startAngle = direction === 'top-right' ? 180 : 
                                direction === 'top-left' ? 270 : 
                                direction === 'bottom-left' ? 0 : 90;
              const endAngle = startAngle + 90;
              
              const pathData = `
                M ${centerX + Math.cos(startAngle * Math.PI / 180) * radius} ${centerY + Math.sin(startAngle * Math.PI / 180) * radius}
                A ${radius} ${radius} 0 0 1 ${centerX + Math.cos(endAngle * Math.PI / 180) * radius} ${centerY + Math.sin(endAngle * Math.PI / 180) * radius}
              `;

              return (
                <g>
                  {/* Ombra curva */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={currentColors.pipeShadow}
                    strokeWidth={diameter + 6}
                    strokeLinecap="round"
                    opacity={0.4}
                    transform={`translate(${NITROGEN_PIPE_CONFIG.shadowOffset}, ${NITROGEN_PIPE_CONFIG.shadowOffset})`}
                  />
                  
                  {/* Tubazione curva principale */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={`url(#pipe-gradient-${label}-${type})`}
                    strokeWidth={diameter}
                    strokeLinecap="round"
                    filter={`url(#shadow-pipe-${label})`}
                  />

                  {/* Riflesso curva */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="white"
                    strokeWidth={diameter/3}
                    strokeLinecap="round"
                    opacity={0.4}
                  />

                  {/* Flusso animato curva */}
                  {hasFlow && (
                    <g>
                      <path
                        d={pathData}
                        fill="none"
                        stroke={NITROGEN_PIPE_CONFIG.colors.flow}
                        strokeWidth={6}
                        strokeLinecap="round"
                        opacity={0.6}
                        strokeDasharray="10 5"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          values="0;15"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </g>
                  )}

                  {/* Flange curve */}
                  <Flange 
                    x={centerX + Math.cos(startAngle * Math.PI / 180) * radius} 
                    y={centerY + Math.sin(startAngle * Math.PI / 180) * radius}
                  />
                  <Flange 
                    x={centerX + Math.cos(endAngle * Math.PI / 180) * radius} 
                    y={centerY + Math.sin(endAngle * Math.PI / 180) * radius}
                  />
                </g>
              );
            })()}
          </g>
        )}

        {/* Indicatore stato flusso */}
        {NITROGEN_PIPE_CONFIG.showFlowIndicator && (
          <g>
            <circle
              cx={20}
              cy={20}
              r={8}
              fill={hasFlow ? NITROGEN_PIPE_CONFIG.colors.flow : NITROGEN_PIPE_CONFIG.colors.noFlow.pipe}
              stroke={NITROGEN_PIPE_CONFIG.colors.border}
              strokeWidth={1}
            />
            <text
              x={20}
              y={24}
              textAnchor="middle"
              fontSize={6}
              fontWeight="bold"
              fill="white"
            >
              N₂
            </text>
          </g>
        )}

        {/* Etichetta */}
        {NITROGEN_PIPE_CONFIG.showLabel && label && (
          <g>
            <text
              x={centerX}
              y={svgHeight - 10}
              textAnchor="middle"
              fontSize={NITROGEN_PIPE_CONFIG.fontSize.label}
              fontWeight="bold"
              fill={NITROGEN_PIPE_CONFIG.colors.text}
            >
              {label}
            </text>
            
            {/* Stato flusso */}
            <text
              x={centerX}
              y={svgHeight - 25}
              textAnchor="middle"
              fontSize={NITROGEN_PIPE_CONFIG.fontSize.status}
              fill={hasFlow ? NITROGEN_PIPE_CONFIG.colors.flow : NITROGEN_PIPE_CONFIG.colors.noFlow.pipe}
              fontWeight="bold"
            >
              {hasFlow ? 'FLUSSO ATTIVO' : 'NESSUN FLUSSO'}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

// Componente Demo per mostrare tutti i tipi
const NitrogenPipeDemo: React.FC = () => {
  const [pipe1Flow, setPipe1Flow] = useState(true);
  const [pipe2Flow, setPipe2Flow] = useState(false);
  const [pipe3Flow, setPipe3Flow] = useState(true);
  const [pipe4Flow, setPipe4Flow] = useState(false);
  const [pipe5Flow, setPipe5Flow] = useState(true);
  const [pipe6Flow, setPipe6Flow] = useState(false);

  // Simulazione automatica
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    if (autoMode) {
      const interval = setInterval(() => {
        // Simulazione cambio stati flusso
        if (Math.random() > 0.8) {
          setPipe1Flow(prev => !prev);
        }
        if (Math.random() > 0.85) {
          setPipe2Flow(prev => !prev);
        }
        if (Math.random() > 0.9) {
          setPipe3Flow(prev => !prev);
        }
        if (Math.random() > 0.87) {
          setPipe4Flow(prev => !prev);
        }
        if (Math.random() > 0.82) {
          setPipe5Flow(prev => !prev);
        }
        if (Math.random() > 0.88) {
          setPipe6Flow(prev => !prev);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoMode]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Tubazioni Azoto - Sistema Modulare
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
                ● Simulazione attiva - cambio stati flusso casuale
              </span>
            )}
          </div>
          
          {/* Controlli manuali */}
          <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { label: 'Tubo 1', flow: pipe1Flow, setFlow: setPipe1Flow },
              { label: 'Tubo 2', flow: pipe2Flow, setFlow: setPipe2Flow },
              { label: 'Tubo 3', flow: pipe3Flow, setFlow: setPipe3Flow },
              { label: 'Tubo 4', flow: pipe4Flow, setFlow: setPipe4Flow },
              { label: 'Tubo 5', flow: pipe5Flow, setFlow: setPipe5Flow },
              { label: 'Tubo 6', flow: pipe6Flow, setFlow: setPipe6Flow }
            ].map((pipe, index) => (
              <button
                key={index}
                onClick={() => pipe.setFlow(!pipe.flow)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  pipe.flow 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {pipe.label}: {pipe.flow ? 'ON' : 'OFF'}
              </button>
            ))}
          </div>
        </div>

        {/* Tubazioni dritte */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Tubazioni Dritte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Orizzontale con flusso */}
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Orizzontale - Con Flusso</h3>
              <div className="flex justify-center">
                <NitrogenPipe
                  type="straight"
                  orientation="horizontal"
                  hasFlow={pipe1Flow}
                  length={100}
                  label="H-001"
                  size={0.8}
                />
              </div>
            </div>

            {/* Orizzontale senza flusso */}
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Orizzontale - Senza Flusso</h3>
              <div className="flex justify-center">
                <NitrogenPipe
                  type="straight"
                  orientation="horizontal"
                  hasFlow={pipe2Flow}
                  length={100}
                  label="H-002"
                  size={0.8}
                />
              </div>
            </div>

            {/* Verticale con flusso */}
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Verticale - Con Flusso</h3>
              <div className="flex justify-center">
                <NitrogenPipe
                  type="straight"
                  orientation="vertical"
                  hasFlow={pipe3Flow}
                  length={80}
                  label="V-001"
                  size={0.8}
                />
              </div>
            </div>

            {/* Verticale senza flusso */}
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Verticale - Senza Flusso</h3>
              <div className="flex justify-center">
                <NitrogenPipe
                  type="straight"
                  orientation="vertical"
                  hasFlow={pipe4Flow}
                  length={80}
                  label="V-002"
                  size={0.8}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tubazioni curve */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Tubazioni Curve 90°</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Curva top-right */}
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Alto-Destra</h3>
              <div className="flex justify-center">
                <NitrogenPipe
                  type="curve"
                  direction="top-right"
                  hasFlow={pipe5Flow}
                  radius={30}
                  label="C-TR"
                  size={0.7}
                />
              </div>
            </div>

            {/* Curva top-left */}
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Alto-Sinistra</h3>
              <div className="flex justify-center">
                <NitrogenPipe
                  type="curve"
                  direction="top-left"
                  hasFlow={pipe6Flow}
                  radius={30}
                  label="C-TL"
                  size={0.7}
                />
              </div>
            </div>

            {/* Curva bottom-left */}
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Basso-Sinistra</h3>
              <div className="flex justify-center">
                <NitrogenPipe
                  type="curve"
                  direction="bottom-left"
                  hasFlow={true}
                  radius={30}
                  label="C-BL"
                  size={0.7}
                />
              </div>
            </div>

            {/* Curva bottom-right */}
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Basso-Destra</h3>
              <div className="flex justify-center">
                <NitrogenPipe
                  type="curve"
                  direction="bottom-right"
                  hasFlow={false}
                  radius={30}
                  label="C-BR"
                  size={0.7}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Esempio sistema combinato */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Esempio Sistema Combinato</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Tubazione Lunga</h3>
              <NitrogenPipe
                type="straight"
                orientation="horizontal"
                hasFlow={true}
                length={150}
                diameter={25}
                label="MAIN-001"
                size={0.6}
              />
            </div>

            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Curva Grande</h3>
              <NitrogenPipe
                type="curve"
                direction="top-right"
                hasFlow={true}
                radius={50}
                diameter={25}
                label="BEND-001"
                size={0.6}
              />
            </div>

            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Tubazione Spessa</h3>
              <NitrogenPipe
                type="straight"
                orientation="vertical"
                hasFlow={false}
                length={100}
                diameter={35}
                label="FEED-001"
                size={0.6}
              />
            </div>
          </div>
        </div>

        {/* Informazioni tecniche */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Tubazioni Azoto - Specifiche Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Tipi Disponibili:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Dritte:</strong> Orizzontali e verticali</div>
                <div>• <strong>Curve 90°:</strong> 4 direzioni disponibili</div>
                <div>• <strong>Dimensioni:</strong> Lunghezza e diametro configurabili</div>
                <div>• <strong>Flange:</strong> Con bulloni alle estremità</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Stati Flusso:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span><strong>Con Flusso:</strong> Blu + animazioni</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span><strong>Senza Flusso:</strong> Grigio statico</span>
                </div>
                <div>• <strong>Particelle animate:</strong> Scorrimento azoto</div>
                <div>• <strong>Linee di flusso:</strong> Indicazione direzione</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Caratteristiche 3D:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Superficie metallica:</strong> Gradienti realistici</div>
                <div>• <strong>Riflessi:</strong> Highlight superiori/laterali</div>
                <div>• <strong>Ombreggiature:</strong> Profondità tridimensionale</div>
                <div>• <strong>Componente unico:</strong> Configurazione modulare</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NitrogenPipeDemo;
