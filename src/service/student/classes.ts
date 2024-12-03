import request from '@/utils/request';

export async function fetchClasses(params: any) {
    return await request.get('/student/classmates/', {
        params,
    });
}