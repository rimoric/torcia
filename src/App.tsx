// App.tsx - Refactored Main Application
import React, { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";

// Components
import Sidebar from './components/ui/Sidebar';
import LogModal from './components/ui/LogModal';
import SchemaImpianto from './SchemaImpianto';
import MenuBar from './MenuBar';
import Settings, { SettingsLimits } from './Settings';

// Panel Components
import TankDataPanel from './components/panels/TankDataPanel';
import PressureTargetPanel from './components/panels/PressureTargetPanel';
import BottleSelectionPanel from './components/panels/BottleSelectionPanel';
import InitialChecksPanel from './components/panels/InitialChecksPanel';
import GeneratorPanel from './components/panels/GeneratorPanel';
import UtilitiesPanel from './components/panels/UtilitiesPanel';
import PressurizationPanel from './components/panels/PressurizationPanel';
import AutomaticProcessPanel from './components/panels/AutomaticProcessPanel';
import SavePanel from './components/panels/SavePanel';

// Hooks
import { useTimer } from './hooks/useTimer';

// Types
import { Fase } from './types';

// Constants
const STEP_TITLES = [
  "Dati serbatoio completi",
  "Selezionare pressione target",
  "Scelta bombole",
  "Verifiche iniziali",
  "Gruppo Elettrogeno",
  "Attivare utenze",
  "Avvio pressurizzazione automatica",
  "Processo automatico e spegnimento",
  "Salvataggio e conclusione",
] as const;

export default function App() {
  // Tank parameters
  const [P0, setP0] = useState(1.0);
  const [volumeProdotto, setVolumeProdotto] = useState<number | "">("");
  const [temperatura, setTemperatura] = useState<number | "">("");
  const [riempPerc, setRiempPerc] = useState<number | "">(""); 
  const [Pfinale, setPfinale] = useState<number | "">("");
  const [presetPressureLevel, setPresetPressureLevel] = useState<string>("custom");

  // Bottle configuration
  const [bombola1, setBombola1] = useState({ used: false, pressure: 180, volume: 50 });
  const [bombola2, setBombola2] = useState({ used: false, pressure: 180, volume: 50 });
  const [bombola3, setBombola3] = useState({ used: false, pressure: 180, volume: 50 });

  // Initial checks
  const [setupVallenLoaded, setSetupVallenLoaded] = useState(false);
  const [sensorsInstalled, setSensorsInstalled] = useState(false);
  const [sensorsWorking, setSensorsWorking] = useState(false);
  const [backgroundNoiseMonitored, setBackgroundNoiseMonitored] = useState(false);

  // Generator states
  const [geStarted, setGeStarted] = useState(false);
  const [geWarmupComplete, setGeWarmupComplete] = useState(false);
  const [geOperational, setGeOperational] = useState(false);
  const [geOn, setGeOn] = useState(false);
  const [geRpm, setGeRpm] = useState(0);
  const [warmup, setWarmup] = useState(0);
  const warmRef = useRef<number | null>(null);

  // Utilities
  const [allUtilitiesOn, setAllUtilitiesOn] = useState(false);
  const [compressoreOn, setCompressoreOn] = useState(false);
  const [essiccatoreOn, setEssiccatoreOn] = useState(false);
  const [genN2On, setGenN2On] = useState(false);

  // Process states
  const [fase, setFase] = useState<Fase>("Idle");
  const [pressurizzazioneProgress, setPressurizzazioneProgress] = useState(0);
  const [pressurizzazioneDuration, setPressurizzazioneDuration] = useState(30);
  
  // Automatic process
  const [processoAutomaticoStarted, setProcessoAutomaticoStarted] = useState(false);
  const [processoAutomaticoCompleto, setProcessoAutomaticoCompleto] = useState(false);
  const [geShutdownDone, setGeShutdownDone] = useState(false);

  // Checklist
  const [checklistItems, setChecklistItems] = useState({
    pressioni: false,
    valvole: false,
    torcia: false,
    bombole: false,
    utenze: false,
    strumenti: false
  });

  // Final states
  const [processoCompletato, setProcessoCompletato] = useState(false);
  const [salvataggioRichiesto, setSalvataggioRichiesto] = useState(false);

  // Valves (visual only)
  const [PV1, setPV1] = useState(false);
  const [PV2, setPV2] = useState(false);
  const [PV4, setPV4] = useState(false);
  const [PV5, setPV5] = useState(false);
  const [PV6, setPV6] = useState(false);
  const [PR1open, setPR1open] = useState(false);
  const [PR2open, setPR2open] = useState(false);

  // Pressures
  const [P_serb, setP_serb] = useState(1.0);
  const [P_bombole, setP_bombole] = useState(180);

  // UI Layout
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  
  // Settings
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
  
  // Refs
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLButtonElement>(null);

  // Wizard state
  const [uiStep, setUiStep] = useState(0);

  // Log
  const [log, setLog] = useState<string[]>([]);
  const pushLog = (msg: string) => setLog((l) => [`${new Date().toLocaleTimeString()}: ${msg}`, ...l]);

  // Custom hooks
  const { timer, startTimer } = useTimer();

  // Functions
  const handleExportPDF = () => {
    const reportData = {
      timestamp: new Date().toLocaleString(),
      parameters: { P0, Pfinale, volumeProdotto, temperatura, riempPerc },
      currentStep: uiStep + 1,
      totalSteps: STEP_TITLES.length,
      fase,
      pressioni: { P_serb, P_bombole },
      log: log.slice(0, 50)
    };
    
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

  const startWarmup = () => {
    if (!geStarted || geRpm !== 1500) return;
    if (warmRef.current) window.clearInterval(warmRef.current);
    setWarmup(10);
    pushLog("Warm-up GE (10 s) avviato a 1500 rpm.");
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

  // Navigation functions
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
      setProcessoCompletato(true);
      setSalvataggioRichiesto(true);
      pushLog("Processo completato!");
    }
  };

// App.tsx - Refactored Main Application
import React, { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";

// Components
import Sidebar from './components/ui/Sidebar';
import LogModal from './components/ui/LogModal';
import SchemaImpianto from './SchemaImpianto';
import MenuBar from './MenuBar';
import Settings, { SettingsLimits } from './Settings';

// Panel Components
import TankDataPanel from './components/panels/TankDataPanel';
import PressureTargetPanel from './components/panels/PressureTargetPanel';
import BottleSelectionPanel from './components/panels/BottleSelectionPanel';
import InitialChecksPanel from './components/panels/InitialChecksPanel';
import GeneratorPanel from './components/panels/GeneratorPanel';
import UtilitiesPanel from './components/panels/UtilitiesPanel';
import PressurizationPanel from './components/panels/PressurizationPanel';
import AutomaticProcessPanel from './components/panels/AutomaticProcessPanel';
import SavePanel from './components/panels/SavePanel';

// Hooks
import { useTimer } from './hooks/useTimer';
import { useWarmup } from './hooks/useWarmup';

// Types
import { Fase, STEP_TITLES } from './types/process';

export default function App() {
  // Tank parameters
  const [P0, setP0] = useState(1.0);
  const [volumeProdotto, setVolumeProdotto] = useState<number | "">("");
  const [temperatura, setTemperatura] = useState<number | "">("");
  const [riempPerc, setRiempPerc] = useState<number | "">("");
  const [Pfinale, setPfinale] = useState<number | "">("");
  const [presetPressureLevel, setPresetPressureLevel] = useState<string>("custom");

  // Bottle configuration
  const [bombola1, setBombola1] = useState({ used: false, pressure: 180, volume: 50 });
  const [bombola2, setBombola2] = useState({ used: false, pressure: 180, volume: 50 });
  const [bombola3, setBombola3] = useState({ used: false, pressure: 180, volume: 50 });

  // Initial checks
  const [setupVallenLoaded, setSetupVallenLoaded] = useState(false);
  const [sensorsInstalled, setSensorsInstalled] = useState(false);
  const [sensorsWorking, setSensorsWorking] = useState(false);
  const [backgroundNoiseMonitored, setBackgroundNoiseMonitored] = useState(false);

  // Generator states
  const [geStarted, setGeStarted] = useState(false);
  const [geWarmupComplete, setGeWarmupComplete] = useState(false);
  const [geOperational, setGeOperational] = useState(false);
  const [geOn, setGeOn] = useState(false);
  const [geRpm, setGeRpm] = useState(0);

  // Utilities
  const [allUtilitiesOn, setAllUtilitiesOn] = useState(false);
  const [compressoreOn, setCompressoreOn] = useState(false);
  const [essiccatoreOn, setEssiccatoreOn] = useState(false);
  const [genN2On, setGenN2On] = useState(false);

  // Process states
  const [fase, setFase] = useState<Fase>("Idle");
  const [pressurizzazioneProgress, setPressurizzazioneProgress] = useState(0);
  const [pressurizzazioneDuration, setPressurizzazioneDuration] = useState(30);
  
  // Automatic process
  const [processoAutomaticoStarted, setProcessoAutomaticoStarted] = useState(false);
  const [processoAutomaticoCompleto, setProcessoAutomaticoCompleto] = useState(false);
  const [geShutdownDone, setGeShutdownDone] = useState(false);

  // Checklist
  const [checklistItems, setChecklistItems] = useState({
    pressioni: false,
    valvole: false,
    torcia: false,
    bombole: false,
    utenze: false,
    strumenti: false
  });

  // Final states
  const [processoCompletato, setProcessoCompletato] = useState(false);
  const [salvataggioRichiesto, setSalvataggioRichiesto] = useState(false);

  // Valves (visual only)
  const [PV1, setPV1] = useState(false);
  const [PV2, setPV2] = useState(false);
  const [PV4, setPV4] = useState(false);
  const [PV5, setPV5] = useState(false);
  const [PV6, setPV6] = useState(false);
  const [PR1open, setPR1open] = useState(false);
  const [PR2open, setPR2open] = useState(false);

  // Pressures
  const [P_serb, setP_serb] = useState(1.0);
  const [P_bombole, setP_bombole] = useState(180);

  // UI Layout
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  
  // Settings
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
  
  // Refs
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLButtonElement>(null);

  // Wizard state
  const [uiStep, setUiStep] = useState(0);

  // Log
  const [log, setLog] = useState<string[]>([]);
  const pushLog = (msg: string) => setLog((l) => [`${new Date().toLocaleTimeString()}: ${msg}`, ...l]);

  // Custom hooks
  const { timer, startTimer } = useTimer();
  const { warmup, startWarmup } = useWarmup();

  // Functions
  const handleExportPDF = () => {
    const reportData = {
      timestamp: new Date().toLocaleString(),
      parameters: { P0, Pfinale, volumeProdotto, temperatura, riempPerc },
      currentStep: uiStep + 1,
      totalSteps: STEP_TITLES.length,
      fase,
      pressioni: { P_serb, P_bombole },
      log: log.slice(0, 50)
    };
    
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

  // Navigation functions
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
      setProcessoCompletato(true);
      setSalvataggioRichiesto(true);
      pushLog("Processo completato!");
    }
  };

  // Validation logic
  const canProceed = (): boolean => {
    switch (uiStep) {
      case 0: // Tank data
        return P0 > 0 && 
               typeof volumeProdotto === "number" && volumeProdotto > 0 &&
               typeof temperatura === "number" && 
               typeof riempPerc === "number" && riempPerc > 0;
      case 1: // Pressure target
        return typeof Pfinale === "number" && Pfinale > P0;
      case 2: // Bottle selection
        return bombola1.used || bombola2.used || bombola3.used;
      case 3: // Initial checks
        return setupVallenLoaded && sensorsInstalled && sensorsWorking && backgroundNoiseMonitored;
      case 4: // Generator
        return geStarted && geWarmupComplete && geOperational;
      case 5: // Utilities
        return allUtilitiesOn;
      case 6: // Pressurization
        return pressurizzazioneProgress >= 100;
      case 7: // Automatic process
        return processoAutomaticoCompleto && geShutdownDone;
      case 8: // Save
        return true;
      default: return false;
    }
  };

  // Reset function
  const resetProcess = () => {
    setFase("Idle");
    setPV1(false); setPV2(false); setPV4(false); setPV5(false); setPV6(false);
    setPR1open(false); setPR2open(false);
    setP_serb(P0);
    setPressurizzazioneProgress(0);
    setProcessoAutomaticoStarted(false);
    setProcessoAutomaticoCompleto(false);
    setGeShutdownDone(false);
    setChecklistItems({
      pressioni: false, valvole: false, torcia: false, 
      bombole: false, utenze: false, strumenti: false
    });
    setSalvataggioRichiesto(false);
    setProcessoCompletato(false);
    setGeStarted(false);
    setGeWarmupComplete(false);
    setGeOperational(false);
    setGeOn(false);
    setGeRpm(0);
    setAllUtilitiesOn(false);
    setCompressoreOn(false);
    setEssiccatoreOn(false);
    setGenN2On(false);
  };

  // Effects
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

  useEffect(() => {
    if (activeStepRef.current && sidebarRef.current) {
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

  // Panel render function
  const renderStep = () => {
    switch (uiStep) {
      case 0:
        return (
          <TankDataPanel
            P0={P0}
            setP0={setP0}
            setP_serb={setP_serb}
            volumeProdotto={volumeProdotto}
            setVolumeProdotto={setVolumeProdotto}
            temperatura={temperatura}
            setTemperatura={setTemperatura}
            riempPerc={riempPerc}
            setRiempPerc={setRiempPerc}
            pushLog={pushLog}
            settingsLimits={settingsLimits}
          />
        );
      
      case 1:
        return (
          <PressureTargetPanel
            Pfinale={Pfinale}
            setPfinale={setPfinale}
            presetPressureLevel={presetPressureLevel}
            setPresetPressureLevel={setPresetPressureLevel}
            pushLog={pushLog}
            settingsLimits={settingsLimits}
          />
        );
      
      case 2:
        return (
          <BottleSelectionPanel
            bombola1={bombola1}
            setBombola1={setBombola1}
            bombola2={bombola2}
            setBombola2={setBombola2}
            bombola3={bombola3}
            setBombola3={setBombola3}
          />
        );
      
      case 3:
        return (
          <InitialChecksPanel
            setupVallenLoaded={setupVallenLoaded}
            setSetupVallenLoaded={setSetupVallenLoaded}
            sensorsInstalled={sensorsInstalled}
            setSensorsInstalled={setSensorsInstalled}
            sensorsWorking={sensorsWorking}
            setSensorsWorking={setSensorsWorking}
            backgroundNoiseMonitored={backgroundNoiseMonitored}
            setBackgroundNoiseMonitored={setBackgroundNoiseMonitored}
          />
        );
      
      case 4:
        return (
          <GeneratorPanel
            geStarted={geStarted}
            setGeStarted={setGeStarted}
            geWarmupComplete={geWarmupComplete}
            setGeWarmupComplete={setGeWarmupComplete}
            geOperational={geOperational}
            setGeOperational={setGeOperational}
            geRpm={geRpm}
            setGeRpm={setGeRpm}
            warmup={warmup}
            startWarmup={() => startWarmup(10, () => {
              pushLog("Warm-up completato - GE pronto per 3000 rpm.");
            })}
            pushLog={pushLog}
            settingsLimits={settingsLimits}
          />
        );
      
      case 5:
        return (
          <UtilitiesPanel
            allUtilitiesOn={allUtilitiesOn}
            setAllUtilitiesOn={setAllUtilitiesOn}
            setCompressoreOn={setCompressoreOn}
            setEssiccatoreOn={setEssiccatoreOn}
            setGenN2On={setGenN2On}
            pushLog={pushLog}
            settingsLimits={settingsLimits}
          />
        );
      
      case 6:
        return (
          <PressurizationPanel
            pressurizzazioneProgress={pressurizzazioneProgress}
            setPressurizzazioneProgress={setPressurizzazioneProgress}
            pressurizzazioneDuration={pressurizzazioneDuration}
            setFase={setFase}
            P_serb={P_serb}
            pushLog={pushLog}
            settingsLimits={settingsLimits}
          />
        );
      
      case 7:
        return (
          <AutomaticProcessPanel
            processoAutomaticoStarted={processoAutomaticoStarted}
            setProcessoAutomaticoStarted={setProcessoAutomaticoStarted}
            processoAutomaticoCompleto={processoAutomaticoCompleto}
            setProcessoAutomaticoCompleto={setProcessoAutomaticoCompleto}
            geShutdownDone={geShutdownDone}
            setGeShutdownDone={setGeShutdownDone}
            timer={timer}
            startTimer={startTimer}
            setFase={setFase}
            setGeOn={setGeOn}
            setGeRpm={setGeRpm}
            checklistItems={checklistItems}
            setChecklistItems={setChecklistItems}
            pushLog={pushLog}
            settingsLimits={settingsLimits}
          />
        );
      
      case 8:
        return (
          <SavePanel
            handleExportPDF={handleExportPDF}
            salvataggioRichiesto={salvataggioRichiesto}
            setSalvataggioRichiesto={setSalvataggioRichiesto}
            pushLog={pushLog}
            settingsLimits={settingsLimits}
          />
        );
      
      default:
        return <div>Step non implementato</div>;
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 flex flex-col">
      {/* Menu Bar */}
      <MenuBar
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenReports={() => setReportsOpen(true)}
        onOpenLog={() => setLogModalOpen(true)}
        onExportPDF={handleExportPDF}
        onSave={() => pushLog("Configurazione salvata")}
        onLoad={() => pushLog("Caricamento configurazione...")}
        onPrint={() => window.print()}
        onAbout={() => alert("HMI Pressurizzazione GPL v2.0\nSistema di controllo processo torcia refactorizzato")}
      />

      {/* Mobile Header */}
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
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            STEP_TITLES={STEP_TITLES}
            uiStep={uiStep}
            setUiStep={setUiStep}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            sidebarRef={sidebarRef}
            activeStepRef={activeStepRef}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="w-80">
              <Sidebar
                STEP_TITLES={STEP_TITLES}
                uiStep={uiStep}
                setUiStep={setUiStep}
                sidebarCollapsed={false}
                setSidebarCollapsed={setSidebarCollapsed}
                sidebarRef={sidebarRef}
                activeStepRef={activeStepRef}
              />
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 bg-black bg-opacity-25"
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Commands Panel */}
          <div className="flex-1 lg:flex-none lg:w-72 xl:w-80 p-4 lg:p-6 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-sm border p-6 h-full">
              {/* Header */}
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
              
              {/* Step Content */}
              <div className="flex-1">
                {renderStep()}
              </div>
              
              {/* Navigation Controls */}
              <div className="mt-8 flex flex-col gap-4 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <button 
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50" 
                    onClick={back} 
                    disabled={uiStep === 0}
                  >
                    ← Indietro
                  </button>
                  
                  <button 
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-sm" 
                    onClick={resetProcess}
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
                    {uiStep === STEP_TITLES.length - 1 ? '🎯 Completa Processo' : '→ Continua'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* P&ID Schema Area */}
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

      {/* Modals */}
      <LogModal
        logModalOpen={logModalOpen}
        setLogModalOpen={setLogModalOpen}
        log={log}
        setLog={setLog}
      />

      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        limits={settingsLimits}
        onSave={handleSaveSettings}
      />
    </div>
  );
}

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 flex flex-col">
      {/* Menu Bar */}
      <MenuBar
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenReports={() => setReportsOpen(true)}
        onOpenLog={() => setLogModalOpen(true)}
        onExportPDF={handleExportPDF}
        onSave={() => pushLog("Configurazione salvata")}
        onLoad={() => pushLog("Caricamento configurazione...")}
        onPrint={() => window.print()}
        onAbout={() => alert("HMI Pressurizzazione GPL v2.0\nSistema di controllo processo torcia refactorizzato")}
      />

      {/* Mobile Header */}
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
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            STEP_TITLES={STEP_TITLES}
            uiStep={uiStep}
            setUiStep={setUiStep}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            sidebarRef={sidebarRef}
            activeStepRef={activeStepRef}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="w-80">
              <Sidebar
                STEP_TITLES={STEP_TITLES}
                uiStep={uiStep}
                setUiStep={setUiStep}
                sidebarCollapsed={false}
                setSidebarCollapsed={setSidebarCollapsed}
                sidebarRef={sidebarRef}
                activeStepRef={activeStepRef}
              />
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 bg-black bg-opacity-25"
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Commands Panel */}
          <div className="flex-1 lg:flex-none lg:w-72 xl:w-80 p-4 lg:p-6 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-sm border p-6 h-full">
              {/* Header */}
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
              
              {/* Step Content */}
              <div className="flex-1">
                {renderStep()}
              </div>
              
              {/* Navigation Controls */}
              <div className="mt-8 flex flex-col gap-4 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <button 
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50" 
                    onClick={back} 
                    disabled={uiStep === 0}
                  >
                    ← Indietro
                  </button>
                  
                  <button 
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-sm" 
                    onClick={() => {
                      // Reset function
                      setFase("Idle");
                      setPV1(false); setPV2(false); setPV4(false); setPV5(false); setPV6(false);
                      setPR1open(false); setPR2open(false);
                      setP_serb(P0);
                      setPressurizzazioneProgress(0);
                      setProcessoAutomaticoStarted(false);
                      setProcessoAutomaticoCompleto(false);
                      setGeShutdownDone(false);
                      setChecklistItems({
                        pressioni: false, valvole: false, torcia: false, 
                        bombole: false, utenze: false, strumenti: false
                      });
                      setSalvataggioRichiesto(false);
                      setProcessoCompletato(false);
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
                    {uiStep === STEP_TITLES.length - 1 ? '🎯 Completa Processo' : '→ Continua'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* P&ID Schema Area */}
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

      {/* Modals */}
      <LogModal
        logModalOpen={logModalOpen}
        setLogModalOpen={setLogModalOpen}
        log={log}
        setLog={setLog}
      />

      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        limits={settingsLimits}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
