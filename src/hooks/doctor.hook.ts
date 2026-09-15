import { useMutation } from "@tanstack/react-query";
import { applyAsDoctor, verifyDoctorAccount } from "@/api/doctor.api";

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