import request from '@/utils/request';
import { ApiResponse } from '../api';

/* 获取问卷调查列表 */
export async function getSurveyList(): Promise<ApiResponse<any>> {
    return await request.get('/student/survey/');
}


/* 提交问卷调查 */
export async function submitSurvey(data: any): Promise<ApiResponse<any>> {
    return await request.post('/student/survey/submit/', data);
}
