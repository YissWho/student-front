import request from "@/utils/request";

interface LoginData {
    phone: string;
    password: string;
    captcha_key: string;
    captcha_code: string;
}
export async function login(data: LoginData): Promise<any> {
    return await request.post('/teacher/login/', data);
}