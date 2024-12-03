import request from "@/utils/request";

interface LoginData {
    phone: string;
    password: string;
}
export async function login(data: LoginData) {
    return await request.post('/teacher/login/', data);
}