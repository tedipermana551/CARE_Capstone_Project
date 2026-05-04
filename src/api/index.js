import * as mock from "../mock/mockServices";
import * as real from "./realServices";

const useMock = import.meta.env.VITE_USE_MOCK === "true";
const services = useMock ? mock : real;

export const authApi = services.authApi;
export const profileApi = services.profileApi;
export const pregnancyApi = services.pregnancyApi;
export const logsApi = services.logsApi;
export const appointmentsApi = services.appointmentsApi;
export const statsApi = services.statsApi;