import request from "@/utils/request";
import { ApiResponse } from "@/service/api";
/**
 * 获取教师学生列表
 * @returns 
 */
interface GetTeacherStudentsParams {
    page: number;
    page_size: number;
    class: number;
    status: number;
    search: string;
}
export async function getTeacherStudents(params: GetTeacherStudentsParams): Promise<ApiResponse<any>> {
    return await request.get('/teacher/students/', { params });
}

/**
 * 获取单个学生信息
 * @param id 
 * @returns 
 */
export async function getTeacherStudent(id: number): Promise<ApiResponse<any>> {
    return await request.get(`/teacher/students/${id}/`);
}

/**
 * 添加学生
 * @param data 
 * @returns 
 */
export async function addTeacherStudent(data: FormData): Promise<ApiResponse<any>> {
    return await request.post('/teacher/students/create/', data);
}

/**
 * 修改学生信息
 * @param id 
 * @param data 
 * @returns 
 */
export async function updateTeacherStudent(id: number, data: FormData): Promise<ApiResponse<any>> {
    return await request.put(`/teacher/students/${id}/`, data);
}

/**
 * 删除学生
 * @param id 
 * @returns 
 */
export async function deleteTeacherStudent(id: number): Promise<ApiResponse<any>> {
    return await request.delete(`/teacher/students/${id}/`);
}