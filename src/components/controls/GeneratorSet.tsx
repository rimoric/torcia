import React, { useState, useEffect } from 'react';

// Configurazione gruppo elettrogeno (facilmente modificabile)
const GENERATOR_SET_CONFIG = {
  // Dimensioni base
  width: 120,
  height: 80,
  
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
    warning: {
      name: "AVVISO",
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
    body: "#2D3748",          // grigio scuro per corpo
    bodyHighlight: "#4A5568", // grigio medio
    bodyShadow: "#1A202C",    // grigio molto scuro
    border: "#1F2937",        // bordi
    text: "#1F2937",
    exhaust: "#8B4513"        // marrone per scarico
  },
  
  // Testo e etichette
  showStateText: true,
  showLabel: true,
  
  // Stili 3D
  strokeWidth: 2,
  shadowOffset: 4,
  fontSize: {
    state: 10,
    label: 12,
    popup: 14
  }
};

type GeneratorState = 'stopped' | 'running' | 'warning' | 'alarm';

interface GeneratorSetProps {
  // Stato del gruppo elettrogeno
  state: GeneratorState;
  
  // Configurazione
  label?: string;
  
  // Controlli
  manualControlEnabled?: boolean;
  onStart?: () => void;
  onStop?: () => void;
  
  // Styling opzionale
  size?: number;
  className?: string;
}

