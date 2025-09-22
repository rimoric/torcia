import React, { useState } from 'react';

// Componente Macchichetta con Tubo Arrotolato
const CoiledPipeCoupling = ({ 
  orientation = "horizontal", // "horizontal" o "vertical"
  hasFlow = false,
  flowDirection = "positive", // "positive" o "negative"
  label = "MACCHICHETTA MC001",
  pipeColor = "#4299e1",
  coilTurns = 4, // Numero di spire
  size = "medium",
  className = ""
}) => {
  
  const getSizeConfig = () => {
    switch(size) {
      case "small":
        return { width: 140, height: 100, pipeWidth: 6, coilRadius: 15, bodyLength: 40 };
      case "large":
        return { width: 220, height: 160, pipeWidth: 14, coilRadius: 25, bodyLength: 70 };
      default: // medium
        return { width: 180, height: 130, pipeWidth: 10, coilRadius: 20, bodyLength: 55 };
    }
  };

  const sizeConfig = getSizeConfig();
  const isHorizontal = orientation === "horizontal";
  const centerX = sizeConfig.width / 2;
  const centerY = sizeConfig.height / 2;

  // Genera il path per la spirale
  const generateCoilPath = () => {
    const radius = sizeConfig.coilRadius;
    const turns = coilTurns;
    const totalLength = sizeConfig.bodyLength;
    const stepSize = totalLength / (turns * 8); // 8 punti per giro
    
    let path = "";
    
    if (isHorizontal) {
      const startX = centerX - totalLength / 2;
      const endX = centerX + totalLength / 2;
      
      for (let i = 0; i <= turns * 8; i++) {
        const t = i / (turns * 8);
        const x = startX + t * totalLength;
        const angle = i * Math.PI / 4; // 45° per step
        const y = centerY + Math.sin(angle) * radius * (1 - Math.abs(t - 0.5) * 0.3); // Rastremazione
        
        if (i === 0) {
          path += `M ${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
      }
    } else {
      const startY = centerY - totalLength / 2;
      const endY = centerY + totalLength / 2;
      
      for (let i = 0; i <= turns * 8; i++) {
        const t = i / (turns * 8);
        const y = startY + t * totalLength;
        const angle = i * Math.PI / 4;
        const x = centerX + Math.sin(angle) * radius * (1 - Math.abs(t - 0.5) * 0.3);
        
        if (i === 0) {
          path += `M ${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
      }
    }
    
    return path;
  };

  return (
    <div className={`flex flex-col items-center bg-gray-700 p-6 rounded-lg border-2 border-gray-400 ${className}`}>
      
      <h4 className="text-sm font-bold text-white mb-4">{label}</h4>
      
      <svg 
        width={sizeConfig.width} 
        height={sizeConfig.height} 
        viewBox={`0 0 ${sizeConfig.width} ${sizeConfig.height}`}
        className="mb-4"
      >
        <defs>
          <linearGradient id={`coil-gradient-${label.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={pipeColor} />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <linearGradient id={`body-gradient-${label.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#cbd5e0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Ombra per profondità */}
          <filter id={`shadow-${label.replace(/\s+/g, '')}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/>
          </filter>
        </defs>

        {isHorizontal ? (
          <>
            {/* Corpo esterno orizzontale */}
            <rect 
              x={centerX - sizeConfig.bodyLength / 2 - 10}
              y={centerY - sizeConfig.coilRadius - 8}
              width={sizeConfig.bodyLength + 20}
              height={sizeConfig.coilRadius * 2 + 16}
              fill={`url(#body-gradient-${label.replace(/\s+/g, '')})`}
              stroke="#64748b"
              strokeWidth="2"
              rx="8"
              filter={`url(#shadow-${label.replace(/\s+/g, '')})`}
              opacity="0.7"
            />

            {/* Tubazioni di raccordo */}
            <rect 
              x="10" 
              y={centerY - sizeConfig.pipeWidth / 2} 
              width={centerX - sizeConfig.bodyLength / 2 - 10} 
              height={sizeConfig.pipeWidth} 
              fill={`url(#coil-gradient-${label.replace(/\s+/g, '')})`} 
              stroke="#2563eb" 
              strokeWidth="1" 
              rx={sizeConfig.pipeWidth / 2} 
            />

            <rect 
              x={centerX + sizeConfig.bodyLength / 2 + 10} 
              y={centerY - sizeConfig.pipeWidth / 2} 
              width={sizeConfig.width - (centerX + sizeConfig.bodyLength / 2 + 10) - 10} 
              height={sizeConfig.pipeWidth} 
              fill={`url(#coil-gradient-${label.replace(/\s+/g, '')})`} 
              stroke="#2563eb" 
              strokeWidth="1" 
              rx={sizeConfig.pipeWidth / 2} 
            />
          </>
        ) : (
          <>
            {/* Corpo esterno verticale */}
            <rect 
              x={centerX - sizeConfig.coilRadius - 8}
              y={centerY - sizeConfig.bodyLength / 2 - 10}
              width={sizeConfig.coilRadius * 2 + 16}
              height={sizeConfig.bodyLength + 20}
              fill={`url(#body-gradient-${label.replace(/\s+/g, '')})`}
              stroke="#64748b"
              strokeWidth="2"
              rx="8"
              filter={`url(#shadow-${label.replace(/\s+/g, '')})`}
              opacity="0.7"
            />

            {/* Tubazioni di raccordo verticali */}
            <rect 
              x={centerX - sizeConfig.pipeWidth / 2} 
              y="10" 
              width={sizeConfig.pipeWidth} 
              height={centerY - sizeConfig.bodyLength / 2 - 10} 
              fill={`url(#coil-gradient-${label.replace(/\s+/g, '')})`} 
              stroke="#2563eb" 
              strokeWidth="1" 
              rx={sizeConfig.pipeWidth / 2} 
            />

            <rect 
              x={centerX - sizeConfig.pipeWidth / 2} 
              y={centerY + sizeConfig.bodyLength / 2 + 10} 
              width={sizeConfig.pipeWidth} 
              height={sizeConfig.height - (centerY + sizeConfig.bodyLength / 2 + 10) - 10} 
              fill={`url(#coil-gradient-${label.replace(/\s+/g, '')})`} 
              stroke="#2563eb" 
              strokeWidth="1" 
              rx={sizeConfig.pipeWidth / 2} 
            />
          </>
        )}

        {/* Spirale interna */}
        <path 
          d={generateCoilPath()} 
          fill="none" 
          stroke={`url(#coil-gradient-${label.replace(/\s+/g, '')})`} 
          strokeWidth={sizeConfig.pipeWidth} 
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Ombreggiatura spirale per effetto 3D */}
        <path 
          d={generateCoilPath()} 
          fill="none" 
          stroke="#1e293b" 
          strokeWidth={sizeConfig.pipeWidth + 2} 
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
          transform="translate(1,1)"
        />

        {/* Dettagli corpo - viti/bulloni */}
        {isHorizontal ? (
          <>
            <circle cx={centerX - sizeConfig.bodyLength / 2} cy={centerY - sizeConfig.coilRadius} r="2" fill="#475569" />
            <circle cx={centerX - sizeConfig.bodyLength / 2} cy={centerY + sizeConfig.coilRadius} r="2" fill="#475569" />
            <circle cx={centerX + sizeConfig.bodyLength / 2} cy={centerY - sizeConfig.coilRadius} r="2" fill="#475569" />
            <circle cx={centerX + sizeConfig.bodyLength / 2} cy={centerY + sizeConfig.coilRadius} r="2" fill="#475569" />
          </>
        ) : (
          <>
            <circle cx={centerX - sizeConfig.coilRadius} cy={centerY - sizeConfig.bodyLength / 2} r="2" fill="#475569" />
            <circle cx={centerX + sizeConfig.coilRadius} cy={centerY - sizeConfig.bodyLength / 2} r="2" fill="#475569" />
            <circle cx={centerX - sizeConfig.coilRadius} cy={centerY + sizeConfig.bodyLength / 2} r="2" fill="#475569" />
            <circle cx={centerX + sizeConfig.coilRadius} cy={centerY + sizeConfig.bodyLength / 2} r="2" fill="#475569" />
          </>
        )}

        {/* Frecce flusso animate */}
        {hasFlow && (
          <g>
            {isHorizontal ? (
              <>
                {/* Freccia ingresso */}
                <polygon
                  points={`30,${centerY-4} 30,${centerY+4} 40,${centerY}`}
                  fill={pipeColor}
                  opacity="0.8"
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={flowDirection === "positive" ? "0,0;20,0;0,0" : "0,0;-20,0;0,0"}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </polygon>

                {/* Freccia uscita */}
                <polygon
                  points={`${sizeConfig.width-40},${centerY-4} ${sizeConfig.width-40},${centerY+4} ${sizeConfig.width-30},${centerY}`}
                  fill={pipeColor}
                  opacity="0.8"
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={flowDirection === "positive" ? "0,0;20,0;0,0" : "0,0;-20,0;0,0"}
                    dur="2s"
                    repeatCount="indefinite"
                    begin="0.3s"
                  />
                </polygon>
              </>
            ) : (
              <>
                {/* Freccia ingresso verticale */}
                <polygon
                  points={`${centerX-4},30 ${centerX+4},30 ${centerX},40`}
                  fill={pipeColor}
                  opacity="0.8"
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={flowDirection === "positive" ? "0,0;0,20;0,0" : "0,0;0,-20;0,0"}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </polygon>

                {/* Freccia uscita verticale */}
                <polygon
                  points={`${centerX-4},${sizeConfig.height-40} ${centerX+4},${sizeConfig.height-40} ${centerX},${sizeConfig.height-30}`}
                  fill={pipeColor}
                  opacity="0.8"
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={flowDirection === "positive" ? "0,0;0,20;0,0" : "0,0;0,-20;0,0"}
                    dur="2s"
                    repeatCount="indefinite"
                    begin="0.3s"
                  />
                </polygon>
              </>
            )}
          </g>
        )}

        {/* Particelle animate nella spirale se attivo */}
        {hasFlow && (
          <g>
            {[...Array(3)].map((_, i) => (
              <circle
                key={i}
                r="2"
                fill="#fbbf24"
                opacity="0.9"
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 1}s`}
                >
                  <mpath href={`#coil-path-${label.replace(/\s+/g, '')}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;0.9;0"
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 1}s`}
                />
              </circle>
            ))}
          </g>
        )}

        {/* Path invisibile per animazione particelle */}
        <path 
          id={`coil-path-${label.replace(/\s+/g, '')}`}
          d={generateCoilPath()} 
          fill="none" 
          stroke="none"
        />

        {/* LED stato */}
        <circle 
          cx={sizeConfig.width - 15} 
          cy="15" 
          r="4" 
          fill={hasFlow ? "#10b981" : "#6b7280"} 
          className="animate-pulse" 
        />

        {/* Etichetta spire */}
        <text 
          x={centerX} 
          y="15" 
          textAnchor="middle" 
          className="text-xs font-bold" 
          fill="#94a3b8"
        >
          {coilTurns} spire
        </text>
      </svg>

      {/* Info stato */}
      <div className="text-center">
        <div className="text-xs text-gray-300 mb-1">
          MACCHICHETTA {orientation === "horizontal" ? "ORIZZONTALE" : "VERTICALE"}
        </div>
        <div className="text-xs text-gray-400">
          {hasFlow ? 
            `Flusso ${orientation === "horizontal" ? 
              (flowDirection === "positive" ? "→" : "←") : 
              (flowDirection === "positive" ? "↓" : "↑")}` : 
            "Nessun flusso"
          }
        </div>
      </div>
    </div>
  );
};

// Demo macchichette arrotolate
const CoiledPipeCouplingDemo = () => {
  const [couplings, setCouplings] = useState({
    coupling1: { hasFlow: true, flowDirection: "positive", coilTurns: 4 },
    coupling2: { hasFlow: true, flowDirection: "negative", coilTurns: 5 },
    coupling3: { hasFlow: false, flowDirection: "positive", coilTurns: 3 },
    coupling4: { hasFlow: true, flowDirection: "positive", coilTurns: 6 },
    coupling5: { hasFlow: false, flowDirection: "negative", coilTurns: 4 },
    coupling6: { hasFlow: true, flowDirection: "negative", coilTurns: 5 }
  });

  const toggleFlow = (id) => {
    setCouplings(prev => ({
      ...prev,
      [id]: { 
        ...prev[id], 
        hasFlow: !prev[id].hasFlow 
      }
    }));
  };

  const toggleDirection = (id) => {
    setCouplings(prev => ({
      ...prev,
      [id]: { 
        ...prev[id], 
        flowDirection: prev[id].flowDirection === "positive" ? "negative" : "positive" 
      }
    }));
  };

  const adjustCoils = (id, delta) => {
    setCouplings(prev => ({
      ...prev,
      [id]: { 
        ...prev[id], 
        coilTurns: Math.max(2, Math.min(8, prev[id].coilTurns + delta))
      }
    }));
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          🌀 Macchichette con Tubo Arrotolato - Design Avanzato
        </h1>

        {/* Controlli demo */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Controlli Demo Avanzati</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(couplings).map(([id, coupling], index) => {
              const labels = ["MC-S1-H", "MC-S2-H", "MC-S3-H", "MC-S4-V", "MC-S5-V", "MC-S6-V"];
              return (
                <div key={id} className="bg-gray-700 p-3 rounded">
                  <div className="text-sm font-medium text-white mb-2">{labels[index]}</div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFlow(id)}
                        className={`px-2 py-1 rounded text-xs flex-1 ${
                          coupling.hasFlow ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}
                      >
                        {coupling.hasFlow ? 'Flusso ON' : 'Flusso OFF'}
                      </button>
                      <button
                        onClick={() => toggleDirection(id)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                      >
                        {coupling.flowDirection === "positive" ? '→' : '←'}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjustCoils(id, -1)}
                        className="px-2 py-1 bg-purple-600 text-white rounded text-xs"
                      >
                        −
                      </button>
                      <span className="text-white text-xs flex-1 text-center">
                        {coupling.coilTurns} spire
                      </span>
                      <button
                        onClick={() => adjustCoils(id, 1)}
                        className="px-2 py-1 bg-purple-600 text-white rounded text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sezione Orizzontali */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-blue-400 mb-6">🌀 Macchichette Orizzontali Arrotolate</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Spirale 4 Giri →</h3>
              <CoiledPipeCoupling
                orientation="horizontal"
                hasFlow={couplings.coupling1.hasFlow}
                flowDirection={couplings.coupling1.flowDirection}
                coilTurns={couplings.coupling1.coilTurns}
                label="MC-S1"
                pipeColor="#4299e1"
                size="medium"
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Spirale 5 Giri ←</h3>
              <CoiledPipeCoupling
                orientation="horizontal"
                hasFlow={couplings.coupling2.hasFlow}
                flowDirection={couplings.coupling2.flowDirection}
                coilTurns={couplings.coupling2.coilTurns}
                label="MC-S2"
                pipeColor="#10b981"
                size="medium"
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Spirale 3 Giri (OFF)</h3>
              <CoiledPipeCoupling
                orientation="horizontal"
                hasFlow={couplings.coupling3.hasFlow}
                flowDirection={couplings.coupling3.flowDirection}
                coilTurns={couplings.coupling3.coilTurns}
                label="MC-S3"
                pipeColor="#ef4444"
                size="medium"
              />
            </div>
          </div>
        </div>

        {/* Sezione Verticali */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-green-400 mb-6">🌀 Macchichette Verticali Arrotolate</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Spirale 6 Giri ↓</h3>
              <CoiledPipeCoupling
                orientation="vertical"
                hasFlow={couplings.coupling4.hasFlow}
                flowDirection={couplings.coupling4.flowDirection}
                coilTurns={couplings.coupling4.coilTurns}
                label="MC-S4"
                pipeColor="#8b5cf6"
                size="medium"
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Spirale 4 Giri (OFF)</h3>
              <CoiledPipeCoupling
                orientation="vertical"
                hasFlow={couplings.coupling5.hasFlow}
                flowDirection={couplings.coupling5.flowDirection}
                coilTurns={couplings.coupling5.coilTurns}
                label="MC-S5"
                pipeColor="#f59e0b"
                size="medium"
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Spirale 5 Giri ↑</h3>
              <CoiledPipeCoupling
                orientation="vertical"
                hasFlow={couplings.coupling6.hasFlow}
                flowDirection={couplings.coupling6.flowDirection}
                coilTurns={couplings.coupling6.coilTurns}
                label="MC-S6"
                pipeColor="#06b6d4"
                size="medium"
              />
            </div>
          </div>
        </div>

        {/* Sezione Diverse Taglie */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">📏 Diverse Taglie Arrotolate</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Piccola (3 Spire)</h3>
              <CoiledPipeCoupling
                orientation="horizontal"
                hasFlow={true}
                flowDirection="positive"
                coilTurns={3}
                label="MC-S"
                pipeColor="#4299e1"
                size="small"
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Media (5 Spire)</h3>
              <CoiledPipeCoupling
                orientation="horizontal"
                hasFlow={true}
                flowDirection="positive"
                coilTurns={5}
                label="MC-M"
                pipeColor="#4299e1"
                size="medium"
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Grande (7 Spire)</h3>
              <CoiledPipeCoupling
                orientation="horizontal"
                hasFlow={true}
                flowDirection="positive"
                coilTurns={7}
                label="MC-L"
                pipeColor="#4299e1"
                size="large"
              />
            </div>
          </div>
        </div>

        {/* Info tecniche */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📋 Caratteristiche Macchichette Arrotolate</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="font-medium text-blue-400 mb-2">🌀 Design Spirale:</h4>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Tubo arrotolato</strong> - Rappresentazione simbolica</li>
                <li>• <strong>Spire configurabili</strong> - Da 2 a 8 giri</li>
                <li>• <strong>Effetto rastremazione</strong> - Spirale più stretta alle estremità</li>
                <li>• <strong>Particelle animate</strong> - Seguono il percorso della spirale</li>
                <li>• <strong>Corpo protettivo</strong> - Involucro esterno realistico</li>
                <li>• <strong>Dettagli industriali</strong> - Bulloni e finiture</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-400 mb-2">⚙️ Funzionalità:</h4>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Flessibilità tubazioni</strong> - Compensa dilatazioni</li>
                <li>• <strong>Riduzione vibrazioni</strong> - Assorbe oscillazioni</li>
                <li>• <strong>Movimenti assiali</strong> - Permette espansione/contrazione</li>
                <li>• <strong>Solo visualizzazione</strong> - Nessun controllo attivo</li>
                <li>• <strong>Animazioni fluide</strong> - Flusso visibile nella spirale</li>
                <li>• <strong>Effetti 3D avanzati</strong> - Ombreggiature e profondità</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoiledPipeCouplingDemo;
