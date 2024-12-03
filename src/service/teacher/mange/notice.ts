import request from "@/utils/request";
import { ApiResponse } from "@/service/api";
/**
 * 获取教师通知列表
 * @returns 
 */
interface FetchNoticeListParams {
    page: number;
    page_size: number;
    search: string;
}
export async function fetchNoticeList(params: FetchNoticeListParams): Promise<ApiResponse<any>> {
    return request.get('/teacher/notices/', { params });
}

/**
 * 添加教师通知
 * @param data 
 * @returns 
 */
export interface AddNoticeParams {
    title: string;
    content: string;
}
export async function addNotice(data: AddNoticeParams): Promise<ApiResponse<any>> {
    return request.post('/teacher/notices/create/', data);
}

/**
 * 删除教师通知
 * @param id 
 * @returns 
 */
export async function deleteNotice(id: number): Promise<ApiResponse<any>> {
    return request.delete(`/teacher/notices/${id}/`);
}

/**
 * 获取单个教师通知
 * @param id 
 * @returns 
 */
export async function getNotice(id: number): Promise<ApiResponse<any>> {
    return request.get(`/teacher/notices/${id}/`);
}

/**
 * 更新教师通知
 * @param id 
 * @param data 
 * @returns 
 */
export async function updateNotice(id: number, data: AddNoticeParams): Promise<ApiResponse<any>> {
    return request.put(`/teacher/notices/${id}/`, data);
}

/**
 * 获取未读的学生数量
 * @param id 
 * @returns 
 */
interface GetUnreadNoticeCountParams {
    id: number;
    page?: number;
    page_size?: number;
}
export async function getUnreadNoticeCount({
    id,
    page = 1,
    page_size = 30
}: GetUnreadNoticeCountParams): Promise<ApiResponse<any>> {
    return request.get(`/teacher/notices/${id}/unread/students/`, { params: { page, page_size } });
}

/**
 * 获取已读的学生数量
 * @param id 
 * @returns 
 */
interface GetReadNoticeCountParams {
    id: number;
    page?: number;
    page_size?: number;
}
export async function getReadNoticeCount({
    id,
    page = 1,
    page_size = 30
}: GetReadNoticeCountParams): Promise<ApiResponse<any>> {
    return request.get(`/teacher/notices/${id}/read/students/`, { params: { page, page_size } });
}