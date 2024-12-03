import request from "@/utils/request";
import { ChartData } from "@/service/api";


/* 获取全国各省份就业升学数据
 * @returns 
 */
interface FetchChinaMapDataParams {
    class_id: string;
}
export async function fetchChinaMapData(params: FetchChinaMapDataParams): Promise<ChartData> {
    return request.get('/teacher/stats/province/map/', { params });
}