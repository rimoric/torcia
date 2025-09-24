import React, { useState, useEffect } from 'react';

// Configurazione torcia GPL (facilmente modificabile)
const FLARE_TORCH_CONFIG = {
  // Dimensioni base
  stackWidth: 15,      
  stackHeight: 40,     // Ridotto da 80 (metà)
  baseWidth: 60,
  baseHeight: 30,
  
  // Colori per stati
  colors: {
    lit: {
      primary: "#FF4500",      // arancione intenso
      secondary: "#FF6347",    // rosso-arancione
      highlight: "#FFD700",    // giallo oro
      shadow: "#8B0000"        // rosso scuro
    },
    off: {
      primary: "#6B7280",      // grigio
      secondary: "#4B5563",    // grigio scuro
      highlight: "#9CA3AF",    // grigio chiaro
      shadow: "#374151"        // grigio molto scuro
    },
    structure: "#8B8B8B",      // grigio metallico
    structureHighlight: "#D3D3D3", // grigio chiaro metallico
    structureShadow: "#2F2F2F", // grigio molto scuro
    border: "#1F2937",         // grigio molto scuro per bordi
    text: "#1F2937",
    pilot: "#0066FF"           // blu per pilot light
  },
  
  // Colori fiamma (gradiente dal basso verso l'alto)
  flameColors: {
    base: "#0066FF",           // blu alla base
    middle1: "#FF4500",        // arancione
    middle2: "#FF6347",        // rosso-arancione
    tip: "#FFD700"             // giallo in punta
  },
  
  // Pilot light
  pilotSize: 8,
  
  // Testo e etichette
  showStateText: true,
  showLabel: true,
  
  // Stili 3D
  strokeWidth: 2,
  shadowOffset: 4,
  fontSize: {
    state: 10,
    label: 12
  }
};

interface FlareTorchProps {
  // Stato della torcia
  isLit: boolean;
  
  // Configurazione
  label?: string;
  orientation?: 'vertical' | 'horizontal';
  
  // Controlli (solo per demo)
  manualControlEnabled?: boolean;
  onToggle?: () => void;
  
  // Styling opzionale
  size?: number;
  className?: string;
}

