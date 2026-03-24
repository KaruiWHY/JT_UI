import { useState, useEffect } from "react";

// --- 普惠满血推理一体机：远程资源监控页 (含温度显示版) ---

export function MonitorPage() {
  // 【重要】请在此处填入你服务器的真实局域网 IP
  const SERVER_IP = "192.168.1.93";
  const SERVER_PORT = "3001";

  const [stats, setStats] = useState({
    cpu: 0,
    gpu: 0,
    vram: 0,
    ram: 0,
    ramTotal: 1228,
    temp: 0,
    isConnected: false,
  });

  const EMA_COEFF = 0.3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://${SERVER_IP}:${SERVER_PORT}/api/hardware`,
        );
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();

        setStats((prev) => ({
          cpu: Math.round(prev.cpu * (1 - EMA_COEFF) + data.cpu * EMA_COEFF),
          gpu: Math.round(prev.gpu * (1 - EMA_COEFF) + data.gpu * EMA_COEFF),
          ram: data.ram,
          ramTotal: data.ramTotal || 1228,
          vram: data.vram,
          temp: data.temp || 0, // 接收温度数据
          isConnected: true,
        }));
      } catch (e) {
        setStats((prev) => ({ ...prev, isConnected: false }));
      }
    };

    const timer = setInterval(fetchData, 1500);
    return () => clearInterval(timer);
  }, [SERVER_IP]);

  return (
    <div
      style={{
        padding: "32px",
        backgroundColor: "#fff",
        height: "100%",
        overflowY: "auto",
        fontFamily: "sans-serif",
      }}
    >
      {/* 顶部标题 */}
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "850",
              color: "#0f172a",
              margin: 0,
            }}
          >
            一体机实时性能监控
          </h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>
            双路 EPYC 9135 + 1.2TB DDR5 + 双 RTX 4090D
          </p>
        </div>
        <div
          style={{
            padding: "8px 16px",
            borderRadius: "99px",
            fontSize: "12px",
            fontWeight: "700",
            backgroundColor: stats.isConnected ? "#ecfdf5" : "#fef2f2",
            color: stats.isConnected ? "#059669" : "#dc2626",
            border: `1px solid ${stats.isConnected ? "#10b981" : "#f87171"}`,
          }}
        >
          ● {stats.isConnected ? "远程服务器已联通" : "正在尝试连接..."}
        </div>
      </div>

      {/* 核心指标网格：改为 3 列布局 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        <StatCard
          title="CPU 综合负载"
          value={`${stats.cpu}%`}
          label="双路 AMD EPYC 9135"
          progress={stats.cpu}
          color="#3b82f6"
        />
        <StatCard
          title="GPU 核心负载"
          value={`${stats.gpu}%`}
          label="双路 4090D "
          progress={stats.gpu}
          color="#8b5cf6"
        />
        <StatCard
          title="GPU 核心温度"
          value={`${stats.temp}°C`}
          label={stats.temp > 75 ? "负载较高" : "散热良好"}
          progress={stats.temp} // 温度通常以 100°C 为阈值
          color={stats.temp > 65 ? "#f59e0b" : "#10b981"}
        />
        <StatCard
          title="系统内存 (RAM)"
          value={`${stats.ram} GB`}
          label="标准配置 1.2TB"
          progress={(stats.ram / stats.ramTotal) * 100}
          color="#6366f1"
        />
        <StatCard
          title="计算显存 (VRAM)"
          value={`${stats.vram} GB`}
          label="总显存 48GB"
          progress={(stats.vram / 48) * 100}
          color="#10b981"
        />
        {/* 第六个格子可以放系统状态或留白 */}
        <div
          style={{
            padding: "24px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600" }}
          >
            推理引擎：K-Transformers
          </span>
        </div>
      </div>

      {/* 技术说明 */}
      <div
        style={{
          marginTop: "24px",
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
        }}
      >
        <h4
          style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: "800" }}
        >
          ▍ 运行说明
        </h4>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#64748b",
            lineHeight: "1.6",
          }}
        >
          • 当前显存占用 <b>{stats.vram}GB</b> 包含 DeepSeek-V3 核心权重及
          KV-Cache。 <br />• 异构卸载策略已激活，剩余专家权重由 <b>1.2TB</b>{" "}
          内存池提供算力支撑。
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, label, progress, color }: any) {
  return (
    <div
      style={{
        padding: "24px",
        border: "1px solid #e2e8f0",
        borderRadius: "24px",
        backgroundColor: "#fff",
      }}
    >
      <p
        style={{
          fontSize: "12px",
          color: "#94a3b8",
          marginBottom: "8px",
          fontWeight: "600",
        }}
      >
        {title}
      </p>
      <h3
        style={{
          fontSize: "24px",
          fontWeight: "850",
          marginBottom: "16px",
          color: "#0f172a",
        }}
      >
        {value}
      </h3>
      <div
        style={{
          height: "8px",
          background: "#f1f5f9",
          borderRadius: "4px",
          overflow: "hidden",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            width: `${Math.min(progress, 100)}%`,
            height: "100%",
            background: color,
            transition: "width 1s ease",
          }}
        ></div>
      </div>
      <p style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>
        {label}
      </p>
    </div>
  );
}
