import React from 'react';

// Configurazione pacco bombole azoto (facilmente modificabile) - DIMENSIONI RIDOTTE DEL 10%
const NITROGEN_BOTTLES_CONFIG = {
  // Dimensioni base - ridotte del 10%
  bottleWidth: 54,     // Ridotto da 60 a 54
  bottleHeight: 180,   // Ridotto da 200 a 180
  manifoldWidth: 216,  // Ridotto da 240 a 216
  manifoldHeight: 27,  // Ridotto da 30 a 27
  
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
  
  // Stili 3D - ridotti proporzionalmente del 10%
  strokeWidth: 1.8,         // Ridotto da 2
  shadowOffset: 2.7,        // Ridotto da 3
  fontSize: {
    pressure: 10.8,         // Ridotto da 12
    fill: 9,                // Ridotto da 10
    label: 9.9,             // Ridotto da 11
    units: 7.2,             // Ridotto da 8
    bottleInfo: 7.2         // Ridotto da 8
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
  orientation?: 'vertical' | 'horizontal' | 'vertical-inverted';
  
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
  
  // Calcolo dimensioni SVG basate sull'orientamento - ridotte del 10%
  const isVertical = orientation === 'vertical' || orientation === 'vertical-inverted';
  const isInverted = orientation === 'vertical-inverted';
  const svgWidth = isVertical ? manifoldWidth + 54 : bottleHeight + manifoldWidth + 108;  // Ridotto da 60 e 120
  const svgHeight = isVertical ? bottleHeight + manifoldHeight + 108 : manifoldHeight + bottleWidth + 108; // Ridotto da 120
  
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  // Posizioni componenti basate sull'orientamento - ridotte del 10%
  const getPositions = () => {
    if (orientation === 'vertical') {
      // Orientamento verticale normale (collettore in alto)
      return {
        bottles: Array.from({ length: bottles.length }, (_, i) => ({
          x: centerX - manifoldWidth/2 + (i + 1) * manifoldWidth/(bottles.length + 1) - bottleWidth/2,
          y: centerY - bottleHeight/2 + 36, // Ridotto da 40
          width: bottleWidth,
          height: bottleHeight
        })),
        manifold: {
          x: centerX - manifoldWidth/2,
          y: centerY - bottleHeight/2 - manifoldHeight + 36, // Ridotto da 40
          width: manifoldWidth,
          height: manifoldHeight
        },
        gauge: {
          x: centerX,
          y: centerY - bottleHeight/2 - manifoldHeight/2 + 36 // Ridotto da 40
        }
      };
    } else if (orientation === 'vertical-inverted') {
      // Orientamento verticale invertito (collettore in basso a stretto contatto)
      return {
        bottles: Array.from({ length: bottles.length }, (_, i) => ({
          x: centerX - manifoldWidth/2 + (i + 1) * manifoldWidth/(bottles.length + 1) - bottleWidth/2,
          y: centerY - bottleHeight/2 + 36, // Ridotto da 40
          width: bottleWidth,
          height: bottleHeight
        })),
        manifold: {
          x: centerX - manifoldWidth/2,
          y: centerY + bottleHeight/2 + 27, // Ridotto da 30
          width: manifoldWidth,
          height: manifoldHeight
        },
        gauge: {
          x: centerX,
          y: centerY + bottleHeight/2 + 27 + manifoldHeight/2 // Ridotto da 30
        }
      };
    } else {
      // Orizzontale: collettore rettangolare a stretto contatto a sinistra
      const totalHeight = bottles.length * bottleWidth + (bottles.length - 1) * 18; // Ridotto da 20
      return {
        bottles: Array.from({ length: bottles.length }, (_, i) => ({
          x: centerX - bottleHeight/2 + 45, // Ridotto da 50
          y: centerY - totalHeight/2 + i * (bottleWidth + 18), // Ridotto da 20
          width: bottleHeight, // bombola orizzontale
          height: bottleWidth
        })),
        manifold: {
          x: centerX - bottleHeight/2 + 18, // Ridotto da 20
          y: centerY - totalHeight/2,
          width: manifoldHeight, // collettore verticale rettangolare
          height: totalHeight
        },
        gauge: {
          x: centerX - bottleHeight/2 + 18 + manifoldHeight/2, // Ridotto da 20
          y: centerY
        }
      };
    }
  };
  
  const positions = getPositions();

  // Componente Bombola (dimensioni ridotte del 10%)
  const Bottle = ({ x, y, width, height, index, bottleData, horizontal = false, inverted = false }: { 
    x: number; 
    y: number; 
    width: number; 
    height: number; 
    index: number; 
    bottleData: BottleData;
    horizontal?: boolean;
    inverted?: boolean;
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
          rx={horizontal ? height/7 : width/7} // Ridotto da 6
        />
        
        {/* Ogiva (posizionata correttamente in base all'orientamento) */}
        {!horizontal && (
          <ellipse
            cx={x + width/2}
            cy={inverted ? y + height * 0.9 : y}
            rx={width/2}
            ry={width/4.4} // Ridotto da 4
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
          rx={horizontal ? height/7 : width/7} // Ridotto da 6
          opacity={bottleData.enabled ? 1 : 0.6}
        />
        
        {/* Riflesso metallico */}
        <rect
          x={x + 2.7} // Ridotto da 3
          y={y + 4.5} // Ridotto da 5
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
            y={horizontal ? y + 2 : 
               inverted ? y + 2 :
               y + height * 0.9 - (height * 0.85) * fillLevel/100}
            width={horizontal ? (width - 4) * fillLevel/100 : width - 4}
            height={horizontal ? height - 4 : (height * 0.85) * fillLevel/100}
            fill={pressureColors.primary}
            opacity={0.3}
            rx={2}
          />
        )}
        
        {/* Valvola (posizionata correttamente in base all'orientamento) */}
        <rect
          x={horizontal ? x - 7.2 : x + width/2 - 2.7} // Ridotto da 8 e 3
          y={horizontal ? y + height/2 - 2.7 : 
             inverted ? y + height * 0.9 : y - 7.2} // Ridotto da 3 e 8
          width={horizontal ? 7.2 : 5.4} // Ridotto da 8 e 6
          height={horizontal ? 5.4 : 7.2} // Ridotto da 6 e 8
          fill={bottleData.enabled ? NITROGEN_BOTTLES_CONFIG.colors.valve : NITROGEN_BOTTLES_CONFIG.colors.disabled}
          stroke={NITROGEN_BOTTLES_CONFIG.colors.border}
          strokeWidth={1}
          rx={1.8} // Ridotto da 2
        />
        
        {/* Indicatore di abilitazione */}
        <circle
          cx={horizontal ? x + width - 10.8 : x + width - 7.2} // Ridotto da 12 e 8
          cy={horizontal ? y + 7.2 : y + 10.8} // Ridotto da 8 e 12
          r={3.6} // Ridotto da 4
          fill={bottleData.enabled ? NITROGEN_BOTTLES_CONFIG.colors.enabled : NITROGEN_BOTTLES_CONFIG.colors.disabled}
          stroke={NITROGEN_BOTTLES_CONFIG.colors.border}
          strokeWidth={1}
        />
        
        {/* Etichetta N₂ */}
        <text
          x={x + width/2}
          y={y + height/2 - 9} // Ridotto da 10
          textAnchor="middle"
          fontSize={horizontal ? 10.8 : 14.4} // Ridotto da 12 e 16
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
              y={y + height/2 + 4.5} // Ridotto da 5
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
              y={y + height/2 + 13.5} // Ridotto da 15
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
          y={inverted ? y + 13.5 : y + height - 4.5} // Ridotto da 15 e 5
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

  const manifoldPressureRange = getPressureRange(manifoldPressure);
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
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.7"/> {/* Ridotto da 3 */}
            <feOffset dx="2.7" dy="2.7" result="offset" /> {/* Ridotto da 3,3 */}
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
            bottleData={bottles[index]}
            horizontal={orientation === 'horizontal'}
            inverted={isInverted}
          />
        ))}

        {/* Connessioni dalle bombole al collettore */}
        {positions.bottles.map((bottle, index) => {
          const connectionStart = isVertical 
            ? { x: bottle.x + bottle.width/2, y: isInverted ? bottle.y + bottle.height : bottle.y }
            : { x: bottle.x, y: bottle.y + bottle.height/2 };
          const connectionEnd = isVertical
            ? { x: positions.manifold.x + (index + 1) * positions.manifold.width/(bottles.length + 1), 
                y: isInverted ? positions.manifold.y : positions.manifold.y + positions.manifold.height }
            : { x: positions.manifold.x, y: positions.manifold.y + (index + 0.5) * (positions.manifold.height)/(bottles.length) };
          
          return (
            <line
              key={`connection-${index}`}
              x1={connectionStart.x}
              y1={connectionStart.y}
              x2={connectionEnd.x}
              y2={connectionEnd.y}
              stroke={bottles[index].enabled ? NITROGEN_BOTTLES_CONFIG.colors.manifold : NITROGEN_BOTTLES_CONFIG.colors.disabled}
              strokeWidth={2.7} // Ridotto da 3
              opacity={bottles[index].enabled ? 1 : 0.5}
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
          rx={orientation === 'horizontal' ? 3.6 : positions.manifold.height/2} // Ridotto da 4
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
          rx={orientation === 'horizontal' ? 3.6 : positions.manifold.height/2} // Ridotto da 4
          filter={`url(#shadow-bottles-${label})`}
        />

        {/* Manometro sul collettore */}
        <circle
          cx={positions.gauge.x}
          cy={positions.gauge.y}
          r={10.8} // Ridotto da 12
          fill="white"
          stroke={NITROGEN_BOTTLES_CONFIG.colors.border}
          strokeWidth={1.8} // Ridotto da 2
        />
        
        <circle
          cx={positions.gauge.x}
          cy={positions.gauge.y}
          r={7.2} // Ridotto da 8
          fill={`url(#gauge-gradient-${label})`}
        />

        {/* Lancetta manometro */}
        <line
          x1={positions.gauge.x}
          y1={positions.gauge.y}
          x2={positions.gauge.x + 5.4} // Ridotto da 6
          y2={positions.gauge.y - 2}
          stroke="white"
          strokeWidth={1.8} // Ridotto da 2
        />

        {/* Display pressione collettore */}
        {NITROGEN_BOTTLES_CONFIG.showPressure && (
          <g>
            {/* Background display - spostato a sinistra del manometro */}
            <rect
              x={positions.gauge.x - 54} // Ridotto da 60
              y={positions.gauge.y - 9} // Ridotto da 10
              width={45} // Ridotto da 50
              height={18} // Ridotto da 20
              fill={manifoldPressureColors.primary}
              stroke={NITROGEN_BOTTLES_CONFIG.colors.border}
              strokeWidth={1}
              rx={3.6} // Ridotto da 4
            />
            
            {/* Valore pressione */}
            <text
              x={positions.gauge.x - 31.5} // Ridotto da 35
              y={positions.gauge.y + 2}
              textAnchor="middle"
              fontSize={NITROGEN_BOTTLES_CONFIG.fontSize.pressure}
              fontWeight="bold"
              fill="white"
            >
              {Math.round(manifoldPressure)} bar
            </text>
          </g>
        )}
        
        {/* Etichetta del pacco */}
        {NITROGEN_BOTTLES_CONFIG.showLabel && (
          <g>
            {/* Ombra dell'etichetta */}
            <text
              x={orientation === 'horizontal' ? centerX + 1 : centerX + 1}
              y={orientation === 'vertical-inverted' ? svgHeight - 4.5 : 
                 orientation === 'horizontal' ? 18 : 
                 svgHeight - 12.6} // Ridotto da 5, 20, 14
              textAnchor="middle"
              fontSize={NITROGEN_BOTTLES_CONFIG.fontSize.label}
              fontWeight="bold"
              fill="black"
              opacity={0.3}
            >
{/*              {label} - N₂ PACK {isInverted ? "(INVERTED)" : ""} */}
            </text>
            {/* Etichetta principale */}
            <text
              x={orientation === 'horizontal' ? centerX : centerX}
              y={orientation === 'vertical-inverted' ? svgHeight - 5.4 : 
                 orientation === 'horizontal' ? 17.1 : 
                 svgHeight - 13.5} // Ridotto da 6, 19, 15
              textAnchor="middle"
              fontSize={NITROGEN_BOTTLES_CONFIG.fontSize.label}
              fontWeight="bold"
              fill={NITROGEN_BOTTLES_CONFIG.colors.text}
            >
{/*              {label} - N₂ PACK {isInverted ? "(INVERTED)" : ""} */}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default NitrogenBottlePack;
