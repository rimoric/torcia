import mqtt from 'mqtt';
import { usePlcStore } from '../store/plcStore';
import { useAlarmStore } from '../store/alarmStore';
import { MqttMessage } from '../types/plc';
import { mqttConfig } from './mqttConfig';

class MqttClient {
  private client: mqtt.MqttClient | null = null;
  private subscriptions: Set<string> = new Set();
  private messageHandlers: Map<string, (payload: any) => void> = new Map();

  async connect(brokerUrl: string, options: mqtt.IClientOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.client = mqtt.connect(brokerUrl, options);

        this.client.on('connect', () => {
          console.log('[MQTT] Connected to broker');
          this.resubscribe();
          resolve();
        });

        this.client.on('error', (error) => {
          console.error('[MQTT] Connection error:', error);
          useAlarmStore.getState().addAlarm({
            severity: 'critical',
            message: `MQTT connection error: ${error.message}`,
            timestamp: Date.now(),
            source: 'PLC_CONNECTION'
          });
          reject(error);
        });

        this.client.on('message', (topic, message) => {
          this.handleMessage(topic, message);
        });

        this.client.on('close', () => {
          console.log('[MQTT] Connection closed');
          usePlcStore.getState().setConnectionStatus(false);
        });

        this.client.on('offline', () => {
          console.log('[MQTT] Client offline');
          usePlcStore.getState().setConnectionStatus(false);
        });

        this.client.on('reconnect', () => {
          console.log('[MQTT] Attempting to reconnect...');
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.subscriptions.clear();
      this.messageHandlers.clear();
    }
  }

  subscribe(topic: string | string[], handler?: (payload: any) => void): void {
    if (!this.client || !this.client.connected) {
      console.warn('[MQTT] Cannot subscribe - not connected');
      return;
    }

    const topics = Array.isArray(topic) ? topic : [topic];

    topics.forEach(t => {
      this.client!.subscribe(t, { qos: 1 }, (err) => {
        if (err) {
          console.error(`[MQTT] Subscribe error for ${t}:`, err);
        } else {
          console.log(`[MQTT] Subscribed to ${t}`);
          this.subscriptions.add(t);
          if (handler) {
            this.messageHandlers.set(t, handler);
          }
        }
      });
    });
  }

  unsubscribe(topic: string | string[]): void {
    if (!this.client) return;

    const topics = Array.isArray(topic) ? topic : [topic];

    topics.forEach(t => {
      this.client!.unsubscribe(t, (err) => {
        if (err) {
          console.error(`[MQTT] Unsubscribe error for ${t}:`, err);
        } else {
          console.log(`[MQTT] Unsubscribed from ${t}`);
          this.subscriptions.delete(t);
          this.messageHandlers.delete(t);
        }
      });
    });
  }

  publish(topic: string, payload: any, options?: mqtt.IClientPublishOptions): void {
    if (!this.client || !this.client.connected) {
      console.warn('[MQTT] Cannot publish - not connected');
      return;
    }

    const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const pubOptions = options || { qos: 1, retain: false };

    this.client.publish(topic, message, pubOptions, (err) => {
      if (err) {
        console.error(`[MQTT] Publish error for ${topic}:`, err);
        useAlarmStore.getState().addAlarm({
          severity: 'warning',
          message: `Failed to send command to ${topic}`,
          timestamp: Date.now(),
          source: 'SYSTEM'
        });
      } else {
        console.log(`[MQTT] Published to ${topic}:`, message);
      }
    });
  }

  private handleMessage(topic: string, message: Buffer): void {
    try {
      const payload = JSON.parse(message.toString());
      console.log(`[MQTT] Message on ${topic}:`, payload);

      // Check for specific handlers
      for (const [pattern, handler] of this.messageHandlers) {
        if (this.topicMatches(pattern, topic)) {
          handler(payload);
        }
      }

      // Update PLC store
      usePlcStore.getState().updateFromMqtt(topic, payload);

    } catch (error) {
      console.error('[MQTT] Error parsing message:', error);
    }
  }

  private resubscribe(): void {
    if (this.subscriptions.size > 0) {
      console.log('[MQTT] Resubscribing to topics...');
      this.subscriptions.forEach(topic => {
        this.subscribe(topic);
      });
    }

    // Subscribe to default topics
    mqttConfig.defaultTopics.forEach(topic => {
      this.subscribe(topic);
    });
  }

  private topicMatches(pattern: string, topic: string): boolean {
    const patternParts = pattern.split('/');
    const topicParts = topic.split('/');

    if (patternParts.length !== topicParts.length && !pattern.includes('#')) {
      return false;
    }

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] === '#') return true;
      if (patternParts[i] === '+') continue;
      if (patternParts[i] !== topicParts[i]) return false;
    }

    return true;
  }

  isConnected(): boolean {
    return this.client?.connected || false;
  }
}

// Singleton instance
export const mqttClient = new MqttClient();
