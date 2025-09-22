import React, { useState, useEffect } from 'react';

// Configurazione pacco bombole azoto (facilmente modificabile)
const NITROGEN_BOTTLES_CONFIG = {
  // Dimensioni base (raddoppiate)
  bottleWidth: 60,     // Raddoppiato da 30
  bottleHeight: 200,   // Raddoppiato da 100
  manifoldWidth: 240,  // Raddoppiato da 120
  manifoldHeight: 30,  // Raddoppiato da 15
  
  // Numero bombole
  bottleCount: 3,
  
  // Range di pressione e colori
  pressureRanges: {
    high: { min: 150, max: 200, colors: {
      primary: "#10B981",    // verde intenso
      secondary: "#059669",  // verde scuro
      highlight: "#6EE7B7",  // verde chiaro
      shadow: "#047857"      // verde molto scuro
    }},
    medium: { min: 100, max: 149, colors: {
      primary: "#F59E0B",    // giallo intenso
      secondary: "#D97706",  // giallo scuro
      highlight: "#FCD34D",  // giallo chiaro
      shadow: "#92400E"      // marrone scuro
    }},
    low: { min: 0, max: 99, colors: {
      primary: "#DC2626",    // rosso intenso
      secondary: "#B91C1C",  // rosso scuro
      highlight: "#F87171",  // rosso chiaro
      shadow: "#7F1D1D"      // rosso molto scuro
    }}
  },
  
  // Colori strutturali
  colors: {
    bottle: "#C0C0C0",        // argento per bombole
    bottleHighlight: "#E8E8E8", // argento chiaro
    bottleShadow: "#808080",   // argento scuro
    manifold: "#4A5568",      // grigio scuro per collettore
    manifoldHighlight: "#718096", // grigio chiaro
    border: "#1F2937",        // bordi
    text: "#1F2937",
    valve: "#2D3748",          // grigio per valvole
    disabled: "#9CA3AF",       // grigio per bombole disabilitate
    enabled: "#10B981"         // verde per bombole abilitate
  },
  
  // Unità di misura
  units: "bar",
  decimals: 0,
  
  // Testo e etichette
  showPressure: true,
  showFillLevel: true,
  showLabel: true,
  
  // Stili 3D
  strokeWidth: 2,
  shadowOffset: 3,
  fontSize: {
    pressure: 12,
    fill: 10,
    label: 11,
    units: 8,
    bottleInfo: 8
  }
};

// Tipo per i dati di ogni bombola
interface BottleData {
  pressure: number;
  capacity: number;
  enabled: boolean;
}

interface NitrogenBottlePackProps {
  // Parametri del pacco
  bottles: BottleData[];    // Array con dati di ogni bombola
  manifoldPressure: number;  // Pressione collettore in bar
  
  // Configurazione
  label?: string;
  orientation?: 'vertical' | 'horizontal';
  
  // Styling opzionale
  size?: number;
  className?: string;
}

