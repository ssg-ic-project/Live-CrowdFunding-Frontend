import api from "./axios";
import axios from "axios";

export const userApi = {
    getUsers(params){
        console.log("in userApi:", params);
        return api.get('/api/usersList', {
            params: {
            page: params.page,
            status: params.status,
            memberType: params.memberType,
            name: params.name
        },
            headers:{
                    // 'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
    }
};