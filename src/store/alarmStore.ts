import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AlarmSeverity = 'info' | 'warning' | 'critical';
export type AlarmSource = 'PLC_CONNECTION' | 'VALVE' | 'GENERATOR' | 'TANK' | 'PRESSURE' | 'SYSTEM';

export interface Alarm {
  id: string;
  severity: AlarmSeverity;
  message: string;
  timestamp: number;
  source: AlarmSource;
  deviceId?: string;
  acknowledged?: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: number;
  resolved?: boolean;
  resolvedAt?: number;
  data?: any;
}

export interface AlarmStore {
  alarms: Alarm[];
  activeAlarmCount: number;
  criticalAlarmCount: number;
  
  // Actions
  addAlarm: (alarm: Omit<Alarm, 'id'>) => void;
  acknowledgeAlarm: (id: string, acknowledgedBy?: string) => void;
  resolveAlarm: (id: string) => void;
  clearAlarm: (id: string) => void;
  clearAllAlarms: () => void;
  clearConnectionAlarms: () => void;
  
  // Queries
  getAlarmsBySource: (source: AlarmSource) => Alarm[];
  getActiveAlarms: () => Alarm[];
  getCriticalAlarms: () => Alarm[];
}

export const useAlarmStore = create<AlarmStore>()(
  persist(
    (set, get) => ({
      alarms: [],
      activeAlarmCount: 0,
      criticalAlarmCount: 0,

      addAlarm: (alarmData) => set((state) => {
        const alarm: Alarm = {
          ...alarmData,
          id: `alarm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        const newAlarms = [alarm, ...state.alarms].slice(0, 1000); // Keep max 1000 alarms
        
        return {
          alarms: newAlarms,
          activeAlarmCount: newAlarms.filter(a => !a.resolved).length,
          criticalAlarmCount: newAlarms.filter(a => !a.resolved && a.severity === 'critical').length
        };
      }),

      acknowledgeAlarm: (id, acknowledgedBy = 'operator') => set((state) => ({
        alarms: state.alarms.map(alarm =>
          alarm.id === id
            ? { 
                ...alarm, 
                acknowledged: true, 
                acknowledgedBy,
                acknowledgedAt: Date.now() 
              }
            : alarm
        )
      })),

      resolveAlarm: (id) => set((state) => {
        const newAlarms = state.alarms.map(alarm =>
          alarm.id === id
            ? { ...alarm, resolved: true, resolvedAt: Date.now() }
            : alarm
        );
        
        return {
          alarms: newAlarms,
          activeAlarmCount: newAlarms.filter(a => !a.resolved).length,
          criticalAlarmCount: newAlarms.filter(a => !a.resolved && a.severity === 'critical').length
        };
      }),

      clearAlarm: (id) => set((state) => {
        const newAlarms = state.alarms.filter(alarm => alarm.id !== id);
        
        return {
          alarms: newAlarms,
          activeAlarmCount: newAlarms.filter(a => !a.resolved).length,
          criticalAlarmCount: newAlarms.filter(a => !a.resolved && a.severity === 'critical').length
        };
      }),

      clearAllAlarms: () => set({
        alarms: [],
        activeAlarmCount: 0,
        criticalAlarmCount: 0
      }),

      clearConnectionAlarms: () => set((state) => {
        const newAlarms = state.alarms.filter(
          alarm => alarm.source !== 'PLC_CONNECTION' || alarm.resolved
        );
        
        return {
          alarms: newAlarms,
          activeAlarmCount: newAlarms.filter(a => !a.resolved).length,
          criticalAlarmCount: newAlarms.filter(a => !a.resolved && a.severity === 'critical').length
        };
      }),

      getAlarmsBySource: (source) => {
        return get().alarms.filter(alarm => alarm.source === source);
      },

      getActiveAlarms: () => {
        return get().alarms.filter(alarm => !alarm.resolved);
      },

      getCriticalAlarms: () => {
        return get().alarms.filter(
          alarm => !alarm.resolved && alarm.severity === 'critical'
        );
      }
    }),
    {
      name: 'plc-alarm-storage',
      partialize: (state) => ({ alarms: state.alarms }) // Persist only alarms
    }
  )
);
