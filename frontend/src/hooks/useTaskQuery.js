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

export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return await http(apiUrl + "/tasks", {
                method: "post",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}

export function useUpdateTaskStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ taskId, status }) => {
            return await http(apiUrl + `/tasks/${taskId}/status`, {
                method: "post",
                body: JSON.stringify({ status }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (taskId) => {
            return await http(apiUrl + `/tasks/delete/${taskId}`, {
                method: "post",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}
