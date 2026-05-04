import api from "./client";

export const authApi = {
    register: (data) => api.post("/auth/register/", data),
    login: (data) => api.post("/auth/login/", data),
    logout: (refresh) => api.post("/auth/logout/", { refresh }),
}

export const profileApi = {
    me: () => api.get("/profile/me/"),
    setup: (data) => api.post("/profile/setup/", data),
    update: (data) => api.patch("/profile/me/", data),
    myCode: () => api.get("/profile/my-code/"),
    linkPartner: (code) => api.post("/profile/link-partner/", { code }),
    unlinkPartner: () => api.post("/profile/unlink-partner/"),
}

export const pregnancyApi = {
    status: () => api.get("/pregnancy/status/"),
}

export const logsApi = {
    list: (params) => api.get("/logs/", { params }),
    today: () => api.get("/logs/today/"),
    create: (data) => api.post("/logs/", data),
    detail: (date) => api.get(`/logs/${date}/`),
    update: (date, data) => api.put(`/logs/${date}/`, data),
    delete: (date) => api.delete(`/logs/${date}/`),
    partner: (params) => api.get("/logs/partner/", { params }),
}

export const appointmentsApi = {
    list: () => api.get("/appointments/"),
    upcoming: () => api.get("/appointments/upcoming/"),
    create: (data) => api.post("/appointments/", data),
    detail: (id) => api.get(`/appointments/${id}/`),
    update: (id, data) => api.put(`/appointments/${id}/`, data),
    delete: (id) => api.delete(`/appointments/${id}/`),
    complete: (id) => api.post(`/appointments/${id}/complete/`),
    partner: () => api.get("/appointments/partner/"),
}

export const statsApi = {
    summary: (params) => api.get("/stats/summary/", { params }),
    mood: (params) => api.get("/stats/mood/", { params }),
    sleep: (params) => api.get("/stats/sleep/", { params }),
    excercise: (params) => api.get("/stats/exercise/", { params }),
    streaks: () => api.get("/stats/streaks/"),
}