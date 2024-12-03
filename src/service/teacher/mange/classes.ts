import request from "@/utils/request";
import { ApiResponse } from "@/service/api";
/**
 * 获取教师班级列表
 * @returns 
 */
interface GetTeacherClassesParams {
    search?: string;
    page?: number;
    page_size?: number;
}
export async function getTeacherClasses({
    search,
    page = 1,
    page_size = 10
}: GetTeacherClassesParams): Promise<ApiResponse<any>> {
    return await request.get('/teacher/classes/', { params: { search, page, page_size } });
}

/**
 * 添加班级，传入班级名称name
 * @param data 
 * @returns 
 */
export async function addTeacherClass(data: any): Promise<ApiResponse<any>> {
    return await request.post('/teacher/classes/create/', data);
}

/**
 * 更新班级，传入班级id和班级名称name
 * @param id 
 * @param data 
 * @returns 
 */
export async function updateTeacherClass(id: number, data: any): Promise<ApiResponse<any>> {
    return await request.put(`/teacher/classes/${id}/`, data);
}

/**
 * 删除班级，传入班级id
 * @param id 
 * @returns 
 */
export async function deleteTeacherClass(id: number): Promise<ApiResponse<any>> {
    return await request.delete(`/teacher/classes/${id}/`);
}

/**
 * 获取班级学生列表，传入班级id
 * @param id 
 * @returns 
 */
export async function getTeacherClassStudents(id: number): Promise<ApiResponse<any>> {
    return await request.get(`/teacher/classes/${id}/`);
}