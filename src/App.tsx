// App.tsx - Dashboard Principale Torcia - MODIFIED SEQUENCE
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Menu, X, FileText } from "lucide-react";
import SchemaImpianto from './SchemaImpianto';
import { Fase } from './types';
import MenuBar from './MenuBar';
import Settings, { SettingsLimits } from './Settings';
import NumericInput from './NumericInput';

// MODIFIED: Updated step titles with new panel structure
const STEP_TITLES = [
  "Dati serbatoio completi",                    // 0 - Consolidated: P0, capacity, temperature, fill%
  "Selezionare pressione target",               // 1 - With preset levels 12/14/16 bar + custom
  "Scelta bombole",                            // 2 - Individual bottle selection and configuration
  "Verifiche iniziali",                        // 3 - Vallen setup and sensor checks
  "Gruppo Elettrogeno",                        // 4 - GE startup sequence with progress bar
  "Attivare utenze",                           // 5 - Single checkbox for all utilities
  "Avvio pressurizzazione automatica",        // 6 - Pressurization start
  "Processo automatico e spegnimento",         // 7 - Consolidated: stasis + depressurization + discharge + GE shutdown
  "Salvataggio e conclusione",                 // 8 - Final save/print/terminate options
] as const;

// Wizard HMI sequenziale – simulazione con rampa pressione + controllo automatico bombole N₂
// Layout ristrutturato: Sidebar verticale + Area comandi centrale + Schema P&ID destra + Log popup

