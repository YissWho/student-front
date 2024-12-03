import request from '@/utils/request';

export async function getChatHistory(data: any) {
    return await request.post('/student/ai/chat/', data);
}

