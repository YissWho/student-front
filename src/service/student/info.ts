import request from '@/utils/request';

export async function fetchStudentInfo() {
    return await request.get('/student/profile/me/');
}

export async function updateStudentInfo(data: any) {
    return await request.put('/student/profile/', data);
}

export async function getStudentInfo() {
    return await request.get('/student/profile/');
}

export async function changePassword(data: {
    old_password: string;
    new_password: string;
    confirm_password: string;
}) {
    return await request.put('/student/change/password/', data);
}
