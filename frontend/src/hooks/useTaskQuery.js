import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "../config";
import { http } from "../utils/http";

export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return await http(apiUrl + "/tasks", {
                method: "post",
                body: data instanceof FormData ? data : JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ taskId, data }) => {
            return await http(apiUrl + `/tasks/update/${taskId}`, {
                method: "post",
                body: data instanceof FormData ? data : JSON.stringify(data),
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

export function useReorderTasks() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return await http(apiUrl + "/tasks/reorder", {
                method: "post",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}
