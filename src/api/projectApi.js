import api from "./axios";

export const projectApi = {
    getFilteredProjects(params) {
        return api.get(
            "/api/projects",
            {
                page: params.page,
                RS: params.RS,
                PS: params.PS,
                SD: params.SD,
                ED: params.ED,
                projname: params.projname,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            }
        );
    },
    getProject(id) {
        return api.get(
            `/api/project/admin/${id}`);
    },
    updateApprovalStatus(id, request) {
        console.log('API 요청 확인: ', id, request);
        return api.post(`/api/project/${id}/approval-status`, request);
    }
};
