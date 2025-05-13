import request from '@/utils/request';

interface FetchClassesParams {
    current: number;
    pageSize: number;
    search?: string;
    status?: number;
    province?: string;
}

/* 获取班级列表 */
export async function fetchClasses(params: FetchClassesParams) {
    const { current, pageSize, ...formParams } = params;
    const requestParams = {
        ...formParams,
        page: current,
        page_size: pageSize
    };
    const res = await request.get('/student/classmates/', {
        params: requestParams,
    });
    return {
        list: res.data.results,
        total: res.data.count
    }
}