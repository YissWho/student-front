import request from "@/utils/request";

/**
 * 获取班级列表
 * @returns 
 */
export async function getClasses() {
    return await request.get('/common/classes/');
}

/**
 * 获取教师列表
 * @returns 
 */
export async function getTeachers() {
    return await request.get('/common/teachers/');
}

/**
 * 获取教师班级列表
 * @param teacher_id 
 * @returns 
 */
export async function getTeacherClasses(teacher_id: string) {
    return await request.get(`/common/teacher/${teacher_id}/classes/`);
}
