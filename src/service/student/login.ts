import request from '@/utils/request';

export async function fetchStudentLogin({
    student_no,
    password,
    captcha_key,
    captcha_code
}: {
    student_no: string,
    password: string,
    captcha_key: string,
    captcha_code: string
}): Promise<any> {
    return await request.post('/student/login/', { student_no, password, captcha_key, captcha_code });
}
