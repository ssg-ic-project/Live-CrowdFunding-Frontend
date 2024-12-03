// C:\Workspace\crofle_front\src\api\adminLoginApi.js
import api from "./axios";

export const adminLoginApi = {
    login(data){
        console.log("checking yejin login");
        console.log(data);
        return api.post("/api/admin-account/login",
            {
                identificationNumber: data.identificationNumber,
                password: data.password,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            });
    },
    logout(){
        const token = localStorage.getItem("accessToken");
        if(!token){
            return Promise.resolve();
        }
        return api.post(
            "/api/admin-account/logout", {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    },
    refresh({accessToken, refreshToken}){
        return api.post("/api/admin-account/refresh", null, {
            headers: {
                Authorization: refreshToken,
                AccessToken: accessToken,
            },
        });
    },
};