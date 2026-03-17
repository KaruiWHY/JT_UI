import { NextResponse } from "next/server";
import si from "systeminformation";

export async function GET() {
  try {
    // 1. 并行抓取：CPU负载、内存、显存/显卡信息
    const [cpuLoad, mem, graphics] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.graphics(),
    ]);

    // 2. 寻找最合适的 GPU 控制器
    const controllers = graphics.controllers as any[];
    
    // 逻辑：优先找 NVIDIA 显卡；如果没有，找利用率 > 0 的显卡；再没有就选第一块
    const targetGpu = controllers.find(g => 
      (g.vendor?.toLowerCase().includes('nvidia')) || 
      (g.model?.toLowerCase().includes('nvidia'))
    ) || controllers.find(g => g.utilizationGpu > 0) || controllers[0];

    // 3. 格式化数据输出
    return NextResponse.json({
      // CPU 占用
      cpu: Math.floor(cpuLoad.currentLoad),

      // 内存占用 (GB)
      ram: +(Number(mem.active) / 1024 / 1024 / 1024).toFixed(1),
      ramTotal: +(Number(mem.total) / 1024 / 1024 / 1024).toFixed(1),

      // GPU 利用率
      // 兼容多种字段：utilizationGpu (Nvidia), gpuUsage (AMD/Intel)
      gpu: targetGpu?.utilizationGpu ?? targetGpu?.gpuUsage ?? 0,

      // 显存占用 (GB)
      // 兼容 vramUsage (Nvidia), memoryUsed (AMD)
      vram: +(
        (targetGpu?.vramUsage || targetGpu?.memoryUsed || targetGpu?.vramUsed || 0) / 1024
      ).toFixed(1),

      // 温度
      temp: targetGpu?.temperatureGpu || targetGpu?.temperature || 0,
      
      // 调试信息：方便你在控制台看到当前抓取的是哪块卡
      gpuName: targetGpu?.model || "Unknown GPU"
    });
  } catch (error) {
    console.error("Hardware API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch hardware data" },
      { status: 500 }
    );
  }
}