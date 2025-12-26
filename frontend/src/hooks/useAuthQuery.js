import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrl } from "../config";
import { http } from "../utils/http";
import useAuth from "../stores/useAuth";

export function useAuthUpdate() {
    return useMutation({
        mutationFn: async (formData) => {
            const response = await http(apiUrl + "/update-profile", {
                method: "post",
                body: formData,
            })
            return response;
        },
    });
}

export function useLogin() {
    return useMutation({
        mutationFn: async (data) => {
            return await http(apiUrl + "/login", {
                method: "post",
                body: JSON.stringify(data),
            });
        },
    });
}

export function useRegister() {
    return useMutation({
        mutationFn: async (formData) => {
            return await http(apiUrl + "/register", {
                method: "post",
                body: formData,
            });
        },
    });
}

export function useAuthInit(enabled = true) {
    const auth = useAuth();
    return useQuery({
        enabled: enabled,
        queryKey: ["user"],
        queryFn: async () => {
            const response = await http(apiUrl + "/user", {
                method: "get",
            });
            if (response && response.status === 'success') {
                await auth.set(response.user);
            } else {
                await auth.clear();
            }
            return response;
        },
    });
}