const GeneratorSet: React.FC<GeneratorSetProps> = ({
  state,
  label = "GE001",
  manualControlEnabled = false,
  onStart,
  onStop,
  size = 1,
  className = ""
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isRunning, setIsRunning] = useState(state === 'running');

  // Animazione motore (vibrazioni quando in funzione)
  const [engineVibration, setEngineVibration] = useState(0);

  useEffect(() => {
    if (state === 'running') {
      const interval = setInterval(() => {
        setEngineVibration(Math.random() * 2 - 1); // Vibrazione tra -1 e +1
      }, 100);
      return () => clearInterval(interval);
    } else {
      setEngineVibration(0);
    }
  }, [state]);

  // Dimensioni scalate
  const width = GENERATOR_SET_CONFIG.width * size;
  const height = GENERATOR_SET_CONFIG.height * size;
  
  // Colori attuali basati sullo stato
  const currentState = GENERATOR_SET_CONFIG.states[state];
  const currentColors = currentState.colors;
  
  // Calcolo dimensioni SVG
  const svgWidth = width + 60;
  const svgHeight = height + 80;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Gestione click per popup
  const handleClick = () => {
    setShowPopup(true);
  };

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
    <div className={`inline-block relative ${className}`}>
      <svg 
        width={svgWidth} 
        height={svgHeight}
        className="cursor-pointer"
        onClick={handleClick}
      >
        {/* Definizione gradienti 3D */}
        <defs>
          {/* Gradiente corpo generatore */}
          <linearGradient id={`body-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={GENERATOR_SET_CONFIG.colors.bodyHighlight} />
            <stop offset="50%" stopColor={GENERATOR_SET_CONFIG.colors.body} />
            <stop offset="100%" stopColor={GENERATOR_SET_CONFIG.colors.bodyShadow} />
          </linearGradient>

          {/* Gradiente stato */}
          <radialGradient id={`state-gradient-${label}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor={currentColors.highlight} />
            <stop offset="70%" stopColor={currentColors.primary} />
            <stop offset="100%" stopColor={currentColors.secondary} />
          </radialGradient>

          {/* Ombra */}
          <filter id={`shadow-gen-${label}`} x="-50%" y="-50%" width="200%" height="200%">
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

        {/* Ombra del corpo */}
        <rect
          x={centerX - width/2 + GENERATOR_SET_CONFIG.shadowOffset + engineVibration}
          y={centerY - height/2 + GENERATOR_SET_CONFIG.shadowOffset + engineVibration}
          width={width}
          height={height}
          fill={GENERATOR_SET_CONFIG.colors.bodyShadow}
          opacity={0.4}
          rx={8}
        />
        
        {/* Corpo principale del generatore */}
        <rect
          x={centerX - width/2 + engineVibration}
          y={centerY - height/2 + engineVibration}
          width={width}
          height={height}
          fill={`url(#body-gradient-${label})`}
          stroke={GENERATOR_SET_CONFIG.colors.border}
          strokeWidth={GENERATOR_SET_CONFIG.strokeWidth}
          rx={8}
          filter={`url(#shadow-gen-${label})`}
        />

        {/* Griglia di ventilazione */}
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((pos, i) => (
          <line
            key={i}
            x1={centerX - width/2 + 10 + engineVibration}
            y1={centerY - height/2 + height * pos + engineVibration}
            x2={centerX + width/2 - 10 + engineVibration}
            y2={centerY - height/2 + height * pos + engineVibration}
            stroke={GENERATOR_SET_CONFIG.colors.bodyHighlight}
            strokeWidth={1}
            opacity={0.6}
          />
        ))}

        {/* Scarico/Camino */}
        <rect
          x={centerX + width/2 - 8 + engineVibration}
          y={centerY - height/2 - 15 + engineVibration}
          width={12}
          height={20}
          fill={GENERATOR_SET_CONFIG.colors.exhaust}
          stroke={GENERATOR_SET_CONFIG.colors.border}
          strokeWidth={1}
          rx={2}
        />

        {/* Fumo quando in funzione */}
        {state === 'running' && (
          <g>
            {[1, 2, 3].map((i) => (
              <circle
                key={i}
                cx={centerX + width/2 - 2 + engineVibration}
                cy={centerY - height/2 - 20 - i * 8 + engineVibration}
                r={2 + i}
                fill="#B0B0B0"
                opacity={0.3 - i * 0.1}
              />
            ))}
          </g>
        )}

        {/* Pannello di controllo */}
        <rect
          x={centerX - width/3 + engineVibration}
          y={centerY - height/4 + engineVibration}
          width={width/1.5}
          height={height/2}
          fill="#1A1A1A"
          stroke={GENERATOR_SET_CONFIG.colors.border}
          strokeWidth={1}
          rx={3}
        />

        {/* LED di stato principale */}
        <circle
          cx={centerX - width/6 + engineVibration}
          cy={centerY - height/8 + engineVibration}
          r={6}
          fill={`url(#state-gradient-${label})`}
          stroke={GENERATOR_SET_CONFIG.colors.border}
          strokeWidth={1}
        />

        {/* Riflesso LED */}
        <circle
          cx={centerX - width/6 - 2 + engineVibration}
          cy={centerY - height/8 - 2 + engineVibration}
          r={2}
          fill="white"
          opacity={0.8}
        />

        {/* Testo stato sul pannello */}
        <text
          x={centerX + width/8 + engineVibration}
          y={centerY - height/8 + 2 + engineVibration}
          fontSize={8}
          fontWeight="bold"
          fill={currentColors.primary}
          textAnchor="middle"
        >
          {currentState.name}
        </text>

        {/* Simbolo GE */}
        <text
          x={centerX + engineVibration}
          y={centerY + height/3 + engineVibration}
          textAnchor="middle"
          fontSize={14}
          fontWeight="bold"
          fill="white"
          opacity={0.7}
        >
          GE
        </text>
        
        {/* Etichetta del generatore */}
        {GENERATOR_SET_CONFIG.showLabel && (
          <text
            x={centerX}
            y={svgHeight - 15}
            textAnchor="middle"
            fontSize={GENERATOR_SET_CONFIG.fontSize.label}
            fontWeight="bold"
            fill={GENERATOR_SET_CONFIG.colors.text}
          >
            {label}
          </text>
        )}

        {/* Controlli manuali (se abilitati) */}
        {manualControlEnabled && (
          <g>
            {/* Pulsante START */}
            <rect
              x={centerX - width/2 - 25}
              y={centerY - 15}
              width={20}
              height={15}
              fill="#10B981"
              stroke="#047857"
              strokeWidth={1}
              rx={3}
              className="cursor-pointer"
              onClick={handleStart}
            />
            <text
              x={centerX - width/2 - 15}
              y={centerY - 6}
              textAnchor="middle"
              fontSize={6}
              fontWeight="bold"
              fill="white"
            >
              START
            </text>

            {/* Pulsante STOP */}
            <rect
              x={centerX - width/2 - 25}
              y={centerY + 2}
              width={20}
              height={15}
              fill="#DC2626"
              stroke="#7F1D1D"
              strokeWidth={1}
              rx={3}
              className="cursor-pointer"
              onClick={handleStop}
            />
            <text
              x={centerX - width/2 - 15}
              y={centerY + 11}
              textAnchor="middle"
              fontSize={6}
              fontWeight="bold"
              fill="white"
            >
              STOP
            </text>
          </g>
        )}
      </svg>

      {/* Popup finestra parametri */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header popup */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Gruppo Elettrogeno - {label}
              </h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Stato principale */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`p-4 rounded-lg border-2 ${
                state === 'running' ? 'border-green-500 bg-green-50' :
                state === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                state === 'alarm' ? 'border-red-500 bg-red-50' :
                'border-gray-400 bg-gray-50'
              }`}>
                <h3 className="font-semibold text-lg mb-2">Stato Operativo</h3>
                <div className={`text-2xl font-bold ${
                  state === 'running' ? 'text-green-600' :
                  state === 'warning' ? 'text-yellow-600' :
                  state === 'alarm' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {currentState.name}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-300 bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">Ore di Funzionamento</h3>
                <div className="text-2xl font-bold text-gray-800">1,247 h</div>
              </div>

              <div className="p-4 rounded-lg border border-gray-300 bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">Ultimo Avvio</h3>
                <div className="text-lg text-gray-800">19/09/2025 14:32</div>
              </div>
            </div>

            {/* Sezioni parametri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Parametri Motore */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Parametri Motore</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Temperatura H2O:</span>
                    <span className="font-semibold">78°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Pressione Olio:</span>
                    <span className="font-semibold">4.2 bar</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Giri Motore:</span>
                    <span className="font-semibold">1,500 rpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Livello Carburante:</span>
                    <span className="font-semibold">75%</span>
                  </div>
                </div>
              </div>

              {/* Parametri Elettrici */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-4">Parametri Elettrici</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tensione L1-N:</span>
                    <span className="font-semibold">230V</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tensione L2-N:</span>
                    <span className="font-semibold">229V</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tensione L3-N:</span>
                    <span className="font-semibold">231V</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Frequenza:</span>
                    <span className="font-semibold">50.0 Hz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Potenza:</span>
                    <span className="font-semibold">45 kW</span>
                  </div>
                </div>
              </div>

              {/* Allarmi e Avvisi */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">Allarmi e Avvisi</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Nessun allarme attivo</div>
                  <div className="text-sm text-gray-600">Nessun avviso attivo</div>
                  <div className="text-sm text-gray-500 mt-4">
                    <strong>Ultimo allarme:</strong><br/>
                    18/09/2025 09:15 - Bassa pressione olio (risolto)
                  </div>
                </div>
              </div>

              {/* Manutenzione */}
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-800 mb-4">Manutenzione</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Cambio Olio:</span>
                    <span className="font-semibold text-green-600">OK (47h fa)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Filtro Aria:</span>
                    <span className="font-semibold text-yellow-600">183h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Prossima Rev.:</span>
                    <span className="font-semibold">253h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nota per sviluppi futuri */}
            <div className="mt-8 p-4 bg-blue-100 rounded-lg border border-blue-300">
              <p className="text-blue-800 text-sm">
                <strong>Nota:</strong> Questa è la struttura base del popup. I parametri specifici e la lista completa 
                verranno implementati quando avremo la documentazione dettagliata dei parametri del gruppo elettrogeno.
              </p>
            </div>

            {/* Comandi manuali nel popup */}
            {manualControlEnabled && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Comandi Manuali</h3>
                <div className="flex gap-4">
                  <button
                    onClick={onStart}
                    disabled={state === 'running'}
                    className={`px-6 py-3 rounded-lg font-semibold ${
                      state === 'running' 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    AVVIA GENERATORE
                  </button>
                  <button
                    onClick={onStop}
                    disabled={state === 'stopped'}
                    className={`px-6 py-3 rounded-lg font-semibold ${
                      state === 'stopped'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    FERMA GENERATORE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente Demo
const GeneratorSetDemo: React.FC = () => {
  const [gen1State, setGen1State] = useState<GeneratorState>('running');
  const [gen2State, setGen2State] = useState<GeneratorState>('stopped');
  const [gen3State, setGen3State] = useState<GeneratorState>('warning');
  const [gen4State, setGen4State] = useState<GeneratorState>('alarm');
  const [manualControlEnabled, setManualControlEnabled] = useState(false);

  // Simulazione automatica
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    if (autoMode) {
      const interval = setInterval(() => {
        // Simulazione cambio stati
        if (Math.random() > 0.9) {
          const states: GeneratorState[] = ['stopped', 'running', 'warning', 'alarm'];
          setGen1State(states[Math.floor(Math.random() * states.length)]);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoMode]);

  const handleStart = (setStateFunc: (state: GeneratorState) => void) => {
    setStateFunc('running');
  };

  const handleStop = (setStateFunc: (state: GeneratorState) => void) => {
    setStateFunc('stopped');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Gruppo Elettrogeno - Dashboard Industriale
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
          <div className="mt-3 text-xs text-blue-600">
            💡 <strong>Clicca sui gruppi elettrogeni</strong> per aprire la finestra dettagli parametri
          </div>
        </div>

        {/* Griglia gruppi elettrogeni */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* GE1 - Running */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Gruppo Elettrogeno - In Funzione
            </h3>
            <div className="flex justify-center">
              <GeneratorSet
                state={gen1State}
                label="GE001"
                manualControlEnabled={manualControlEnabled}
                onStart={() => handleStart(setGen1State)}
                onStop={() => handleStop(setGen1State)}
                size={0.8}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-600">
                Stato: <span className={`font-semibold ${
                  gen1State === 'running' ? 'text-green-600' :
                  gen1State === 'warning' ? 'text-yellow-600' :
                  gen1State === 'alarm' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {GENERATOR_SET_CONFIG.states[gen1State].name}
                </span>
              </div>
              <div className="text-gray-600">Potenza: 45 kW</div>
            </div>
          </div>

          {/* GE2 - Stopped */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Gruppo Elettrogeno - Fermo
            </h3>
            <div className="flex justify-center">
              <GeneratorSet
                state={gen2State}
                label="GE002"
                manualControlEnabled={manualControlEnabled}
                onStart={() => handleStart(setGen2State)}
                onStop={() => handleStop(setGen2State)}
                size={0.8}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-600">
                Stato: <span className="font-semibold text-gray-600">FERMO</span>
              </div>
              <div className="text-gray-600">Standby: OK</div>
            </div>
          </div>

          {/* GE3 - Warning */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Gruppo Elettrogeno - Avviso
            </h3>
            <div className="flex justify-center">
              <GeneratorSet
                state={gen3State}
                label="GE003"
                manualControlEnabled={manualControlEnabled}
                onStart={() => handleStart(setGen3State)}
                onStop={() => handleStop(setGen3State)}
                size={0.8}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-600">
                Stato: <span className="font-semibold text-yellow-600">AVVISO</span>
              </div>
              <div className="text-gray-600">Manutenzione richiesta</div>
            </div>
          </div>

          {/* GE4 - Alarm */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-gray-700">
              Gruppo Elettrogeno - Allarme
            </h3>
            <div className="flex justify-center">
              <GeneratorSet
                state={gen4State}
                label="GE004"
                manualControlEnabled={manualControlEnabled}
                onStart={() => handleStart(setGen4State)}
                onStop={() => handleStop(setGen4State)}
                size={0.8}
              />
            </div>
            <div className="mt-3 text-xs text-center space-y-1">
              <div className="text-gray-600">
                Stato: <span className="font-semibold text-red-600">ALLARME</span>
              </div>
              <div className="text-gray-600">Intervento necessario</div>
            </div>
          </div>
        </div>

        {/* Pannello di stato sistema */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Sistema Gruppi Elettrogeni</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'GE001', state: gen1State, power: '45 kW' },
              { label: 'GE002', state: gen2State, power: '50 kW' },
              { label: 'GE003', state: gen3State, power: '60 kW' },
              { label: 'GE004', state: gen4State, power: '45 kW' }
            ].map((gen, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                gen.state === 'running' ? 'border-green-500 bg-green-50' :
                gen.state === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                gen.state === 'alarm' ? 'border-red-500 bg-red-50' :
                'border-gray-400 bg-gray-50'
              }`}>
                <div className="text-sm font-semibold text-gray-700">{gen.label}</div>
                <div className="text-xs text-gray-600">{gen.power}</div>
                <div className={`text-xs font-semibold ${
                  gen.state === 'running' ? 'text-green-600' :
                  gen.state === 'warning' ? 'text-yellow-600' :
                  gen.state === 'alarm' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {GENERATOR_SET_CONFIG.states[gen.state].name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informazioni tecniche */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Gruppo Elettrogeno - Caratteristiche</h3>
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
                  <span><strong>AVVISO:</strong> Manutenzione richiesta</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span><strong>ALLARME:</strong> Intervento necessario</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span><strong>FERMO:</strong> Spento/Standby</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Funzionalità:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Popup dettagli:</strong> Click per parametri</div>
                <div>• <strong>Animazione:</strong> Vibrazioni quando attivo</div>
                <div>• <strong>Comandi manuali:</strong> START/STOP</div>
                <div>• <strong>Monitoraggio:</strong> Stati in tempo reale</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Parametri Monitrati:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• <strong>Motore:</strong> Temp, pressione, giri</div>
                <div>• <strong>Elettrici:</strong> Tensioni, frequenza, potenza</div>
                <div>• <strong>Allarmi:</strong> Storico e attivi</div>
                <div>• <strong>Manutenzione:</strong> Scadenze e controlli</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorSetDemo;
