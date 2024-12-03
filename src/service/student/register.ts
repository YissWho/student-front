import request from "@/utils/request";

export async function fetchStudentRegister(data: any) {
    return await request.post('/student/register/', data);
}
