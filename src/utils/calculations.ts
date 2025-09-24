// calculations.ts - Process Calculations and Engineering Utilities

interface BottleConfig {
  used: boolean;
  pressure: number;
  volume: number;
}

interface TankParameters {
  P0: number;
  Pfinale: number;
  volume: number;
  temperature: number;
  fillPercentage: number;
}

// Gas law calculations
export function calculateRequiredGasAmount(params: TankParameters): number {
  const { P0, Pfinale, volume, fillPercentage } = params;
  
  // Calculate effective gas volume (ullage space)
  const gasVolume = volume * (1 - fillPercentage / 100);
  
  // Required gas amount in bar·L (simplified approach)
  const deltaP = Pfinale - P0;
  const requiredBarLiters = gasVolume * deltaP;
  
  return requiredBarLiters;
}

// Bottle capacity calculation
export function calculateBottleCapacity(bottles: BottleConfig[]): number {
  return bottles
    .filter(bottle => bottle.used)
    .reduce((total, bottle) => {
      // Assume 20 bar residual pressure and 70% efficiency
      const usablePressure = Math.max(0, bottle.pressure - 20);
      const efficiency = 0.7;
      return total + (bottle.volume * usablePressure * efficiency);
    }, 0);
}

// Check if bottles are sufficient
export function checkBottleSufficiency(
  tankParams: TankParameters,
  bottles: BottleConfig[]
): {
  issufficient: boolean;
  required: number;
  available: number;
  margin: number;
  marginPercentage: number;
} {
  const required = calculateRequiredGasAmount(tankParams);
  const available = calculateBottleCapacity(bottles);
  const margin = available - required;
  const marginPercentage = available > 0 ? (margin / available) * 100 : 0;
  
  return {
    issufficient: margin >= 0,
    required: Math.round(required),
    available: Math.round(available),
    margin: Math.round(margin),
    marginPercentage: Math.round(marginPercentage)
  };
}

// Pressure ramp time estimation
export function estimatePressurization Time(
  P0: number,
  Pfinale: number,
  volume: number,
  bottleCapacity: number
): number {
  const deltaP = Pfinale - P0;
  const gasAmount = volume * (1 - 0.8) * deltaP; // Assume 80% fill
  
  // Simplified flow rate calculation (bar·L/min)
  const flowRate = Math.min(bottleCapacity / 10, 50); // Max 50 bar·L/min
  
  const timeMinutes = gasAmount / flowRate;
  return Math.max(1, Math.round(timeMinutes)); // Minimum 1 minute
}

// Temperature compensation
export function compensatePressureForTemperature(
  pressure: number,
  currentTemp: number,
  targetTemp: number = 20
): number {
  // Gay-Lussac's law: P1/T1 = P2/T2
  const T1 = currentTemp + 273.15; // Convert to Kelvin
  const T2 = targetTemp + 273.15;
  
  return pressure * (T2 / T1);
}

// Safety factor calculations
export function calculateSafetyFactors(params: TankParameters): {
  pressureSafetyFactor: number;
  temperatureSafetyFactor: number;
  volumeSafetyFactor: number;
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
} {
  const { Pfinale, temperature, fillPercentage } = params;
  
  // Pressure safety factor (higher pressure = lower safety)
  let pressureSafetyFactor = 1.0;
  if (Pfinale > 25) pressureSafetyFactor = 0.7;
  else if (Pfinale > 15) pressureSafetyFactor = 0.85;
  
  // Temperature safety factor
  let temperatureSafetyFactor = 1.0;
  if (temperature > 60) temperatureSafetyFactor = 0.6;
  else if (temperature > 40) temperatureSafetyFactor = 0.8;
  else if (temperature < -10) temperatureSafetyFactor = 0.8;
  
  // Volume/fill safety factor
  let volumeSafetyFactor = 1.0;
  if (fillPercentage > 90) volumeSafetyFactor = 0.7;
  else if (fillPercentage > 80) volumeSafetyFactor = 0.85;
  
  const overallSafety = pressureSafetyFactor * temperatureSafetyFactor * volumeSafetyFactor;
  
  let overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  if (overallSafety > 0.8) overallRiskLevel = 'LOW';
  else if (overallSafety > 0.6) overallRiskLevel = 'MEDIUM';
  else overallRiskLevel = 'HIGH';
  
  return {
    pressureSafetyFactor,
    temperatureSafetyFactor,
    volumeSafetyFactor,
    overallRiskLevel
  };
}

// Process efficiency calculations
export function calculateProcessEfficiency(
  actualTime: number,
  estimatedTime: number,
  actualPressure: number,
  targetPressure: number
): {
  timeEfficiency: number;
  pressureAccuracy: number;
  overallEfficiency: number;
} {
  const timeEfficiency = estimatedTime > 0 ? Math.min(100, (estimatedTime / actualTime) * 100) : 0;
  const pressureAccuracy = targetPressure > 0 ? Math.max(0, 100 - Math.abs(actualPressure - targetPressure) / targetPressure * 100) : 0;
  const overallEfficiency = (timeEfficiency + pressureAccuracy) / 2;
  
  return {
    timeEfficiency: Math.round(timeEfficiency),
    pressureAccuracy: Math.round(pressureAccuracy),
    overallEfficiency: Math.round(overallEfficiency)
  };
}

