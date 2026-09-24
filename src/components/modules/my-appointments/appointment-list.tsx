"use client";

import { Button } from "@/components/ui/button";
import { useGetMyAppointments } from "@/hooks/appointment.hook";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AppointmentLists() {
    const params = useSearchParams();
    const status = params.get("status");

    const { data } = useGetMyAppointments({ page: 1, limit: 100 });

    const appointments = data?.data ?? [];

    if(status === "success") {
        return (
            <div>
                <div>
                    <h1>Payment Successful</h1>
                    <p>Your payment has been processed successfully.</p>
                    <Link href="/dashboard/my-appointments">
                        Go back to My Appointments
                    </Link>
                </div>
            </div>
        );
    }

    if (status === "failure") {
        return (
            <div>
                <div>
                    <h1>Payment Failed</h1>
                    <p>Please try again later.</p>
                    <Link href="/dashboard/my-appointments">
                        Go back to My Appointments
                    </Link>
                </div>
            </div>
        );
    }

    if (appointments.length === 0) {
        return (
            <div>
                <h1>No Appointments Found</h1>
                <p>You have no appointments scheduled.</p>
                <Link href="/doctors">
                    Book an Appointment
                </Link>
            </div>
        );
    }

    return (
        <div>
            {appointments.map(({ doctor, status, id }) => (
                <div key={id} className="border rounded p-3">
                    <div className="w-ful flex justify-between gap-3">
                        <span>{doctor.name}</span>
                        <span>{status}</span>
                        <Button>Join</Button>
                    </div>
                </div>
            ))}
        </div>
    );
}