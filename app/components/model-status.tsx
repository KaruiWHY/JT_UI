import { useState, useEffect } from "react";

// --- 普惠 AI 一体机：模型状态页 (精简一屏显示版) ---

export function ModelStatusPage() {
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoading((prev) => (prev < 100 ? prev + 1 : 100));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#ffffff",
    overflow: "hidden", // 强制不显示滚动条
    color: "#1f2937",
    padding: "24px 32px", // 缩小上下内边距
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  return (
    <div style={containerStyle as any}>
      {/* 1. 顶部标题区 - 压缩间距 */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "26px", fontWeight: "850", color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
          模型运行引擎状态
        </h2>
        <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>
          当前核心：DeepSeek-V3/R1 (671B) · K-Transformers 算力调度中
        </p>
      </div>

      {/* 2. 核心指标看板 - 减小高度 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" }}>
        <StatusCard label="模型后端" value="K-Transformers" sub="高性能内核" />
        <StatusCard label="量化级别" value="Q2_K / INT4" sub="动态量化" />
        <StatusCard label="推理并行度" value="TP 2 / PP 1" sub="双卡并行" />
        <StatusCard label="运行状态" value="健康" color="#10b981" sub="响应正常" />
      </div>

      {/* 3. 权重分布可视化与实时日志 - 压缩高度 */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px", marginBottom: "20px", flexGrow: 1 }}>
        
        {/* 左侧：权重驻留拓扑 */}
        <div style={{ padding: "20px", border: "1px solid #e2e8f0", borderRadius: "20px", background: "#f8fafc", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h4 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "800", color: "#1e293b" }}>
            ▍ K-Transformers 权重驻留拓扑
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <ProgressGroup 
              label="GPU 驻留层 (Attention / KV)" 
              percent={18} 
              desc="48GB VRAM 已映射，首字延迟 < 150ms"
              color="#10b981" 
            />
            <ProgressGroup 
              label="CPU 卸载层 (MoE Experts)" 
              percent={82} 
              desc="220GB 驻留于 1TB 内存，EPYC 高速调度"
              color="#3b82f6" 
            />
          </div>
          <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>
             <strong>备注：</strong> 针对 671B MoE 稀疏性，利用 1024GB 内存池突破显存瓶颈。
          </div>
        </div>

        {/* 右侧：实时内核日志 - 压缩高度 */}
        <div style={{ 
          backgroundColor: "#0f172a", 
          borderRadius: "20px", 
          padding: "20px", 
          color: "#38bdf8", 
          fontFamily: "'Fira Code', monospace",
          fontSize: "11px",
          display: "flex",
          flexDirection: "column"
        }}>
          <h4 style={{ color: "#fff", margin: "0 0 12px 0", fontFamily: "sans-serif", fontSize: "13px" }}>内核实时追踪</h4>
          <div style={{ overflow: "hidden", lineHeight: "1.6" }}>
            <div style={{ color: "#94a3b8" }}>[INFO] 2026-03-18 20:01:05 - Init Engine...</div>
            <div>[INFO] CPU: AMD EPYC 9135 x 2 (256T)</div>
            <div>[INFO] GPU: Dual RTX 4090D (48GB)</div>
            <div style={{ color: "#10b981" }}>[SUCCESS] Weights Loaded: {loading}%</div>
            <div>[DEBUG] Layer Mapping: 18.2% CUDA / 81.8% RAM</div>
            <div style={{ color: "#fbbf24" }}>[WARN] NUMA Affinity: Node 0/1 Balanced</div>
            <div style={{ color: "#fff", borderTop: "1px solid #1e293b", marginTop: "8px", paddingTop: "8px" }}>
              {"> "} Ready for request (24.5 t/s)
            </div>
            <div style={{ animation: "blink 1s infinite" }}>{"> "} _</div>
          </div>
        </div>
      </div>

      {/* 4. 推理引擎性能详情 - 压缩高度 */}
      <div style={{ 
        padding: "20px", 
        backgroundColor: "#ffffff", 
        borderRadius: "20px", 
        border: "1px solid #e2e8f0", 
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)" 
      }}>
        <h3 style={{ fontSize: "16px", fontWeight: "850", marginBottom: "16px", color: "#0f172a" }}>
          ▍ 推理引擎性能详情
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <DetailRow label="后端框架" value="K-Transformers / vLLM" />
            <DetailRow label="计算精度" value="INT8 / FP16" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <DetailRow label="推理速度" value="24.5 tokens/s" valueStyle={{ color: "#2563eb", fontWeight: "850" }} />
            <DetailRow label="首字延迟" value="140ms" />
          </div>
        </div>
      </div>

      <style>{`@keyframes blink { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }`}</style>
    </div>
  );
}

// --- 辅助子组件 (略作精简) ---

function StatusCard({ label, value, sub, color }: any) {
  return (
    <div style={{ padding: "16px", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px" }}>
      <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 4px 0", fontWeight: "600" }}>{label}</p>
      <p style={{ fontSize: "16px", fontWeight: "850", margin: "0 0 2px 0", color: color || "#0f172a" }}>{value}</p>
      <p style={{ fontSize: "10px", color: "#64748b", margin: 0 }}>{sub}</p>
    </div>
  );
}

function ProgressGroup({ label, percent, desc, color }: any) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", fontWeight: "700" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: "800", color: color }}>{percent}%</span>
      </div>
      <div style={{ height: "8px", backgroundColor: "#e2e8f0", borderRadius: "99px", overflow: "hidden", marginBottom: "6px" }}>
        <div style={{ width: `${percent}%`, height: "100%", backgroundColor: color }}></div>
      </div>
      <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>{desc}</p>
    </div>
  );
}

function DetailRow({ label, value, valueStyle = {} }: any) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ color: "#64748b", fontSize: "13px", fontWeight: "600" }}>{label}:</span>
      <span style={{ color: "#0f172a", fontSize: "13px", fontWeight: "700", fontFamily: "monospace", ...valueStyle }}>{value}</span>
    </div>
  );
}