"use client";

import { cn } from "cn";
import { differenceInMinutes, format } from "date-fns";
import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock,
  Link2,
  Users,
  Video,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Schedule } from "@/types";

interface Props {
  schedule: Schedule;
  open: boolean;
  onClose: () => void;
}

function dateLabel(value: string) {
  return format(new Date(value), "EEEE, MMMM d, yyyy");
}

function timeLabel(value: string) {
  return format(new Date(value), "hh:mm a");
}

function durationLabel(start: string, end: string) {
  const minutes = differenceInMinutes(new Date(end), new Date(start));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  return `${mins} min`;
}

function StatusBadge({ status }: { status: Schedule["status"] }) {
  const isPublished = status === "PUBLISHED";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        isPublished
          ? "border-green-600/30 bg-green-600/10 text-green-600"
          : "border-amber-600/30 bg-amber-600/10 text-amber-600",
      )}
    >
      {isPublished && <CheckCircle2 className="size-3" />}
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="flex shrink-0 items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

export default function ScheduleDetailSheet({
  schedule,
  open,
  onClose,
}: Props) {
  const bookedSlots = schedule.totalSlots - schedule.availableSlots;
  const fillPercent =
    schedule.totalSlots > 0
      ? Math.round((bookedSlots / schedule.totalSlots) * 100)
      : 0;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Schedule details</SheetTitle>
          <SheetDescription>
            {dateLabel(schedule.startDateTime)}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
          <div className="flex items-center justify-between gap-3 rounded-lg border p-4">
            <div>
              <p className="font-heading text-base font-medium text-foreground">
                {dateLabel(schedule.startDateTime)}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="size-3.5" />
                {timeLabel(schedule.startDateTime)} –{" "}
                {timeLabel(schedule.endDateTime)}
                <span className="text-muted-foreground/70">
                  ({durationLabel(schedule.startDateTime, schedule.endDateTime)}
                  )
                </span>
              </p>
            </div>
            <StatusBadge status={schedule.status} />
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Slots availability</span>
              <span className="font-medium">
                {bookedSlots} of {schedule.totalSlots} booked
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  bookedSlots > 0 ? "bg-primary" : "bg-primary/30",
                )}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {schedule.availableSlots} slot
              {schedule.availableSlots === 1 ? "" : "s"} still available
            </p>
          </div>

          <dl className="grid gap-3 text-sm">
            <InfoRow
              icon={<CalendarDays className="size-4" />}
              label="Date"
              value={dateLabel(schedule.startDateTime)}
            />
            <InfoRow
              icon={<Clock className="size-4" />}
              label="Start Time"
              value={timeLabel(schedule.startDateTime)}
            />
            <InfoRow
              icon={<Clock className="size-4" />}
              label="End Time"
              value={timeLabel(schedule.endDateTime)}
            />
            <InfoRow
              icon={<CalendarClock className="size-4" />}
              label="Duration"
              value={durationLabel(
                schedule.startDateTime,
                schedule.endDateTime,
              )}
            />
            <InfoRow
              icon={<Users className="size-4" />}
              label="Slots"
              value={`${schedule.availableSlots} available / ${schedule.totalSlots} total`}
            />
            <InfoRow
              icon={<CheckCircle2 className="size-4" />}
              label="Status"
              value={
                schedule.status.charAt(0) +
                schedule.status.slice(1).toLowerCase()
              }
            />
          </dl>

          <div className="flex items-center justify-between gap-3 rounded-lg border p-4">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Link2 className="size-4 shrink-0" />
                Meeting Link
              </p>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {schedule.meetingLink}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                window.open(schedule.meetingLink, "_blank", "noreferrer")
              }
            >
              <Video className="size-3.5" />
              Join
            </Button>
          </div>
        </div>

        <Separator />

        {/* <SheetFooter>
          <Button variant="outline" size="lg" onClick={onClose}>
            Close
          </Button>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
