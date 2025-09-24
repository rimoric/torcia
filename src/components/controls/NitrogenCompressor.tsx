import React, { useState, useEffect } from 'react';

// Configurazione compressore azoto (facilmente modificabile)
const NITROGEN_COMPRESSOR_CONFIG = {
  // Dimensioni base - ottimizzate
  tankWidth: 200,    // Dimensione finale ottimizzata
  tankHeight: 90,    // Dimensione finale ottimizzata
  motorWidth: 60,
  motorHeight: 60,
  
  // Stati operativi
  states: {
    stopped: {
      name: "FERMO",
      colors: {
        primary: "#6B7280",    // grigio
        secondary: "#4B5563",  // grigio scuro
        highlight: "#9CA3AF",  // grigio chiaro
        shadow: "#374151"      // grigio molto scuro
      }
    },
    running: {
      name: "RUN",
      colors: {
        primary: "#10B981",    // verde intenso
        secondary: "#059669",  // verde scuro
        highlight: "#6EE7B7",  // verde chiaro
        shadow: "#047857"      // verde molto scuro
      }
    },
    standby: {
      name: "STANDBY",
      colors: {
        primary: "#F59E0B",    // giallo intenso
        secondary: "#D97706",  // giallo scuro
        highlight: "#FCD34D",  // giallo chiaro
        shadow: "#92400E"      // marrone scuro
      }
    },
    alarm: {
      name: "ALLARME",
      colors: {
        primary: "#DC2626",    // rosso intenso
        secondary: "#B91C1C",  // rosso scuro
        highlight: "#F87171",  // rosso chiaro
        shadow: "#7F1D1D"      // rosso molto scuro
      }
    }
  },
  
  // Colori strutturali
  colors: {
    tank: "#C0C0C0",          // argento per serbatoio
    tankHighlight: "#E8E8E8", // argento chiaro
    tankShadow: "#808080",    // argento scuro
    motor: "#2D3748",         // grigio scuro per motore
    motorHighlight: "#4A5568", // grigio medio
    border: "#1F2937",        // bordi
    text: "#1F2937",
    pipe: "#6B7280"           // grigio per tubazioni
  },
  
  // Parametri di pressione
  pressureRange: { min: 0, max: 15 },
  units: "bar",
  decimals: 1,
  
  // Testo e etichette
  showPressure: true,
  showTemperature: true,
  showLabel: true,
  
  // Stili 3D
  strokeWidth: 2,
  shadowOffset: 4,
  fontSize: {
    pressure: 14,
    temperature: 10,
    state: 10,
    label: 12
  }
};

type CompressorState = 'stopped' | 'running' | 'standby' | 'alarm';
type PipeExitSide = 'right' | 'left' | 'top' | 'bottom';

interface NitrogenCompressorProps {
  // Stato del compressore
  state: CompressorState;
  pressure: number;        // Pressione di uscita in bar
  temperature: number;     // Temperatura in °C
  
  // Configurazione
  label?: string;
  pipeExitSide?: PipeExitSide; // Lato di uscita del tubo
  
  // Controlli (solo per demo)
  manualControlEnabled?: boolean;
  onStart?: () => void;
  onStop?: () => void;
  
  // Styling opzionale
  size?: number;
  className?: string;
}