export default function App() {
  // Parametri serbatoio - ALL CONSOLIDATED IN STEP 0
  const [P0, setP0] = useState(1.0);
  const [volumeProdotto, setVolumeProdotto] = useState<number | "">("");
  const [temperatura, setTemperatura] = useState<number | "">("");  // Now "temperatura serbatoio"
  const [riempPerc, setRiempPerc] = useState<number | "">(""); // % di riempimento
  const [Pfinale, setPfinale] = useState<number | "">("");
  const [presetPressureLevel, setPresetPressureLevel] = useState<string>("custom"); // "12", "14", "16", "custom"

  // Bombole configuration - NEW FOR PANEL 2
  const [bombola1, setBombola1] = useState({ used: false, pressure: 180, volume: 50 });
  const [bombola2, setBombola2] = useState({ used: false, pressure: 180, volume: 50 });
  const [bombola3, setBombola3] = useState({ used: false, pressure: 180, volume: 50 });

  // Verifiche iniziali - MODIFIED FOR PANEL 3
  const [setupVallenLoaded, setSetupVallenLoaded] = useState(false);
  const [sensorsInstalled, setSensorsInstalled] = useState(false);
  const [sensorsWorking, setSensorsWorking] = useState(false);
  const [backgroundNoiseMonitored, setBackgroundNoiseMonitored] = useState(false);

  // GE startup sequence - MODIFIED FOR PANEL 4
  const [geStarted, setGeStarted] = useState(false);
  const [geWarmupComplete, setGeWarmupComplete] = useState(false);
  const [geOperational, setGeOperational] = useState(false);

  // Utilities - SIMPLIFIED FOR PANEL 5
  const [allUtilitiesOn, setAllUtilitiesOn] = useState(false);

  // Processo automatico - NEW FOR CONSOLIDATED PANEL 7
  const [processoAutomaticoStarted, setProcessoAutomaticoStarted] = useState(false);
  const [processoAutomaticoCompleto, setProcessoAutomaticoCompleto] = useState(false);
  const [geShutdownDone, setGeShutdownDone] = useState(false);

  // GE e utenze
  const [geOn, setGeOn] = useState(false);
  const [geRpm, setGeRpm] = useState(0);
  const [warmup, setWarmup] = useState(0);
  const warmRef = useRef<number | null>(null);
  const [compressoreOn, setCompressoreOn] = useState(false);
  const [essiccatoreOn, setEssiccatoreOn] = useState(false);
  const [genN2On, setGenN2On] = useState(false);

  // Valvole/regolatori (solo visual)
  const [PV1, setPV1] = useState(false);
  const [PV2, setPV2] = useState(false);
  const [PV4, setPV4] = useState(false);
  const [PV5, setPV5] = useState(false);
  const [PV6, setPV6] = useState(false);
  const [PR1open, setPR1open] = useState(false);
  const [PR2open, setPR2open] = useState(false);

  // Pressioni
  const [P_serb, setP_serb] = useState(1.0);
  const [P_bombole, setP_bombole] = useState(180); // sensore collettore pacco bombole (bar)

  // Stati processo
  const [fase, setFase] = useState<Fase>("Idle");
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [stasiCompletata, setStasiCompletata] = useState(false);
  const [depCompletata, setDepCompletata] = useState(false);
  const [scaricoLineeDone, setScaricoLineeDone] = useState(false);
  const [scaricoGenDone, setScaricoGenDone] = useState(false);
  
  // Progress bars
  const [pressurizzazioneProgress, setPressurizzazioneProgress] = useState(0);
  const [pressurizzazioneDuration, setPressurizzazioneDuration] = useState(30); // secondi stimati
  
  // Fine processo - Checklist finale
  const [checklistItems, setChecklistItems] = useState({
    pressioni: false,
    valvole: false,
    torcia: false,
    bombole: false,
    utenze: false,
    strumenti: false
  });
  
  // Fine processo
  const [processoCompletato, setProcessoCompletato] = useState(false);
  const [salvataggioRichiesto, setSalvataggioRichiesto] = useState(false);

  // Verifica bombole
  const [bomboleCheckDone, setBomboleCheckDone] = useState(false);
  const [bomboleOK, setBomboleOK] = useState<boolean | null>(null);
  const [bomboleMsg, setBomboleMsg] = useState<string>("");

  // UI Layout
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  
  // Settings limits
  const [settingsLimits, setSettingsLimits] = useState<SettingsLimits>({
    P0: { min: 0.5, max: 2.0 },
    Pfinale: { min: 1.0, max: 50.0 },
    volumeProdotto: { min: 100, max: 10000 },
    temperatura: { min: -20, max: 80 },
    riempPerc: { min: 10, max: 95 },
    geRpm: { min: 1500, max: 3000 },
    warmupTime: { min: 30, max: 300 },
    timerStasi: { min: 60, max: 1800 },
    timerDep: { min: 30, max: 600 },
    P_bombole: { min: 150, max: 300 }
  });
  
  // Refs per auto-scroll
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLButtonElement>(null);

  // Wizard
  const [uiStep, setUiStep] = useState(0);

  // Log
  const [log, setLog] = useState<string[]>([]);
  const pushLog = (msg: string) => setLog((l) => [`${new Date().toLocaleTimeString()}: ${msg}`, ...l]);

  // Export PDF function
  const handleExportPDF = () => {
    const reportData = {
      timestamp: new Date().toLocaleString(),
      parameters: {
        P0,
        Pfinale,
        volumeProdotto,
        temperatura,
        riempPerc
      },
      currentStep: uiStep + 1,
      totalSteps: STEP_TITLES.length,
      fase,
      pressioni: {
        P_serb,
        P_bombole
      },
      log: log.slice(0, 50) // Ultimi 50 eventi
    };
    
    // Simulazione esportazione PDF
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `torcia_report_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    pushLog(`Report esportato: ${exportFileDefaultName}`);
  };

  const handleSaveSettings = (newLimits: SettingsLimits) => {
    setSettingsLimits(newLimits);
    pushLog("Impostazioni limiti salvate");
    setSettingsOpen(false);
  };

  const genMax = 11.0; // solo per cambio label Fase2 oltre ~11 bar

  // Warm-up GE (10 secondi nella simulazione)
  const startWarmup = () => {
    if (!geOn || geRpm !== 1550) return;
    if (warmRef.current) window.clearInterval(warmRef.current);
    setWarmup(10);
    pushLog("Warm-up GE (10 s) avviato a 1550 rpm.");
    warmRef.current = window.setInterval(() => {
      setWarmup((t) => {
        if (t <= 1) {
          if (warmRef.current) { window.clearInterval(warmRef.current); warmRef.current = null; }
          pushLog("Warm-up completato - GE pronto per 3000 rpm.");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  // Stima semplice sufficienza bombole (bar·L)
  function verificaBombole() {
    setBomboleCheckDone(true);
    setBomboleOK(null);
    const vol = typeof volumeProdotto === "number" ? volumeProdotto : NaN;
    const fperc = typeof riempPerc === "number" ? riempPerc : NaN;
    const target = typeof Pfinale === "number" ? Pfinale : NaN;
    if (!isFinite(vol) || !isFinite(fperc) || !isFinite(target)) {
      setBomboleMsg("Dati incompleti (volume/% riempimento/target).");
      setBomboleOK(false);
      return;
    }
    const volEff = vol * (fperc / 100);
    const needed = volEff * (target - P0);
    const disponibile = 100 * P_bombole; // 100L a ~180bar = 18000 barL
    pushLog(`Verifica bombole: serve ${needed.toFixed(0)} bar·L, disponibile ${disponibile.toFixed(0)} bar·L.`);
    if (needed <= disponibile) {
      setBomboleMsg(`OK: ${needed.toFixed(0)} bar·L richiesti, ${disponibile.toFixed(0)} bar·L disponibili.`);
      setBomboleOK(true);
    } else {
      setBomboleMsg(`ATTENZIONE: servono ${needed.toFixed(0)} bar·L, disponibili solo ${disponibile.toFixed(0)} bar·L!`);
      setBomboleOK(false);
    }
  }

  // Timer
  const startTimer = (seconds: number) => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setTimer(seconds);
    timerRef.current = window.setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null; }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  // Simulazione rampa pressione
  useEffect(() => {
    if (fase === "Pressurizzazione") {
      const targetP = typeof Pfinale === "number" ? Pfinale : 10;
      if (P_serb < targetP) {
        const rampTimer = window.setTimeout(() => {
          setP_serb((p) => Math.min(p + 0.2, targetP));
        }, 300);
        return () => window.clearTimeout(rampTimer);
      }
    }
  }, [P_serb, fase, Pfinale]);

  // Auto-scroll sidebar to active step
  useEffect(() => {
    if (activeStepRef.current && sidebarRef.current) {
      // Scroll sempre all'ultimo step attivo
      setTimeout(() => {
        const activeStep = activeStepRef.current;
        if (activeStep) {
          activeStep.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  }, [uiStep]);

  // Funzioni wizard
  const back = () => {
    if (uiStep > 0) {
      setUiStep(uiStep - 1);
      pushLog(`Tornato al passo ${uiStep}.`);
    }
  };

  const next = () => {
    if (uiStep < STEP_TITLES.length - 1) {
      pushLog(`Passaggio al passo ${uiStep + 2}.`);
      setUiStep(uiStep + 1);
    } else {
      // Fine processo
      setProcessoCompletato(true);
      setSalvataggioRichiesto(true);
      pushLog("Processo completato!");
    }
  };

  // Check se tutti i checkbox della checklist sono selezionati
  const allChecklistCompleted = () => {
    return Object.values(checklistItems).every(item => item === true);
  };

  // MODIFIED: Updated canProceed logic for new simplified step sequence
  const canProceed = (): boolean => {
    switch (uiStep) {
      case 0: // Consolidated tank data
        return P0 > 0 && 
               typeof volumeProdotto === "number" && volumeProdotto > 0 &&
               typeof temperatura === "number" && 
               typeof riempPerc === "number" && riempPerc > 0;
      case 1: // Target pressure with presets
        return typeof Pfinale === "number" && Pfinale > P0;
      case 2: // Bottle selection
        return bombola1.used || bombola2.used || bombola3.used; // At least one bottle selected
      case 3: // Initial verifications
        return setupVallenLoaded && sensorsInstalled && sensorsWorking && backgroundNoiseMonitored;
      case 4: // GE startup
        return geStarted && geWarmupComplete && geOperational;
      case 5: // Utilities
        return allUtilitiesOn;
      case 6: // Pressurization
        return pressurizzazioneProgress >= 100;
      case 7: // Automatic process + shutdown
        return processoAutomaticoCompleto && geShutdownDone;
      case 8: // Final save/print/terminate
        return true;
      default: return false;
    }
  };

  // Sidebar Component
  const Sidebar = () => (
    <div className={`bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 h-full flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-80'}`}>
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!sidebarCollapsed && <h2 className="text-lg font-bold">Fasi Processo</h2>}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-slate-700 rounded-lg">
          <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      <div ref={sidebarRef} className="flex-1 overflow-y-auto scrollbar-thin">
        {STEP_TITLES.map((titolo, idx) => {
          const isActive = idx === uiStep;
          const isCompleted = idx < uiStep;
          
          return (
            <button
              key={idx}
              ref={isActive ? activeStepRef : null}
              className={`w-full p-4 text-left border-b border-slate-700/50 hover:bg-slate-700/50 transition-all duration-200 ${
                isActive ? 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg' : 
                isCompleted ? 'bg-slate-700/30' : ''
              }`}
              onClick={() => setUiStep(idx)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-br from-white to-slate-100 text-indigo-600 shadow-lg shadow-white/20' 
                    : isCompleted 
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-400/30'
                      : 'bg-gradient-to-br from-slate-600 to-slate-700 text-slate-300'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-sm leading-tight font-medium">{titolo}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Log Modal Component
  const LogModal = () => (
    <>
      {logModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setLogModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Log Eventi Sistema</h3>
                  <p className="text-sm text-slate-500">{log.length} eventi registrati</p>
                </div>
              </div>
              <button
                onClick={() => setLogModalOpen(false)}
                className="p-2 hover:bg-white/80 rounded-xl transition-all duration-200 hover:shadow-lg"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50 to-white">
              <div className="space-y-3">
                {log.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-lg">Nessun evento registrato</p>
                  </div>
                ) : (
                  log.map((entry, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-xl shadow-sm border-l-4 transition-all duration-200 hover:shadow-md ${
                        entry.includes('Errore') ?
                        'bg-gradient-to-r from-red-50 to-red-100 border-red-400 text-red-800' :
                        entry.includes('OK') || entry.includes('completat') ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-400 text-emerald-800' :
                        entry.includes('avviat') || entry.includes('Passaggio') ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 text-blue-800' :
                        'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-400 text-slate-700'
                      }`}
                    >
                      <span className="font-mono text-sm leading-relaxed">{entry}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 flex justify-between items-center">
              <div className="text-sm text-slate-600">
                <span className="font-medium">{log.length}</span> eventi totali
              </div>
              <button
                onClick={() => setLog([])}
                className="px-4 py-2 bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 rounded-lg transition-all duration-200 text-slate-700 font-medium shadow-sm hover:shadow-md"
              >
                🗑️ Cancella Log
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // MODIFIED: Render step content for new consolidated sequence
  const renderStep = () => {
    switch (uiStep) {
      case 0: // CONSOLIDATED TANK DATA PANEL
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-6 text-lg">📊 Dati Serbatoio Completi</h4>
              
              <div className="space-y-6">
                {/* Pressione iniziale */}
                <div>
                  <p className="text-blue-700 text-sm mb-3 font-medium">Pressione iniziale P₀ [bar]</p>
                  <NumericInput
                    value={P0}
                    onChange={(v) => { setP0(v); setP_serb(v); }}
                    label="Pressione iniziale"
                    unit="bar"
                    min={settingsLimits.P0.min}
                    max={settingsLimits.P0.max}
                    decimals={1}
                    step={0.1}
                  />
                </div>

                {/* Capacità serbatoio */}
                <div>
                  <p className="text-blue-700 text-sm mb-3 font-medium">Capacità serbatoio [L]</p>
                  <NumericInput
                    value={volumeProdotto || 0}
                    onChange={setVolumeProdotto}
                    label="Capacità serbatoio"
                    unit="L"
                    min={settingsLimits.volumeProdotto.min}
                    max={settingsLimits.volumeProdotto.max}
                    decimals={0}
                    step={1}
                  />
                </div>
                
                {/* Temperatura serbatoio */}
                <div>
                  <p className="text-blue-700 text-sm mb-3 font-medium">Temperatura serbatoio [°C]</p>
                  <NumericInput
                    value={temperatura || 0}
                    onChange={setTemperatura}
                    label="Temperatura serbatoio"
                    unit="°C"
                    min={settingsLimits.temperatura.min}
                    max={settingsLimits.temperatura.max}
                    decimals={1}
                    step={0.5}
                  />
                </div>
                
                {/* Percentuale riempimento */}
                <div>
                  <p className="text-blue-700 text-sm mb-3 font-medium">Percentuale riempimento serbatoio [%]</p>
                  <NumericInput
                    value={riempPerc || 0}
                    onChange={setRiempPerc}
                    label="Riempimento serbatoio"
                    unit="%"
                    min={settingsLimits.riempPerc.min}
                    max={settingsLimits.riempPerc.max}
                    decimals={0}
                    step={1}
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-300">
                <p className="text-blue-800 text-sm font-medium">
                  📋 Inserire tutti i parametri del serbatoio prima di procedere
                </p>
              </div>
            </div>
          </div>
        );

      case 1: // Target pressure (moved from old step 3)
        return (
          <div className="space-y-4">
            <p className="text-slate-600">Inserire pressione finale desiderata [bar].</p>
            <NumericInput
              value={Pfinale || 0}
              onChange={setPfinale}
              label="Pressione finale"
              unit="bar"
              min={settingsLimits.Pfinale.min}
              max={settingsLimits.Pfinale.max}
              decimals={1}
              step={0.5}
            />
          </div>
        );

      case 2: // Bottle verification (moved from old step 4)
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-4">Verifica Bombole N₂</h4>
              
              <div className="space-y-4">
                <div>
                  <p className="text-amber-700 text-sm mb-2">Pressione bombole N₂ [bar]</p>
                  <NumericInput
                    value={P_bombole}
                    onChange={(v) => setP_bombole(v)}
                    label="Pressione bombole"
                    unit="bar"
                    min={settingsLimits.P_bombole.min}
                    max={settingsLimits.P_bombole.max}
                    decimals={0}
                    step={5}
                  />
                </div>
                
                <button 
                  className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors w-full" 
                  onClick={verificaBombole}
                >
                  🔍 Verifica Fattibilità Prova
                </button>
                
                {bomboleCheckDone && (
                  <div className={`p-4 rounded-lg border-2 ${bomboleOK ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-red-100 border-red-400 text-red-800'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{bomboleOK ? '✅' : '❌'}</span>
                      <div>
                        <div className="font-semibold">{bomboleOK ? 'PROVA FATTIBILE' : 'PROVA NON FATTIBILE'}</div>
                        <div className="text-sm">{bomboleMsg}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3: // Power systems + Vallen (consolidated old steps 5+6)
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-4">Alimentazioni, Strumenti e Vallen</h4>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/50 rounded-lg transition-colors">
                  <input 
                    type="checkbox" 
                    checked={batteriaOn} 
                    onChange={(e) => setBatteriaOn(e.target.checked)} 
                    className="w-4 h-4"
                  />
                  <span>🔋 Batteria principale ON</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/50 rounded-lg transition-colors">
                  <input type="checkbox" checked={plcOn} onChange={(e) => setPlcOn(e.target.checked)} className="w-4 h-4" />
                  <span>⚙️ PLC acceso</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/50 rounded-lg transition-colors">
                  <input type="checkbox" checked={monitorPressOn} onChange={(e) => setMonitorPressOn(e.target.checked)} className="w-4 h-4" />
                  <span>📊 Monitor pressioni attivo</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/50 rounded-lg transition-colors">
                  <input type="checkbox" checked={monitorVallenOn} onChange={(e) => setMonitorVallenOn(e.target.checked)} className="w-4 h-4" />
                  <span>🖥️ Monitor Vallen attivo</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/50 rounded-lg transition-colors">
                  <input type="checkbox" checked={vallenReady} onChange={(e) => setVallenReady(e.target.checked)} className="w-4 h-4" />
                  <span>✅ Vallen pronto (modello + calibrazione)</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 4: // GE warmup + operational (consolidated old steps 6+7)
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-4">Gruppo Elettrogeno - Warm-up e Regime</h4>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={geOn} 
                    onChange={(e) => {
                      setGeOn(e.target.checked);
                      if (e.target.checked) {
                        setGeRpm(1550);
                        pushLog("GE acceso - Avviamento a 1550 rpm");
                        startWarmup();
                      } else {
                        setGeRpm(0);
                        setWarmup(0);
                        if (warmRef.current) {
                          window.clearInterval(warmRef.current);
                          warmRef.current = null;
                        }
                        pushLog("GE spento");
                      }
                    }} 
                    className="w-4 h-4" 
                  />
                  <span>🔌 Accensione GE</span>
                </label>
                
                {geOn && (
                  <div className="space-y-3 bg-white p-4 rounded-lg border">
                    <div className="text-sm text-green-700">
                      ⚡ GE in funzione a <strong>{geRpm} rpm</strong>
                    </div>
                    
                    {warmup > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm text-orange-600">🔥 Riscaldamento in corso: {warmup}s rimanenti</div>
                        <div className="w-full bg-orange-200 rounded-full h-4 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-full transition-all duration-1000 relative overflow-hidden"
                            style={{ width: `${((10 - warmup) / 10) * 100}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 animate-pulse" />
                          </div>
                        </div>
                        <div className="text-center text-xs text-orange-600">
                          Progresso: {Math.round(((10 - warmup) / 10) * 100)}% - Tempo rimanente: {warmup}s
                        </div>
                      </div>
                    )}
                    
                    {warmup === 0 && geRpm === 1550 && (
                      <button
                        onClick={() => {
                          setGeRpm(3000);
                          pushLog("GE portato a 3000 rpm - Regime operativo");
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        🚀 Funzionamento 3000 rpm
                      </button>
                    )}
                    
                    {geRpm === 3000 && (
                      <div className="text-center p-3 bg-green-100 rounded-lg border border-green-400">
                        <span className="text-green-800 font-semibold">✅ GE in regime operativo (3000 rpm)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5: // Utilities (moved from old step 7)
        return (
          <div className="space-y-4">
            <p className="text-slate-600">Accensione utenze a valle GE.</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={compressoreOn} onChange={(e) => setCompressoreOn(e.target.checked)} className="w-4 h-4" />
                <span>💨 Compressore</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={essiccatoreOn} onChange={(e) => setEssiccatoreOn(e.target.checked)} className="w-4 h-4" />
                <span>🌪️ Essiccatore</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={genN2On} onChange={(e) => setGenN2On(e.target.checked)} className="w-4 h-4" />
                <span>🔷 Generatore N₂</span>
              </label>
            </div>
          </div>
        );

      case 6: // Pressurization (moved from old step 8)
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-4">Avvio Pressurizzazione</h4>
              <p className="text-indigo-700 text-sm mb-4">Il PLC gestirà automaticamente le valvole. Premere START per iniziare.</p>
              
              {pressurizzazioneProgress === 0 && (
                <button 
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105" 
                  onClick={() => { 
                    setFase("Pressurizzazione");
                    pushLog("Avviata pressurizzazione automatica.");
                    // Avvia progress bar
                    const duration = pressurizzazioneDuration * 1000; // ms
                    const interval = 100; // update ogni 100ms
                    const increment = (interval / duration) * 100;
                    
                    const progressTimer = setInterval(() => {
                      setPressurizzazioneProgress(prev => {
                        const newProgress = prev + increment;
                        if (newProgress >= 100) {
                          clearInterval(progressTimer);
                          pushLog("Pressurizzazione completata.");
                          return 100;
                        }
                        return newProgress;
                      });
                    }, interval);
                  }}
                >
                  🚀 START Pressurizzazione
                </button>
              )}
              
              {pressurizzazioneProgress > 0 && pressurizzazioneProgress < 100 && (
                <div className="space-y-3">
                  <div className="text-center text-indigo-700 font-semibold">⚡ Pressurizzazione in corso...</div>
                  <div className="w-full bg-indigo-200 rounded-full h-4 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 h-4 rounded-full transition-all duration-100 shadow-lg relative overflow-hidden"
                      style={{ width: `${pressurizzazioneProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center text-sm text-indigo-600">
                    {Math.round(pressurizzazioneProgress)}% - Tempo stimato: {Math.round(pressurizzazioneDuration * (100 - pressurizzazioneProgress) / 100)}s
                  </div>
                </div>
              )}
              
              {pressurizzazioneProgress >= 100 && (
                <div className="text-center p-3 bg-green-100 rounded-lg border border-green-400">
                  <span className="text-green-800 font-semibold">✅ Pressurizzazione completata</span>
                  <div className="text-sm text-green-700 mt-1">P_serb = {P_serb.toFixed(1)} bar</div>
                </div>
              )}
            </div>
          </div>
        );

      case 7: // Stasis (moved from old step 9)
        return (
          <div className="space-y-4">
            <p className="text-slate-600">Fase di stasi (12s simulazione) per stabilizzazione pressione.</p>
            <button 
              className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 w-full" 
              onClick={() => { startTimer(12); setFase("Stasi"); pushLog("Avviata fase stasi (12s simulazione)."); }} 
              disabled={timer > 0}
            >
              Avvia Stasi (12s)
            </button>
            {timer > 0 && (
              <div className="space-y-2">
                <div className="text-blue-600 text-center">Stasi in corso: {timer}s rimanenti</div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${((12 - timer) / 12) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {timer === 0 && fase === "Stasi" && (
              <button 
                className="px-6 py-3 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors w-full" 
                onClick={() => { setStasiCompletata(true); pushLog("Stasi completata."); }}
              >
                ✅ Conferma stasi completata
              </button>
            )}
            {stasiCompletata && <div className="text-center text-emerald-700 text-sm font-medium">✓ Stasi completata.</div>}
          </div>
        );

      case 8: // Depressurization (moved from old step 10)
        return (
          <div className="space-y-4">
            <p className="text-slate-600">Depressurizzazione automatica verso torcia.</p>
            <button 
              className="w-full px-6 py-3 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors font-semibold" 
              onClick={() => { 
                setPV6(true); 
                setFase("Depressurizzazione"); 
                setDepCompletata(true); 
                pushLog("Depressurizzazione completata automaticamente."); 
              }}
            >
              🔥 START Depressurizzazione
            </button>
            {depCompletata && (
              <div className="text-center p-3 bg-emerald-100 rounded-lg border border-emerald-400">
                <span className="text-emerald-800 font-semibold">✅ Depressurizzazione completata. Torcia chiusa.</span>
              </div>
            )}
          </div>
        );

      case 9: // Line discharge (moved from old step 11)
        return (
          <div className="space-y-4">
            <p className="text-slate-600">Scarico automatico linee (PV1/PV4/PV6 aprono e poi richiudono).</p>
            <button 
              className="w-full px-6 py-3 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors" 
              onClick={() => { setScaricoLineeDone(true); pushLog("Scarico linee completato."); }}
            >
              💨 Avvia scarico linee
            </button>
            {scaricoLineeDone && <div className="text-center text-emerald-700 text-sm font-medium">✓ Scarico linee completato.</div>}
          </div>
        );

      case 10: // Generator discharge (moved from old step 12)
        return (
          <div className="space-y-4">
            <p className="text-slate-600">Scarico linea generatore.</p>
            <button 
              className="w-full px-6 py-3 rounded-lg bg-amber-700 text-white hover:bg-amber-800 transition-colors" 
              onClick={() => { setScaricoGenDone(true); pushLog("Scarico generatore completato."); }}
            >
              🌪️ Avvia scarico generatore
            </button>
            {scaricoGenDone && <div className="text-center text-emerald-700 text-sm font-medium">✓ Scarico generatore completato.</div>}
          </div>
        );

      case 11: // Final checklist (moved from old step 13)
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border shadow-inner">
              <h4 className="font-semibold text-slate-700 mb-4">Checklist finale - Confermare le seguenti voci:</h4>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg shadow-sm border hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={checklistItems.pressioni} 
                    onChange={(e) => setChecklistItems(prev => ({...prev, pressioni: e.target.checked}))}
                    className="w-4 h-4" 
                  />
                  <span>📊 Pressioni = 0</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg shadow-sm border hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={checklistItems.valvole} 
                    onChange={(e) => setChecklistItems(prev => ({...prev, valvole: e.target.checked}))}
                    className="w-4 h-4" 
                  />
                  <span>🔧 Tutte le valvole chiuse</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg shadow-sm border hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={checklistItems.torcia} 
                    onChange={(e) => setChecklistItems(prev => ({...prev, torcia: e.target.checked}))}
                    className="w-4 h-4" 
                  />
                  <span>🔥 Torcia smontata e riposta</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg shadow-sm border hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={checklistItems.bombole} 
                    onChange={(e) => setChecklistItems(prev => ({...prev, bombole: e.target.checked}))}
                    className="w-4 h-4" 
                  />
                  <span>🗜️ Bombole chiuse</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg shadow-sm border hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={checklistItems.utenze} 
                    onChange={(e) => setChecklistItems(prev => ({...prev, utenze: e.target.checked}))}
                    className="w-4 h-4" 
                  />
                  <span>⚡ Utenze spente</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg shadow-sm border hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={checklistItems.strumenti} 
                    onChange={(e) => setChecklistItems(prev => ({...prev, strumenti: e.target.checked}))}
                    className="w-4 h-4" 
                  />
                  <span>🔋 Vallen/PLC/monitor spenti; batteria disattivata</span>
                </label>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm font-medium">
                ⚠️ Verificare e confermare tutti i punti ({Object.values(checklistItems).filter(Boolean).length}/6) prima di procedere.
              </p>
            </div>
          </div>
        );

      case 12: // Final completion (moved from old step 14)
        return (
          <div className="space-y-6">
            {!salvataggioRichiesto ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h4 className="font-semibold text-green-800 mb-4">🎉 Processo Completato con successo!</h4>
                <p className="text-green-700 mb-4">Il processo di pressurizzazione GPL è stato completato con successo. È possibile salvare i dati e generare il report.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button 
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-semibold"
                    onClick={() => {
                      handleExportPDF();
                      pushLog("Dati salvati e report generato.");
                    }}
                  >
                    💾 Salva Dati + Report
                  </button>
                  <button 
                    className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors font-semibold"
                    onClick={() => {
                      handleExportPDF();
                      pushLog("Report PDF generato.");
                    }}
                  >
                    📄 Genera Report PDF
                  </button>
                  <button 
                    className="px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    onClick={() => {
                      pushLog("Processo completato senza salvataggio.");
                    }}
                  >
                    ⭐ Termina senza salvare
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-blue-800 mb-2">Processo Terminato</h3>
                <p className="text-blue-600">Tutti i dati sono stati salvati con successo.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 flex flex-col">
      {/* Menu Bar Desktop Style */}
      <MenuBar
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenReports={() => setReportsOpen(true)}
        onOpenLog={() => setLogModalOpen(true)}
        onExportPDF={handleExportPDF}
        onSave={() => pushLog("Configurazione salvata")}
        onLoad={() => pushLog("Caricamento configurazione...")}
        onPrint={() => window.print()}
        onAbout={() => alert("HMI Pressurizzazione GPL v1.0\nSistema di controllo processo torcia")}
      />

      {/* Header mobile - nascosto quando c'è il menu bar */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Dashboard Torcia</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLogModalOpen(true)}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg"
          >
            Log
          </button>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="w-80">
              <Sidebar />
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 bg-black bg-opacity-25"
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Commands Area */}
          <div className="flex-1 lg:flex-none lg:w-72 xl:w-80 p-4 lg:p-6 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-sm border p-6 h-full">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    {uiStep + 1}. {STEP_TITLES[uiStep].split(' ').slice(0, 3).join(' ')}
                    {STEP_TITLES[uiStep].split(' ').length > 3 && '...'}
                  </h2>
                </div>
                <div className="w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-lg relative overflow-hidden"
                    style={{ width: `${((uiStep + 1) / STEP_TITLES.length) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                {renderStep()}
              </div>
              
              <div className="mt-8 flex flex-col gap-4 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <button 
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50" 
                    onClick={back} 
                    disabled={uiStep === 0}
                  >
                    ⬅️ Indietro
                  </button>
                  
                  <button 
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-sm" 
                    onClick={() => {
                      setFase("Idle"); setPV1(false); setPV2(false); setPV4(false); setPV5(false); setPV6(false); 
                      setPR1open(false); setPR2open(false); setTimer(0); setStasiCompletata(false); 
                      setDepCompletata(false); setScaricoLineeDone(false); setScaricoGenDone(false); setP_serb(P0);
                      setPressurizzazioneProgress(0); setChecklistItems({
                        pressioni: false, valvole: false, torcia: false, bombole: false, utenze: false, strumenti: false
                      }); setSalvataggioRichiesto(false); setProcessoCompletato(false);
                    }}
                  >
                    🔄 Reset
                  </button>
                </div>
                
                <button 
                  className={`w-full px-6 py-4 rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg transform hover:scale-105 ${
                    canProceed() 
                      ? uiStep === STEP_TITLES.length - 1
                        ? "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/30 hover:shadow-emerald-500/50" 
                        : "bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-blue-700 shadow-indigo-500/30 hover:shadow-indigo-500/50"
                      : "bg-gradient-to-r from-slate-200 to-slate-300 text-slate-500 cursor-not-allowed shadow-slate-200/50"
                  } relative overflow-hidden`} 
                  onClick={next} 
                  disabled={!canProceed()}
                >
                  {canProceed() && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse" />
                  )}
                  <span className="relative z-10">
                    {uiStep === STEP_TITLES.length - 1 ? '🎯 Completa Processo' : '➡️ Continua'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Schema Area */}
          <div className="flex-1 p-4 lg:p-6 overflow-hidden">
            <SchemaImpianto
              P_serb={P_serb}
              P_bombole={P_bombole}
              PV1={PV1}
              PV2={PV2}
              PV4={PV4}
              PV5={PV5}
              PV6={PV6}
              PR1open={PR1open}
              PR2open={PR2open}
              geOn={geOn}
              compressoreOn={compressoreOn}
              essiccatoreOn={essiccatoreOn}
              genN2On={genN2On}
              fase={fase}
            />
          </div>
        </div>
      </div>

      {/* Log Modal */}
      <LogModal />

      {/* Settings Modal */}
      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        limits={settingsLimits}
        onSave={handleSaveSettings}
      />
    </div>
  );
}