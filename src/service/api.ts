/**
 * 自定义项目响应接口
 */
export interface ApiResponse<T = any> {
    status: 'success' | 'false';
    message: string;
    code: number;
    data: T;
}

/* 通用图表接口 */
interface basicChartData {
    value: number;
    name: string;
}

/* 基础图表响应接口*/
export interface ChartData {
    status: 'success' | 'false';
    code: number;
    data: basicChartData[];
}

/* 折线图接口 */
export interface LineChartData {
    status: 'success' | 'false';
    code: number;
    data: {
        xAxis: any[];
        series: any[];
    };
}