import { useState } from 'react';
import { Card, Statistic, Row, Col, Button } from 'antd';
import { ArrowUpOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';


import { useFundData } from './hooks/useFundData';
import { FundTable } from './components/FundTable';
import { FundModal } from './components/FundModal';

function App() {
  // 1. 调用自定义 Hook：一句话拿到所有数据和逻辑方法
  // 现在的 App 组件根本不知道数据是怎么算的，它只管找 Hook 要
  const { 
    data, 
    loading, 
    loadData, 
    handleAddFund, 
    handleDeleteFund 
  } = useFundData();
  
  // 2. 控制弹窗显示的局部状态（这个属于 UI 状态，所以放在这里）
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: '50px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card
        title="💸 我的基金看板 (Pro版)"
        extra={
          <>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsModalOpen(true)} 
              style={{ marginRight: 8 }}
            >
              添加/加仓
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadData} 
              loading={loading}
            >
              刷新
            </Button>
          </>
        }
      >
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Statistic
              title="今日总预估盈亏"
              // 简单的计算逻辑可以保留在 View 层，或者也可以抽到 Hook 里
              value={data.reduce((acc, cur) => acc + (cur.profit || 0), 0)}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
              suffix="元"
            />
          </Col>
        </Row>

        {/* 使用表格组件：只传数据，不写逻辑 */}
        <FundTable 
          data={data} 
          loading={loading} 
          onDelete={handleDeleteFund} 
        />
      </Card>

      {/* 使用弹窗组件：提交时直接调用 Hook 里的 handleAddFund */}
      <FundModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddFund} 
      />
    </div>
  );
}

export default App;