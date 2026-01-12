import axios from "axios";
import { type FundResponse } from "../types";

export const fetchFundData = async (code:string):Promise<FundResponse | null> => {
    try {
        const timestamp = new Date().getTime();
        const res = await axios.get(`/api/js/${code}.js?rt=${timestamp}`);

        const match = res.data.match(/jsonpgz\(([\s\S]*?)\)/);
        if (match && match[1]) {
            return JSON.parse(match[1]);
        }
        return null;
    }catch (error) {
        console.log("请求炸了:",error);
        return null;
    }
}