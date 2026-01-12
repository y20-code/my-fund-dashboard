import {useEffect,useState} from 'react';
import { Table, Card, Tag, Statistic, Row, Col, Button } from 'antd';
import { ArrowUpOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchFundData } from './services/api';
import {type FundItem } from './types';


// 配置你的持仓数据（这里暂时写死，以后可以做成输入框）
const MY_FUNDS = [
  { code: '017435', cost: 1.0500, share: 1000 }, // 假设你的成本和份额
  { code: '017747', cost: 0.8000, share: 50 }
];

function App() {
  const [data,setData] = useState<FundItem[]>([]);

  const [loading,setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true)
    const promises = MY_FUNDS.map(async (fund) => {
      const info = await fetchFundData(fund.code);
      if(!info) return null;

      const currentVal = parseFloat(info.gsz);

      const profit = (currentVal - fund.cost) * fund.share

      return {
        ...info,
        key:info.fundcode,
        cost:fund.cost,
        share:fund.share,
        profit:parseFloat(profit.toFixed(2))
      } as FundItem;
    });

    const results = await Promise.all(promises);

    // 过滤掉失败的请求
    setData(results.filter((item): item is FundItem => item !== null));

    setLoading(false);

  };

  useEffect(() => {
    loadData();
  }, []);

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
    }
  ];

  
  return (
    <div style={{ padding: '50px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card title="我的基金看板 (Mihoyo Prep Ver.)" extra={<Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>刷新数据</Button>}>
        
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
    </div>
  );


}

export default App;