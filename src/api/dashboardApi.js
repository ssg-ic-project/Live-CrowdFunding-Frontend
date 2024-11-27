import api from "./axios";

export const dashboardApi ={
    getStats() {
        return api.get("/api/dashboard/stats")
    },
    getNewUsers(){
        return api.get("/api/dashboard/new-users")
    },
    yearRevenueStats(){
        return api.get("/api/dashboard/yearly-revenue")
    },
    streamingStats(){
        return api.get("/api/dashboard/streaming-stats")
    },
    currentUserStats(){
        return api.get("/api/dashboard/current-users")
    },
    categoryRevenueStats(){
        return api.get("/api/dashboard/revenue-by-category")
    },


}