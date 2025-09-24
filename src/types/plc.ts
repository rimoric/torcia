// Tipi per stati delle valvole
export interface ValveState {
  id: string;
  isOpen: boolean;
  position?: number; // Per valvole modulanti (0-100%)
  lastUpdate: number;
  alarmState?: 'normal' | 'warning' | 'alarm';
}

// Tipi per il generatore
export interface GeneratorState {
  id: string;
  isRunning: boolean;
  pressure: number;
  temperature: number;
  hoursRunning: number;
  lastMaintenance: number;
  alarms: string[];
  state: 'stopped' | 'running' | 'standby' | 'alarm';
}

// Tipi per serbatoi
export interface TankState {
  id: string;
  level: number; // 0-100%
  temperature: number;
  pressure: number;
  capacity: number; // Litri
  product: 'GPL' | 'N2';
}

// Tipi per pressostati
export interface PressureSwitchState {
  id: string;
  pressure: number;
  isActive: boolean;
  setpoint: number;
  differential?: number; // Per pressostati differenziali
  isClean?: boolean; // Per filtri
}

// Tipi per torce
export interface FlareState {
  id: string;
  isLit: boolean;
  pilotActive: boolean;
  temperature: number;
}

// Tipi per bombole azoto
export interface NitrogenBottleState {
  id: string;
  pressure: number;
  capacity: number;
  enabled: boolean;
}

// Tipi per compressore azoto
export interface CompressorState {
  id: string;
  state: 'stopped' | 'running' | 'standby' | 'alarm';
  pressure: number;
  temperature: number;
}

// Struttura completa dati PLC
export interface PlcData {
  valves: Record<string, ValveState>;
  generators: Record<string, GeneratorState>;
  tanks: Record<string, TankState>;
  pressureSwitches: Record<string, PressureSwitchState>;
  flares: Record<string, FlareState>;
  nitrogenBottles: Record<string, NitrogenBottleState>;
  compressors: Record<string, CompressorState>;
  timestamp: number;
}

// Tipi per comandi
export interface PlcCommand {
  device: string;
  action: string;
  value?: any;
  timestamp: number;
}

// Tipi per messaggi MQTT
export interface MqttMessage {
  topic: string;
  payload: any;
  qos: 0 | 1 | 2;
  retain: boolean;
}
