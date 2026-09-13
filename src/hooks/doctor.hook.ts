import { useMutation } from "@tanstack/react-query";
import { applyAsDoctor } from "@/api/doctor.api";

export function useApplyAsDoctor(){
    return useMutation({
        mutationFn: applyAsDoctor,
    });
}