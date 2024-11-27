import api from "./axios";

export const dashboardApi ={
    generalStats() {
        return api.get("/api/dashboard/stats")
    }
}