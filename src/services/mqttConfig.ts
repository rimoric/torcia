import mqtt from 'mqtt';

interface MqttConfig {
  brokerUrl: string;
  options: mqtt.IClientOptions;
  defaultTopics: string[];
  commandTopics: {
    valve: string;
    generator: string;
    compressor: string;
    system: string;
  };
  reconnectInterval: number;
  maxReconnectAttempts: number;
}

export const mqttConfig: MqttConfig = {
  brokerUrl: process.env.REACT_APP_MQTT_BROKER_URL || 'ws://localhost:9001',
  
  options: {
    clientId: `hmi-client-${Math.random().toString(36).substring(2, 15)}`,
    username: process.env.REACT_APP_MQTT_USERNAME || '',
    password: process.env.REACT_APP_MQTT_PASSWORD || '',
    clean: true,
    connectTimeout: 30000,
    reconnectPeriod: 5000,
    keepalive: 60,
    will: {
      topic: 'hmi/status',
      payload: JSON.stringify({ status: 'offline', timestamp: Date.now() }),
      qos: 1,
      retain: true
    }
  },
  
  defaultTopics: [
    'plc/+/+',          // All PLC data (plc/valve/*, plc/generator/*, etc)
    'plc/status',       // PLC connection status
    'plc/alarms',       // System alarms
    'plc/all/update',   // Bulk updates
    'hmi/command/+',    // Commands from HMI
  ],
  
  commandTopics: {
    valve: 'plc/command/valve',
    generator: 'plc/command/generator',
    compressor: 'plc/command/compressor',
    system: 'plc/command/system'
  },
  
  reconnectInterval: 5000,
  maxReconnectAttempts: 10
};

// Topic builders
export const buildTopic = {
  deviceStatus: (deviceType: string, deviceId: string) => 
    `plc/${deviceType}/${deviceId}`,
  
  deviceCommand: (deviceType: string, deviceId: string) => 
    `plc/command/${deviceType}/${deviceId}`,
  
  alarm: (severity: string) => 
    `plc/alarms/${severity}`,
  
  system: (action: string) => 
    `plc/system/${action}`
};
