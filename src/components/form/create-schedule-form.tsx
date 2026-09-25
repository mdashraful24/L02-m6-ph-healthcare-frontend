import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import { format } from "date-fns";
import { Check, ChevronDown, Clock, Video } from "lucide-react";
import { useState } from "react";
import { useCreateSchedule } from "@/hooks/schedule.hook";
import { scheduleSchema } from "@/validation";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectList,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, index) => {
  const hour = Math.floor(index / 4);
  const minute = (index % 4) * 15;
  const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  return {
    value,
    label: format(new Date(`2000-01-01T${value}`), "hh:mm a"),
  };
});

function formatTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

export default function CreateScheduleForm({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const { mutate: create, isPending } = useCreateSchedule();
  const [dateOpen, setDateOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      date: "",
      startTime: "",
      endTime: "",
      meetingLink: "https://meet.google.com/aiu-ctor-moh",
    },
    validators: {
      onSubmit: scheduleSchema,
    },
    onSubmit: ({ value }) => {
      const scheduleValue = {
        startDateTime: new Date(
          `${value.date}T${value.startTime}`,
        ).toISOString(),
        endDateTime: new Date(`${value.date}T${value.endTime}`).toISOString(),
        meetingLink: value.meetingLink,
      };

      create(scheduleValue, {
        onSuccess: (res) => {
          if (!res.success) {
            toast.add({
              title: "Server Failure",
              description: "Something went wrong. Please try again",
              type: "error",
            });
            return;
          }
          toast.add({
            title: "Schedule Created",
            description: "Your schedule is saved as a draft",
            type: "success",
          });
          handleClose();
        },
        onError: (err) => {
          toast.add({
            title: "Schedule creation failed",
            description:
              err.message || "Something went wrong. Please try again",
            type: "error",
          });
          handleClose();
        },
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="date">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            const selected = field.state.value
              ? new Date(`${field.state.value}T00:00:00`)
              : undefined;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger render={<Button variant="outline" />}>
                    {selected ? `${format(selected, "PPP")}` : "Select a Date"}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selected}
                      disabled={{ before: new Date() }}
                      onSelect={(date) => {
                        if (date) {
                          field.handleChange(format(date, "yyyy-MM-dd"));
                          field.handleBlur();
                          setDateOpen(false);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FieldDescription>
                  Choose the day patients can book this slot
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <form.Field name="startTime">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Start Time</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value ?? "");
                      field.handleBlur();
                    }}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={isInvalid}
                      className={cn(
                        !field.state.value && "text-muted-foreground",
                      )}
                    >
                      <Clock className="size-4 shrink-0 text-muted-foreground" />
                      <SelectValue>
                        {(value) =>
                          value ? formatTime(value) : "Select start time"
                        }
                      </SelectValue>
                      <SelectIcon>
                        <ChevronDown className="size-4" />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectList>
                        {TIME_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <SelectItemText>{option.label}</SelectItemText>
                            <SelectItemIndicator>
                              <Check className="size-4" />
                            </SelectItemIndicator>
                          </SelectItem>
                        ))}
                      </SelectList>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="endTime">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>End Time</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value ?? "");
                      field.handleBlur();
                    }}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={isInvalid}
                      className={cn(
                        !field.state.value && "text-muted-foreground",
                      )}
                    >
                      <Clock className="size-4 shrink-0 text-muted-foreground" />
                      <SelectValue>
                        {(value) =>
                          value ? formatTime(value) : "Select end time"
                        }
                      </SelectValue>
                      <SelectIcon>
                        <ChevronDown className="size-4" />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectList>
                        {TIME_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <SelectItemText>{option.label}</SelectItemText>
                            <SelectItemIndicator>
                              <Check className="size-4" />
                            </SelectItemIndicator>
                          </SelectItem>
                        ))}
                      </SelectList>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>
        <form.Field name="meetingLink">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Meeting Link</FieldLabel>
                <div className="relative">
                  <Video className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={field.name}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="off"
                    aria-invalid={isInvalid}
                    value={field.state.value}
                    className="pl-9"
                  />
                </div>
                <FieldDescription>
                  Patients will join the video call through this link
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Creating...
            </>
          ) : (
            "Create Schedule"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
