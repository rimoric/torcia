import { 
  ValveState, 
  GeneratorState, 
  TankState, 
  PressureSwitchState 
} from '../types/plc';

// Validazione dati
export const validatePressure = (pressure: number, min = 0, max = 15): boolean => {
  return !isNaN(pressure) && pressure >= min && pressure <= max;
};

export const validateTemperature = (temp: number, min = -50, max = 200): boolean => {
  return !isNaN(temp) && temp >= min && temp <= max;
};

export const validateLevel = (level: number): boolean => {
  return !isNaN(level) && level >= 0 && level <= 100;
};

// Conversioni unità
export const barToPsi = (bar: number): number => bar * 14.5038;
export const psiToBar = (psi: number): number => psi / 14.5038;
export const celsiusToFahrenheit = (celsius: number): number => (celsius * 9/5) + 32;
export const fahrenheitToCelsius = (fahrenheit: number): number => (fahrenheit - 32) * 5/9;
export const litersToGallons = (liters: number): number => liters * 0.264172;
export const gallonsToLiters = (gallons: number): number => gallons / 0.264172;

// Calcoli serbatoio
export const calculateTankVolume = (level: number, capacity: number): number => {
  return (level / 100) * capacity;
};

export const calculateFillTime = (
  currentLevel: number, 
  targetLevel: number, 
  flowRate: number, 
  capacity: number
): number => {
  const volumeDiff = ((targetLevel - currentLevel) / 100) * capacity;
  return Math.abs(volumeDiff / flowRate) * 60; // in minuti
};

// Stato allarmi
export const checkPressureAlarm = (
  pressure: number, 
  min: number, 
  max: number
): 'normal' | 'warning' | 'alarm' => {
  if (pressure < min || pressure > max) return 'alarm';
  if (pressure < min + 1 || pressure > max - 1) return 'warning';
  return 'normal';
};

export const checkTemperatureAlarm = (
  temp: number, 
  min: number, 
  max: number
): 'normal' | 'warning' | 'alarm' => {
  if (temp < min || temp > max) return 'alarm';
  if (temp < min + 5 || temp > max - 5) return 'warning';
  return 'normal';
};

// Formattazione
export const formatPressure = (pressure: number, unit = 'bar'): string => {
  return `${pressure.toFixed(1)} ${unit}`;
};

export const formatTemperature = (temp: number, unit = '°C'): string => {
  return `${Math.round(temp)}${unit}`;
};

export const formatLevel = (level: number): string => {
  return `${Math.round(level)}%`;
};

export const formatFlowRate = (rate: number, unit = 'L/min'): string => {
  return `${rate.toFixed(1)} ${unit}`;
};

// Calcoli processo
export const calculateNitrogenConsumption = (
  pressure: number,
  temperature: number,
  flowRate: number
): number => {
  // Simplified calculation - adjust based on real formulas
  const tempFactor = (273.15 + temperature) / 293.15;
  const pressureFactor = pressure / 1.01325;
  return flowRate * tempFactor / pressureFactor;
};

export const calculateValveFlow = (
  valvePosition: number,
  inletPressure: number,
  outletPressure: number,
  cv: number
): number => {
  // Simplified flow calculation
  const dp = Math.max(0, inletPressure - outletPressure);
  const flow = cv * Math.sqrt(dp) * (valvePosition / 100);
  return flow;
};

// Helpers per stati dispositivi
export const isValveOpen = (valve: ValveState | undefined): boolean => {
  return valve?.isOpen || false;
};

export const isGeneratorRunning = (generator: GeneratorState | undefined): boolean => {
  return generator?.state === 'running';
};

export const isTankEmpty = (tank: TankState | undefined, threshold = 10): boolean => {
  return (tank?.level || 0) < threshold;
};

export const isTankFull = (tank: TankState | undefined, threshold = 90): boolean => {
  return (tank?.level || 0) > threshold;
};

// Utility per timestamp
export const getTimeSinceUpdate = (lastUpdate: number): string => {
  const seconds = Math.floor((Date.now() - lastUpdate) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const isDataStale = (lastUpdate: number, maxAge = 5000): boolean => {
  return Date.now() - lastUpdate > maxAge;
};

// Export all helpers
export default {
  validatePressure,
  validateTemperature,
  validateLevel,
  barToPsi,
  psiToBar,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  litersToGallons,
  gallonsToLiters,
  calculateTankVolume,
  calculateFillTime,
  checkPressureAlarm,
  checkTemperatureAlarm,
  formatPressure,
  formatTemperature,
  formatLevel,
  formatFlowRate,
  calculateNitrogenConsumption,
  calculateValveFlow,
  isValveOpen,
  isGeneratorRunning,
  isTankEmpty,
  isTankFull,
  getTimeSinceUpdate,
  isDataStale
};
