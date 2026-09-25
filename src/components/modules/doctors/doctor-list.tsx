"use client";

import {
  ArrowRight,
  Banknote,
  BadgeCheck,
  BriefcaseMedical,
  GraduationCap,
  IdCard,
  Stethoscope,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllPublicDoctors } from "@/hooks";
import { formatFee, getInitials } from "@/utils";

export default function DoctorList() {
  const { data, isLoading } = useGetAllPublicDoctors({ page: 1, limit: 100 });

  const doctorList = data?.data || [];

  return (
    <div className="h-full max-w-7xl mx-auto px-4 py-10">
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Find Your Doctor</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our verified doctors and view their full profile to book a
          consultation.
        </p>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : doctorList.length === 0 ? (
        <div className="border rounded-lg py-16 text-center text-muted-foreground">
          <Users className="mx-auto mb-3 size-10 opacity-60" />
          <p>No doctors available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctorList.map((doctor) => (
            <Card
              key={doctor.id}
              className="flex flex-col transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                    {getInitials(doctor.name)}
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="flex items-center gap-1">
                      <span className="truncate">{doctor.name}</span>
                      <BadgeCheck
                        className="size-4 shrink-0 text-primary"
                        aria-label="Verified"
                      />
                    </CardTitle>
                    <CardDescription className="mt-0.5 flex items-center gap-1">
                      <Stethoscope className="size-3.5 shrink-0" />
                      {doctor.specialization}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-2.5 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <BriefcaseMedical className="size-4" />
                    Experience
                  </span>
                  <span className="font-medium">
                    {doctor.experienceYears} year
                    {doctor.experienceYears === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="size-4" />
                    Qualifications
                  </span>
                  <span className="max-w-[55%] truncate text-right font-medium">
                    {doctor.qualifications}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <IdCard className="size-4" />
                    License No.
                  </span>
                  <span className="font-medium">{doctor.licenseNumber}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Banknote className="size-4" />
                    Consultation Fee
                  </span>
                  <span className="font-medium text-primary">
                    {formatFee(doctor.consultationFee)}
                  </span>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant="default"
                  nativeButton={false}
                  render={<Link href={`/doctors/${doctor.id}`} />}
                  className="w-full"
                >
                  View Details
                  <ArrowRight className="size-4" data-icon="inline-end" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
