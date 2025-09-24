// validation.ts - Validation Utilities for Process Parameters
import { SettingsLimits } from '../Settings';

// Tank data validation
export interface TankData {
  P0: number;
  volumeProdotto: number | "";
  temperatura: number | "";
  riempPerc: number | "";
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateTankData(data: TankData, limits: SettingsLimits): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // P0 validation
  if (data.P0 <= 0) {
    errors.push("La pressione iniziale deve essere maggiore di 0");
  } else if (data.P0 < limits.P0.min || data.P0 > limits.P0.max) {
    errors.push(`Pressione iniziale fuori range: ${limits.P0.min}-${limits.P0.max} bar`);
  }

  // Volume validation
  if (typeof data.volumeProdotto !== "number") {
    errors.push("Capacità serbatoio richiesta");
  } else if (data.volumeProdotto <= 0) {
    errors.push("Capacità serbatoio deve essere maggiore di 0");
  } else if (data.volumeProdotto < limits.volumeProdotto.min || data.volumeProdotto > limits.volumeProdotto.max) {
    errors.push(`Capacità serbatoio fuori range: ${limits.volumeProdotto.min}-${limits.volumeProdotto.max} L`);
  }

  // Temperature validation
  if (typeof data.temperatura !== "number") {
    errors.push("Temperatura serbatoio richiesta");
  } else if (data.temperatura < limits.temperatura.min || data.temperatura > limits.temperatura.max) {
    errors.push(`Temperatura fuori range: ${limits.temperatura.min}-${limits.temperatura.max} °C`);
  } else if (data.temperatura < -10) {
    warnings.push("Temperatura molto bassa: verificare condizioni operative");
  } else if (data.temperatura > 60) {
    warnings.push("Temperatura elevata: verificare sicurezza operativa");
  }

  // Fill percentage validation
  if (typeof data.riempPerc !== "number") {
    errors.push("Percentuale riempimento richiesta");
  } else if (data.riempPerc <= 0 || data.riempPerc > 100) {
    errors.push("Percentuale riempimento deve essere tra 1 e 100%");
  } else if (data.riempPerc < limits.riempPerc.min || data.riempPerc > limits.riempPerc.max) {
    errors.push(`Percentuale riempimento fuori range: ${limits.riempPerc.min}-${limits.riempPerc.max}%`);
  } else if (data.riempPerc < 20) {
    warnings.push("Riempimento molto basso: verificare se sufficiente per la prova");
  } else if (data.riempPerc > 85) {
    warnings.push("Riempimento molto alto: verificare sicurezza");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Pressure target validation
export function validatePressureTarget(
  Pfinale: number | "", 
  P0: number, 
  limits: SettingsLimits
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof Pfinale !== "number") {
    errors.push("Pressione finale richiesta");
  } else {
    if (Pfinale <= P0) {
      errors.push("Pressione finale deve essere maggiore della pressione iniziale");
    }
    
    if (Pfinale < limits.Pfinale.min || Pfinale > limits.Pfinale.max) {
      errors.push(`Pressione finale fuori range: ${limits.Pfinale.min}-${limits.Pfinale.max} bar`);
    }

    const deltaP = Pfinale - P0;
    if (deltaP > 20) {
      warnings.push("Delta pressione molto elevato: verificare capacità sistema");
    } else if (deltaP < 2) {
      warnings.push("Delta pressione molto basso: verificare utilità della prova");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Bottle configuration validation
export interface BottleConfig {
  used: boolean;
  pressure: number;
  volume: number;
}

export function validateBottleConfiguration(
  bottles: [BottleConfig, BottleConfig, BottleConfig],
  limits: SettingsLimits
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const usedBottles = bottles.filter(b => b.used);
  
  if (usedBottles.length === 0) {
    errors.push("Almeno una bombola deve essere selezionata");
    return { isValid: false, errors, warnings };
  }

  usedBottles.forEach((bottle, index) => {
    const bottleNum = bottles.indexOf(bottle) + 1;
    
    if (bottle.pressure < limits.P_bombole.min || bottle.pressure > limits.P_bombole.max) {
      errors.push(`Bombola ${bottleNum}: pressione fuori range ${limits.P_bombole.min}-${limits.P_bombole.max} bar`);
    } else if (bottle.pressure < 150) {
      warnings.push(`Bombola ${bottleNum}: pressione bassa, verificare sufficienza`);
    }

    if (bottle.volume <= 0 || bottle.volume > 100) {
      errors.push(`Bombola ${bottleNum}: volume non valido`);
    } else if (bottle.volume < 30) {
      warnings.push(`Bombola ${bottleNum}: volume piccolo, verificare sufficienza`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// RPM validation for generator
export function validateGeneratorRPM(rpm: number, limits: SettingsLimits): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (rpm < limits.geRpm.min || rpm > limits.geRpm.max) {
    errors.push(`RPM fuori range: ${limits.geRpm.min}-${limits.geRpm.max}`);
  } else if (rpm > 0 && rpm < 1500) {
    warnings.push("RPM troppo bassi per funzionamento stabile");
  } else if (rpm > 3200) {
    warnings.push("RPM molto alti: verificare stress meccanico");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Generic numeric validation
export function validateNumericRange(
  value: number | "",
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof value !== "number") {
    errors.push(`${fieldName} richiesto`);
  } else if (value < min || value > max) {
    errors.push(`${fieldName} deve essere tra ${min} e ${max}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Safety checks
export function performSafetyChecks(processData: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for dangerous combinations
  if (processData.temperatura > 50 && processData.Pfinale > 25) {
    warnings.push("Combinazione alta temperatura + alta pressione: prestare attenzione");
  }

  if (processData.riempPerc > 90 && processData.Pfinale > 20) {
    warnings.push("Serbatoio molto pieno + alta pressione: verificare sicurezza");
  }

  // Check minimum requirements
  const usedBottles = [processData.bombola1, processData.bombola2, processData.bombola3]
    .filter((b: BottleConfig) => b.used);
  
  if (usedBottles.length === 1 && processData.Pfinale > 20) {
    warnings.push("Una sola bombola per pressione elevata: verificare sufficienza");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Comprehensive validation
export function validateProcessParameters(processData: any, limits: SettingsLimits): ValidationResult {
  const tankValidation = validateTankData({
    P0: processData.P0,
    volumeProdotto: processData.volumeProdotto,
    temperatura: processData.temperatura,
    riempPerc: processData.riempPerc
  }, limits);

  const pressureValidation = validatePressureTarget(
    processData.Pfinale,
    processData.P0,
    limits
  );

  const bottleValidation = validateBottleConfiguration([
    processData.bombola1,
    processData.bombola2,
    processData.bombola3
  ], limits);

  const safetyValidation = performSafetyChecks(processData);

  return {
    isValid: tankValidation.isValid && pressureValidation.isValid && bottleValidation.isValid,
    errors: [
      ...tankValidation.errors,
      ...pressureValidation.errors,
      ...bottleValidation.errors,
      ...safetyValidation.errors
    ],
    warnings: [
      ...tankValidation.warnings,
      ...pressureValidation.warnings,
      ...bottleValidation.warnings,
      ...safetyValidation.warnings
    ]
  };
}
