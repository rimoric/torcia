import React, { useState, useEffect } from 'react';

// Configurazione compressore azoto (facilmente modificabile)
const NITROGEN_COMPRESSOR_CONFIG = {
  // Dimensioni base
  tankWidth: 180,
  tankHeight: 80,
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

interface NitrogenCompressorProps {
  // Stato del compressore
  state: CompressorState;
  pressure: number;        // Pressione di uscita in bar
  temperature: number;     // Temperatura in °C
  
  // Configurazione
  label?: string;
  
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

  // Dimensioni scalate
  const tankWidth = NITROGEN_COMPRESSOR_CONFIG.tankWidth * size;
  const tankHeight = NITROGEN_COMPRESSOR_CONFIG.tankHeight * size;
  const motorWidth = NITROGEN_COMPRESSOR_CONFIG.motorWidth * size;
  const motorHeight = NITROGEN_COMPRESSOR_CONFIG.motorHeight * size;
  
  // Colori attuali basati sullo stato
  const currentState = NITROGEN_COMPRESSOR_CONFIG.states[state];
  const currentColors = currentState.colors;
  
  // Calcolo dimensioni SVG
  const svgWidth = tankWidth + motorWidth + 100;
  const svgHeight = Math.max(tankHeight, motorHeight) + 120;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  // Posizioni componenti
  const tankX = centerX - tankWidth/2;
  const tankY = centerY - tankHeight/2;
  const motorX = tankX + tankWidth + 20;
  const motorY = centerY - motorHeight/2;

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

        {/* Valvola di uscita */}
        <rect
          x={tankX + tankWidth - 15 + vibration}
          y={tankY + tankHeight/2 - 8 + vibration}
          width={25}
          height={16}
          fill={NITROGEN_COMPRESSOR_CONFIG.colors.pipe}
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={1}
          rx={3}
        />

        {/* Tubazione di uscita */}
        <rect
          x={tankX + tankWidth + 10 + vibration}
          y={tankY + tankHeight/2 - 4 + vibration}
          width={30}
          height={8}
          fill={NITROGEN_COMPRESSOR_CONFIG.colors.pipe}
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={1}
          rx={2}
        />

        {/* Ombra motore */}
        <rect
          x={motorX + NITROGEN_COMPRESSOR_CONFIG.shadowOffset + vibration}
          y={motorY + NITROGEN_COMPRESSOR_CONFIG.shadowOffset + vibration}
          width={motorWidth}
          height={motorHeight}
          fill={NITROGEN_COMPRESSOR_CONFIG.colors.tankShadow}
          opacity={0.4}
          rx={8}
        />

        {/* Motore elettrico */}
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
          const rotation = state === 'running' ? angle + (Date.now() / 50) % 360 : angle;
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

        {/* Connessione meccanica serbatoio-motore */}
        <rect
          x={tankX + tankWidth/2 - 5 + vibration}
          y={motorY + motorHeight/2 - 4 + vibration}
          width={motorX - tankX - tankWidth/2 + 5}
          height={8}
          fill={NITROGEN_COMPRESSOR_CONFIG.colors.motor}
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={1}
          rx={2}
        />

        {/* Manometro */}
        <circle
          cx={tankX + tankWidth - 30 + vibration}
          cy={tankY + 15 + vibration}
          r={12}
          fill="white"
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={2}
        />
        
        <circle
          cx={tankX + tankWidth - 30 + vibration}
          cy={tankY + 15 + vibration}
          r={8}
          fill={`url(#state-gradient-${label})`}
        />

        {/* Lancetta manometro */}
        <line
          x1={tankX + tankWidth - 30 + vibration}
          y1={tankY + 15 + vibration}
          x2={tankX + tankWidth - 30 + 6 + vibration}
          y2={tankY + 15 - 2 + vibration}
          stroke="white"
          strokeWidth={2}
        />

        {/* Display pressione */}
        {NITROGEN_COMPRESSOR_CONFIG.showPressure && (
          <g>
            <rect
              x={tankX + 20 + vibration}
              y={tankY - 30 + vibration}
              width={80}
              height={25}
              fill={currentColors.primary}
              stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
              strokeWidth={1}
              rx={4}
            />
            
            <text
              x={tankX + 60 + vibration}
              y={tankY - 12 + vibration}
              textAnchor="middle"
              fontSize={NITROGEN_COMPRESSOR_CONFIG.fontSize.pressure}
              fontWeight="bold"
              fill="white"
            >
              {displayPressure.toFixed(NITROGEN_COMPRESSOR_CONFIG.decimals)} {NITROGEN_COMPRESSOR_CONFIG.units}
            </text>
          </g>
        )}

        {/* Display temperatura */}
        {NITROGEN_COMPRESSOR_CONFIG.showTemperature && (
          <g>
            <rect
              x={motorX + 5 + vibration}
              y={motorY - 25 + vibration}
              width={50}
              height={18}
              fill="#E5E7EB"
              stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
              strokeWidth={1}
              rx={3}
            />
            
            <text
              x={motorX + 30 + vibration}
              y={motorY - 12 + vibration}
              textAnchor="middle"
              fontSize={NITROGEN_COMPRESSOR_CONFIG.fontSize.temperature}
              fontWeight="bold"
              fill={NITROGEN_COMPRESSOR_CONFIG.colors.text}
            >
              {Math.round(displayTemp)}°C
            </text>
          </g>
        )}

        {/* LED di stato */}
        <circle
          cx={tankX + tankWidth/2 + vibration}
          cy={tankY - 15 + vibration}
          r={8}
          fill={`url(#state-gradient-${label})`}
          stroke={NITROGEN_COMPRESSOR_CONFIG.colors.border}
          strokeWidth={2}
        />

        {/* Riflesso LED */}
        <circle
          cx={tankX + tankWidth/2 - 2 + vibration}
          cy={tankY - 17 + vibration}
          r={3}
          fill="white"
          opacity={0.8}
        />

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

        {/* Simbolo NC */}
        <text
          x={tankX + tankWidth/2 + vibration}
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
              x={20}
              y={centerY - 15}
              width={30}
              height={20}
              fill="#10B981"
              stroke="#047857"
              strokeWidth={1}
              rx={4}
              className="cursor-pointer"
              onClick={handleStart}
            />
            <text
              x={35}
              y={centerY - 2}
              textAnchor="middle"
              fontSize={8}
              fontWeight="bold"
              fill="white"
            >
              START
            </text>

            {/* Pulsante STOP */}
            <rect
              x={20}
              y={centerY + 8}
              width={30}
              height={20}
              fill="#DC2626"
              stroke="#7F1D1D"
              strokeWidth={1}
              rx={4}
              className="cursor-pointer"
              onClick={handleStop}
            />
            <text
              x={35}
              y={centerY + 21}
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

// Componente Demo
const NitrogenCompressorDemo: React.FC = () => {
  const [comp1State, setComp1State] = useState<CompressorState>('running');
  const [comp1Pressure, setComp1Pressure] = useState(8.5);
  const [comp1Temp, setComp1Temp] = useState(65);

  const [comp2State, setComp2State] = useState<CompressorState>('standby');
  const [comp2Pressure, setComp2Pressure] = useState(12.0);
  const [comp2Temp, setComp2Temp] = useState(45);

  const [comp3State, setComp3State] = useState<CompressorState>('alarm');
  const [comp3Pressure, setComp3Pressure] = useState(2.1);
  const [comp3Temp, setComp3Temp] = useState(85);

  const [comp4State, setComp4State] = useState<CompressorState>('stopped');
  const [comp4Pressure, setComp4Pressure] = useState(0.0);
  const [comp4Temp, setComp4Temp] = useState(25);

  const [manualControlEnabled, setManualControlEnabled] = useState(false);

  // Simulazione automatica
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    if (autoMode) {
      const interval = setInterval(() => {
        // Simulazione variazioni parametri
        if (comp1State === 'running') {
          setComp1Pressure(prev => Math.max(0, Math.min(15, prev + (Math.random() - 0.5) * 0.5)));
          setComp1Temp(prev => Math.max(20, Math.min(90, prev + (Math.random() - 0.5) * 2)));
        }
        
        if (comp2State === 'standby') {
          setComp2Pressure(prev => Math.max(10, Math.min(15, prev + (Math.random() - 0.5) * 0.2)));
          setComp2Temp(prev => Math.max(30, Math.min(60, prev + (Math.random() - 0.5) * 1)));
        }
        
        // Simulazione cambio stati occasionale
        if (Math.random() > 0.95) {
          const states: CompressorState[] = ['stopped', 'running', 'standby', 'alarm'];
          setComp1State(states[Math.floor(Math.random() * states.length)]);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [autoMode, comp1State, comp2State]);

  const handleStart = (setStateFunc: (state: CompressorState) => void) => {
    setStateFunc('running');
  };

  const handleStop = (setStateFunc: (state: CompressorState) => void) => {
    setStateFunc('stopped');
  };

  const getStateColor = (state: CompressorState) => {
    switch (state) {
      case 'running': return 'text-green-600';
      case 'standby': return 'text-yellow-600';
      case 'alarm': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Compressore di Azoto - Dashboard Industriale
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
              <span className="text-sm font-medium">Abilita Comandi Manuali</span>
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
                ● Comandi manuali attivi - usa pulsanti START/STOP
              </span>
            )}
          </div>
        </div>

        {/* Griglia compressori */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Compressore 1 - Running */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Compressore - In Funzione
            </h3>
            <div className="flex justify-center">
              <NitrogenCompressor
                state={comp1State}
                pressure={comp1Pressure}
                temperature={comp1Temp}
                label="NC001"
                manualControlEnabled={manualControlEnabled}
                onStart={() => handleStart(setComp1State)}
                onStop={() => handleStop(setComp1State)}
                size={0.6}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-gray-600">Stato</div>
                <div className={`font-semibold ${getStateColor(comp1State)}`}>
                  {NITROGEN_COMPRESSOR_CONFIG.states[comp1State].name}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Pressione</div>
                <div className="font-semibold text-blue-600">
                  {comp1Pressure.toFixed(1)} bar
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Temperatura</div>
                <div className="font-semibold text-orange-600">
                  {Math.round(comp1Temp)}°C
                </div>
              </div>
            </div>
          </div>

          {/* Compressore 2 - Standby */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Compressore - Standby
            </h3>
            <div className="flex justify-center">
              <NitrogenCompressor
                state={comp2State}
                pressure={comp2Pressure}
                temperature={comp2Temp}
                label="NC002"
                manualControlEnabled={manualControlEnabled}
                onStart={() => handleStart(setComp2State)}
                onStop={() => handleStop(setComp2State)}
                size={0.6}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-gray-600">Stato</div>
                <div className={`font-semibold ${getStateColor(comp2State)}`}>
                  {NITROGEN_COMPRESSOR_CONFIG.states[comp2State].name}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Pressione</div>
                <div className="font-semibold text-blue-600">
                  {comp2Pressure.toFixed(1)} bar
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Temperatura</div>
                <div className="font-semibold text-orange-600">
                  {Math.round(comp2Temp)}°C
                </div>
              </div>
            </div>
          </div>

          {/* Compressore 3 - Allarme */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Compressore - Allarme
            </h3>
            <div className="flex justify-center">
              <NitrogenCompressor
                state={comp3State}
                pressure={comp3Pressure}
                temperature={comp3Temp}
                label="NC003"
                manualControlEnabled={manualControlEnabled}
                onStart={() => handleStart(setComp3State)}
                onStop={() => handleStop(setComp3State)}
                size={0.6}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-gray-600">Stato</div>
                <div className={`font-semibold ${getStateColor(comp3State)}`}>
                  {NITROGEN_COMPRESSOR_CONFIG.states[comp3State].name}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Pressione</div>
                <div className="font-semibold text-red-600">
                  {comp3Pressure.toFixed(1)} bar
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Temperatura</div>
                <div className="font-semibold text-red-600">
                  {Math.round(comp3Temp)}°C
                </div>
              </div>
            </div>
          </div>

          {/* Compressore 4 - Fermo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              Compressore - Fermo
            </h3>
            <div className="flex justify-center">
              <NitrogenCompressor
                state={comp4State}
                pressure={comp4Pressure}
                temperature={comp4Temp}
                label="NC004"
                manualControlEnabled={manualControlEnabled}
                onStart={() => handleStart(setComp4State)}
                onStop={() => handleStop(setComp4State)}
                size={0.6}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-gray-600">Stato</div>
                <div className={`font-semibold ${getStateColor(comp4State)}`}>
                  {NITROGEN_COMPRESSOR_CONFIG.states[comp4State].name}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Pressione</div>
                <div className="font-semibold text-gray-600">
                  {comp4Pressure.toFixed(1)} bar
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Temperatura</div>
                <div className="font-semibold text-gray-600">
                  {Math.round(comp4Temp)}°C
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pannello di stato sistema */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Sistema Compressori Azoto</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'NC001', state: comp1State, pressure: comp1Pressure, temp: comp1Temp },
              { label: 'NC002', state: comp2State, pressure: comp2Pressure, temp: comp2Temp },
              { label: 'NC003', state: comp3State, pressure: comp3Pressure, temp: comp3Temp },
              { label: 'NC004', state: comp4State, pressure: comp4Pressure, temp: comp4Temp }
            ].map((comp, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                comp.state === 'running' ? 'border-green-500 bg-green-50' :
                comp.state === 'standby' ? 'border-yellow-500 bg-yellow-50' :
                comp.state === 'alarm' ? 'border-red-500 bg-red-50' :
                'border-gray-400 bg-gray-50'
              }`}>
                <div className="text-sm font-semibold text-gray-700">{comp.label}</div>
                <div className="text-sm font-bold text-gray-800">
                  {comp.pressure.toFixed(1)} bar
                </div>
                <div className="text-xs text-orange-600">
                  {Math.round(comp.temp)}°C
                </div>
                <div className={`text-xs font-semibold ${getStateColor(comp.state)}`}>
                  {NITROGEN_COMPRESSOR_CONFIG.states[comp.state].name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informazioni tecniche */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Compressore Azoto - Specifiche</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Stati Operativi:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span><strong>RUN:</strong> In funzione normale</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span><strong>STANDBY:</strong> In attesa pressostato</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span><strong>ALLARME:</strong> Guasto/sovrapressione</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span><strong>FERMO:</strong> Spento</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Componenti:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Serbatoio:</strong> Cilindrico orizzontale</div>
                <div>• <strong>Motore elettrico:</strong> Con ventola raffreddamento</div>
                <div>• <strong>Manometro:</strong> Controllo pressione</div>
                <div>• <strong>Valvole:</strong> Uscita e sicurezza</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Monitoraggio:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Pressione:</strong> 0-15 bar</div>
                <div>• <strong>Temperatura:</strong> Controllo surriscaldamento</div>
                <div>• <strong>Vibrazioni:</strong> Quando in funzione</div>
                <div>• <strong>Ventola animata:</strong> Rotazione quando attivo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NitrogenCompressorDemo;
