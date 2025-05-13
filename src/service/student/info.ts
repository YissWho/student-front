import request from '@/utils/request';

/* 获取个人信息 */
export async function fetchStudentInfo() {
    return await request.get('/student/profile/me/');
}

/* 更新个人信息 */
export async function updateStudentInfo(data: any) {
    return await request.put('/student/profile/', data);
}

/* 获取个人信息 */
export async function getStudentInfo() {
    return await request.get('/student/profile/');
}

/* 修改密码 */
export async function changePassword(data: {
    old_password: string;
    new_password: string;
    confirm_password: string;
}) {
    return await request.put('/student/change/password/', data);
}
