import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { applyAsDoctor, approveDoctor, getAllDoctors, verifyDoctorAccount } from "@/api/doctor.api";
import { IDoctorParams } from "@/types";

export function useApplyAsDoctor() {
    return useMutation({
        mutationFn: applyAsDoctor,
    });
}

export function useVerifyDoctorAccount() {
    return useMutation({
        mutationFn: verifyDoctorAccount,
    });
}

export function useGetAllDoctors(params: IDoctorParams) {
    return useQuery({
        queryKey: ["doctors", params],
        queryFn: () => getAllDoctors(params),
    });
}

export function useSuspenseGetAllDoctors(params: IDoctorParams) {
    return useSuspenseQuery({
        queryKey: ["doctors", params],
        queryFn: () => getAllDoctors(params),
    });
}

export function useApproveDoctor(){
    return useMutation({
        mutationFn: approveDoctor,
    });
}