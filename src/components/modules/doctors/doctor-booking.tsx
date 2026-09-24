"use client";

import { useRouter } from "next/navigation";
import { format, isBefore, subMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBookAppointment, useGetMe, useGetTodayScheduleByDoctor } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";

// Must match BOOKING_CUTOFF_MINUTES in the backend config
const BOOKING_CUTOFF_MINUTES = 30;

export default function DoctorBooking({ doctorId }: { doctorId: string }) {
    const router = useRouter();

    const { data: me, isPending: mePending } = useGetMe();
    const { data, isPending, error } = useGetTodayScheduleByDoctor({ doctorId });
    const {mutate: book, isPending: bookPending } = useBookAppointment();

    const schedules = data?.data ?? [];

    const bookingClosesAt = (startDateTime: string) =>
        subMinutes(new Date(startDateTime), BOOKING_CUTOFF_MINUTES);

    const isBookingOpen = (startDateTime: string) =>
        isBefore(new Date(), bookingClosesAt(startDateTime));

    const handleBooking = (scheduleId: string) => {
        if (!mePending && !me?.data) {
            router.push("/login");
            return;
        }

        book({ scheduleId }, {
            onSuccess: (res) => {
                console.log(res);
            }
        });
    };

    if (isPending) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Spinner />
                    <span className="text-sm text-muted-foreground">
                        Loading today's schedule for the doctor. Please wait...
                    </span>
                </div>
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <p className="text-sm text-muted-foreground">
                Failed to load today's schedule for the doctor. Please try again later.
            </p>
        )
    }

    if (schedules.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No schedule available today. Please check back later.
            </p>
        );
    }

    return (
        <div>
            {schedules.map((schedule) => (
                <div key={schedule.id} className="flex flex-col gap-3 border p-4 rounded-md">
                    <span>{format(schedule.startDateTime, "eeee")}</span>
                    <span>{format(schedule.startDateTime, "PP")}</span>
                    <span className="text-sm text-muted-foreground">
                        Starts at: {format(schedule.startDateTime, "p")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        Ends at: {format(schedule.endDateTime, "p")}
                    </span>
                    <span className={isBookingOpen(schedule.startDateTime) ? "text-sm text-amber-600" : "text-sm text-red-600"}>
                        {isBookingOpen(schedule.startDateTime)
                            ? `Booking closes at: ${format(bookingClosesAt(schedule.startDateTime), "p")}`
                            : "Booking closed"}
                    </span>

                    {isBookingOpen(schedule.startDateTime) ? (
                        <Button size="lg" className="w-full" disabled={bookPending} onClick={() => handleBooking(schedule.id)}>
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
    );
}