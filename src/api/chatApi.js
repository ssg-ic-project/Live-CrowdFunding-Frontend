import api from "./axios";

export const chatApi = {
    getReportList(param){
        return api.get('/api/chat-reports', {
            params: {
                page: param.page
            },
            headers: {
                'Accept': 'application/json'
            }
        });
    },
    updateUserStatus(reportId, status) {
        return api.post(`/api/${reportId}/user-status`, {
            status: status
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}