const NitrogenBottlePack: React.FC<NitrogenBottlePackProps> = ({
  bottles,
  manifoldPressure,
  label = "N2-001",
  orientation = 'vertical',
  size = 1,
  className = ""
}) => {
  const [displayBottles, setDisplayBottles] = useState(bottles);
  const [displayManifoldPressure, setDisplayManifoldPressure] = useState(manifoldPressure);

  // Animazione graduale dei valori
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayBottles(prev => prev.map((bottle, index) => ({
        ...bottle,
        pressure: bottle.pressure + (bottles[index].pressure - bottle.pressure) * 0.1
      })));
      
      setDisplayManifoldPressure(prev => {
        const diff = manifoldPressure - prev;
        if (Math.abs(diff) < 0.5) return manifoldPressure;
        return prev + (diff > 0 ? Math.min(2, diff) : Math.max(-2, diff));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [bottles, manifoldPressure]);

  // Dimensioni scalate
  const bottleWidth = NITROGEN_BOTTLES_CONFIG.bottleWidth * size;
  const bottleHeight = NITROGEN_BOTTLES_CONFIG.bottleHeight * size;
  const manifoldWidth = NITROGEN_BOTTLES_CONFIG.manifoldWidth * size;
  const manifoldHeight = NITROGEN_BOTTLES_CONFIG.manifoldHeight * size;
  
  // Determina il range di colori basato sulla pressione
  const getPressureRange = (press: number) => {
    const { pressureRanges } = NITROGEN_BOTTLES_CONFIG;
    if (press >= pressureRanges.high.min) return pressureRanges.high;
    if (press >= pressureRanges.medium.min) return pressureRanges.medium;
    return pressureRanges.low;
  };
  
  // Calcolo dimensioni SVG basate sull'orientamento
  const isVertical = orientation === 'vertical';
  const svgWidth = isVertical ? manifoldWidth + 60 : bottleHeight + manifoldWidth + 120;
  const svgHeight = isVertical ? bottleHeight + manifoldHeight + 120 : manifoldHeight + bottleWidth + 120;
  
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  // Posizioni componenti basate sull'orientamento
  const getPositions = () => {
    if (isVertical) {
      return {
        bottles: Array.from({ length: bottles.length }, (_, i) => ({
          x: centerX - manifoldWidth/2 + (i + 1) * manifoldWidth/(bottles.length + 1) - bottleWidth/2,
          y: centerY - bottleHeight/2 + 40,
          width: bottleWidth,
          height: bottleHeight
        })),
        manifold: {
          x: centerX - manifoldWidth/2,
          y: centerY - bottleHeight/2 - manifoldHeight + 40,
          width: manifoldWidth,
          height: manifoldHeight
        },
        gauge: {
          x: centerX,
          y: centerY - bottleHeight/2 - manifoldHeight/2 + 40
        }
      };
    } else {
      // Orizzontale: collettore verticale a sinistra, bombole una sopra l'altra
      const totalHeight = bottles.length * bottleWidth + (bottles.length - 1) * 20;
      return {
        bottles: Array.from({ length: bottles.length }, (_, i) => ({
          x: centerX - bottleHeight/2 + 50,
          y: centerY - totalHeight/2 + i * (bottleWidth + 20),
          width: bottleHeight, // bombola orizzontale
          height: bottleWidth
        })),
        manifold: {
          x: centerX - bottleHeight/2 - manifoldHeight + 10,
          y: centerY - totalHeight/2 - 10,
          width: manifoldHeight, // collettore verticale
          height: totalHeight + 20
        },
        gauge: {
          x: centerX - bottleHeight/2 - manifoldHeight/2 + 10,
          y: centerY
        }
      };
    }
  };
  
  const positions = getPositions();

  // Componente Bombola (aggiornato per orientamento e dettagli individuali)
  const Bottle = ({ x, y, width, height, index, bottleData, horizontal = false }: { 
    x: number; 
    y: number; 
    width: number; 
    height: number; 
    index: number; 
    bottleData: BottleData;
    horizontal?: boolean 
  }) => {
    const pressureRange = getPressureRange(bottleData.pressure);
    const pressureColors = pressureRange.colors;
    const fillLevel = (bottleData.pressure / 200) * 100; // Assumiamo 200 bar come massimo
    
    return (
      <g>
        {/* Ombra bombola */}
        <rect
          x={x + NITROGEN_BOTTLES_CONFIG.shadowOffset}
          y={y + NITROGEN_BOTTLES_CONFIG.shadowOffset}
          width={width}
          height={height * 0.9}
          fill={bottleData.enabled ? NITROGEN_BOTTLES_CONFIG.colors.bottleShadow : NITROGEN_BOTTLES_CONFIG.colors.disabled}
          opacity={0.4}
          rx={horizontal ? height/6 : width/6}
        />
        
        {/* Ogiva (solo per verticale, omessa per orizzontale) */}
        {!horizontal && (
          <ellipse
            cx={x + width/2}
            cy={y}
            rx={width/2}
            ry={width/4}
            fill={bottleData.enabled ? NITROGEN_BOTTLES_CONFIG.colors.bottle : NITROGEN_BOTTLES_CONFIG.colors.disabled}
            stroke={NITROGEN_BOTTLES_CONFIG.colors.border}
            strokeWidth={1}
            opacity={bottleData.enabled ? 1 : 0.6}
          />
        )}
        
        {/* Corpo principale bombola */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height * 0.9}
          fill={bottleData.enabled ? `url(#bottle-gradient-${label}-${index})` : NITROGEN_BOTTLES_CONFIG.colors.disabled}
          stroke={NITROGEN_BOTTLES_CONFIG.colors.border}
          strokeWidth={NITROGEN_BOTTLES_CONFIG.strokeWidth}
          rx={horizontal ? height/6 : width/6}
          opacity={bottleData.enabled ? 1 : 0.6}
        />
        
        {/* Riflesso metallico */}
        <rect
          x={x + 3}
          y={y + 5}
          width={horizontal ? width * 0.8 : width/4}
          height={horizontal ? height/4 : height * 0.8}
          fill="white"
          opacity={bottleData.enabled ? 0.4 : 0.2}
          rx={2}
        />
        
        {/* Indicatore di riempimento */}
        {bottleData.enabled && (
          <rect
            x={x + 2}
            y={horizontal ? y + 2 : y + height * 0.9 - (height * 0.85) * fillLevel/100}
            width={horizontal ? (width - 4) * fillLevel/100 : width - 4}
            height={horizontal ? height - 4 : (height * 0.85) * fillLevel/100}
            fill={pressureColors.primary}
            opacity={0.3}
            rx={2}
          />
        )}
        
        {/* Valvola (in cima per verticale, sinistra per orizzontale) */}
        <rect
          x={horizontal ? x - 8 : x + width/2 - 3}
          y={horizontal ? y + height/2 - 3 : y - 8}
          width={horizontal ? 8 : 6}
          height={horizontal ? 6 : 8}
          fill={bottleData.enabled ? NITROGEN_BOTTLES_CONFIG.colors.valve : NITROGEN_BOTTLES_CONFIG.colors.disabled}
          stroke={NITROGEN_BOTTLES_CONFIG.colors.border}
          strokeWidth={1}
          rx={2}
        />
        
        {/* Indicatore di abilitazione */}
        <circle
          cx={horizontal ? x + width - 12 : x + width - 8}
          cy={horizontal ? y + 8 : y + 12}
          r={4}
          fill={bottleData.enabled ? NITROGEN_BOTTLES_CONFIG.colors.enabled : NITROGEN_BOTTLES_CONFIG.colors.disabled}
          stroke={NITROGEN_BOTTLES_CONFIG.colors.border}
          strokeWidth={1}
        />
        
        {/* Etichetta N₂ */}
        <text
          x={x + width/2}
          y={y + height/2 - 10}
          textAnchor="middle"
          fontSize={horizontal ? 12 : 16}
          fontWeight="bold"
          fill={bottleData.enabled ? NITROGEN_BOTTLES_CONFIG.colors.text : NITROGEN_BOTTLES_CONFIG.colors.disabled}
          opacity={bottleData.enabled ? 0.7 : 0.4}
        >
          N₂
        </text>
        
        {/* Informazioni bombola */}
        {bottleData.enabled && (
          <>
            {/* Pressione */}
            <text
              x={x + width/2}
              y={y + height/2 + 5}
              textAnchor="middle"
              fontSize={NITROGEN_BOTTLES_CONFIG.fontSize.bottleInfo}
              fill={NITROGEN_BOTTLES_CONFIG.colors.text}
              fontWeight="bold"
            >
              {Math.round(bottleData.pressure)} bar
            </text>
            
            {/* Capacità */}
            <text
              x={x + width/2}
              y={y + height/2 + 15}
              textAnchor="middle"
              fontSize={NITROGEN_BOTTLES_CONFIG.fontSize.bottleInfo}
              fill={NITROGEN_BOTTLES_CONFIG.colors.text}
            >
              {bottleData.capacity}L
            </text>
          </>
        )}
        
        {/* Numero bombola */}
        <text
          x={x + width/2}
          y={y + height - 5}
          textAnchor="middle"
          fontSize={NITROGEN_BOTTLES_CONFIG.fontSize.bottleInfo}
          fill={NITROGEN_BOTTLES_CONFIG.colors.text}
          fontWeight="bold"
        >
          #{index + 1}
        </text>
      </g>
    );
  };

  const manifoldPressureRange = getPressureRange(displayManifoldPressure);
  const manifoldPressureColors = manifoldPressureRange.colors;

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={svgWidth} 
        height={svgHeight}
      >
        {/* Definizione gradienti 3D */}
        <defs>
          {/* Gradienti per bombole */}
          {Array.from({ length: bottles.length }, (_, i) => (
            <linearGradient key={i} id={`bottle-gradient-${label}-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={NITROGEN_BOTTLES_CONFIG.colors.bottleHighlight} />
              <stop offset="30%" stopColor={NITROGEN_BOTTLES_CONFIG.colors.bottle} />
              <stop offset="100%" stopColor={NITROGEN_BOTTLES_CONFIG.colors.bottleShadow} />
            </linearGradient>
          ))}

          {/* Gradiente collettore */}
          <linearGradient id={`manifold-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={NITROGEN_BOTTLES_CONFIG.colors.manifoldHighlight} />
            <stop offset="50%" stopColor={NITROGEN_BOTTLES_CONFIG.colors.manifold} />
            <stop offset="100%" stopColor={NITROGEN_BOTTLES_CONFIG.colors.bottleShadow} />
          </linearGradient>

          {/* Gradiente manometro */}
          <radialGradient id={`gauge-gradient-${label}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor={manifoldPressureColors.highlight} />
            <stop offset="70%" stopColor={manifoldPressureColors.primary} />
            <stop offset="100%" stopColor={manifoldPressureColors.secondary} />
          </radialGradient>

          {/* Ombra */}
          <filter id={`shadow-bottles-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
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

        {/* Bombole di azoto */}
        {positions.bottles.map((bottle, index) => (
          <Bottle
            key={index}
            x={bottle.x}
            y={bottle.y}
            width={bottle.width}
            height={bottle.height}
            index={index}
            bottleData={displayBottles[index]}
            horizontal={!isVertical}
          />
        ))}

        {/* Connessioni dalle bombole al collettore */}
        {positions.bottles.map((bottle, index) => {
          const connectionStart = isVertical 
            ? { x: bottle.x + bottle.width/2, y: bottle.y }
            : { x: bottle.x, y: bottle.y + bottle.height/2 };
          const connectionEnd = isVertical
            ? { x: positions.manifold.x + (index + 1) * positions.manifold.width/(bottles.length + 1), y: positions.manifold.y + positions.manifold.height }
            : { x: positions.manifold.x + positions.manifold.width, y: positions.manifold.y + 10 + (index + 1) * (positions.manifold.height - 20)/(bottles.length + 1) };
          
          return (
            <line
              key={`connection-${index}`}
              x1={connectionStart.x}
              y1={connectionStart.y}
              x2={connectionEnd.x}
              y2={connectionEnd.y}
              stroke={displayBottles[index].enabled ? NITROGEN_BOTTLES_CONFIG.colors.manifold : NITROGEN_BOTTLES_CONFIG.colors.disabled}
              strokeWidth={3}
              opacity={displayBottles[index].enabled ? 1 : 0.5}
            />
          );
        })}

        {/* Ombra collettore */}
        <rect
          x={positions.manifold.x + NITROGEN_BOTTLES_CONFIG.shadowOffset}
          y={positions.manifold.y + NITROGEN_BOTTLES_CONFIG.shadowOffset}
          width={positions.manifold.width}
          height={positions.manifold.height}
          fill={NITROGEN_BOTTLES_CONFIG.colors.bottleShadow}
          opacity={0.4}
          rx={positions.manifold.height/2}
        />

        {/* Collettore principale */}
        <rect
          x={positions.manifold.x}
          y={positions.manifold.y}
          width={positions.manifold.width}
          height={positions.manifold.height}
          fill={`url(#manifold-gradient-${label})`}
          stroke={NITROGEN_BOTTLES_CONFIG.colors.border}
          strokeWidth={NITROGEN_BOTTLES_CONFIG.strokeWidth}
          rx={positions.manifold.height/2}
          filter={`url(#shadow-bottles-${label})`}
        />

        {/* Manometro sul collettore */}
        <circle
          cx={positions.gauge.x}
          cy={positions.gauge.y}
          r={12}
          fill="white"
          stroke={NITROGEN_BOTTLES_CONFIG.colors.border}
          strokeWidth={2}
        />
        
        <circle
          cx={positions.gauge.x}
          cy={positions.gauge.y}
          r={8}
          fill={`url(#gauge-gradient-${label})`}
        />

        {/* Lancetta manometro */}
        <line
          x1={positions.gauge.x}
          y1={positions.gauge.y}
          x2={positions.gauge.x + 6}
          y2={positions.gauge.y - 2}
          stroke="white"
          strokeWidth={2}
        />

        {/* Display pressione collettore */}
        {NITROGEN_BOTTLES_CONFIG.showPressure && (
          <g>
            {/* Background display - spostato a sinistra del manometro */}
            <rect
              x={positions.gauge.x - 60}
              y={positions.gauge.y - 10}
              width={50}
              height={20}
              fill={manifoldPressureColors.primary}
              stroke={NITROGEN_BOTTLES_CONFIG.colors.border}
              strokeWidth={1}
              rx={4}
            />
            
            {/* Valore pressione */}
            <text
              x={positions.gauge.x - 35}
              y={positions.gauge.y + 2}
              textAnchor="middle"
              fontSize={NITROGEN_BOTTLES_CONFIG.fontSize.pressure}
              fontWeight="bold"
              fill="white"
            >
              {Math.round(displayManifoldPressure)} bar
            </text>
          </g>
        )}
        
        {/* Etichetta del pacco */}
        {NITROGEN_BOTTLES_CONFIG.showLabel && (
          <g>
            {/* Ombra dell'etichetta */}
            <text
              x={centerX + 1}
              y={svgHeight - 14}
              textAnchor="middle"
              fontSize={NITROGEN_BOTTLES_CONFIG.fontSize.label}
              fontWeight="bold"
              fill="black"
              opacity={0.3}
            >
              {label} - N₂ PACK
            </text>
            {/* Etichetta principale */}
            <text
              x={centerX}
              y={svgHeight - 15}
              textAnchor="middle"
              fontSize={NITROGEN_BOTTLES_CONFIG.fontSize.label}
              fontWeight="bold"
              fill={NITROGEN_BOTTLES_CONFIG.colors.text}
            >
              {label} - N₂ PACK
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

// Componente Demo per mostrare entrambi gli orientamenti
const NitrogenBottlePackDemo: React.FC = () => {
  const [pack1Bottles, setPack1Bottles] = useState<BottleData[]>([
    { pressure: 180, capacity: 50, enabled: true },
    { pressure: 175, capacity: 50, enabled: true },
    { pressure: 170, capacity: 50, enabled: true }
  ]);
  
  const [pack2Bottles, setPack2Bottles] = useState<BottleData[]>([
    { pressure: 120, capacity: 40, enabled: true },
    { pressure: 110, capacity: 40, enabled: true },
    { pressure: 0, capacity: 40, enabled: false }
  ]);
  
  const [pack3Bottles, setPack3Bottles] = useState<BottleData[]>([
    { pressure: 75, capacity: 60, enabled: true },
    { pressure: 80, capacity: 60, enabled: true },
    { pressure: 70, capacity: 60, enabled: true }
  ]);
  
  const [pack4Bottles, setPack4Bottles] = useState<BottleData[]>([
    { pressure: 190, capacity: 50, enabled: true },
    { pressure: 0, capacity: 50, enabled: false },
    { pressure: 195, capacity: 50, enabled: true }
  ]);

  // Calcola pressione del collettore come media delle bombole abilitate
  const calculateManifoldPressure = (bottles: BottleData[]) => {
    const enabledBottles = bottles.filter(b => b.enabled);
    if (enabledBottles.length === 0) return 0;
    return enabledBottles.reduce((sum, b) => sum + b.pressure, 0) / enabledBottles.length;
  };

  // Simulazione automatica
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    if (autoMode) {
      const interval = setInterval(() => {
        // Simulazione consumo azoto graduale per bombole abilitate
        setPack1Bottles(prev => prev.map(b => 
          b.enabled ? { ...b, pressure: Math.max(0, b.pressure - Math.random() * 2) } : b
        ));
        
        setPack2Bottles(prev => prev.map(b => 
          b.enabled ? { ...b, pressure: Math.max(0, b.pressure - Math.random() * 1.5) } : b
        ));
        
        setPack3Bottles(prev => prev.map(b => 
          b.enabled ? { ...b, pressure: Math.max(0, b.pressure - Math.random() * 1) } : b
        ));
        
        setPack4Bottles(prev => prev.map(b => 
          b.enabled ? { ...b, pressure: Math.max(0, b.pressure - Math.random() * 2.5) } : b
        ));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoMode]);

  const getPressureStatus = (pressure: number) => {
    if (pressure >= 150) return { status: 'ALTO', color: 'text-green-600' };
    if (pressure >= 100) return { status: 'MEDIO', color: 'text-yellow-600' };
    return { status: 'BASSO', color: 'text-red-600' };
  };

  // Toggle abilitazione bombola
  const toggleBottle = (packSetter: React.Dispatch<React.SetStateAction<BottleData[]>>, index: number) => {
    packSetter(prev => prev.map((b, i) => 
      i === index ? { ...b, enabled: !b.enabled, pressure: b.enabled ? 0 : 150 } : b
    ));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Pacco Bombole Azoto - Dettagli Individuali
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
                ● Simulazione attiva - consumo graduale azoto
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Clicca sulle bombole nel pannello di controllo per abilitare/disabilitare
          </p>
        </div>

        {/* Griglia pacchi bombole */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Pacco Verticale 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Pacco Verticale - Alta Pressione
            </h3>
            <div className="flex justify-center">
              <NitrogenBottlePack
                bottles={pack1Bottles}
                manifoldPressure={calculateManifoldPressure(pack1Bottles)}
                label="N2-001"
                orientation="vertical"
                size={0.8}
              />
            </div>
            <div className="mt-4 space-y-2">
              {pack1Bottles.map((bottle, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                  <button
                    onClick={() => toggleBottle(setPack1Bottles, index)}
                    className={`px-2 py-1 rounded ${bottle.enabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                  >
                    Bombola #{index + 1}
                  </button>
                  <span>{bottle.capacity}L</span>
                  <span className={`font-semibold ${getPressureStatus(bottle.pressure).color}`}>
                    {Math.round(bottle.pressure)} bar
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pacco Verticale 2 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Pacco Verticale - Media Pressione
            </h3>
            <div className="flex justify-center">
              <NitrogenBottlePack
                bottles={pack2Bottles}
                manifoldPressure={calculateManifoldPressure(pack2Bottles)}
                label="N2-002"
                orientation="vertical"
                size={0.8}
              />
            </div>
            <div className="mt-4 space-y-2">
              {pack2Bottles.map((bottle, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                  <button
                    onClick={() => toggleBottle(setPack2Bottles, index)}
                    className={`px-2 py-1 rounded ${bottle.enabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                  >
                    Bombola #{index + 1}
                  </button>
                  <span>{bottle.capacity}L</span>
                  <span className={`font-semibold ${getPressureStatus(bottle.pressure).color}`}>
                    {Math.round(bottle.pressure)} bar
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pacco Orizzontale 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Pacco Orizzontale - Bassa Pressione
            </h3>
            <div className="flex justify-center">
              <NitrogenBottlePack
                bottles={pack3Bottles}
                manifoldPressure={calculateManifoldPressure(pack3Bottles)}
                label="N2-003"
                orientation="horizontal"
                size={0.8}
              />
            </div>
            <div className="mt-4 space-y-2">
              {pack3Bottles.map((bottle, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                  <button
                    onClick={() => toggleBottle(setPack3Bottles, index)}
                    className={`px-2 py-1 rounded ${bottle.enabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                  >
                    Bombola #{index + 1}
                  </button>
                  <span>{bottle.capacity}L</span>
                  <span className={`font-semibold ${getPressureStatus(bottle.pressure).color}`}>
                    {Math.round(bottle.pressure)} bar
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pacco Orizzontale 2 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Pacco Orizzontale - Alta Pressione
            </h3>
            <div className="flex justify-center">
              <NitrogenBottlePack
                bottles={pack4Bottles}
                manifoldPressure={calculateManifoldPressure(pack4Bottles)}
                label="N2-004"
                orientation="horizontal"
                size={0.8}
              />
            </div>
            <div className="mt-4 space-y-2">
              {pack4Bottles.map((bottle, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                  <button
                    onClick={() => toggleBottle(setPack4Bottles, index)}
                    className={`px-2 py-1 rounded ${bottle.enabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                  >
                    Bombola #{index + 1}
                  </button>
                  <span>{bottle.capacity}L</span>
                  <span className={`font-semibold ${getPressureStatus(bottle.pressure).color}`}>
                    {Math.round(bottle.pressure)} bar
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pannello di stato sistema */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Sistema Azoto - Monitoraggio Dettagliato</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'N2-001', bottles: pack1Bottles, orientation: 'Verticale' },
              { label: 'N2-002', bottles: pack2Bottles, orientation: 'Verticale' },
              { label: 'N2-003', bottles: pack3Bottles, orientation: 'Orizzontale' },
              { label: 'N2-004', bottles: pack4Bottles, orientation: 'Orizzontale' }
            ].map((pack, index) => {
              const avgPressure = calculateManifoldPressure(pack.bottles);
              const status = getPressureStatus(avgPressure);
              const enabledCount = pack.bottles.filter(b => b.enabled).length;
              const totalCapacity = pack.bottles.reduce((sum, b) => sum + (b.enabled ? b.capacity : 0), 0);
              
              return (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  avgPressure >= 150 ? 'border-green-500 bg-green-50' :
                  avgPressure >= 100 ? 'border-yellow-500 bg-yellow-50' :
                  'border-red-500 bg-red-50'
                }`}>
                  <div className="text-sm font-semibold text-gray-700">{pack.label}</div>
                  <div className="text-xs text-gray-600">{pack.orientation}</div>
                  <div className="text-sm font-bold text-gray-800">
                    {Math.round(avgPressure)} bar (media)
                  </div>
                  <div className="text-xs text-gray-600">
                    {enabledCount}/{pack.bottles.length} bombole attive
                  </div>
                  <div className="text-xs text-blue-600">
                    {totalCapacity}L capacità totale
                  </div>
                  <div className={`text-xs font-semibold ${status.color}`}>
                    {status.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informazioni tecniche */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Pacco Bombole Azoto - Funzionalità Avanzate</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Dettagli Bombola:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Pressione:</strong> Visualizzata su ogni bombola</div>
                <div>• <strong>Capacità:</strong> Litri per ogni bombola</div>
                <div>• <strong>Abilitazione:</strong> Indicatore verde/grigio</div>
                <div>• <strong>Numerazione:</strong> ID univoco bombola</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Controlli Avanzati:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Toggle:</strong> Abilita/disabilita bombole</div>
                <div>• <strong>Collettore:</strong> Pressione media bombole attive</div>
                <div>• <strong>Simulazione:</strong> Consumo automatico</div>
                <div>• <strong>Indicatori:</strong> Colori per range pressione</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Monitoraggio:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Individuale:</strong> Stato ogni bombola</div>
                <div>• <strong>Collettivo:</strong> Media pressione pacco</div>
                <div>• <strong>Capacità:</strong> Totale litri disponibili</div>
                <div>• <strong>Allarmi:</strong> Visivi per basse pressioni</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NitrogenBottlePackDemo;
