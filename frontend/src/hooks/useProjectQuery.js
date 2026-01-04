import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "../config";
import { http } from "../utils/http";

export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            return await http(apiUrl + "/projects");
        },
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return await http(apiUrl + "/projects", {
                method: "post",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            return await http(apiUrl + `/projects/delete/${id}`, {
                method: "post",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}
