import { useMutation, useQuery } from "@tanstack/react-query";
import { getMe, googleOAuth, userLogin, userLogout, userRegistration, verifyAccount } from "@/api";

export function useRegistration(){
    return useMutation({
        mutationFn: userRegistration,
    })
}

export function useVerifyAccount() {
    return useMutation({
        mutationFn: verifyAccount,
    });
}

export function useLogin() {
    return useMutation({
        mutationFn: userLogin,
    });
}

export function useGoogleOAuth(){
    return useMutation({
        mutationFn: googleOAuth,
    })
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