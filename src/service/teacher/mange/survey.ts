import request from '@/utils/request';

/* 获取问卷列表 */
export async function getTeacherSurveys(params: { page: number, page_size: number }) {
    return await request.get('/teacher/survey/stats/', {
        params
    });
}

/* 获取学生填写情况 */
interface GetTeacherSurveyStudentParams {
    id: number;
    page?: number;
    page_size?: number;
    status?: string;
}
export async function getTeacherSurveyStudent(params: GetTeacherSurveyStudentParams) {
    return await request.get(`/teacher/survey/${params.id}/students/`, {
        params: params
    });
}

/* 获取学生填写问卷详情 */
export async function getTeacherSurveyStudentDetail(id: number, sno: number) {
    return await request.get(`/teacher/survey/${id}/student/${sno}/`);
}