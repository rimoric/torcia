import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  PlcData, 
  ValveState, 
  GeneratorState, 
  TankState,
  PressureSwitchState,
  FlareState,
  CompressorState,
  NitrogenBottleState,
  PlcCommand 
} from '../types/plc';
import { mqttClient } from '../services/mqttClient';

export interface PlcStore extends PlcData {
  // Connection state
  isConnected: boolean;
  lastUpdateTime: number;
  
  // Actions
  setConnectionStatus: (connected: boolean) => void;
  updateValve: (id: string, state: Partial<ValveState>) => void;
  updateGenerator: (id: string, state: Partial<GeneratorState>) => void;
  updateTank: (id: string, state: Partial<TankState>) => void;
  updatePressureSwitch: (id: string, state: Partial<PressureSwitchState>) => void;
  updateFlare: (id: string, state: Partial<FlareState>) => void;
  updateCompressor: (id: string, state: Partial<CompressorState>) => void;
  updateNitrogenBottle: (id: string, state: Partial<NitrogenBottleState>) => void;
  
  // MQTT handlers
  updateFromMqtt: (topic: string, payload: any) => void;
  sendCommand: (command: PlcCommand) => void;
  
  // Bulk updates
  updateAllData: (data: Partial<PlcData>) => void;
}

export const usePlcStore = create<PlcStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    valves: {},
    generators: {},
    tanks: {},
    pressureSwitches: {},
    flares: {},
    nitrogenBottles: {},
    compressors: {},
    timestamp: Date.now(),
    isConnected: false,
    lastUpdateTime: Date.now(),

    // Connection actions
    setConnectionStatus: (connected) => set({ isConnected: connected }),

    // Individual update actions
    updateValve: (id, state) => set((prev) => ({
      valves: {
        ...prev.valves,
        [id]: { ...prev.valves[id], ...state, id, lastUpdate: Date.now() }
      },
      lastUpdateTime: Date.now()
    })),

    updateGenerator: (id, state) => set((prev) => ({
      generators: {
        ...prev.generators,
        [id]: { ...prev.generators[id], ...state, id }
      },
      lastUpdateTime: Date.now()
    })),

    updateTank: (id, state) => set((prev) => ({
      tanks: {
        ...prev.tanks,
        [id]: { ...prev.tanks[id], ...state, id }
      },
      lastUpdateTime: Date.now()
    })),

    updatePressureSwitch: (id, state) => set((prev) => ({
      pressureSwitches: {
        ...prev.pressureSwitches,
        [id]: { ...prev.pressureSwitches[id], ...state, id }
      },
      lastUpdateTime: Date.now()
    })),

    updateFlare: (id, state) => set((prev) => ({
      flares: {
        ...prev.flares,
        [id]: { ...prev.flares[id], ...state, id }
      },
      lastUpdateTime: Date.now()
    })),

    updateCompressor: (id, state) => set((prev) => ({
      compressors: {
        ...prev.compressors,
        [id]: { ...prev.compressors[id], ...state, id }
      },
      lastUpdateTime: Date.now()
    })),

    updateNitrogenBottle: (id, state) => set((prev) => ({
      nitrogenBottles: {
        ...prev.nitrogenBottles,
        [id]: { ...prev.nitrogenBottles[id], ...state, id }
      },
      lastUpdateTime: Date.now()
    })),

    // MQTT update handler
    updateFromMqtt: (topic, payload) => {
      const parts = topic.split('/');
      const deviceType = parts[1];
      const deviceId = parts[2];
      const state = get();

      switch (deviceType) {
        case 'valve':
          state.updateValve(deviceId, payload);
          break;
        case 'generator':
          state.updateGenerator(deviceId, payload);
          break;
        case 'tank':
          state.updateTank(deviceId, payload);
          break;
        case 'pressure':
          state.updatePressureSwitch(deviceId, payload);
          break;
        case 'flare':
          state.updateFlare(deviceId, payload);
          break;
        case 'compressor':
          state.updateCompressor(deviceId, payload);
          break;
        case 'nitrogen':
          state.updateNitrogenBottle(deviceId, payload);
          break;
        case 'all':
          state.updateAllData(payload);
          break;
      }
    },

    // Send command to PLC
    sendCommand: (command) => {
      const topic = `plc/command/${command.device}`;
      mqttClient.publish(topic, command);
    },

    // Bulk update
    updateAllData: (data) => set((prev) => ({
      ...prev,
      ...data,
      timestamp: Date.now(),
      lastUpdateTime: Date.now()
    }))
  }))
);

// Subscription helper per componenti specifici
export const usePlcDevice = <T>(deviceType: keyof PlcData, deviceId: string) => {
  return usePlcStore((state) => {
    const devices = state[deviceType] as Record<string, T>;
    return devices[deviceId];
  });
};
