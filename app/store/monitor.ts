import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MonitorStats {
  cpu: number;
  gpu: number;
  vram: number;
  ram: number;
  ramTotal: number;
  cpuTemp: number;
  temp: number;
  isConnected: boolean;
}

interface MonitorStore {
  stats: MonitorStats;
  updateStats: (newStats: Partial<MonitorStats>) => void;
}

export const useMonitorStore = create<MonitorStore>()(
  persist(
    (set) => ({
      stats: {
        cpu: 0,
        gpu: 0,
        vram: 0,
        ram: 0,
        ramTotal: 1228,
        temp: 0,
        cpuTemp: 0,
        isConnected: false,
      },
      updateStats: (newStats) =>
        set((state) => ({
          stats: { ...state.stats, ...newStats },
        })),
    }),
    { name: "monitor-store" }, // 这里的 persist 会让数据自动存入 localStorage，实现秒开显示旧数据
  ),
);
