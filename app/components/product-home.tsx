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

  return (
    <div style={containerStyle as any}>
      {/* 1. Hero 视觉区 */}
      <section style={heroSectionStyle as any}>
        <div style={{
          display: 'inline-block',
          padding: '6px 16px',
          backgroundColor: '#2563eb',
          color: '#fff',
          borderRadius: '99px',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
        }}>
          单机部署 671B–685B 级大模型
        </div>
        <h1 style={{ fontSize: '38px', fontWeight: '850', marginBottom: '20px', color: '#0f172a', lineHeight: '1.2' }}>
          晶铁普惠满血推理一体机
        </h1>
        <p style={{ fontSize: '18px', color: '#475569', maxWidth: '850px', margin: '0 auto 30px', lineHeight: '1.6' }}>
          面向政企与科研用户，在单机形态下支持 <b>DeepSeek-V3 / R1</b> 及同级超大模型私有化部署。
          兼顾数据安全、成本可控与工程可落地，降低私有化 AI 落地门槛。
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate(Path.Inference)}
            style={{ padding: '14px 36px', backgroundColor: '#2563eb', color: '#fff', borderRadius: '10px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            开启满血推理对话
          </button>
          <button 
            onClick={() => navigate(Path.Showcase)}
            style={{ padding: '14px 36px', backgroundColor: '#fff', color: '#1f2937', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: '600', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            查看产品手册
          </button>
        </div>
      </section>

      {/* 2. 核心技术亮点 (2*2 布局) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', padding: '50px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <FeatureCard 
          icon="🚀" 
          title="CPU–GPU 异构卸载" 
          desc="全量权重常驻主存，突破显存限制，实现 671B 级模型单机加载运行。" 
        />
        <FeatureCard 
          icon="🦀" 
          title="OpenClaw 智能体生态" 
          desc="集成 OpenAI-compatible API，轻松对接政企 RAG、Agent 及自动化工作流。" 
        />
        <FeatureCard 
          icon="🔒" 
          title="私有安全可控" 
          desc="模型、数据、日志全链路闭环，保障政企敏感数据不出域，满足专网部署需求。" 
        />
        <FeatureCard 
          icon="💰" 
          title="总体成本友好" 
          desc="显著低于传统 H100 集群投入门槛，减少供电散热及运维复杂度。" 
        />
      </div>

      {/* 3. 典型应用场景 */}
      <div style={{ padding: '60px 20px', backgroundColor: '#f8fafc' }}>
        <h3 style={{ textAlign: 'center', fontSize: '26px', fontWeight: '800', marginBottom: '30px', color: '#0f172a' }}>▍ 典型应用场景</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
          <SceneBox title="政企私有化问答" desc="构建政策、制度、业务流程内部助手。" />
          <SceneBox title="行业知识库 RAG" desc="将海量规章文档转化为可检索的业务助手。" />
          <SceneBox title="企业 Agent 底座" desc="支撑审批、总结、编排等私有化智能中枢。" />
          <SceneBox title="科研验证评测" desc="用于超大模型私有部署验证与基准测试。" />
        </div>
      </div>
    </div>
  );
}

// 子组件
function FeatureCard({ icon, title, desc }: any) {
  return (
    <div style={{ 
      padding: '30px', 
      border: '1px solid #e2e8f0', 
      borderRadius: '20px', 
      backgroundColor: '#fff',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ fontSize: '36px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px', color: '#0f172a' }}>{title}</h3>
      <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '14px', margin: 0 }}>{desc}</p>
    </div>
  );
}

function SceneBox({ title, desc }: any) {
  return (
    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' as const, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', color: '#2563eb' }}>{title}</h4>
      <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>{desc}</p>
    </div>
  );
}