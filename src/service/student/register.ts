import request from "@/utils/request";

export async function fetchStudentRegister(data: any): Promise<any> {
    return await request.post('/student/register/', data);
}
