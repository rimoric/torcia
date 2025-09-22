import { useEffect, useState, useCallback } from 'react';
import { usePlcStore } from '../store/plcStore';
import { useAlarmStore } from '../store/alarmStore';
import { mqttClient } from '../services/mqttClient';
import { mqttConfig } from '../services/mqttConfig';

interface UsePlcConnectionReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnectAttempts: number;
}

export const usePlcConnection = (): UsePlcConnectionReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const { setConnectionStatus } = usePlcStore();
  const { addAlarm, clearConnectionAlarms } = useAlarmStore();

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      await mqttClient.connect(mqttConfig.brokerUrl, mqttConfig.options);
      
      setIsConnected(true);
      setConnectionStatus(true);
      clearConnectionAlarms();
      setReconnectAttempts(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore connessione PLC';
      setError(errorMessage);
      setIsConnected(false);
      setConnectionStatus(false);
      
      addAlarm({
        id: 'plc-connection-error',
        severity: 'critical',
        message: `Impossibile connettersi al PLC: ${errorMessage}`,
        timestamp: Date.now(),
        source: 'PLC_CONNECTION'
      });
    } finally {
      setIsConnecting(false);
    }
  }, [setConnectionStatus, addAlarm, clearConnectionAlarms]);

  const disconnect = useCallback(() => {
    mqttClient.disconnect();
    setIsConnected(false);
    setConnectionStatus(false);
  }, [setConnectionStatus]);

  // Auto-connect on mount
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []);

  // Handle reconnection
  useEffect(() => {
    if (!isConnected && !isConnecting && reconnectAttempts < mqttConfig.maxReconnectAttempts) {
      const timeout = setTimeout(() => {
        setReconnectAttempts(prev => prev + 1);
        connect();
      }, mqttConfig.reconnectInterval);

      return () => clearTimeout(timeout);
    }
  }, [isConnected, isConnecting, reconnectAttempts, connect]);

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    reconnectAttempts
  };
};
