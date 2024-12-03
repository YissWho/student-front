import request from '@/utils/request';

export async function fetchStudentLogin({
    student_no,
    password
}: {
    student_no: string,
    password: string
}) {
    return await request.post('/student/login/', { student_no, password });
}
