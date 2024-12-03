import request from '@/utils/request';

/* 获取通知列表 */
interface FetchNoticeListParams {
    is_read?: number;
    page_size?: number;
    page?: number;
}
export async function fetchNoticeList({
    is_read = 0,
    page = 1,
    page_size = 1000,
}: FetchNoticeListParams) {
    return await request.get('/student/notices/', {
        params: {
            is_read,
            page_size,
            page
        },
    });
}


/* 批量标为已读 */
export async function markAsRead(notice_ids: number[]) {
    return await request.post(`student/notices/read/`, {
        notice_ids,
    });
}
/* 单个标为已读 */
export async function markAsReadSingle(id: number) {
    return await request.post(`student/notices/read/${id}/`);
}
