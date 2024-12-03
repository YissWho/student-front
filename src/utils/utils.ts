export const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export const setToken = (token: string) => {
    localStorage.setItem('token', token);
}

export const removeToken = () => {
    localStorage.removeItem('token');
}

export function isLogin() {
    const localStorageToken = localStorage.getItem('token');
    if (localStorageToken) {
        return true;
    }
    return false;
}

export const getStatusColor = (status: number) => {
    const colorMap: Record<number, string> = {
        0: 'green',    // 就业
        1: 'blue',     // 考研
        2: 'gold',     // 创业
        3: 'default'   // 其他
    };
    return colorMap[status] || 'default';
};

/* 省份映射 */
export const provinceMap = [
    [0, '北京市'],
    [1, '天津市'],
    [2, '河北省'],
    [3, '山西省'],
    [4, '内蒙古自治区'],
    [5, '辽宁省'],
    [6, '吉林省'],
    [7, '黑龙江省'],
    [8, '上海市'],
    [9, '江苏省'],
    [10, '浙江省'],
    [11, '安徽省'],
    [12, '福建省'],
    [13, '江西省'],
    [14, '山东省'],
    [15, '河南省'],
    [16, '湖北省'],
    [17, '湖南省'],
    [18, '广东省'],
    [19, '广西壮族自治区'],
    [20, '海南省'],
    [21, '重庆市'],
    [22, '四川省'],
    [23, '贵州省'],
    [24, '云南省'],
    [25, '西藏自治区'],
    [26, '陕西省'],
    [27, '甘肃省'],
    [28, '青海省'],
    [29, '宁夏回族自治区'],
    [30, '新疆维吾尔自治区'],
    [31, '台湾省'],
    [32, '香港特别行政区'],
    [33, '澳门特别行政区'],
]

/* 就业状态映射 */
export const employmentStatusMap = [
    [0, '就业'],
    [1, '升学'],
] as const;