// Economic calculations
export function calculateOperatingCosts(
  gasUsed: number, // bar·L
  operatingTime: number, // minutes
  electricityRate: number = 0.25 // €/kWh
): {
  gasCost: number;
  electricityCost: number;
  laborCost: number;
  totalCost: number;
} {
  // Gas cost (simplified - €0.002 per bar·L)
  const gasCost = gasUsed * 0.002;
  
  // Electricity cost (assume 5kW average consumption)
  const electricityCost = (5 * operatingTime / 60) * electricityRate;
  
  // Labor cost (assume €30/hour)
  const laborCost = (operatingTime / 60) * 30;
  
  const totalCost = gasCost + electricityCost + laborCost;
  
  return {
    gasCost: Math.round(gasCost * 100) / 100,
    electricityCost: Math.round(electricityCost * 100) / 100,
    laborCost: Math.round(laborCost * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100
  };
}

// Optimization suggestions
export function getOptimizationSuggestions(
  params: TankParameters,
  bottles: BottleConfig[]
): string[] {
  const suggestions: string[] = [];
  const { Pfinale, temperature, fillPercentage } = params;
  const bottleCheck = checkBottleSufficiency(params, bottles);
  
  // Pressure optimization
  if (Pfinale > 20) {
    suggestions.push("Considerare riduzione pressione target per migliorare sicurezza ed efficienza");
  }
  
  // Temperature optimization
  if (temperature < 10) {
    suggestions.push("Preriscaldare il serbatoio per migliorare l'efficienza del processo");
  } else if (temperature > 50) {
    suggestions.push("Raffreddare il serbatoio per migliorare la sicurezza");
  }
  
  // Fill optimization
  if (fillPercentage > 85) {
    suggestions.push("Ridurre il riempimento per maggiore sicurezza operativa");
  } else if (fillPercentage < 30) {
    suggestions.push("Aumentare il riempimento per un test più rappresentativo");
  }
  
  // Bottle optimization
  if (bottleCheck.marginPercentage < 20) {
    suggestions.push("Aggiungere bombole per maggiore margine di sicurezza");
  } else if (bottleCheck.marginPercentage > 200) {
    suggestions.push("Possibile ridurre il numero di bombole per efficienza economica");
  }
  
  const usedBottles = bottles.filter(b => b.used);
  const lowPressureBottles = usedBottles.filter(b => b.pressure < 160);
  if (lowPressureBottles.length > 0) {
    suggestions.push("Sostituire bombole con pressione bassa per migliore efficienza");
  }
  
  return suggestions;
}

// Unit conversions
export const unitConversions = {
  barToPsi: (bar: number) => bar * 14.504,
  psiToBar: (psi: number) => psi / 14.504,
  celsiusToKelvin: (celsius: number) => celsius + 273.15,
  kelvinToCelsius: (kelvin: number) => kelvin - 273.15,
  litersToGallons: (liters: number) => liters * 0.264172,
  gallonsToLiters: (gallons: number) => gallons / 0.264172,
  barLitersToScfm: (barLiters: number) => barLiters * 0.0353, // Simplified conversion
};

// Mathematical utilities
export const mathUtils = {
  clamp: (value: number, min: number, max: number) => Math.max(min, Math.min(max, value)),
  round: (value: number, decimals: number = 2) => Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals),
  interpolate: (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
  },
  movingAverage: (values: number[], windowSize: number = 5) => {
    if (values.length < windowSize) return values;
    const result = [];
    for (let i = windowSize - 1; i < values.length; i++) {
      const sum = values.slice(i - windowSize + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / windowSize);
    }
    return result;
  }
};

// Export comprehensive calculation function
export function performComprehensiveCalculations(
  tankParams: TankParameters,
  bottles: BottleConfig[]
): {
  gasRequirement: number;
  bottleCapacity: number;
  sufficiency: ReturnType<typeof checkBottleSufficiency>;
  estimatedTime: number;
  safetyFactors: ReturnType<typeof calculateSafetyFactors>;
  optimizationSuggestions: string[];
  operatingCosts: ReturnType<typeof calculateOperatingCosts>;
} {
  const gasRequirement = calculateRequiredGasAmount(tankParams);
  const bottleCapacity = calculateBottleCapacity(bottles);
  const sufficiency = checkBottleSufficiency(tankParams, bottles);
  const estimatedTime = estimatePressurization Time(tankParams.P0, tankParams.Pfinale, tankParams.volume, bottleCapacity);
  const safetyFactors = calculateSafetyFactors(tankParams);
  const optimizationSuggestions = getOptimizationSuggestions(tankParams, bottles);
  const operatingCosts = calculateOperatingCosts(gasRequirement, estimatedTime);
  
  return {
    gasRequirement,
    bottleCapacity,
    sufficiency,
    estimatedTime,
    safetyFactors,
    optimizationSuggestions,
    operatingCosts
  };
}
