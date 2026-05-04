import { create } from "zustand";
import { pregnancyApi, statsApi, appointmentsApi } from "../api/realServices";

const usePregnancyStore = create((set) => ({
    pregnancyStatus: null,
    SummaryStats: null,
    streakStats: null,
    upcomingAppointments: [],
    isLoading: false,

    fetchPregnancyStatus: async () => {
        try {
            const { data } = await pregnancyApi.status();
            set({ pregnancyStatus: data.data });
        } catch {
            set({ pregnancyStatus: null });
        }
    },

    fetchSummaryStats: async (params) => {
        try {
            const { data } = await statsApi.summary(params);
            set({ summaryStats: data.data });
        } catch {
            set({ summaryStats: null });
        }
    },

    fetchStreakStats: async () => {
        try {
            const { data } = await statsApi.streaks();
            set({ streakStats: data.data });
        } catch {
            set({ streakStats: null });
        }
    },

    fetchUpcomingAppointments: async () => {
        try {
            const { data } = await appointmentsApi.upcoming();
            set({ upcomingAppointments: data.data });
        } catch {
            set({ upcomingAppointments: [] });
        }
    },

    fetchAllDashboard: async () => {
        set({ isLoading: true })
        await Promise.allSettled([
            usePregnancyStore.getState().fetchPregnancyStatus(),
            usePregnancyStore.getState().fetchSummaryStats({ period: "monthly" }),
            usePregnancyStore.getState().fetchStreakStats(),
            usePregnancyStore.getState().fetchUpcomingAppointments(),
        ]);
        set({ isLoading: false });
    },
}));

export default usePregnancyStore;