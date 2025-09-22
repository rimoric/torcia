// process.ts - TypeScript Types and Interfaces for Process Management

// Core process phases
export type Fase = 
  | "Idle" 
  | "Pressurizzazione" 
  | "Fase1" 
  | "Fase2" 
  | "Stasi" 
  | "Depressurizzazione" 
  | "ScaricoLinee" 
  | "ScaricoGeneratore" 
  | "Checklist";

// Constants - Step titles for the wizard
export const STEP_TITLES = [
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

// Bottle configuration interface
export interface BottleConfig {
  used: boolean;
  pressure: number; // bar
  volume: number;   // L
}

// Tank parameters interface
export interface TankParameters {
  P0: number;               // Initial pressure (bar)
  Pfinale: number | "";     // Target pressure (bar)
  volumeProdotto: number | ""; // Tank capacity (L)
  temperatura: number | "";    // Tank temperature (°C)
  riempPerc: number | "";     // Fill percentage (%)
}

// Generator states interface
export interface GeneratorState {
  geOn: boolean;
  geRpm: number;
  geStarted: boolean;
  geWarmupComplete: boolean;
  geOperational: boolean;
  warmup: number;
}

// Valve states interface
export interface ValveStates {
  PV1: boolean;
  PV2: boolean;
  PV4: boolean;
  PV5: boolean;
  PV6: boolean;
  PR1open: boolean;
  PR2open: boolean;
}

// Utility states interface
export interface UtilityStates {
  compressoreOn: boolean;
  essiccatoreOn: boolean;
  genN2On: boolean;
  allUtilitiesOn: boolean;
}

// Initial verification checks interface
export interface InitialChecks {
  setupVallenLoaded: boolean;
  sensorsInstalled: boolean;
  sensorsWorking: boolean;
  backgroundNoiseMonitored: boolean;
}

// Final checklist interface
export interface ChecklistItems {
  pressioni: boolean;
  valvole: boolean;
  torcia: boolean;
  bombole: boolean;
  utenze: boolean;
  strumenti: boolean;
}

// Process progress interface
export interface ProcessProgress {
  currentStep: number;
  totalSteps: number;
  pressurizzazioneProgress: number;
  processoAutomaticoStarted: boolean;
  processoAutomaticoCompleto: boolean;
  geShutdownDone: boolean;
}

// Complete process state interface
export interface ProcessState {
  // Tank data
  tankParameters: TankParameters;
  presetPressureLevel: string;

  // Bottle configuration
  bombola1: BottleConfig;
  bombola2: BottleConfig;
  bombola3: BottleConfig;

  // Initial checks
  initialChecks: InitialChecks;

  // Generator state
  generatorState: GeneratorState;

  // Utilities
  utilityStates: UtilityStates;

  // Valves
  valveStates: ValveStates;

  // Process status
  fase: Fase;
  timer: number;
  
  // Pressure readings
  P_serb: number;
  P_bombole: number;

  // Progress tracking
  processProgress: ProcessProgress;

  // Final states
  checklistItems: ChecklistItems;
  processoCompletato: boolean;
  salvataggioRichiesto: boolean;
}

// Step validation interface
export interface StepValidation {
  canProceed: boolean;
  errors: string[];
  warnings: string[];
  requiredActions?: string[];
}

// Process event interface
export interface ProcessEvent {
  timestamp: Date;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  message: string;
  step?: number;
  phase?: Fase;
  data?: any;
}

// Report data interface
export interface ReportData {
  timestamp: string;
  processId: string;
  parameters: {
    P0: number;
    Pfinale: number | "";
    volumeProdotto: number | "";
    temperatura: number | "";
    riempPerc: number | "";
  };
  bottleConfiguration: [BottleConfig, BottleConfig, BottleConfig];
  currentStep: number;
  totalSteps: number;
  fase: Fase;
  pressioni: {
    P_serb: number;
    P_bombole: number;
  };
  processMetrics: {
    startTime: Date;
    endTime?: Date;
    duration?: number;
    efficiency?: number;
  };
  safetyChecks: {
    allChecksCompleted: boolean;
    checklistItems: ChecklistItems;
    safetyWarnings: string[];
  };
  log: ProcessEvent[];
}

// Settings and limits interfaces
export interface SettingsLimit {
  min: number;
  max: number;
}

export interface SettingsLimits {
  P0: SettingsLimit;
  Pfinale: SettingsLimit;
  volumeProdotto: SettingsLimit;
  temperatura: SettingsLimit;
  riempPerc: SettingsLimit;
  geRpm: SettingsLimit;
  warmupTime: SettingsLimit;
  timerStasi: SettingsLimit;
  timerDep: SettingsLimit;
  P_bombole: SettingsLimit;
}

// Schema P&ID props interface
export interface SchemaImpiantoProps {
  P_serb: number;
  P_bombole: number;
  PV1: boolean;
  PV2: boolean;
  PV4: boolean;
  PV5: boolean;
  PV6: boolean;
  PR1open: boolean;
  PR2open: boolean;
  geOn: boolean;
  compressoreOn: boolean;
  essiccatoreOn: boolean;
  genN2On: boolean;
  fase: Fase;
}

// Panel component props interfaces
export interface PanelProps {
  pushLog: (message: string) => void;
  settingsLimits: SettingsLimits;
}

export interface TankDataPanelProps extends PanelProps {
  P0: number;
  setP0: (value: number) => void;
  setP_serb: (value: number) => void;
  volumeProdotto: number | "";
  setVolumeProdotto: (value: number | "") => void;
  temperatura: number | "";
  setTemperatura: (value: number | "") => void;
  riempPerc: number | "";
  setRiempPerc: (value: number | "") => void;
}

export interface PressureTargetPanelProps extends PanelProps {
  Pfinale: number | "";
  setPfinale: (value: number | "") => void;
  presetPressureLevel: string;
  setPresetPressureLevel: (value: string) => void;
}

export interface BottleSelectionPanelProps {
  bombola1: BottleConfig;
  setBombola1: (value: BottleConfig | ((prev: BottleConfig) => BottleConfig)) => void;
  bombola2: BottleConfig;
  setBombola2: (value: BottleConfig | ((prev: BottleConfig) => BottleConfig)) => void;
  bombola3: BottleConfig;
  setBombola3: (value: BottleConfig | ((prev: BottleConfig) => BottleConfig)) => void;
}

export interface InitialChecksPanelProps {
  setupVallenLoaded: boolean;
  setSetupVallenLoaded: (value: boolean) => void;
  sensorsInstalled: boolean;
  setSensorsInstalled: (value: boolean) => void;
  sensorsWorking: boolean;
  setSensorsWorking: (value: boolean) => void;
  backgroundNoiseMonitored: boolean;
  setBackgroundNoiseMonitored: (value: boolean) => void;
}

export interface GeneratorPanelProps extends PanelProps {
  geStarted: boolean;
  setGeStarted: (value: boolean) => void;
  geWarmupComplete: boolean;
  setGeWarmupComplete: (value: boolean) => void;
  geOperational: boolean;
  setGeOperational: (value: boolean) => void;
  geRpm: number;
  setGeRpm: (value: number) => void;
  warmup: number;
  startWarmup: () => void;
}

export interface UtilitiesPanelProps extends PanelProps {
  allUtilitiesOn: boolean;
  setAllUtilitiesOn: (value: boolean) => void;
  setCompressoreOn: (value: boolean) => void;
  setEssiccatoreOn: (value: boolean) => void;
  setGenN2On: (value: boolean) => void;
}

export interface PressurizationPanelProps extends PanelProps {
  pressurizzazioneProgress: number;
  setPressurizzazioneProgress: (value: number) => void;
  pressurizzazioneDuration: number;
  setFase: (value: Fase) => void;
  P_serb: number;
}

export interface AutomaticProcessPanelProps extends PanelProps {
  processoAutomaticoStarted: boolean;
  setProcessoAutomaticoStarted: (value: boolean) => void;
  processoAutomaticoCompleto: boolean;
  setProcessoAutomaticoCompleto: (value: boolean) => void;
  geShutdownDone: boolean;
  setGeShutdownDone: (value: boolean) => void;
  timer: number;
  startTimer: (seconds: number) => void;
  setFase: (value: Fase) => void;
  setGeOn: (value: boolean) => void;
  setGeRpm: (value: number) => void;
  checklistItems: ChecklistItems;
  setChecklistItems: (value: ChecklistItems | ((prev: ChecklistItems) => ChecklistItems)) => void;
}

export interface SavePanelProps extends PanelProps {
  handleExportPDF: () => void;
  salvataggioRichiesto: boolean;
  setSalvataggioRichiesto: (value: boolean) => void;
}

// UI Component interfaces
export interface SidebarProps {
  STEP_TITLES: readonly string[];
  uiStep: number;
  setUiStep: (step: number) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidebarRef: React.RefObject<HTMLDivElement>;
  activeStepRef: React.RefObject<HTMLButtonElement>;
}

export interface LogModalProps {
  logModalOpen: boolean;
  setLogModalOpen: (open: boolean) => void;
  log: string[];
  setLog: (log: string[]) => void;
}

export interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  showTimeRemaining?: boolean;
  totalTime?: number;
  className?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'indigo' | 'slate';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

// Constants
export const STEP_TITLES = [
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

export type StepTitle = typeof STEP_TITLES[number];

// Process step configuration
export interface StepConfig {
  id: number;
  title: StepTitle;
  description?: string;
  component: React.ComponentType<any>;
  validation: (state: ProcessState) => StepValidation;
  requiredData: string[];
  safetyChecks?: string[];
}

// Export utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ProcessStateUpdate = DeepPartial<ProcessState>;

// Event handlers type
export interface ProcessEventHandlers {
  onStepChange: (step: number) => void;
  onPhaseChange: (phase: Fase) => void;
  onError: (error: string) => void;
  onWarning: (warning: string) => void;
  onProcessComplete: () => void;
  onProcessReset: () => void;
}
