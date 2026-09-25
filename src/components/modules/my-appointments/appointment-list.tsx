"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMyAppointments } from "@/hooks/appointment.hook";

export default function AppointmentLists() {
  const params = useSearchParams();
  const status = params.get("status");

  const { data, error, isPending } = useGetMyAppointments({
    page: 1,
    limit: 100,
  });

  useEffect(() => {
    if (status === "success") {
      toast.add({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
        type: "success",
      });
    }

    if (status === "failure") {
      toast.add({
        title: "Payment Failed",
        description: "The payment could not be completed. Please try again.",
        type: "error",
      });
    }
  }, [status]);

  useEffect(() => {
    if (error) {
      toast.add({
        title: "Appointments Failed",
        description: error.message || "Unable to load your appointments.",
        type: "error",
      });
    }
  }, [error]);

  const appointments = data?.data ?? [];

  if (status === "success") {
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

  if (isPending) {
    return (
      <p className="text-sm text-muted-foreground">Loading appointments...</p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        Failed to load your appointments. Please try again later.
      </p>
    );
  }

  if (appointments.length === 0) {
    return (
      <div>
        <h1>No Appointments Found</h1>
        <p>You have no appointments scheduled.</p>
        <Link href="/doctors">Book an Appointment</Link>
      </div>
    );
  }

  return (
    <div>
      {appointments.map(({ doctor, status, id }) => (
        <div key={id} className="border rounded p-3">
          <div className="w-ful flex justify-between gap-3">
            <span>{doctor?.name}</span>
            <span>{status}</span>
            <Button>Join</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
