import { Path } from "../constant";
import { useNavigate } from "react-router-dom";

export function ShowcasePage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff', overflowY: 'auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* 标题区 */}
      <div style={{ padding: '40px 40px 20px', borderBottom: '1px solid #f1f5f9' }}>
        <h2 style={{ fontSize: '30px', fontWeight: '850', margin: 0, color: '#0f172a', letterSpacing: '-0.5px' }}>样机形态与规格</h2>
        <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>一站式交付：覆盖硬件整机、推理软件栈与模型调优。</p>
      </div>

      <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
        
        {/* 左侧：物理形态与交付内容 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 样机图片 */}
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '24px', padding: '20px', border: '1px solid #e2e8f0', textAlign: 'center' as const }}>
            <img 
              src="/device.png" 
              alt="样机示意图" 
              style={{ width: '100%', borderRadius: '16px', objectFit: 'cover' }} 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
              }}
            />
            <div style={{ 
              display: 'none', 
              height: '350px', 
              backgroundColor: '#e2e8f0', 
              borderRadius: '16px', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#94a3b8',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              [ 样机示意图：支持 4U 机架/塔式灵活适配 ]
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>
              示意图：实际交付机箱、面板接口可根据项目要求适配调整。
            </p>
          </div>
          
          {/* 交付标准说明 */}
          <div style={{ padding: '28px', backgroundColor: '#f0f9ff', borderRadius: '20px', border: '1px solid #bae6fd' }}>
            <h4 style={{ color: '#0369a1', fontWeight: '850', marginBottom: '16px', marginTop: 0, fontSize: '16px' }}>▍ 标准交付内容</h4>
            <div style={{ fontSize: '14px', color: '#0c4a6e', lineHeight: '2' }}>
              • 硬件整机一套（含出厂基础配置）<br/>
              • 完整推理软件栈（SGLang + KTransformers）<br/>
              • DeepSeek-V3/R1 模型部署、参数校验与调优<br/>
              • 交付验收材料：部署/运维/用户手册与基线测试报告
            </div>
          </div>
        </div>

        {/* 右侧：Datasheet 与硬件规格表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 性能口径 */}
          <div style={{ padding: '28px', border: '1px solid #e2e8f0', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '850', marginBottom: '20px', color: '#2563eb' }}>标准性能口径 (典型值)</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <SpecItem label="支持模型" value="671B–685B 级 FP8 MoE" />
              <SpecItem label="首 Token 延迟(TTFT)" value="0.7 – 1.0 s " />
              <SpecItem label="单会话吞吐" value="7 – 12 token/s" />
              <SpecItem label="总吞吐" value="20 – 30 token/s" />
              <SpecItem label="推荐服务并发" value="4 – 8 路" />
              <SpecItem label="批量预填充能力" value="> 1000 token/s" />
            </div>
          </div>

          {/* 硬件规格 */}
          <div style={{ padding: '28px', backgroundColor: '#fafafa', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '850', marginBottom: '20px', color: '#0f172a' }}>核心硬件规格</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <SpecItem label="CPU" value="双路 AMD EPYC 9135 平台" />
              <SpecItem label="运行内存" value="1.2TB DDR5 ECC RDIMM" />
              <SpecItem label="GPU" value="RTX 4090 D 24GB × 2" />
              <SpecItem label="系统硬盘" value="≥ 2TB 企业级 NVMe SSD" />
              <SpecItem label="软件生态" value="Ubuntu 24.04 / 容器化部署" />
            </div>
          </div>
          
          {/* 跳转按钮 */}
          <button 
            onClick={() => navigate(Path.Dashboard)}
            style={{ 
              width: '100%', 
              padding: '16px', 
              backgroundColor: '#0f172a', 
              color: '#fff', 
              borderRadius: '14px', 
              border: 'none', 
              fontWeight: '800', 
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'background-color 0.2s',
              marginTop: 'auto'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0f172a')}
          >
            进入实时性能监控面板
          </button>
        </div>
      </div>
    </div>
  );
}

// 优化了对齐的 SpecItem 组件
function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '14px 0', 
      borderBottom: '1px solid #f1f5f9' 
    }}>
      <span style={{ 
        width: '120px', 
        color: '#64748b', 
        fontSize: '14px', 
        fontWeight: '600',
        flexShrink: 0 
      }}>
        {label}
      </span>
      <span style={{ 
        flexGrow: 1, 
        textAlign: 'right' as const, 
        fontWeight: '700', 
        color: '#1e293b', 
        fontSize: '14px' 
      }}>
        {value}
      </span>
    </div>
  );
}