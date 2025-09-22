// components/GeneratorDisplay.tsx
import { usePlcStore } from '@/store/PlcStore';

const GeneratorDisplay = () => {
  // Subscribe solo ai dati necessari
  const generatorStatus = usePlcStore((state) => state.generatorStatus);
  
  return (
    <GeneratorSet
      state={generatorStatus.isRunning ? 'running' : 'stopped'}
      pressure={generatorStatus.pressure}
      temperature={generatorStatus.temperature}
      label="GE001"
    />
  );
};

// components/ValveControl.tsx
const ValveControl = ({ valveId }: { valveId: string }) => {
  const valve = usePlcStore((state) => state.valves[valveId]);
  const mqttClient = usePlcStore((state) => state.mqttClient);
  
  const handleToggle = () => {
    // Invia comando al PLC
    if (mqttClient) {
      mqttClient.publish(`plc/valve/${valveId}/command`, JSON.stringify({
        action: valve?.isOpen ? 'close' : 'open'
      }));
    }
  };
  
  return (
    <Valve2Way
      isOpen={valve?.isOpen ?? false}
      label={valveId}
      manualControlEnabled={true}
      onToggle={handleToggle}
    />
  );
};
