import {useEffect,useState} from 'react';
import { Table, Card, Tag, Statistic, Row, Col, Button ,Modal, Form, InputNumber,message,Popconfirm,Input} from 'antd';
import { ArrowUpOutlined, DeleteOutlined, ReloadOutlined,PlusOutlined } from '@ant-design/icons';
import { fetchFundData } from './services/api';
import {type FundItem } from './types';

interface LocalFund {
  code:string;
  costPrice:number; //持仓成本价
  amount:number;    //投入金额
}


function App() {
  const [data,setData] = useState<FundItem[]>([]);

  const [loading,setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  //初始化，从LocalStorage读取数据
  const [myFunds,setMyFunds] = useState<LocalFund[]>(() => {
    const saved = localStorage.getItem('my_funds');
    return saved ? JSON.parse(saved) : [];
  })

  const [form] = Form.useForm();

  //金额转份额
  const loadData = async () => {
    if (myFunds.length === 0) {
      setData([]);
      return;
    }

    setLoading(true)
    const promises = myFunds.map(async (fund) => {
      const info = await fetchFundData(fund.code);
      if(!info) return null;

      const currentVal = parseFloat(info.gsz);
      // 份额 = 总金额 / 成本价
      const share = fund.amount / fund.costPrice;
      // 收益 = (当前估值 - 成本价) * 份额
      const profit = (currentVal - fund.costPrice) * share

      return {
        ...info,
        key:info.fundcode,
        cost:fund.costPrice,
        share:share,
        profit:parseFloat(profit.toFixed(2)),
        investment: fund.amount // 把本金也带上方便展示
      } as FundItem;
    });

    const results = await Promise.all(promises);

    // 过滤掉失败的请求
    setData(results.filter((item): item is FundItem => item !== null));

    setLoading(false);

  };

  useEffect(() => {
    localStorage.setItem('my_funds',JSON.stringify(myFunds));
    loadData();
  }, [myFunds]);

  //添加基金
  const handleAddFund = (values:LocalFund) => {
    const newFund:LocalFund = {
      code:values.code,
      costPrice:values.costPrice,
      amount:values.amount
    }
    setMyFunds([...myFunds,newFund]);
    setIsModalOpen(false);
    form.resetFields();
    message.success('基金添加成功');
  }

  // 删除基金
  const handleDeleteFund = (code:string) => {
    const newFunds = myFunds.filter(item => item.code !==code);
    setMyFunds(newFunds);
    message.success('基金删除成功');
  }

  const columns = [
    {title: '基金名称',dataIndex:'name',key:'name'},
    {
      title:'估算涨幅',
      dataIndex:'gszzl',
      key:'gszzl',
      render:(text:string) =>{
        const val = parseFloat(text);
        const color = val >= 0 ? 'red' : 'green'; // A股红涨绿跌
        return <Tag color={color}>{text}%</Tag>
      }
    },
    {title:'当前估值',dataIndex:'gsz',key:'gsz'},
    {
      title:'预估收益(元)',
      dataIndex:'profit',
      key:'profit',
      render:(val:number) => (
        <span style={{ color: val >= 0 ? '#cf1322' : '#3f8600', fontWeight: 'bold' }}>
          {val > 0 ? '+' : ''}{val}
        </span>
      )
    },{
      title:'操作',
      key:'action',
      render:(_:any,record:FundItem) => (
        <Popconfirm
          title="确定删除该基金吗？"
          onConfirm={() => handleDeleteFund(record.fundcode)}
          okText="是"
          cancelText="否"
        >
          <Button type="link" danger icon={<DeleteOutlined/>}></Button>
        </Popconfirm>
      )
    }
  ];

  
  return (
    <div style={{ padding: '50px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card 
        title="我的基金看板 ()" 
        extra={
          <>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsModalOpen(true)} 
              style={{ marginRight: 8 }}
            >
              添加基金
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadData} 
              loading={loading}>
                刷新数据
            </Button>
          </>
          }
      >
        
        {/* 顶部总览数据 */}
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Statistic 
              title="今日总预估盈亏" 
              value={data.reduce((acc, cur) => acc + (cur.profit || 0), 0)} 
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
              suffix="元"
            />
          </Col>
        </Row>

        {/* 详细表格 */}
        <Table 
          dataSource={data} 
          columns={columns} 
          loading={loading} 
          pagination={false} 
        />
        
        <div style={{ marginTop: 20, color: '#888' }}>
           Tips: 数据来源天天基金，更新时间: {data[0]?.gztime || '--'}
        </div>
      </Card>

      <Modal 
        title="添加基金"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form} 
          onFinish={handleAddFund} 
          layout="vertical">
          <Form.Item
            name="code"
            label="基金代码"
            rules={[{required:true,message:'请输入基金代码'}]}
          >
            <Input
              style={{ width: '100%' }}
              placeholder="例如：110022"
              maxLength={6}
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="costPrice"
            label="持仓成本价(元)"
            rules={[{required:true,message:'请输入持仓成本价'}]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="例如：1.23"
              controls={false}
              min={0}
              step={0.01}
            />
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="投入金额(元)"
            rules={[{required:true,message:'请输入投入金额'}]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="例如：1000"
              controls={false}
              min={0}
              step={0.01}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType='submit'
              block
              
            >
              添加基金
            </Button>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );


}

export default App;