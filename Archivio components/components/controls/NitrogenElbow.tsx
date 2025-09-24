import React, { useState, useEffect } from 'react';

// Configurazione curve azoto (semplificata)
const CURVED_PIPE_CONFIG = {
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
    border: "#1F2937",         // grigio molto scuro per bordi
    text: "#1F2937"
  },
  
  // Animazione flusso
  flowSpeed: 2,
  particleCount: 3,
  particleSize: 3,
  
  // Stili
  strokeWidth: 2,
  shadowOffset: 3,
  fontSize: {
    label: 10,
    status: 8
  }
};

type CurveDirection = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface CurvedPipeProps {
  // Direzione della curva
  direction: CurveDirection;
  
  // Stato del flusso
  hasFlow: boolean;
  
  // Configurazione dimensioni
  diameter?: number;
  radius?: number;
  
  // Configurazione
  label?: string;
  
  // Styling opzionale
  size?: number;
  className?: string;
}

const CurvedPipe: React.FC<CurvedPipeProps> = ({
  direction,
  hasFlow,
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
        setFlowOffset(prev => (prev + CURVED_PIPE_CONFIG.flowSpeed) % 100);
      }, 50);
      return () => clearInterval(interval);
    } else {
      setFlowOffset(0);
    }
  }, [hasFlow]);

  // Dimensioni scalate
  const diameter = (customDiameter || CURVED_PIPE_CONFIG.defaultDiameter) * size;
  const radius = (customRadius || CURVED_PIPE_CONFIG.defaultRadius) * size;
  
  // Colori attuali basati sullo stato
  const currentColors = hasFlow ? 
    CURVED_PIPE_CONFIG.colors.withFlow : 
    CURVED_PIPE_CONFIG.colors.noFlow;
  
  // Calcolo dimensioni SVG
  const svgWidth = radius * 2 + diameter + 40;
  const svgHeight = radius * 2 + diameter + 60;
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
    }
  };

  const { startAngle, endAngle } = getAngles();

  // Calcolo punti di inizio e fine
  const startX = centerX + Math.cos(startAngle * Math.PI / 180) * radius;
  const startY = centerY + Math.sin(startAngle * Math.PI / 180) * radius;
  const endX = centerX + Math.cos(endAngle * Math.PI / 180) * radius;
  const endY = centerY + Math.sin(endAngle * Math.PI / 180) * radius;

  // Path della curva
  const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

  // Componente Particella Flusso per curve
  const CurveFlowParticle = ({ offset }: { offset: number }) => {
    // Calcola la posizione lungo la curva
    const angle = startAngle + ((endAngle - startAngle) * ((flowOffset + offset * 33.33) % 100) / 100);
    const x = centerX + Math.cos(angle * Math.PI / 180) * radius;
    const y = centerY + Math.sin(angle * Math.PI / 180) * radius;
    
    return (
      <circle
        cx={x}
        cy={y}
        r={CURVED_PIPE_CONFIG.particleSize}
        fill={CURVED_PIPE_CONFIG.colors.withFlow.flowParticle}
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
          <linearGradient id={`curved-pipe-gradient-${label}-${direction}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={currentColors.pipeHighlight} />
            <stop offset="50%" stopColor={currentColors.pipe} />
            <stop offset="100%" stopColor={currentColors.pipeShadow} />
          </linearGradient>

          {/* Gradiente flusso animato */}
          <linearGradient id={`curved-flow-gradient-${label}`}>
            <stop offset="0%" stopColor={CURVED_PIPE_CONFIG.colors.withFlow.flow} stopOpacity="0" />
            <stop offset="50%" stopColor={CURVED_PIPE_CONFIG.colors.withFlow.flow} stopOpacity="0.6" />
            <stop offset="100%" stopColor={CURVED_PIPE_CONFIG.colors.withFlow.flow} stopOpacity="0" />
          </linearGradient>

          {/* Ombra */}
          <filter id={`shadow-curved-pipe-${label}`} x="-50%" y="-50%" width="200%" height="200%">
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
          strokeWidth={diameter + 6}
          strokeLinecap="butt" // Estremità squadrate
          opacity={0.4}
          transform={`translate(${CURVED_PIPE_CONFIG.shadowOffset}, ${CURVED_PIPE_CONFIG.shadowOffset})`}
        />
        
        {/* Tubazione curva principale */}
        <path
          d={pathData}
          fill="none"
          stroke={`url(#curved-pipe-gradient-${label}-${direction})`}
          strokeWidth={diameter}
          strokeLinecap="butt" // Estremità squadrate, non arrotondate
          filter={`url(#shadow-curved-pipe-${label})`}
        />

        {/* Riflesso curva */}
        <path
          d={pathData}
          fill="none"
          stroke="white"
          strokeWidth={diameter/3}
          strokeLinecap="butt" // Estremità squadrate
          opacity={0.4}
        />

        {/* Flusso animato curva */}
        {hasFlow && (
          <g>
            {/* Linea di flusso animata */}
            <path
              d={pathData}
              fill="none"
              stroke={CURVED_PIPE_CONFIG.colors.withFlow.flow}
              strokeWidth={6}
              strokeLinecap="butt"
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
            
            {/* Particelle animate lungo la curva */}
            {Array.from({ length: CURVED_PIPE_CONFIG.particleCount }, (_, i) => (
              <CurveFlowParticle
                key={i}
                offset={i * 0.3}
              />
            ))}
          </g>
        )}

        {/* Indicatore stato flusso */}
        <g>
          <circle
            cx={20}
            cy={20}
            r={8}
            fill={hasFlow ? CURVED_PIPE_CONFIG.colors.withFlow.flow : CURVED_PIPE_CONFIG.colors.noFlow.pipe}
            stroke={CURVED_PIPE_CONFIG.colors.border}
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

        {/* Etichetta */}
        {label && (
          <g>
            <text
              x={centerX}
              y={svgHeight - 10}
              textAnchor="middle"
              fontSize={CURVED_PIPE_CONFIG.fontSize.label}
              fontWeight="bold"
              fill={CURVED_PIPE_CONFIG.colors.text}
            >
              {label}
            </text>
            
            {/* Stato flusso */}
            <text
              x={centerX}
              y={svgHeight - 25}
              textAnchor="middle"
              fontSize={CURVED_PIPE_CONFIG.fontSize.status}
              fill={hasFlow ? CURVED_PIPE_CONFIG.colors.withFlow.flow : CURVED_PIPE_CONFIG.colors.noFlow.pipe}
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

// Demo per mostrare tutti gli orientamenti
const CurvedPipeDemo: React.FC = () => {
  const [flowStates, setFlowStates] = useState({
    topRight: true,
    topLeft: false,
    bottomLeft: true,
    bottomRight: false
  });

  // Simulazione automatica
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    if (autoMode) {
      const interval = setInterval(() => {
        // Cambio casuale degli stati
        if (Math.random() > 0.8) {
          setFlowStates(prev => ({
            ...prev,
            topRight: !prev.topRight
          }));
        }
        if (Math.random() > 0.85) {
          setFlowStates(prev => ({
            ...prev,
            topLeft: !prev.topLeft
          }));
        }
        if (Math.random() > 0.9) {
          setFlowStates(prev => ({
            ...prev,
            bottomLeft: !prev.bottomLeft
          }));
        }
        if (Math.random() > 0.87) {
          setFlowStates(prev => ({
            ...prev,
            bottomRight: !prev.bottomRight
          }));
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [autoMode]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Tubazioni Azoto - Curve 90° Semplici
        </h1>
        
        {/* Pannello controlli */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Controlli Demo</h2>
          <div className="flex items-center gap-6 mb-4">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Alto-Destra', key: 'topRight', flow: flowStates.topRight },
              { label: 'Alto-Sinistra', key: 'topLeft', flow: flowStates.topLeft },
              { label: 'Basso-Sinistra', key: 'bottomLeft', flow: flowStates.bottomLeft },
              { label: 'Basso-Destra', key: 'bottomRight', flow: flowStates.bottomRight }
            ].map((curve) => (
              <button
                key={curve.key}
                onClick={() => setFlowStates(prev => ({ ...prev, [curve.key]: !prev[curve.key] }))}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  curve.flow 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {curve.label}: {curve.flow ? 'ON' : 'OFF'}
              </button>
            ))}
          </div>
        </div>

        {/* Curve 90° - 4 orientamenti */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Curve 90° - Quattro Orientamenti</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Curva top-right */}
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Alto-Destra</h3>
              <div className="flex justify-center">
                <CurvedPipe
                  direction="top-right"
                  hasFlow={flowStates.topRight}
                  label="C-TR"
                  size={0.8}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Da sinistra verso l'alto</p>
            </div>

            {/* Curva top-left */}
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Alto-Sinistra</h3>
              <div className="flex justify-center">
                <CurvedPipe
                  direction="top-left"
                  hasFlow={flowStates.topLeft}
                  label="C-TL"
                  size={0.8}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Dall'alto verso destra</p>
            </div>

            {/* Curva bottom-left */}
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Basso-Sinistra</h3>
              <div className="flex justify-center">
                <CurvedPipe
                  direction="bottom-left"
                  hasFlow={flowStates.bottomLeft}
                  label="C-BL"
                  size={0.8}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Da destra verso il basso</p>
            </div>

            {/* Curva bottom-right */}
            <div className="text-center">
              <h3 className="text-sm font-semibent mb-3 text-gray-700">Basso-Destra</h3>
              <div className="flex justify-center">
                <CurvedPipe
                  direction="bottom-right"
                  hasFlow={flowStates.bottomRight}
                  label="C-BR"
                  size={0.8}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Dal basso verso sinistra</p>
            </div>
          </div>
        </div>

        {/* Esempi con dimensioni diverse */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Variazioni Dimensioni</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Raggio Piccolo</h3>
              <div className="flex justify-center">
                <CurvedPipe
                  direction="top-right"
                  hasFlow={true}
                  radius={25}
                  diameter={15}
                  label="SMALL"
                  size={0.7}
                />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Raggio Standard</h3>
              <div className="flex justify-center">
                <CurvedPipe
                  direction="bottom-left"
                  hasFlow={true}
                  label="STANDARD"
                  size={0.7}
                />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Raggio Grande</h3>
              <div className="flex justify-center">
                <CurvedPipe
                  direction="top-left"
                  hasFlow={false}
                  radius={60}
                  diameter={30}
                  label="LARGE"
                  size={0.7}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Informazioni tecniche */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Curve Azoto - Specifiche Semplificate</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Orientamenti Disponibili:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Alto-Destra:</strong> Sinistra → Alto</div>
                <div>• <strong>Alto-Sinistra:</strong> Alto → Destra</div>
                <div>• <strong>Basso-Sinistra:</strong> Destra → Basso</div>
                <div>• <strong>Basso-Destra:</strong> Basso → Sinistra</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Caratteristiche:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Senza flange:</strong> Estremità pulite</div>
                <div>• <strong>Estremità squadrate:</strong> Taglio netto</div>
                <div>• <strong>Curve 90°:</strong> Angolo fisso perfetto</div>
                <div>• <strong>Dimensioni:</strong> Raggio e diametro configurabili</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Animazioni Flusso:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Particelle curve:</strong> Seguono il percorso</div>
                <div>• <strong>Linee tratteggiate:</strong> Indicazione direzione</div>
                <div>• <strong>Colore dinamico:</strong> Blu=flusso, Grigio=fermo</div>
                <div>• <strong>Riflessi 3D:</strong> Effetto metallico realistico</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurvedPipeDemo;
