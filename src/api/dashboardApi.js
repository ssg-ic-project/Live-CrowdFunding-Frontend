import api from "./axios";

export const dashboardApi ={
    getStats() {
        return api.get("/api/dashboard/stats")
    },
    getNewUsers(){
        return api.get("/api/dashboard/new-users")
    },
    getTotalRevenue(){
        return api.get("/api/dashboard/yearly-revenue")
    },
    getPopularFunding(){
        return api.get("/api/dashboard/streaming-stats")
    },
    getCurrentUsers(){
        return api.get("/api/dashboard/current-users")
    },
    getCategoryRevenue(){
        return api.get("/api/dashboard/revenue-by-category")
    },


}