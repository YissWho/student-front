import request from "@/utils/request";
import { ChartData, LineChartData } from "@/service/api";

/* 
 * 获取班级人数饼图数据
 * @returns 
 */
export async function fetchClassStudentCount(): Promise<ChartData> {
    return request.get('/teacher/stats/class/count/');
}

/* 
 * 就业升学统计 折线图
 * @returns 
 */
export async function fetchEmploymentAndEnrollment(): Promise<LineChartData> {
    return request.get('/teacher/stats/employment/');
}


/* 
 * 就业升学比例 饼图或者是比例图
 * @returns 
 */
export async function fetchEmploymentAndEnrollmentRatio(): Promise<ChartData> {
    return request.get('/teacher/stats/status/ratio/');
}


/* 
 * 意向省份词云图
 * @returns 
 */
export async function fetchProvinceWordCloud(): Promise<ChartData> {
    return request.get('/teacher/stats/province/wordcloud/');
}