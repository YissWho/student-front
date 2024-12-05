import request from "@/utils/request";

interface LoginData {
    phone: string;
    password: string;
}
export async function login(data: LoginData): Promise<any> {
    return await request.post('/teacher/login/', data);
}