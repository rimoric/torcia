import { mqttClient } from './mqttClient';
import { buildTopic } from './mqttConfig';
import { PlcCommand } from '../types/plc';
import { usePlcStore } from '../store/plcStore';
import { useAlarmStore } from '../store/alarmStore';

class PlcService {
  // Valve controls
  async setValveState(valveId: string, open: boolean): Promise<void> {
    const command: PlcCommand = {
      device: `valve/${valveId}`,
      action: open ? 'open' : 'close',
      timestamp: Date.now()
    };
    
    mqttClient.publish(buildTopic.deviceCommand('valve', valveId), command);
  }

  async setValvePosition(valveId: string, position: number): Promise<void> {
    const command: PlcCommand = {
      device: `valve/${valveId}`,
      action: 'setPosition',
      value: Math.max(0, Math.min(100, position)),
      timestamp: Date.now()
    };
    
    mqttClient.publish(buildTopic.deviceCommand('valve', valveId), command);
  }

  // Generator controls
  async startGenerator(generatorId: string): Promise<void> {
    const command: PlcCommand = {
      device: `generator/${generatorId}`,
      action: 'start',
      timestamp: Date.now()
    };
    
    mqttClient.publish(buildTopic.deviceCommand('generator', generatorId), command);
  }

  async stopGenerator(generatorId: string): Promise<void> {
    const command: PlcCommand = {
      device: `generator/${generatorId}`,
      action: 'stop',
      timestamp: Date.now()
    };
    
    mqttClient.publish(buildTopic.deviceCommand('generator', generatorId), command);
  }

  // Compressor controls
  async setCompressorState(compressorId: string, state: 'start' | 'stop'): Promise<void> {
    const command: PlcCommand = {
      device: `compressor/${compressorId}`,
      action: state,
      timestamp: Date.now()
    };
    
    mqttClient.publish(buildTopic.deviceCommand('compressor', compressorId), command);
  }

  // Flare controls
  async igniteFlare(flareId: string): Promise<void> {
    const command: PlcCommand = {
      device: `flare/${flareId}`,
      action: 'ignite',
      timestamp: Date.now()
    };
    
    mqttClient.publish(buildTopic.deviceCommand('flare', flareId), command);
  }

  async extinguishFlare(flareId: string): Promise<void> {
    const command: PlcCommand = {
      device: `flare/${flareId}`,
      action: 'extinguish',
      timestamp: Date.now()
    };
    
    mqttClient.publish(buildTopic.deviceCommand('flare', flareId), command);
  }

  // System commands
  async emergencyStop(): Promise<void> {
    const command: PlcCommand = {
      device: 'system',
      action: 'emergencyStop',
      timestamp: Date.now()
    };
    
    mqttClient.publish(buildTopic.system('emergency'), command);
    
    // Add critical alarm
    useAlarmStore.getState().addAlarm({
      severity: 'critical',
      message: 'Emergency stop activated',
      timestamp: Date.now(),
      source: 'SYSTEM'
    });
  }

  async resetSystem(): Promise<void> {
    const command: PlcCommand = {
      device: 'system',
      action: 'reset',
      timestamp: Date.now()
    };
    
    mqttClient.publish(buildTopic.system('reset'), command);
  }

  async acknowledgeAlarms(): Promise<void> {
    const command: PlcCommand = {
      device: 'system',
      action: 'acknowledgeAlarms',
      timestamp: Date.now()
    };
    
    mqttClient.publish(buildTopic.system('ackAlarms'), command);
  }

  // Data requests
  async requestFullUpdate(): Promise<void> {
    mqttClient.publish('plc/request/fullUpdate', { timestamp: Date.now() });
  }

  async requestDeviceStatus(deviceType: string, deviceId: string): Promise<void> {
    mqttClient.publish(`plc/request/${deviceType}/${deviceId}`, { 
      timestamp: Date.now() 
    });
  }

  // Process sequences
  async startPressurization(targetPressure: number): Promise<void> {
    const command: PlcCommand = {
      device: 'process',
      action: 'startPressurization',
      value: { targetPressure },
      timestamp: Date.now()
    };
    
    mqttClient.publish('plc/process/pressurization', command);
  }

  async stopPressurization(): Promise<void> {
    const command: PlcCommand = {
      device: 'process',
      action: 'stopPressurization',
      timestamp: Date.now()
    };
    
    mqttClient.publish('plc/process/pressurization', command);
  }

  // Utility methods
  isConnected(): boolean {
    return mqttClient.isConnected();
  }

  getConnectionStatus(): boolean {
    return usePlcStore.getState().isConnected;
  }
}

// Singleton instance
export const plcService = new PlcService();
