export const ROLE = {
    TEACHER: 0,
    STUDENT: 1
} as const;

export type Role = typeof ROLE[keyof typeof ROLE];

// 角色路径映射
export const ROLE_PATH_MAP = {
    [ROLE.TEACHER]: '/teacher/home',
    [ROLE.STUDENT]: '/student/home'
} as const; 