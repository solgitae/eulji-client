import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
    /** public.users.avatar_url — localStorage에 영속 저장 */
    avatarUrl: string | null;
    /** public.users.name — localStorage에 영속 저장 */
    displayName: string | null;
    /** 프로필 설정 또는 초기 로드 시 호출 */
    setProfile: (avatarUrl: string | null, displayName: string | null) => void;
    /** 로그아웃 시 초기화 */
    clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set) => ({
            avatarUrl: null,
            displayName: null,
            setProfile: (avatarUrl, displayName) => set({ avatarUrl, displayName }),
            clearProfile: () => set({ avatarUrl: null, displayName: null }),
        }),
        {
            name: 'eulji-profile', // localStorage key
            // avatarUrl, displayName만 영속 (함수는 제외)
            partialize: (state) => ({
                avatarUrl: state.avatarUrl,
                displayName: state.displayName,
            }),
        },
    ),
);
