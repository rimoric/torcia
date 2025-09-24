// types/PlcData.ts
interface PlcData {
  // Stati operativi
  generatorStatus: {
    isRunning: boolean;
    pressure: number;
    temperature: number;
    alarms: string[];
  };
  
  // Serbatoio GPL
  gplTank: {
    level: number;
    temperature: number;
    pressure: number;
  };
  
  // Valvole
  valves: {
    [valveId: string]: {
      isOpen: boolean;
      position?: number; // per valvole modulanti
    };
  };
  
  // Pressostati
  pressureSwitches: {
    [psId: string]: {
      pressure: number;
      isActive: boolean;
    };
  };
  
  // Torce
  flares: {
    [flareId: string]: {
      isLit: boolean;
      pilotActive: boolean;
    };
  };
}

// store/PlcStore.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface PlcStore extends PlcData {
  // Actions
  updateGeneratorStatus: (status: Partial<PlcData['generatorStatus']>) => void;
  updateValveState: (valveId: string, state: Partial<PlcData['valves'][string]>) => void;
  updateFromMqtt: (topic: string, payload: any) => void;
  
  // Subscription management
  mqttClient: any;
  connectMqtt: () => void;
  disconnectMqtt: () => void;
}

const usePlcStore = create<PlcStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    generatorStatus: {
      isRunning: false,
      pressure: 0,
      temperature: 0,
      alarms: []
    },
    
    gplTank: {
      level: 0,
      temperature: 0,
      pressure: 0
    },
    
    valves: {},
    pressureSwitches: {},
    flares: {},
    
    mqttClient: null,
    
    // Actions
    updateGeneratorStatus: (status) =>
      set((state) => ({
        generatorStatus: { ...state.generatorStatus, ...status }
      })),
    
    updateValveState: (valveId, valveState) =>
      set((state) => ({
        valves: {
          ...state.valves,
          [valveId]: { ...state.valves[valveId], ...valveState }
        }
      })),
    
    // MQTT message handler
    updateFromMqtt: (topic, payload) => {
      const state = get();
      
      // Parse topic to determine data type
      if (topic.includes('generator/status')) {
        state.updateGeneratorStatus(payload);
      } else if (topic.includes('valve/')) {
        const valveId = topic.split('/')[1];
        state.updateValveState(valveId, payload);
      } else if (topic.includes('gpl/tank')) {
        set({ gplTank: { ...state.gplTank, ...payload } });
      }
      // ... altri casi
    },
    
    // MQTT connection
    connectMqtt: () => {
      // Configurazione MQTT client
      const client = mqtt.connect('mqtt://your-broker-url');
      
      client.on('connect', () => {
        // Subscribe to all PLC topics
        client.subscribe('plc/+/+');
      });
      
      client.on('message', (topic, message) => {
        const payload = JSON.parse(message.toString());
        get().updateFromMqtt(topic, payload);
      });
      
      set({ mqttClient: client });
    },
    
    disconnectMqtt: () => {
      const { mqttClient } = get();
      if (mqttClient) {
        mqttClient.end();
        set({ mqttClient: null });
      }
    }
  }))
);
