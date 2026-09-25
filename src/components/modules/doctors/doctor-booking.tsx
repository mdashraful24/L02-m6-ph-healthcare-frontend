"use client";

import { format, isBefore, subMinutes } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import {
  useBookAppointment,
  useGetMe,
  useGetTodayScheduleByDoctor,
} from "@/hooks";
import { ISchedule } from "@/types";
import {
  bookAppointmentResponseSchema,
  bookAppointmentSchema,
} from "@/validation";

// Must match BOOKING_CUTOFF_MINUTES in the backend config
const BOOKING_CUTOFF_MINUTES = 30;

interface IBookingConfirmation {
  paymentUrl: string;
  schedule: ISchedule;
}

export default function DoctorBooking({ doctorId }: { doctorId: string }) {
  const router = useRouter();

  const { data: me, isPending: mePending } = useGetMe();
  const { data, isPending, error } = useGetTodayScheduleByDoctor({ doctorId });
  const { mutate: book, isPending: bookPending } = useBookAppointment();
  const [confirmation, setConfirmation] = useState<IBookingConfirmation | null>(
    null,
  );

  const schedules = data?.data ?? [];

  const bookingClosesAt = (startDateTime: string) =>
    subMinutes(new Date(startDateTime), BOOKING_CUTOFF_MINUTES);

  const isBookingOpen = (startDateTime: string) =>
    isBefore(new Date(), bookingClosesAt(startDateTime));

  const handleBooking = (schedule: ISchedule) => {
    if (mePending) {
      toast.add({
        title: "Booking unavailable",
        description: "Please wait while we verify your login.",
        type: "info",
      });
      return;
    }

    if (!me?.data) {
      router.push("/login");
      return;
    }

    if (schedule.status !== "PUBLISHED") {
      toast.add({
        title: "Schedule unavailable",
        description: "This schedule is not open for booking.",
        type: "error",
      });
      return;
    }

    if (schedule.availableSlots <= 0) {
      toast.add({
        title: "Schedule unavailable",
        description: "No slots remain for this schedule.",
        type: "error",
      });
      return;
    }

    if (!isBookingOpen(schedule.startDateTime)) {
      toast.add({
        title: "Booking closed",
        description: "Please choose another available schedule.",
        type: "error",
      });
      return;
    }

    const validation = bookAppointmentSchema.safeParse({
      scheduleId: schedule.id,
    });

    if (!validation.success) {
      toast.add({
        title: "Invalid appointment",
        description:
          validation.error.issues[0]?.message ??
          "Schedule selection is invalid.",
        type: "error",
      });
      return;
    }

    book(validation.data, {
      onSuccess: (res) => {
        if (!res.success) {
          toast.add({
            title: "Booking failed",
            description: res.message || "Unable to book this appointment.",
            type: "error",
          });
          return;
        }

        const responseValidation = bookAppointmentResponseSchema.safeParse(
          res.data,
        );

        if (!responseValidation.success) {
          toast.add({
            title: "Booking failed",
            description:
              responseValidation.error.issues[0]?.message ??
              "The booking response was invalid.",
            type: "error",
          });
          return;
        }

        setConfirmation({
          paymentUrl: responseValidation.data.paymentUrl,
          schedule,
        });
      },
      onError: (err) => {
        toast.add({
          title: "Booking failed",
          description: err.message || "Unable to book this appointment.",
          type: "error",
        });
      },
    });
  };

  if (isPending) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Loading today's schedule for the doctor. Please wait...
        </p>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        Failed to load today's schedule for the doctor. Please try again later.
      </p>
    );
  }

  if (schedules.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No schedule available today. Please check back later.
      </p>
    );
  }

  return (
    <>
      <div>
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="flex flex-col gap-3 border p-4 rounded-md"
          >
            <span>{format(schedule.startDateTime, "eeee")}</span>
            <span>{format(schedule.startDateTime, "PP")}</span>
            <span className="text-sm text-muted-foreground">
              Starts at: {format(schedule.startDateTime, "p")}
            </span>
            <span className="text-sm text-muted-foreground">
              Ends at: {format(schedule.endDateTime, "p")}
            </span>
            <span
              className={
                isBookingOpen(schedule.startDateTime)
                  ? "text-sm text-amber-600"
                  : "text-sm text-red-600"
              }
            >
              {isBookingOpen(schedule.startDateTime)
                ? `Booking closes at: ${format(bookingClosesAt(schedule.startDateTime), "p")}`
                : "Booking closed"}
            </span>

            {isBookingOpen(schedule.startDateTime) ? (
              <Button
                size="lg"
                className="w-full"
                disabled={bookPending}
                onClick={() => handleBooking(schedule)}
              >
                {bookPending ? "Booking..." : "Book Now"}
              </Button>
            ) : (
              <Button size="lg" className="w-full" disabled>
                Booking Closed
              </Button>
            )}
          </div>
        ))}
      </div>

      <Dialog
        open={!!confirmation}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmation(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Successful</DialogTitle>
            <DialogDescription>
              Please pay within 10 minutes to keep your booking.
            </DialogDescription>
            <span>
              Data and Time:{" "}
              {confirmation
                ? format(confirmation.schedule.startDateTime, "PPPP")
                : "N/A"}
            </span>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmation(null)}>
              Pay Later
            </Button>
            <Button
              onClick={() => {
                // window.open(confirmation?.paymentUrl, "_blank");
                if (confirmation) {
                  window.location.href = confirmation.paymentUrl;
                }
              }}
            >
              Pay Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
