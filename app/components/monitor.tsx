import { useState, useEffect } from "react";

// --- 普惠满血推理一体机：远程资源监控页 ---

export function MonitorPage() {
  // 【重要】请在此处填入你服务器的真实局域网 IP
  const SERVER_IP = "192.168.1.37"; 
  const SERVER_PORT = "3001";

  const [stats, setStats] = useState({
    cpu: 0,
    gpu: 0,
    vram: 0,
    ram: 0,
    ramTotal: 1228, // 对应手册建议的 1.2TB 标准配置
    temp: 0,
    isConnected: false
  });

  const EMA_COEFF = 0.3; // 指数平滑系数

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${SERVER_IP}:${SERVER_PORT}/api/hardware`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        setStats(prev => ({
          // 对利用率进行平滑处理，减少数值抖动
          cpu: Math.round(prev.cpu * (1 - EMA_COEFF) + data.cpu * EMA_COEFF),
          gpu: Math.round(prev.gpu * (1 - EMA_COEFF) + data.gpu * EMA_COEFF),
          ram: data.ram,
          ramTotal: data.ramTotal || 1228,
          vram: data.vram,
          temp: data.temp,
          isConnected: true
        }));
      } catch (e) {
        console.error("无法联通远程一体机哨兵:", e);
        setStats(prev => ({ ...prev, isConnected: false }));
      }
    };

    const timer = setInterval(fetchData, 1500); // 1.5秒采样一次
    return () => clearInterval(timer);
  }, [SERVER_IP]);

  return (
    <div style={{ padding: '32px', backgroundColor: '#fff', height: '100%', overflowY: 'auto', fontFamily: 'sans-serif' }}>
      {/* 顶部标题与状态 */}
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '850', color: '#0f172a', margin: 0 }}>
            一体机实时性能监控
          </h2>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>
            正在连接：双路 AMD EPYC 9135 + 1.2TB DDR5 + 双 RTX 4090D
          </p>
        </div>
        <div style={{ 
          padding: '8px 16px', 
          borderRadius: '99px', 
          fontSize: '13px', 
          fontWeight: '600',
          backgroundColor: stats.isConnected ? '#ecfdf5' : '#fef2f2',
          color: stats.isConnected ? '#059669' : '#dc2626',
          border: `1px solid ${stats.isConnected ? '#10b981' : '#f87171'}`
        }}>
          ● {stats.isConnected ? "远程哨兵已联通" : "尝试连接服务器中..."}
        </div>
      </div>
      
      {/* 核心指标网格 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        <StatCard 
          title="CPU 综合负载" 
          value={`${stats.cpu}%`} 
          label="双路 EPYC 9135 (256 线程)" 
          progress={stats.cpu} 
          color="#3b82f6" 
        />
        <StatCard 
          title="GPU 核心负载" 
          progress={stats.gpu} 
          value={`${stats.gpu}%`} 
          label="双路 RTX 4090D 协同推理" 
          color="#8b5cf6" 
        />
        <StatCard 
          title="系统内存 (RAM)" 
          value={`${stats.ram} GB`} 
          label="标准建议配置 1.2TB" 
          progress={(stats.ram / stats.ramTotal) * 100} 
          color="#6366f1" 
        />
        <StatCard 
          title="计算显存 (VRAM)" 
          value={`${stats.vram} GB`} 
          label="总显存 48GB (24G × 2)" 
          progress={(stats.vram / 48) * 100} 
          color="#10b981" 
        />
      </div>

      {/* 技术说明区 */}
      <div style={{ 
        marginTop: '32px', 
        padding: '24px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '20px', 
        border: '1px solid #e2e8f0' 
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '800' }}>▍ 推理监控解析</h4>
        <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
          <p style={{ margin: '0 0 8px 0' }}>
            • <b>CPU-GPU 异构卸载：</b> 全量权重（约 220GB）常驻于 1.2TB 主存中，GPU 仅保存激活专家与热数据。
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            • <b>NUMA 感知执行：</b> 针对双路平台优化内存布局，降低跨节点访问带来的性能波动。
          </p>
          <p style={{ margin: 0 }}>
            • <b>功耗参考：</b> 典型推理功耗处于 650–750 W 区间，由双路 EPYC 平台高效支撑。
          </p>
        </div>
      </div>
    </div>
  );
}

// 统计卡片子组件
function StatCard({ title, value, label, progress, color }: any) {
  return (
    <div style={{ padding: '28px', border: '1px solid #e2e8f0', borderRadius: '24px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
      <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>{title}</p>
      <h3 style={{ fontSize: '28px', fontWeight: '850', marginBottom: '20px', color: '#0f172a' }}>{value}</h3>
      <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ width: `${Math.min(progress, 100)}%`, height: '100%', background: color, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
      </div>
      <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{label}</p>
    </div>
  );
}