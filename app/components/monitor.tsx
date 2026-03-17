import { useState, useEffect } from "react";

// --- 这个版本使用最基础的 inline style，无需配置 Tailwind 即可看到酷炫效果 ---

export function MonitorPage() {
  const [stats, setStats] = useState({
    cpu: 0,
    gpu: 0,
    vram: 0,
    ram: 0,
    ramTotal: 16,
    temp: 0
  });

  // 模拟实时数据波动
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/hardware");
        const data = await response.json();
        if (!data.error) {
          setStats(data);
        }
      } catch (e) {
        console.error("无法获取硬件数据:", e);
      }
    };

    fetchData(); // 立即执行一次
    const timer = setInterval(fetchData, 2000); // 每2秒刷新一次真实数据
    return () => clearInterval(timer);
  }, []);

  // 通用的内联样式设置，保持整体布局
  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '40px',
    backgroundColor: '#f9fafb',
    overflowY: 'auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // 响应式网格
    gap: '24px'
  };

  return (
    <div style={pageStyle as any}>
      <div style={headerStyle as any}>
        <div>
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>资源实时监控</h2>
          <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '16px' }}>正在监控普惠一体机计算单元 </p>
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            backgroundColor: '#d1fae5', // 浅绿色背景
            color: '#059669',          // 深绿色文字
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#10b981', // 绿色状态点
              borderRadius: '50%',
              display: 'inline-block'
            }}></span>
            系统运行中
          </span>
        </div>
      </div>

      {/* 核心指标卡片组 */}
      <div style={gridStyle as any}>
        <StatCard title="CPU 利用率" value={`${stats.cpu}%`} label="AMD EPYC 9355" progress={stats.cpu} color="#3b82f6" />
        <StatCard title="GPU 利用率" value={`${stats.gpu}%`} label="NVIDIA-5090D" progress={stats.gpu} color="#8b5cf6" />
        <StatCard title="核心温度" value={`${stats.temp}°C`} label="Normal" progress={stats.temp} color="#f59e0b" />
        <StatCard title="显存占用 (VRAM)" value={`${stats.vram} GB`} label="Total 48GB" progress={(stats.vram/16)*100} color="#10b981" />
        <StatCard title="内存占用 (RAM)" value={`${stats.ram} GB`} label="Total 1024GB" progress={(stats.ram/32)*100} color="#6366f1" />
      </div>

      {/* 底部详情展示 */}
      <div style={{
        marginTop: '40px',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: '16px', color: '#374151' }}>推理引擎状态</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280', margin: 0 }}>后端框架: <span style={{ color: '#1f2937', fontFamily: 'monospace' }}>vLLM / Ollama</span></p>
            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280', margin: 0 }}>计算精度: <span style={{ color: '#1f2937', fontFamily: 'monospace' }}>INT8 / FP16</span></p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280', margin: 0 }}>推理速度: <span style={{ color: '#2563eb', fontFamily: 'monospace', fontWeight: 'bold' }}>24.5 tokens/s</span></p>
            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280', margin: 0 }}>首字延迟: <span style={{ color: '#1f2937', fontFamily: 'monospace' }}>140ms</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 子组件：指标卡片（同样使用内联样式）
function StatCard({ title, value, label, progress, color }: any) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      transition: 'box-shadow 0.3s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <p style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500', margin: 0 }}>{title}</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginTop: '4px', margin: 0 }}>{value}</p>
        </div>
        <span style={{ fontSize: '12px', color: '#9ca3af', backgroundColor: '#f9fafb', padding: '4px 8px', borderRadius: '4px' }}>{label}</span>
      </div>
      <div style={{ width: '100%', backgroundColor: '#f3f4f6', height: '8px', borderRadius: '9999px', overflow: 'hidden' }}>
        <div 
          style={{ 
            height: '100%', 
            transition: 'all 1s ease-out', // 平滑动画
            width: `${progress}%`, 
            backgroundColor: color 
          }}
        ></div>
      </div>
    </div>
  );
}