import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BasicInfo {
    id?: number;
    student_no?: string;
    username: string;
    phone: string;
    avatar: string;
    class_name?: string;
    unread_notice_count?: number;
    teacher?: string;
}

interface StatusInfo {
    status: number;
    status_display: string;
    province: number;
    province_display: string;
    province_type: string;
}

interface UserState {
    token: string;
    refresh: string;
    userInfo: any;
    info: {
        basic_info: BasicInfo | null;
        status_info: StatusInfo | null;
    };
    setUserInfo: (data: any) => void;
    setUser: (data: { token: string; refresh: string; user: any }) => void;
    setInfo: (data: { basic_info: BasicInfo; status_info: StatusInfo }) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            token: '',
            refresh: '',
            userInfo: null,
            info: {
                basic_info: null,
                status_info: null,
            },
            setUserInfo: (data) =>
                set({
                    userInfo: data,
                }),
            setUser: (data) =>
                set({
                    token: data.token,
                    refresh: data.refresh,
                    userInfo: data.user,
                }),
            setInfo: (data) =>
                set({
                    info: data,
                }),
            logout: () =>
                set({
                    token: '',
                    refresh: '',
                    userInfo: null,
                    info: {
                        basic_info: null,
                        status_info: null,
                    },
                }),
        }),
        {
            name: 'user-storage',
        }
    )
)