const FlareTorch: React.FC<FlareTorchProps> = ({
  isLit,
  label = "FT001",
  orientation = 'vertical',
  manualControlEnabled = false,
  onToggle,
  size = 1,
  className = ""
}) => {
  const [flameIntensity, setFlameIntensity] = useState(1);
  const [pilotFlicker, setPilotFlicker] = useState(1);

  // Animazione fiamma
  useEffect(() => {
    if (isLit) {
      const interval = setInterval(() => {
        setFlameIntensity(0.8 + Math.random() * 0.4); // Varia tra 0.8 e 1.2
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isLit]);

  // Animazione pilot light (sempre attiva)
  useEffect(() => {
    const interval = setInterval(() => {
      setPilotFlicker(0.7 + Math.random() * 0.6); // Varia tra 0.7 e 1.3
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Dimensioni scalate
  const stackWidth = FLARE_TORCH_CONFIG.stackWidth * size;
  const stackHeight = FLARE_TORCH_CONFIG.stackHeight * size;
  const baseWidth = FLARE_TORCH_CONFIG.baseWidth * size;
  const baseHeight = FLARE_TORCH_CONFIG.baseHeight * size;
  const pilotSize = FLARE_TORCH_CONFIG.pilotSize * size;
  
  // Calcolo dimensioni SVG basate sull'orientamento
  const isVertical = orientation === 'vertical';
  const svgWidth = isVertical ? baseWidth + 80 : stackHeight + baseHeight + 100;
  const svgHeight = isVertical ? stackHeight + baseHeight + 120 : baseWidth + 80;
  
  // Centro del componente
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  // Posizioni componenti
  const getPositions = () => {
    if (isVertical) {
      return {
        base: {
          x: centerX - baseWidth/2,
          y: centerY + stackHeight/2 - 10,
          width: baseWidth,
          height: baseHeight
        },
        stack: {
          x: centerX - stackWidth/2,
          y: centerY - stackHeight/2,
          width: stackWidth,
          height: stackHeight
        },
        pilot: {
          x: centerX,
          y: centerY - stackHeight/2 - 5
        },
        flame: {
          x: centerX,
          y: centerY - stackHeight/2 - 10
        }
      };
    } else {
      return {
        base: {
          x: centerX - stackHeight/2 - baseHeight/2,
          y: centerY - baseWidth/2,
          width: baseHeight,
          height: baseWidth
        },
        stack: {
          x: centerX - stackHeight/2,
          y: centerY - stackWidth/2,
          width: stackHeight,
          height: stackWidth
        },
        pilot: {
          x: centerX + stackHeight/2 + 5,
          y: centerY
        },
        flame: {
          x: centerX + stackHeight/2 + 10,
          y: centerY
        }
      };
    }
  };
  
  const positions = getPositions();
  
  // Gestione click
  const handleClick = () => {
    if (manualControlEnabled && onToggle) {
      onToggle();
    }
  };

  // Componente Fiamma
  const Flame = ({ x, y, intensity, large = false }: { x: number; y: number; intensity: number; large?: boolean }) => {
    const flameWidth = large ? 30 * intensity * size : 12 * intensity * size;
    const flameHeight = large ? 60 * intensity * size : 15 * intensity * size;
    
    if (isVertical) {
      return (
        <g>
          {/* Fiamma principale */}
          <ellipse
            cx={x}
            cy={y - flameHeight/2}
            rx={flameWidth/2}
            ry={flameHeight/2}
            fill={`url(#flame-gradient-${label})`}
            opacity={0.9}
          />
          {/* Centro più intenso */}
          <ellipse
            cx={x}
            cy={y - flameHeight/3}
            rx={flameWidth/3}
            ry={flameHeight/3}
            fill={large ? FLARE_TORCH_CONFIG.flameColors.middle1 : FLARE_TORCH_CONFIG.flameColors.pilot}
            opacity={0.8}
          />
          {/* Punta della fiamma */}
          {large && (
            <ellipse
              cx={x}
              cy={y - flameHeight * 0.8}
              rx={flameWidth/4}
              ry={flameHeight/4}
              fill={FLARE_TORCH_CONFIG.flameColors.tip}
              opacity={0.7}
            />
          )}
        </g>
      );
    } else {
      return (
        <g>
          {/* Fiamma principale orizzontale */}
          <ellipse
            cx={x + flameHeight/2}
            cy={y}
            rx={flameHeight/2}
            ry={flameWidth/2}
            fill={`url(#flame-gradient-${label})`}
            opacity={0.9}
          />
          {/* Centro più intenso */}
          <ellipse
            cx={x + flameHeight/3}
            cy={y}
            rx={flameHeight/3}
            ry={flameWidth/3}
            fill={large ? FLARE_TORCH_CONFIG.flameColors.middle1 : FLARE_TORCH_CONFIG.flameColors.pilot}
            opacity={0.8}
          />
          {/* Punta della fiamma */}
          {large && (
            <ellipse
              cx={x + flameHeight * 0.8}
              cy={y}
              rx={flameHeight/4}
              ry={flameWidth/4}
              fill={FLARE_TORCH_CONFIG.flameColors.tip}
              opacity={0.7}
            />
          )}
        </g>
      );
    }
  };

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
          {/* Gradiente struttura metallica */}
          <linearGradient id={`structure-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={FLARE_TORCH_CONFIG.colors.structureHighlight} />
            <stop offset="50%" stopColor={FLARE_TORCH_CONFIG.colors.structure} />
            <stop offset="100%" stopColor={FLARE_TORCH_CONFIG.colors.structureShadow} />
          </linearGradient>

          {/* Gradiente fiamma */}
          <radialGradient id={`flame-gradient-${label}`} cx="50%" cy="70%">
            <stop offset="0%" stopColor={FLARE_TORCH_CONFIG.flameColors.base} />
            <stop offset="30%" stopColor={FLARE_TORCH_CONFIG.flameColors.middle1} />
            <stop offset="70%" stopColor={FLARE_TORCH_CONFIG.flameColors.middle2} />
            <stop offset="100%" stopColor={FLARE_TORCH_CONFIG.flameColors.tip} />
          </radialGradient>

          {/* Gradiente stato (accesa/spenta) */}
          <linearGradient id={`state-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLit ? FLARE_TORCH_CONFIG.colors.lit.highlight : FLARE_TORCH_CONFIG.colors.off.highlight} />
            <stop offset="50%" stopColor={isLit ? FLARE_TORCH_CONFIG.colors.lit.primary : FLARE_TORCH_CONFIG.colors.off.primary} />
            <stop offset="100%" stopColor={isLit ? FLARE_TORCH_CONFIG.colors.lit.shadow : FLARE_TORCH_CONFIG.colors.off.shadow} />
          </linearGradient>

          {/* Ombra */}
          <filter id={`shadow-torch-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="4" dy="4" result="offset" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>

          {/* Effetto calore (distorsione) */}
          <filter id={`heat-effect-${label}`}>
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
          </filter>
        </defs>

        {/* Ombra della base */}
        <rect
          x={positions.base.x + FLARE_TORCH_CONFIG.shadowOffset}
          y={positions.base.y + FLARE_TORCH_CONFIG.shadowOffset}
          width={positions.base.width}
          height={positions.base.height}
          fill={FLARE_TORCH_CONFIG.colors.structureShadow}
          opacity={0.4}
          rx={5}
        />

        {/* Base della torcia */}
        <rect
          x={positions.base.x}
          y={positions.base.y}
          width={positions.base.width}
          height={positions.base.height}
          fill={`url(#structure-gradient-${label})`}
          stroke={FLARE_TORCH_CONFIG.colors.border}
          strokeWidth={FLARE_TORCH_CONFIG.strokeWidth}
          rx={5}
          filter={`url(#shadow-torch-${label})`}
        />

        {/* Bulloni sulla base */}
        {[0.2, 0.8].map((pos, i) => (
          <circle
            key={i}
            cx={positions.base.x + positions.base.width * pos}
            cy={positions.base.y + positions.base.height/2}
            r={3 * size}
            fill={FLARE_TORCH_CONFIG.colors.structureShadow}
            stroke={FLARE_TORCH_CONFIG.colors.border}
            strokeWidth={1}
          />
        ))}

        {/* Connessione gas alla base */}
        {isVertical ? (
          <rect
            x={positions.base.x + positions.base.width * 0.1}
            y={positions.base.y + positions.base.height}
            width={positions.base.width * 0.8}
            height={8 * size}
            fill={FLARE_TORCH_CONFIG.colors.structure}
            stroke={FLARE_TORCH_CONFIG.colors.border}
            strokeWidth={1}
            rx={2}
          />
        ) : (
          <rect
            x={positions.base.x - 8 * size}
            y={positions.base.y + positions.base.height * 0.1}
            width={8 * size}
            height={positions.base.height * 0.8}
            fill={FLARE_TORCH_CONFIG.colors.structure}
            stroke={FLARE_TORCH_CONFIG.colors.border}
            strokeWidth={1}
            rx={2}
          />
        )}

        {/* Ombra dello stack */}
        <rect
          x={positions.stack.x + FLARE_TORCH_CONFIG.shadowOffset}
          y={positions.stack.y + FLARE_TORCH_CONFIG.shadowOffset}
          width={positions.stack.width}
          height={positions.stack.height}
          fill={FLARE_TORCH_CONFIG.colors.structureShadow}
          opacity={0.4}
          rx={isVertical ? stackWidth/4 : stackHeight/4}
        />

        {/* Stack principale */}
        <rect
          x={positions.stack.x}
          y={positions.stack.y}
          width={positions.stack.width}
          height={positions.stack.height}
          fill={`url(#structure-gradient-${label})`}
          stroke={FLARE_TORCH_CONFIG.colors.border}
          strokeWidth={FLARE_TORCH_CONFIG.strokeWidth}
          rx={isVertical ? stackWidth/4 : stackHeight/4}
          filter={`url(#shadow-torch-${label})`}
        />

        {/* Riflessi metallici sullo stack */}
        <rect
          x={positions.stack.x + (isVertical ? 2 : 5)}
          y={positions.stack.y + (isVertical ? 5 : 2)}
          width={isVertical ? stackWidth/3 : stackHeight/3}
          height={isVertical ? stackHeight - 10 : stackWidth - 4}
          fill="white"
          opacity={0.3}
          rx={isVertical ? stackWidth/6 : stackHeight/6}
        />

        {/* Ugello in cima */}
        {isVertical ? (
          <rect
            x={positions.stack.x - 3}
            y={positions.stack.y - 8}
            width={positions.stack.width + 6}
            height={8}
            fill={FLARE_TORCH_CONFIG.colors.structure}
            stroke={FLARE_TORCH_CONFIG.colors.border}
            strokeWidth={1}
            rx={2}
          />
        ) : (
          <rect
            x={positions.stack.x + positions.stack.width}
            y={positions.stack.y - 3}
            width={8}
            height={positions.stack.height + 6}
            fill={FLARE_TORCH_CONFIG.colors.structure}
            stroke={FLARE_TORCH_CONFIG.colors.border}
            strokeWidth={1}
            rx={2}
          />
        )}

        {/* Pilot light (sempre acceso) */}
        <Flame 
          x={positions.pilot.x} 
          y={positions.pilot.y} 
          intensity={pilotFlicker} 
          large={false}
        />

        {/* Fiamma principale (solo se accesa) */}
        {isLit && (
          <g filter={`url(#heat-effect-${label})`}>
            <Flame 
              x={positions.flame.x} 
              y={positions.flame.y} 
              intensity={flameIntensity} 
              large={true}
            />
          </g>
        )}

        {/* Indicatore di stato */}
        <circle
          cx={isVertical ? centerX + baseWidth/2 - 8 : centerX - stackHeight/2 - 15}
          cy={isVertical ? positions.base.y - 10 : centerY - baseWidth/2 + 8}
          r={6 * size}
          fill={`url(#state-gradient-${label})`}
          stroke={FLARE_TORCH_CONFIG.colors.border}
          strokeWidth={1}
        />

        {/* Riflesso indicatore */}
        <circle
          cx={isVertical ? centerX + baseWidth/2 - 9 : centerX - stackHeight/2 - 16}
          cy={isVertical ? positions.base.y - 11 : centerY - baseWidth/2 + 7}
          r={2 * size}
          fill="white"
          opacity={0.7}
        />

        {/* Testo stato */}
        {FLARE_TORCH_CONFIG.showStateText && (
          <text
            x={centerX}
            y={isVertical ? positions.base.y + positions.base.height + 25 : centerY + baseWidth/2 + 20}
            textAnchor="middle"
            fontSize={FLARE_TORCH_CONFIG.fontSize.state}
            fontWeight="bold"
            fill={isLit ? FLARE_TORCH_CONFIG.colors.lit.primary : FLARE_TORCH_CONFIG.colors.off.primary}
          >
            {isLit ? "ACCESA" : "SPENTA"}
          </text>
        )}
        
        {/* Etichetta della torcia */}
        {FLARE_TORCH_CONFIG.showLabel && (
          <g>
            {/* Ombra dell'etichetta */}
            <text
              x={centerX + 1}
              y={svgHeight - 14}
              textAnchor="middle"
              fontSize={FLARE_TORCH_CONFIG.fontSize.label}
              fontWeight="bold"
              fill="black"
              opacity={0.3}
            >
              {label} - FLARE
            </text>
            {/* Etichetta principale */}
            <text
              x={centerX}
              y={svgHeight - 15}
              textAnchor="middle"
              fontSize={FLARE_TORCH_CONFIG.fontSize.label}
              fontWeight="bold"
              fill={FLARE_TORCH_CONFIG.colors.text}
            >
              {label} - FLARE
            </text>
          </g>
        )}

        {/* Indicatore controllo manuale abilitato */}
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

// Componente Demo per mostrare entrambi gli orientamenti
const FlareTorchDemo: React.FC = () => {
  const [torch1Lit, setTorch1Lit] = useState(false);
  const [torch2Lit, setTorch2Lit] = useState(true);
  const [torch3Lit, setTorch3Lit] = useState(false);
  const [torch4Lit, setTorch4Lit] = useState(true);
  const [manualControlEnabled, setManualControlEnabled] = useState(false);

  // Simulazione automatica
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    if (autoMode) {
      const interval = setInterval(() => {
        // Simulazione accensione/spegnimento casuale
        if (Math.random() > 0.85) {
          setTorch1Lit(prev => !prev);
        }
        if (Math.random() > 0.9) {
          setTorch2Lit(prev => !prev);
        }
        if (Math.random() > 0.88) {
          setTorch3Lit(prev => !prev);
        }
        if (Math.random() > 0.87) {
          setTorch4Lit(prev => !prev);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoMode]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen"> {/* Sfondo scuro per vedere meglio le fiamme */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">
          Torcia GPL - Bruciatore Gas Residuo
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
                ● Demo attiva - cliccare sulle torce per accendere/spegnere
              </span>
            )}
          </div>
        </div>

        {/* Griglia delle torce */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Torcia Verticale - Spenta */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-300">
              Verticale - Spenta
            </h3>
            <div className="flex justify-center">
              <FlareTorch
                isLit={torch1Lit}
                label="FT001"
                orientation="vertical"
                manualControlEnabled={manualControlEnabled}
                onToggle={() => setTorch1Lit(!torch1Lit)}
                size={0.7}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-400">
                Stato: <span className={`font-semibold ${torch1Lit ? 'text-orange-400' : 'text-gray-500'}`}>
                  {torch1Lit ? 'ACCESA' : 'SPENTA'}
                </span>
              </div>
              <div className="text-gray-400">
                Pilot: <span className="font-semibold text-blue-400">ATTIVO</span>
              </div>
            </div>
          </div>

          {/* Torcia Verticale - Accesa */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-300">
              Verticale - Accesa
            </h3>
            <div className="flex justify-center">
              <FlareTorch
                isLit={torch2Lit}
                label="FT002"
                orientation="vertical"
                manualControlEnabled={manualControlEnabled}
                onToggle={() => setTorch2Lit(!torch2Lit)}
                size={0.7}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-400">
                Stato: <span className={`font-semibold ${torch2Lit ? 'text-orange-400' : 'text-gray-500'}`}>
                  {torch2Lit ? 'ACCESA' : 'SPENTA'}
                </span>
              </div>
              <div className="text-gray-400">
                Pilot: <span className="font-semibold text-blue-400">ATTIVO</span>
              </div>
            </div>
          </div>

          {/* Torcia Orizzontale - Spenta */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-300">
              Orizzontale - Spenta
            </h3>
            <div className="flex justify-center">
              <FlareTorch
                isLit={torch3Lit}
                label="FT003"
                orientation="horizontal"
                manualControlEnabled={manualControlEnabled}
                onToggle={() => setTorch3Lit(!torch3Lit)}
                size={0.7}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-400">
                Stato: <span className={`font-semibold ${torch3Lit ? 'text-orange-400' : 'text-gray-500'}`}>
                  {torch3Lit ? 'ACCESA' : 'SPENTA'}
                </span>
              </div>
              <div className="text-gray-400">
                Pilot: <span className="font-semibold text-blue-400">ATTIVO</span>
              </div>
            </div>
          </div>

          {/* Torcia Orizzontale - Accesa */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-300">
              Orizzontale - Accesa
            </h3>
            <div className="flex justify-center">
              <FlareTorch
                isLit={torch4Lit}
                label="FT004"
                orientation="horizontal"
                manualControlEnabled={manualControlEnabled}
                onToggle={() => setTorch4Lit(!torch4Lit)}
                size={0.7}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-400">
                Stato: <span className={`font-semibold ${torch4Lit ? 'text-orange-400' : 'text-gray-500'}`}>
                  {torch4Lit ? 'ACCESA' : 'SPENTA'}
                </span>
              </div>
              <div className="text-gray-400">
                Pilot: <span className="font-semibold text-blue-400">ATTIVO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Esempi con dimensioni diverse */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Varianti Dimensionali</h2>
          <div className="flex flex-wrap gap-8 items-end justify-center">
            
            <div className="text-center">
              <FlareTorch
                isLit={true}
                label="Small"
                orientation="vertical"
                size={0.5}
                manualControlEnabled={manualControlEnabled}
                onToggle={() => {}}
              />
              <p className="text-xs text-gray-400 mt-2">Piccola (50%)</p>
            </div>

            <div className="text-center">
              <FlareTorch
                isLit={false}
                label="Normal"
                orientation="vertical"
                size={0.8}
                manualControlEnabled={manualControlEnabled}
                onToggle={() => {}}
              />
              <p className="text-xs text-gray-400 mt-2">Normale (80%)</p>
            </div>

            <div className="text-center">
              <FlareTorch
                isLit={true}
                label="Large"
                orientation="vertical"
                size={1.2}
                manualControlEnabled={manualControlEnabled}
                onToggle={() => {}}
              />
              <p className="text-xs text-gray-400 mt-2">Grande (120%)</p>
            </div>
          </div>
        </div>

        {/* Pannello di stato sistema */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Sistema Torce GPL</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'FT001', lit: torch1Lit, orientation: 'Verticale' },
              { label: 'FT002', lit: torch2Lit, orientation: 'Verticale' },
              { label: 'FT003', lit: torch3Lit, orientation: 'Orizzontale' },
              { label: 'FT004', lit: torch4Lit, orientation: 'Orizzontale' }
            ].map((torch, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                torch.lit ? 'border-orange-500 bg-orange-50' : 'border-gray-400 bg-gray-50'
              }`}>
                <div className="text-sm font-semibold text-gray-700">{torch.label}</div>
                <div className="text-xs text-gray-600">{torch.orientation}</div>
                <div className={`text-xs font-semibold ${torch.lit ? 'text-orange-600' : 'text-gray-600'}`}>
                  {torch.lit ? '🔥 ACCESA' : '⚪ SPENTA'}
                </div>
                <div className="text-xs text-blue-600">
                  💡 Pilot OK
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informazioni tecniche */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Torcia GPL - Specifiche Tecniche</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Fiamma Animata:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Colori graduali:</strong> Blu → Arancione → Giallo</div>
                <div>• <strong>Oscillazione:</strong> Intensità variabile</div>
                <div>• <strong>Pilot light:</strong> Sempre acceso (blu)</div>
                <div>• <strong>Effetto calore:</strong> Distorsione aria</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Stati Operativi:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span><strong>ACCESA:</strong> Fiamma principale + pilot</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span><strong>SPENTA:</strong> Solo pilot light</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span><strong>Pilot:</strong> Sempre attivo</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Caratteristiche:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Orientamenti:</strong> Verticale/Orizzontale</div>
                <div>• <strong>Struttura:</strong> Metallica con riflessi</div>
                <div>• <strong>Base robusta:</strong> Con bulloni e connessioni</div>
                <div>• <strong>Dimensioni:</strong> Scalabili per layout</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlareTorchDemo;
