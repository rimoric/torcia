// useProcessState.tsx - Process State Management Hook
import { useState } from 'react';
import { Fase } from '../types/process';

interface BottleConfig {
  used: boolean;
  pressure: number;
  volume: number;
}

interface ChecklistItems {
  pressioni: boolean;
  valvole: boolean;
  torcia: boolean;
  bombole: boolean;
  utenze: boolean;
  strumenti: boolean;
}

export function useProcessState() {
  // Tank parameters
  const [P0, setP0] = useState(1.0);
  const [volumeProdotto, setVolumeProdotto] = useState<number | "">("");
  const [temperatura, setTemperatura] = useState<number | "">("");
  const [riempPerc, setRiempPerc] = useState<number | "">("");
  const [Pfinale, setPfinale] = useState<number | "">("");
  const [presetPressureLevel, setPresetPressureLevel] = useState<string>("custom");

  // Bottle configuration
  const [bombola1, setBombola1] = useState<BottleConfig>({ used: false, pressure: 180, volume: 50 });
  const [bombola2, setBombola2] = useState<BottleConfig>({ used: false, pressure: 180, volume: 50 });
  const [bombola3, setBombola3] = useState<BottleConfig>({ used: false, pressure: 180, volume: 50 });

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
  
  // Automatic process
  const [processoAutomaticoStarted, setProcessoAutomaticoStarted] = useState(false);
  const [processoAutomaticoCompleto, setProcessoAutomaticoCompleto] = useState(false);
  const [geShutdownDone, setGeShutdownDone] = useState(false);

  // Final checklist
  const [checklistItems, setChecklistItems] = useState<ChecklistItems>({
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

  // Pressures
  const [P_serb, setP_serb] = useState(1.0);
  const [P_bombole, setP_bombole] = useState(180);

  // Valves (visual only)
  const [PV1, setPV1] = useState(false);
  const [PV2, setPV2] = useState(false);
  const [PV4, setPV4] = useState(false);
  const [PV5, setPV5] = useState(false);
  const [PV6, setPV6] = useState(false);
  const [PR1open, setPR1open] = useState(false);
  const [PR2open, setPR2open] = useState(false);

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

  // Validation helpers
  const isTankDataComplete = () => {
    return P0 > 0 && 
           typeof volumeProdotto === "number" && volumeProdotto > 0 &&
           typeof temperatura === "number" && 
           typeof riempPerc === "number" && riempPerc > 0;
  };

  const isPressureTargetValid = () => {
    return typeof Pfinale === "number" && Pfinale > P0;
  };

  const isBottleSelectionValid = () => {
    return bombola1.used || bombola2.used || bombola3.used;
  };

  const areInitialChecksComplete = () => {
    return setupVallenLoaded && sensorsInstalled && sensorsWorking && backgroundNoiseMonitored;
  };

  const isGeneratorReady = () => {
    return geStarted && geWarmupComplete && geOperational;
  };

  const areUtilitiesActive = () => {
    return allUtilitiesOn;
  };

  const isPressurializationComplete = () => {
    return pressurizzazioneProgress >= 100;
  };

  const isAutomaticProcessComplete = () => {
    return processoAutomaticoCompleto && geShutdownDone;
  };

  const isChecklistComplete = () => {
    return Object.values(checklistItems).every(item => item === true);
  };

  return {
    // Tank data
    P0, setP0,
    volumeProdotto, setVolumeProdotto,
    temperatura, setTemperatura,
    riempPerc, setRiempPerc,
    Pfinale, setPfinale,
    presetPressureLevel, setPresetPressureLevel,

    // Bottles
    bombola1, setBombola1,
    bombola2, setBombola2,
    bombola3, setBombola3,

    // Initial checks
    setupVallenLoaded, setSetupVallenLoaded,
    sensorsInstalled, setSensorsInstalled,
    sensorsWorking, setSensorsWorking,
    backgroundNoiseMonitored, setBackgroundNoiseMonitored,

    // Generator
    geStarted, setGeStarted,
    geWarmupComplete, setGeWarmupComplete,
    geOperational, setGeOperational,
    geOn, setGeOn,
    geRpm, setGeRpm,

    // Utilities
    allUtilitiesOn, setAllUtilitiesOn,
    compressoreOn, setCompressoreOn,
    essiccatoreOn, setEssiccatoreOn,
    genN2On, setGenN2On,

    // Process
    fase, setFase,
    pressurizzazioneProgress, setPressurizzazioneProgress,
    processoAutomaticoStarted, setProcessoAutomaticoStarted,
    processoAutomaticoCompleto, setProcessoAutomaticoCompleto,
    geShutdownDone, setGeShutdownDone,

    // Checklist
    checklistItems, setChecklistItems,

    // Final states
    processoCompletato, setProcessoCompletato,
    salvataggioRichiesto, setSalvataggioRichiesto,

    // Pressures
    P_serb, setP_serb,
    P_bombole, setP_bombole,

    // Valves
    PV1, setPV1, PV2, setPV2, PV4, setPV4, PV5, setPV5, PV6, setPV6,
    PR1open, setPR1open, PR2open, setPR2open,

    // Functions
    resetProcess,

    // Validation
    isTankDataComplete,
    isPressureTargetValid,
    isBottleSelectionValid,
    areInitialChecksComplete,
    isGeneratorReady,
    areUtilitiesActive,
    isPressurializationComplete,
    isAutomaticProcessComplete,
    isChecklistComplete
  };
}
