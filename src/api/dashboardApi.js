// C:\Workspace\crofle_front\src\api\dashboardApi.js
import api from "./axios";

export const dashboardApi ={
    getStats() {
        return api.get("/api/dashboard/stats")
    },
    getNewUsers(){
        return api.get("/api/dashboard/new-users")
    },
    // getTotalRevenue(){
    //     return api.get("/api/dashboard/yearly-revenue")
    // },
    getFundingStatus(){
        console.log("inside api check ");
        return api.get("/api/dashboard/projectSuccessRate")
    },

    getPopularFunding(){
        return api.get("/api/dashboard/streaming-stats")
    },
    getCurrentUsers(){
        return api.get("/api/dashboard/current-users")
    },
    getCategoryRevenue(){
        console.log("check 펀딩 결과")
        return api.get("/api/dashboard/revenue-by-category")
    },


}