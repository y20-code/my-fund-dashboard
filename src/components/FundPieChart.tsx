import ReactECharts from 'echarts-for-react'
import {Card} from 'antd'
import {type FundItem} from '../types'

interface Props {
    data:FundItem[];
}

export const FundPieChart = ({data}:Props) => {
    // 核心知识点：数据清洗 (Data Transformation)
    // ECharts 的饼图不认识 FundItem，它只认识 { value: 100, name: 'xxx' }
    // 所以我们要用 map 做一次“整容”

    const chartData = data.map(item => ({
        value:item.investment || 0,
        name:item.name
    }));

    // 核心知识点：配置项 (Option)
    // 这是 ECharts 的“配置文件”，就像写 CSS 一样，查文档就能懂

    const option ={
        title:{
            text:'持仓分布',
            left:'center'
        },
        tooltip:{
            trigger:'item',
            formatter:'{b}:{c}元 ({d}%)'
        },
        legend:{
            orient:'vertical',
            left:'left'
        },
        series: [
            {
                name: '投入金额',
                type: 'pie',           // 指定图表类型为：饼图
                radius: '50%',         // 饼图半径
                data: chartData,       // 👉 把我们上面洗好的数据喂给它
                emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
                }
            }
        ]
    };

    return (
        <Card hoverable style={{ height: '100%' }}>
            <ReactECharts option={option} style={{ height: 300 }} />
        </Card>
    );
}