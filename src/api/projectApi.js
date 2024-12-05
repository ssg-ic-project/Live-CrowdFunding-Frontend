// C:\Workspace\crofle_front\src\api\projectApi.js
import api from "./axios";

export const projectApi = {
    getFilteredProjects(params) {
        console.log("checking page size", params.page);
        return api.get("/api/projects", {
            params: {
                page: params.page,
                RS: params.RS,
                PS: params.PS,
                SD: params.SD,
                ED: params.ED,
                projname: params.projname,
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    },
    getProject(id) {
        return api.get(
            `/api/project/admin/${id}`);
    },
    updateApprovalStatus(id, request) {
        console.log('API 요청 확인: ', id, request);
        console.log('매니저 아이디 확인, ', request.id);
        return api.post(`/api/project/${id}/approval-status`, request);
    },
    getImages(id){
        return api.get(`/api/project/${id}/images`);
    },
    getProjectDocs(id){
        return api.get(`/api/project/${id}/docs`);
    },
    getDocumentContent: (docUrl) => {
        return api.get(`/api/project/documentContent`,{
           params: {url: docUrl} 
        });
    }
    
};
