import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  BriefcaseMedical,
  Calendar,
  GraduationCap,
  IdCard,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPublicDoctors, getPublicDoctorProfile } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatFee, getInitials } from "@/utils";

export async function generateStaticParams() {
    const limit = 100;
    const first = await getAllPublicDoctors({ page: 1, limit });

    const totalPages = first?.meta?.totalPages || 1;

    const all = [...(first.data ?? [])];

    for (let page = 2; page <= totalPages; page++) {
        const response = await getAllPublicDoctors({ page, limit });
        all.push(...(response.data ?? []));
    }

    return all.map((doctor)=>({ id: doctor.id }));
}

export default async function DoctorDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const response = await getPublicDoctorProfile(id);
    const doctor = response?.data;

    if (!doctor) {
        notFound();
    }

    const joinedYear = new Date(doctor.createdAt).getFullYear();

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    nativeButton={false}
                    render={<Link href="/doctors" />}
                >
                    <ArrowLeft className="size-4" />
                    All Doctors
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                                    {getInitials(doctor.name)}
                                </div>
                                <div className="min-w-0">
                                    <CardTitle className="flex items-center gap-1.5 text-xl">
                                        <span className="truncate">{doctor.name}</span>
                                        <BadgeCheck className="size-5 shrink-0 text-primary" />
                                    </CardTitle>
                                    <CardDescription className="mt-1 flex items-center gap-1">
                                        <Stethoscope className="size-4 shrink-0" />
                                        {doctor.specialization}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div>
                                <h2 className="mb-1 font-medium">About</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {doctor.bio || "No bio available."}
                                </p>
                            </div>
                            <div>
                                <h2 className="mb-1 font-medium">Qualifications</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {doctor.qualifications}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Consultation Fee</CardTitle>
                            <CardDescription>Per appointment</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold text-primary">
                                {formatFee(doctor.consultationFee)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <p className="flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <IdCard className="size-4" />
                                    License No.
                                </span>
                                <span className="font-medium">{doctor.licenseNumber}</span>
                            </p>
                            <p className="flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <BriefcaseMedical className="size-4" />
                                    Experience
                                </span>
                                <span className="font-medium">
                                    {doctor.experienceYears} year
                                    {doctor.experienceYears === 1 ? "" : "s"}
                                </span>
                            </p>
                            <p className="flex items-start justify-between gap-2">
                                <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                                    <GraduationCap className="size-4" />
                                    Qualifications
                                </span>
                                <span className="text-right font-medium">{doctor.qualifications}</span>
                            </p>
                            <p className="flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="size-4" />
                                    Member Since
                                </span>
                                <span className="font-medium">{joinedYear}</span>
                            </p>
                            <p className="flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <Banknote className="size-4" />
                                    Fee
                                </span>
                                <span className="font-medium text-primary">
                                    {formatFee(doctor.consultationFee)}
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}