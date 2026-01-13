import { useState , useEffect } from 'react';
import { message } from 'antd';

import { fetchFundData } from '../services/api';
import { type FundItem } from '../types';

interface LocalFund {
    code: string;
    costPrice: number; //持仓成本价
    amount: number;    //投入金额
}

/**
 * 自定义 Hook: UseFundData
 * 责任: 管理所有与基金数据相关的状态和逻辑(增删改查)
 * 包含: 数据获取、本地存储同步、加仓逻辑
 */

export const useFundData = () => {
    // 状态定义（State)
    const [data, setData] = useState<FundItem[]>([]);
    const [loading, setLoading] = useState(false);

    //初始化核心数据(从 LocalStorage 读取)
    const [myFunds, setMyFunds] = useState<LocalFund[]>(() => {
        const saved = localStorage.getItem('my_funds');
        return saved ? JSON.parse(saved) : [];
    });

    // 获取最新数据(Data Fetching)
    const loadData = async () => {
        if (myFunds.length ===0){
            setData([]);
            return;
        };

        setLoading(true);

        const promises = myFunds.map(async (fund) =>{
            const info = await fetchFundData(fund.code);
            if(!info) return null;

            // 核心算法：计算份额与收益
            const currentVal = parseFloat(info.gsz);
            const share = fund.amount / fund.costPrice;
            const profit = (currentVal - fund.costPrice) * share;

            return {
                ...info,
                key: info.fundcode,
                cost: fund.costPrice,
                share: share,
                profit: parseFloat(profit.toFixed(2)),
                investment: fund.amount
            } as FundItem;
        });

        const results = await Promise.all(promises);

        // 过滤掉请求失败的项
        setData(results.filter((item): item is FundItem => item !== null));
        setLoading(false);
    };

    // 副作用：监听 myFunds 变化，自动保存并刷新 (Side Effects)
    useEffect(() => {
        localStorage.setItem('my_funds', JSON.stringify(myFunds));
        loadData(); 
    }, [myFunds]);

    // 5.业务逻辑：加仓 (Add Amount)
    const handleAddAmount = (code: string, extraAmount: number) => {
        const newFunds = myFunds.map(item => {
        if (item.code === code) {
            return { ...item, amount: item.amount + extraAmount };
        }
        return item;
        });
        setMyFunds(newFunds);
        message.success('加仓成功！');
    };
    
    // 业务逻辑：新增基金 (Add New Fund)
    const handleAddFund = (values: LocalFund) => {
        // 逻辑复用：如果已存在，则转为加仓
        if (myFunds.find(item => item.code === values.code)) {
        handleAddAmount(values.code, values.amount);
        return;
        }
        
        const newFund: LocalFund = {
        code: values.code,
        costPrice: values.costPrice,
        amount: values.amount
        };
        setMyFunds([...myFunds, newFund]);
        message.success('基金添加成功');
    };

    // 业务逻辑：删除基金 (Delete)
    const handleDeleteFund = (code: string) => {
        setMyFunds(myFunds.filter(item => item.code !== code));
        message.success('基金删除成功');
    };

    // 导出：把 UI 需要的东西暴露出去 (Return)
    return {
        data,           // 表格数据
        loading,        // 加载转圈圈
        loadData,       // 手动刷新函数
        handleAddFund,  // 添加函数
        handleDeleteFund // 删除函数
    };


}