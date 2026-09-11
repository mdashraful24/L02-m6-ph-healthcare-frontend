import { useMutation, useQuery } from "@tanstack/react-query";
import { getMe, userLogin, userLogout } from "@/api";

export function useLogin() {
    return useMutation({
        mutationFn: userLogin,
    });
}

export function useLogout() {
    return useMutation({
        mutationFn: userLogout,
    });
}

export function useGetMe() {
    return useQuery({
        queryKey: ["USER"],
        queryFn: getMe,
        retry: false,
    });
}