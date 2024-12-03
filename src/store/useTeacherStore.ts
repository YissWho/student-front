import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTeacherStore = create<any>()(
    persist(
        (set) => ({
            token: '',
            refresh: '',
            userInfo: null,
            setToken: (token: string) => set({ token }),
            setRefresh: (refresh: string) => set({ refresh }),
            setUserInfo: (userInfo: any) => set({ userInfo }),
            clearUserInfo: () => set({ userInfo: null }),
        }),
        {
            name: 'teacher-storage',
        }
    )
)