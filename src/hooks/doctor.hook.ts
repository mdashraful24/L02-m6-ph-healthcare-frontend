import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  applyAsDoctor,
  approveDoctor,
  getAllDoctors,
  getAllPublicDoctors,
  getPublicDoctorProfile,
  getTodayScheduleByDoctor,
  verifyDoctorAccount,
} from "@/api/doctor.api";
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

export function useGetAllPublicDoctors(params: IDoctorParams) {
  return useQuery({
    queryKey: ["doctors", "public", params],
    queryFn: () => getAllPublicDoctors(params),
  });
}

export function useSuspenseGetPublicDoctors(params: IDoctorParams) {
  return useSuspenseQuery({
    queryKey: ["doctors", "public", params],
    queryFn: () => getAllPublicDoctors(params),
  });
}

export function usePublicDoctorProfile(doctorId: string) {
  return useQuery({
    queryKey: ["doctors", "public", doctorId],
    queryFn: () => getPublicDoctorProfile(doctorId),
    enabled: !!doctorId,
  });
}

export function useSuspenseGetAllDoctors(params: IDoctorParams) {
  return useSuspenseQuery({
    queryKey: ["doctors", params],
    queryFn: () => getAllDoctors(params),
  });
}

export function useApproveDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}

export function useGetTodayScheduleByDoctor(params: {
  doctorId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: () => getTodayScheduleByDoctor(params),
  });
}
