// 接口返回的最原始数据结构（第三方不可控）
export interface FundResponse {
    fundcode: string;
    name: string;
    jzrq: string;    // 净值日期
    dwjz: string;    // 单位净值
    gsz: string;     // 估算值(实时)
    gszzl: string;   // 估算涨幅(百分比)
    gztime: string;  // 估值时间
}

// 2. UI 展示用的结构（继承自 Response，但这部分是我们自己算出来的）
export interface FundItem extends FundResponse {
    key: string;         // AntD 表格需要唯一 key
    cost?: number;       // 持仓成本
    share?: number;      // 持有份额
    profit?: number;     // 预估收益金额
    investment?: number; // 🟢 新增：投入本金 (我们在表格里要展示这个)
}

// 3. 本地存储 & 表单提交的结构（纯净的输入数据）
export interface LocalFund {
    code: string;        // 基金代码
    costPrice: number;   // 持仓成本价
    amount: number;      // 投入金额
}