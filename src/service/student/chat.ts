import request from '@/utils/request';

/* 发送聊天信息 */
export async function getChatHistory(data: any) {
    return await request.post('/student/ai/chat/', data);
}

