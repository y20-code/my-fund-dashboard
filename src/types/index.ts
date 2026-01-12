// 定义接口返回的最原始数据结构（这是不可控的第三方数据）
export interface FundResponse {
    fundcode:string;
    name:string;
    jzrq:string;    //净值日期
    dwjz:string;    //单位净值
    gsz:string;     //估算值(实时)
    gszzl:string;   //估算涨幅(百分比)
    gztime:string;  //估值时间
}

// 定义我们需要在 UI 上展示的结构（这是我们可以控制的）
export interface FundItem extends FundResponse {
    key:string;         // AntD 表格需要唯一 key
    const?:number;      // 你的持仓成本
    share?:number;      // 你的持有份额
    profit?:number;     // 预估收益金额
}