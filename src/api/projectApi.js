import api from "./axios";

export const projectApi = {
    getFilteredProjects(params){
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
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            }
        );
    },
    getProject(id){
        return api.get(
            `/api/project/admin/${id}`);
    }


}
