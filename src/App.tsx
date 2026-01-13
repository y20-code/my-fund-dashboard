import { useState } from 'react';
import { Card, Statistic, Row, Col, Button } from 'antd';
import { ArrowUpOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';


import { useFundData } from './hooks/useFundData';
import { FundTable } from './components/FundTable';
import { FundModal } from './components/FundModal';
import { FundPieChart } from './components/FundPieChart';
import type { LocalFund,FundItem } from './types';

function App() {
  // 1. 调用自定义 Hook：一句话拿到所有数据和逻辑方法
  // 现在的 App 组件根本不知道数据是怎么算的，它只管找 Hook 要
  const { 
    data, 
    loading, 
    loadData, 
    handleAddFund, 
    handleDeleteFund,
    handleEditFund,
  } = useFundData();
  
  // 2. 控制弹窗显示的局部状态（这个属于 UI 状态，所以放在这里）
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [currentFund,setCurrentFund] = useState<LocalFund | null>(null);

  // 🟢 新增：专门处理“点击编辑按钮”的动作
  const onEditClick = (record: FundItem) => {
    // 1. 把表格里的 FundItem 转换成简单的 LocalFund 格式存起来
    setCurrentFund({
      code: record.fundcode,
      costPrice: record.cost || 0, // 防止 undefined
      amount: record.investment || 0 // 防止 undefined
    });
    // 2. 打开弹窗
    setIsModalOpen(true);
  };

  const onAddClick = () => {
    setCurrentFund(null); // 清空当前选中，代表是“新增”
    setIsModalOpen(true);
  };

  const handleFormSubmit = (values: LocalFund) => {
    // 如果 currentFund 有值，说明是编辑模式
    if (currentFund) {
      handleEditFund(values); // 调用修改逻辑
    } else {
      handleAddFund(values);  // 调用新增逻辑
    }
    // 关闭弹窗 (FundModal 会自己调用 onClose，这里其实只需要负责数据逻辑)
    setIsModalOpen(false); 
  };

  return (
    <div style={{ padding: '50px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card
        title="💸 我的基金看板 (Pro版)"
        extra={
          <>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={onAddClick} 
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
          <Col span={8}>
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
          <Col span={16}>
            <FundPieChart data={data}/>
          </Col>
        </Row>

        {/* 使用表格组件：只传数据，不写逻辑 */}
        <FundTable 
          data={data} 
          loading={loading} 
          onDelete={handleDeleteFund}
          onEdit={onEditClick} 
          
        />
      </Card>

      {/* 使用弹窗组件：提交时直接调用 Hook 里的 handleAddFund */}
      <FundModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialValues={currentFund || undefined} 
        // 👇 提交时，交给 handleFormSubmit 去判断是新增还是修改
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default App;