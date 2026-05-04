/* eslint-disable no-empty */
import { create } from "zustand";
import { authApi, profileApi } from "../api/realServices";
import { DEMO_PROFILE, DEMO_PARTNER_PROFILE } from "../mock/seedData";
import { ESLint } from "eslint";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

const useAuthStore = create((set) => ({
    user: null,
    partner: null,
    isAuthenticated: !!localStorage.getItem("access_token"),
    isLoading: false,
    error: null,

    login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
            const {data} = await authApi.login(credentials)
            const {user, access, refresh} = data.data
            localStorage.setItem("access_token", access)
            localStorage.setItem("refresh_token", refresh)
            let profile = null
            if (useMock) {
                const role = localStorage.getItem("demo_role") || "mother"
                profile = role === "husband" ? DEMO_PROFILE : DEMO_PARTNER_PROFILE
            }
            set({user, profile, isAuthenticated: true, isLoading: false})
            return { success: true, needsSetup: false }
        } catch (err) {
            const error = err.response?.data?.message || "Login failed"
            set({ error, isLoading: false })
            return { success: false, error }
        }
    },

    register: async (formData) => {
        set({ isLoading: true, error: null })
        try {
            const {data} = await authApi.register(formData)
            const {user, access, refresh} = data.data
            localStorage.setItem("access_token", access)
            localStorage.setItem("refresh_token", refresh)
            set({user, isAuthenticated: true, isLoading: false})
            return { success: true, needsSetup: !useMock}
        } catch (err) {
            const error = err.response?.data?.message || "Registration failed"
            set({ error, isLoading: false })
            return { success: false, error }
        }
    },

    logout: async () => {
        const refresh = localStorage.getItem("refresh_token")
        try { await authApi.logout(refresh)} catch {}
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        set({ user: null, profile: null, isAuthenticated: false })
    },

    fetchProfile: async () => {
        try {
            const {data} = await profileApi.me()
            set({ profile: data })
            return data.data
        } catch {
            return null
        }
    },

    setProfile: (profile) => set({ profile }),
    setUser: (user) => set({ user }),
    clearError: () => set({ error: null }),
}));

export default useAuthStore;