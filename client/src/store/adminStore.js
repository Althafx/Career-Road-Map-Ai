import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAdminStore = create(
    persist(
        (set) => ({
            adminToken: null,
            isAdminAuthenticated: false,
            adminUser: null,
            _hasHydrated: false,

            setHasHydrated: (state) => set({ _hasHydrated: state }),

            setAdminAuth: (user, token) => {
                set({ adminToken: token, isAdminAuthenticated: true, adminUser: user });
            },

            adminLogout: () => {
                set({ adminToken: null, isAdminAuthenticated: false, adminUser: null });
            },
        }),
        {
            name: 'admin-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state.setHasHydrated(true);
            },
        }
    )
);

export default useAdminStore;