const NitrogenCompressor: React.FC<NitrogenCompressorProps> = ({
  state,
  pressure,
  temperature,
  label = "NC001",
  pipeExitSide = 'right',
  manualControlEnabled = false,
  onStart,
  onStop,
  size = 1,
  className = ""
}) => {
  const [displayPressure, setDisplayPressure] = useState(pressure);
  const [displayTemp, setDisplayTemp] = useState(temperature);
  const [vibration, setVibration] = useState(0);

  // Animazione graduale dei valori
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayPressure(prev => {
        const diff = pressure - prev;
        if (Math.abs(diff) < 0.05) return pressure;
        return prev + (diff > 0 ? Math.min(0.1, diff) : Math.max(-0.1, diff));
      });
      
      setDisplayTemp(prev => {
        const diff = temperature - prev;
        if (Math.abs(diff) < 0.1) return temperature;
        return prev + (diff > 0 ? Math.min(0.2, diff) : Math.max(-0.2, diff));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [pressure, temperature]);

  // Animazione vibrazioni quando in funzione
  useEffect(() => {
    if (state === 'running') {
      const interval = setInterval(() => {
        setVibration(Math.random() * 2 - 1); // Vibrazione tra -1 e +1
      }, 150);
      return () => clearInterval(interval);
    } else {
      setVibration(0);
    }
  }, [state]);

  // Dimensioni tubazione
  const pipeDefaultDiameter = 20 * size;
  const pipeLength = 40 * size;

  // Dimensioni scalate
  const tankWidth = NITROGEN_COMPRESSOR_CONFIG.tankWidth * size;
  const tankHeight = NITROGEN_COMPRESSOR_CONFIG.tankHeight * size;
  const motorWidth = NITROGEN_COMPRESSOR_CONFIG.motorWidth * size;
  const motorHeight = NITROGEN_COMPRESSOR_CONFIG.motorHeight * size;
  
  // Colori attuali basati sullo stato
  const currentState = NITROGEN_COMPRESSOR_CONFIG.states[state];
  const currentColors = currentState.colors;
  
  // Calcolo dimensioni SVG (aggiustato per il tubo di uscita)
  const svgWidth = tankWidth + 80 + (pipeExitSide === 'left' || pipeExitSide === 'right' ? pipeLength : 0);
  const svgHeight = tankHeight + 120 + (pipeExitSide === 'top' || pipeExitSide === 'bottom' ? pipeLength : 0);
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  // Posizioni componenti
  const tankX = centerX - tankWidth/2;
  const tankY = centerY - tankHeight/2;
  const motorX = tankX + tankWidth - motorWidth - 15; // Motore all'interno del serbatoio
  const motorY = tankY + (tankHeight - motorHeight)/2;

  // Calcolo posizione del tubo di uscita
  const getPipePosition = () => {
    switch (pipeExitSide) {
      case 'right':
        return {
          x: tankX + tankWidth,
          y: tankY + tankHeight/2 - pipeDefaultDiameter/2,
          width: pipeLength,
          height: pipeDefaultDiameter,
          isVertical: false
        };
      case 'left':
        return {
          x: tankX - pipeLength,
          y: tankY + tankHeight/2 - pipeDefaultDiameter/2,
          width: pipeLength,
          height: pipeDefaultDiameter,
          isVertical: false
        };
      case 'top':
        return {
          x: tankX + tankWidth/2 - pipeDefaultDiameter/2,
          y: tankY - pipeLength,
          width: pipeDefaultDiameter,
          height: pipeLength,
          isVertical: true
        };
      case 'bottom':
        return {
          x: tankX + tankWidth/2 - pipeDefaultDiameter/2,
          y: tankY + tankHeight,
          width: pipeDefaultDiameter,
          height: pipeLength,
          isVertical: true
        };
    }
  };

  const pipePosition = getPipePosition();

  // Gestione comandi manuali
  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (manualControlEnabled && onStart) {
      onStart();
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (manualControlEnabled && onStop) {
      onStop();
    }
  };

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={svgWidth} 
        height={svgHeight}
      >
        {/* Definizione gradienti 3D */}
        <defs>
          {/* Gradiente serbatoio */}
          <linearGradient id={`tank-gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.tankHighlight} />
            <stop offset="50%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.tank} />
            <stop offset="100%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.tankShadow} />
          </linearGradient>

          {/* Gradiente motore */}
          <linearGradient id={`motor-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.motorHighlight} />
            <stop offset="50%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.motor} />
            <stop offset="100%" stopColor={NITROGEN_COMPRESSOR_CONFIG.colors.tankShadow} />
          </linearGradient>

          {/* Gradiente stato */}
          <radialGradient id={`state-gradient-${label}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor={currentColors.highlight} />
            <stop offset="70%" stopColor={currentColors.primary} />
            <stop offset="100%" stopColor={currentColors.secondary} />
          </radialGradient>

          {/* Ombra */}
          <filter id={`shadow-comp-${label}`} x="-50%" y="-50%" width="200%" height="200%">
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
        </defs>

        {/* Ombra serbatoio */}
        <rect
          x={tankX + NITROGEN_COMPRESSOR_CONFIG.shadowOffset + vibration}
          y={tankY + NITROGEN_COMPRESSOR_CONFIG.shadowOffset + vibration}
          width={tankWidth}
          height={tankHeight}
          fill={NITROGEN_COMPRESSOR_CONFIG.colors.tankShadow}
          opacity={0.4}
          rx={15}
        />

        {/* Serbatoio principale (rettangolare con angoli arrotondati) */}
        <rect
          x={tankX + vibration}
          y={tankY + vibration}
          width={tankWidth}
          height={tankHeight}
          fill={`url(#tank-gradient-${label})`}
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={NITROGEN_COMPRESSOR_CONFIG.strokeWidth}
          rx={15}
          filter={`url(#shadow-comp-${label})`}
        />

        {/* Riflesso metallico sul serbatoio */}
        <rect
          x={tankX + 10 + vibration}
          y={tankY + 8 + vibration}
          width={tankWidth - 20}
          height={tankHeight/3}
          fill="white"
          opacity={0.4}
          rx={8}
        />

        {/* Tubo di uscita con diametro standard delle tubazioni */}
        <g>
          {/* Ombra tubo */}
          <rect
            x={pipePosition.x + NITROGEN_COMPRESSOR_CONFIG.shadowOffset}
            y={pipePosition.y + NITROGEN_COMPRESSOR_CONFIG.shadowOffset}
            width={pipePosition.width}
            height={pipePosition.height}
            fill={NITROGEN_COMPRESSOR_CONFIG.colors.tankShadow}
            opacity={0.4}
          />
          
          {/* Tubo principale - senza arrotondamenti */}
          <rect
            x={pipePosition.x}
            y={pipePosition.y}
            width={pipePosition.width}
            height={pipePosition.height}
            fill={state === 'running' ? "#4A90E2" : "#9CA3AF"} // Blu se in funzione, grigio se fermo
            stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
            strokeWidth={1}
          />

          {/* Riflesso metallico sul tubo */}
          <rect
            x={pipePosition.x + (pipePosition.isVertical ? 2 : 3)}
            y={pipePosition.y + (pipePosition.isVertical ? 3 : 2)}
            width={pipePosition.isVertical ? pipePosition.width/3 : pipePosition.width - 6}
            height={pipePosition.isVertical ? pipePosition.height - 6 : pipePosition.height/3}
            fill="white"
            opacity={0.4}
          />

          {/* Indicatore di flusso (quando in funzione) */}
          {state === 'running' && (
            <rect
              x={pipePosition.x + (pipePosition.isVertical ? pipePosition.width/2 - 1 : 5)}
              y={pipePosition.y + (pipePosition.isVertical ? 5 : pipePosition.height/2 - 1)}
              width={pipePosition.isVertical ? 2 : pipePosition.width - 10}
              height={pipePosition.isVertical ? pipePosition.height - 10 : 2}
              fill="#00BFFF"
              opacity={0.8}
            >
              {/* Animazione flusso */}
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </rect>
          )}
        </g>

        {/* Motore elettrico - posizionato all'interno del serbatoio */}
        <rect
          x={motorX + vibration}
          y={motorY + vibration}
          width={motorWidth}
          height={motorHeight}
          fill={`url(#motor-gradient-${label})`}
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={NITROGEN_COMPRESSOR_CONFIG.strokeWidth}
          rx={8}
          filter={`url(#shadow-comp-${label})`}
        />

        {/* Ventola di raffreddamento */}
        <circle
          cx={motorX + motorWidth/2 + vibration}
          cy={motorY + motorHeight/2 + vibration}
          r={20}
          fill="none"
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={2}
        />

        {/* Pale della ventola (animate se in funzione) */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rotation = state === 'running' ? 
            angle + (Date.now() / 50) % 360 : angle;
          const radians = (rotation * Math.PI) / 180;
          const x1 = motorX + motorWidth/2 + Math.cos(radians) * 5 + vibration;
          const y1 = motorY + motorHeight/2 + Math.sin(radians) * 5 + vibration;
          const x2 = motorX + motorWidth/2 + Math.cos(radians) * 18 + vibration;
          const y2 = motorY + motorHeight/2 + Math.sin(radians) * 18 + vibration;
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
              strokeWidth={2}
            />
          );
        })}

        {/* Manometro - vicino al bordo sinistro del serbatoio */}
        <circle
          cx={tankX + 15 + vibration}
          cy={tankY + 20 + vibration}
          r={12}
          fill="white"
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={2}
        />
        
        <circle
          cx={tankX + 15 + vibration}
          cy={tankY + 20 + vibration}
          r={8}
          fill={`url(#state-gradient-${label})`}
        />

        {/* Lancetta manometro */}
        <line
          x1={tankX + 15 + vibration}
          y1={tankY + 20 + vibration}
          x2={tankX + 15 + 6 + vibration}
          y2={tankY + 20 - 2 + vibration}
          stroke="white"
          strokeWidth={2}
        />

        {/* Display pressione - spostato più a sinistra */}
        {NITROGEN_COMPRESSOR_CONFIG.showPressure && (
          <g>
            <rect
              x={tankX + 10 + vibration}
              y={tankY - 60 + vibration}
              width={80}
              height={25}
              fill={currentColors.primary}
              stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
              strokeWidth={1}
              rx={4}
            />
            
            <text
              x={tankX + 50 + vibration}
              y={tankY - 42 + vibration}
              textAnchor="middle"
              fontSize={NITROGEN_COMPRESSOR_CONFIG.fontSize.pressure}
              fontWeight="bold"
              fill="white"
            >
              {displayPressure.toFixed(NITROGEN_COMPRESSOR_CONFIG.decimals)} {NITROGEN_COMPRESSOR_CONFIG.units}
            </text>
          </g>
        )}

        {/* Display temperatura - sotto il display pressione */}
        {NITROGEN_COMPRESSOR_CONFIG.showTemperature && (
          <g>
            <rect
              x={tankX + 10 + vibration}
              y={tankY - 30 + vibration}
              width={50}
              height={18}
              fill="#E5E7EB"
              stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
              strokeWidth={1}
              rx={3}
            />
            
            <text
              x={tankX + 35 + vibration}
              y={tankY - 17 + vibration}
              textAnchor="middle"
              fontSize={NITROGEN_COMPRESSOR_CONFIG.fontSize.temperature}
              fontWeight="bold"
              fill={NITROGEN_COMPRESSOR_CONFIG.colors.text}
            >
              {Math.round(displayTemp)}°C
            </text>
          </g>
        )}

        {/* Testo stato */}
        <text
          x={centerX}
          y={tankY + tankHeight + 25}
          textAnchor="middle"
          fontSize={NITROGEN_COMPRESSOR_CONFIG.fontSize.state}
          fontWeight="bold"
          fill={currentColors.primary}
        >
          {currentState.name}
        </text>

        {/* Simbolo NC - spostato nella parte sinistra del serbatoio */}
        <text
          x={tankX + 50 + vibration}
          y={tankY + tankHeight/2 + 5 + vibration}
          textAnchor="middle"
          fontSize={18}
          fontWeight="bold"
          fill="white"
          opacity={0.7}
        >
          NC
        </text>
        
        {/* Etichetta del compressore */}
        {NITROGEN_COMPRESSOR_CONFIG.showLabel && (
          <text
            x={centerX}
            y={svgHeight - 15}
            textAnchor="middle"
            fontSize={NITROGEN_COMPRESSOR_CONFIG.fontSize.label}
            fontWeight="bold"
            fill={NITROGEN_COMPRESSOR_CONFIG.colors.text}
          >
            {label} - N₂ COMPRESSOR
          </text>
        )}

        {/* Controlli manuali (se abilitati) */}
        {manualControlEnabled && (
          <g>
            {/* Pulsante START */}
            <rect
              x={centerX - 40}
              y={svgHeight - 50}
              width={30}
              height={20}
              fill="#10B981"
              stroke="#047857"
              strokeWidth={1}
              rx={3}
              className="cursor-pointer"
              onClick={handleStart}
            />
            <text
              x={centerX - 25}
              y={svgHeight - 37}
              textAnchor="middle"
              fontSize={8}
              fontWeight="bold"
              fill="white"
            >
              START
            </text>

            {/* Pulsante STOP */}
            <rect
              x={centerX + 10}
              y={svgHeight - 50}
              width={30}
              height={20}
              fill="#DC2626"
              stroke="#B91C1C"
              strokeWidth={1}
              rx={3}
              className="cursor-pointer"
              onClick={handleStop}
            />
            <text
              x={centerX + 25}
              y={svgHeight - 37}
              textAnchor="middle"
              fontSize={8}
              fontWeight="bold"
              fill="white"
            >
              STOP
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

// Componente Demo Finale
const NitrogenCompressorFinalDemo: React.FC = () => {
  const [compressor1State, setCompressor1State] = useState<CompressorState>('running');
  const [compressor1Pressure, setCompressor1Pressure] = useState(8.5);
  const [compressor1Temp, setCompressor1Temp] = useState(65);

  // Simulazione parametri per compressore in funzione
  useEffect(() => {
    if (compressor1State === 'running') {
      const interval = setInterval(() => {
        setCompressor1Pressure(prev => {
          const variation = (Math.random() - 0.5) * 0.3;
          const newPressure = prev + variation;
          return Math.max(7.5, Math.min(9.5, newPressure));
        });
        
        setCompressor1Temp(prev => {
          const variation = (Math.random() - 0.5) * 2;
          const newTemp = prev + variation;
          return Math.max(60, Math.min(70, newTemp));
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [compressor1State]);

  const toggleCompressor1 = () => {
    if (compressor1State === 'stopped') {
      setCompressor1State('running');
      setCompressor1Pressure(8.0);
      setCompressor1Temp(65);
    } else {
      setCompressor1State('stopped');
      setCompressor1Pressure(0);
      setCompressor1Temp(25);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">NitrogenCompressor - Versione Finale Ottimizzata</h1>
          <p className="text-gray-600 mb-4">
            Compressore/Generatore di azoto con tutte le ottimizzazioni applicate
          </p>
          
          {/* Caratteristiche principali */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800">Serbatoio Ottimizzato</div>
              <div className="text-blue-700">200x90px - Più spazioso</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="font-semibold text-green-800">Layout Perfetto</div>
              <div className="text-green-700">Zero sovrapposizioni</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="font-semibold text-purple-800">Tubo 4 Lati</div>
              <div className="text-purple-700">Diametro 20px standard</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <div className="font-semibold text-orange-800">4 Stati</div>
              <div className="text-orange-700">Run/Stop/Standby/Alarm</div>
            </div>
          </div>
        </div>

        {/* Demo Interattivo Principale */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Demo Interattivo</h2>
          <div className="flex justify-center">
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-8 mb-4">
                <NitrogenCompressor
                  state={compressor1State}
                  pressure={compressor1Pressure}
                  temperature={compressor1Temp}
                  label="NC-DEMO"
                  pipeExitSide="right"
                  manualControlEnabled={true}
                  onStart={() => toggleCompressor1()}
                  onStop={() => toggleCompressor1()}
                  size={1}
                />
              </div>
              <button
                onClick={toggleCompressor1}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  compressor1State === 'running'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {compressor1State === 'running' ? 'STOP' : 'START'}
              </button>
              <p className="mt-2 text-sm text-gray-600">
                Clicca START/STOP o usa i controlli integrati
              </p>
            </div>
          </div>
        </div>

        {/* Stati Operativi */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Stati Operativi</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-3 text-green-700">RUNNING</h3>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <NitrogenCompressor
                  state="running"
                  pressure={8.7}
                  temperature={67}
                  label="NC-RUN"
                  pipeExitSide="right"
                  size={0.55}
                />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-3 text-yellow-700">STANDBY</h3>
              <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                <NitrogenCompressor
                  state="standby"
                  pressure={12.0}
                  temperature={45}
                  label="NC-STB"
                  pipeExitSide="top"
                  size={0.55}
                />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-3 text-red-700">ALARM</h3>
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                <NitrogenCompressor
                  state="alarm"
                  pressure={2.1}
                  temperature={89}
                  label="NC-ALM"
                  pipeExitSide="left"
                  size={0.55}
                />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">STOPPED</h3>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <NitrogenCompressor
                  state="stopped"
                  pressure={0}
                  temperature={25}
                  label="NC-OFF"
                  pipeExitSide="bottom"
                  size={0.55}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NitrogenCompressorFinalDemo;
