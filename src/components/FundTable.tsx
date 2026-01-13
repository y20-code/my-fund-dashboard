import {Table , Tag, Popconfirm,Button} from 'antd';
import { DeleteOutlined,FireOutlined,EditOutlined } from '@ant-design/icons';

import { type FundItem } from '../types';

// 定义组件属性
interface Props {
    data:FundItem[];                        // 表格要显示的数据
    loading:boolean;                        // 是否在转圈圈
    onDelete:(code:string) => void;         // 当用户点击删除时，要调用的父级函数
    onEdit:(record:FundItem) => void;           // 当用户点击编辑时，要调用的父级函数
}

export const FundTable = ({data,loading,onDelete,onEdit}:Props) => {
    const columns = [
        {title:"基金名称",dataIndex:"name",key:"name"},
        {
            title: '估算涨幅',
            dataIndex: 'gszzl',
            key: 'gszzl',
            render: (text: string) => {
                const val = parseFloat(text);
                const color = val >= 0 ? 'red' : 'green';
                return (
                <Tag color={color}>
                    {val >= 2 && <FireOutlined />} {text}%
                </Tag>
                );
            }
        },
        { title: '当前估值', dataIndex: 'gsz', key: 'gsz' },
        { 
            title: '投入本金', 
            dataIndex: 'investment', 
            key: 'investment', 
            render: (v: number) => `¥${v}` 
        },
        {
            title: '预估收益',
            dataIndex: 'profit',
            key: 'profit',
            render: (val: number) => (
                <span style={{ color: val >= 0 ? '#cf1322' : '#3f8600', fontWeight: 'bold' }}>
                {val > 0 ? '+' : ''}{val}
                </span>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (_: unknown, record: FundItem) => (
                <>
                    <Popconfirm title="确认编辑" onConfirm={() => onEdit(record)}>
                        <Button type="link" danger icon={<EditOutlined/>}></Button>
                    </Popconfirm>
                    <Popconfirm title="确定删除？" onConfirm={() => onDelete(record.fundcode)}>
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </>
            )
        }
    ];

    return (
            <Table 
            dataSource={data} 
            columns={columns} 
            loading={loading} 
            pagination={false}
            rowKey="fundcode" 
            />
    );
    
}