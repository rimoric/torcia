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

// Constants - Step titles for the wizard (SINGLE DECLARATION)
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

// Final checklist interface
export interface ChecklistItems {
  pressioni: boolean;
  valvole: boolean;
  torcia: boolean;
  bombole: boolean;
  utenze: boolean;
  strumenti: boolean;
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

// Panel component props interfaces
export interface PanelProps {
  pushLog: (message: string) => void;
  settingsLimits: SettingsLimits;
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

// Export utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
