import { Path } from "../constant";
import { useNavigate } from "react-router-dom";

export function ProductHomePage() {
  const navigate = useNavigate();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#fff',
    overflowY: 'auto',
    color: '#1f2937',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  };    

  const heroSectionStyle = {
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
    textAlign: 'center' as const,
    borderBottom: '1px solid #e2e8f0'
  };

  const badgeStyle = {
    display: 'inline-block',
    padding: '6px 16px',
    backgroundColor: '#2563eb',
    color: '#fff',
    borderRadius: '99px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
  };

  // --- 关键修改：设置 2*2 网格布局 ---
  const featureGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // 核心：强制两列
    gap: '24px',                            // 卡片间距
    padding: '50px 20px',
    maxWidth: '1000px',                     // 稍微缩小最大宽度让布局更紧凑
    margin: '0 auto'
  };

  return (
    <div style={containerStyle as any}>
      {/* Hero Section */}
      <section style={heroSectionStyle as any}>
        <div style={badgeStyle as any}>国产之光 · 普惠算力</div>
        <h1 style={{ fontSize: '36px', fontWeight: '850', marginBottom: '20px', color: '#0f172a', lineHeight: '1.2' }}>
          普惠 AI 一体机
        </h1>
        <p style={{ fontSize: '18px', color: '#475569', maxWidth: '800px', margin: '0 auto 30px', lineHeight: '1.6' }}>
          全球首个通过 <span style={{color:'#2563eb', fontWeight:'700'}}>K-Transformers</span> 架构
          实现单机部署 <span style={{color:'#2563eb', fontWeight:'700'}}>DeepSeek-V3/R1 (671B)</span> 的商用一体机。
          接入 OpenClaw 生态，让万亿级算力真正走进千家万户。
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate(Path.Inference)}
            style={{ padding: '12px 30px', backgroundColor: '#2563eb', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            开启 671B 对话
          </button>
          <button 
            onClick={() => navigate(Path.Showcase)}
            style={{ padding: '12px 30px', backgroundColor: '#fff', color: '#1f2937', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '600', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            查看样机形态
          </button>
        </div>
      </section>

      {/* 核心卖点 - 2*2 布局区域 */}
      <div style={featureGridStyle as any}>
        <FeatureCard 
          icon="🧠" 
          title="极致显存压缩" 
          desc="基于 K-Transformers 技术，支持高性能 2-bit/4-bit 量化，在单台设备上即可流畅运行 DeepSeek 671B 全量模型。" 
        />
        <FeatureCard 
          icon="🦀" 
          title="OpenClaw 生态" 
          desc="深度接入 OpenClaw 插件系统，支持自动调用外部 API、文件处理及复杂任务编排，AI 不止于聊天。" 
        />
        <FeatureCard 
          icon="💰" 
          title="极致性价比" 
          desc="普惠级定价。无需昂贵的 A100 集群，用消费级硬件成本，获得顶级模型推理能力。" 
        />
        <FeatureCard 
          icon="⚡" 
          title="开箱即用" 
          desc="预装国产全栈 AI 环境，集成推理加速引擎，通电即可使用，零门槛上手万亿大模型。" 
        />
      </div>

      <div style={{ padding: '30px', textAlign: 'center' as const, color: '#94a3b8', fontSize: '13px', borderTop: '1px solid #f1f5f9' }}>
        普惠一体机项目组 · 2026 技术演示版
      </div>
    </div>
  );
}

// 子组件：指标卡片（同样使用内联样式）
function FeatureCard({ icon, title, desc }: any) {
  return (
    <div 
      style={{ 
        padding: '30px', 
        border: '1px solid #e2e8f0', 
        borderRadius: '16px', 
        backgroundColor: '#fff', 
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        height: '100%' // 确保卡片高度一致
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: '36px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#0f172a' }}>{title}</h3>
      <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '14px', margin: 0, flexGrow: 1 }}>{desc}</p>
    </div>
  );
}