// types.ts - Tipologie TypeScript per HMI Torcia

// Fasi del processo
export type Fase = 
  | "Idle" 
  | "Pressurizzazione" 
  | "Stasi" 
  | "Depressurizzazione" 
  | "Scarico"
  | "Fase1"
  | "Fase2";

// Titoli dei passaggi del wizard
export const STEP_TITLES = [
  "Inserimento P₀",
  "Inserimento volume serbatoio", 
  "Parametri ambientali",
  "Inserimento pressione finale",
  "Verifica bombole N₂",
  "Alimentazioni e strumenti",
  "Avviamento gruppo elettrogeno",
  "Accensione utenze",
  "Avvio pressurizzazione",
  "Fase di stasi",
  "Depressurizzazione",
  "Scarico linee",
  "Scarico generatore",
  "Checklist finale",
  "Completamento processo"
];

// Proprietà del componente Schema Impianto
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

// Limiti per le impostazioni
export interface SettingsLimits {
  P0: { min: number; max: number };
  Pfinale: { min: number; max: number };
  volumeProdotto: { min: number; max: number };
  temperatura: { min: number; max: number };
  riempPerc: { min: number; max: number };
  geRpm: { min: number; max: number };
  warmupTime: { min: number; max: number };
  timerStasi: { min: number; max: number };
  timerDep: { min: number; max: number };
  P_bombole: { min: number; max: number };
}
