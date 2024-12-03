import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, ROLE } from '@/constants/role';

interface RoleState {
    role: Role | null;
    setRole: (role: Role) => void;
    clearRole: () => void;
}

export const useRoleStore = create<RoleState>()(
    persist(
        (set) => ({
            role: null,
            setRole: (role) => set({ role }),
            clearRole: () => set({ role: null }),
        }),
        {
            name: 'role-storage',
        }
    )
);