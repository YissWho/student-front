import request from "@/utils/request";

/**
 * 修改教师密码
 * @param data 
 * @returns 
 */
export async function changeTeacherPassword(data: any) {
    return await request.put('/teacher/change/password/', data);
}

/**
 * 获取教师信息
 * @returns 
 */
export async function getTeacherInfo() {
    return await request.get('/teacher/profile/');
}

/**
 * 修改教师信息
 * @param data 
 * @returns 
 */
export async function changeTeacherInfo(data: any) {
    return await request.put('/teacher/profile/', data);
}