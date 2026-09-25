import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useDeleteSchedule, usePublishSchedule } from "@/hooks";
import { Schedule } from "@/types";
import ScheduleDetailSheet from "./schedule-detail-sheet";

export default function ScheduleActions({ schedule }: { schedule: Schedule }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { mutate: publish, isPending: publishPending } = usePublishSchedule();
  const { mutate: remove, isPending: deletePending } = useDeleteSchedule();

  const locked = schedule.status === "PUBLISHED";

  const handlePublish = () => {
    publish(schedule.id, {
      onSuccess: (res) => {
        if (!res.success) {
          toast.add({
            title: "Failed to publish schedule",
            description: "Something went wrong. Please try again later.",
            type: "error",
          });
          return;
        }
        toast.add({
          title: "Schedule published",
          description: "Patient can now book slots for this schedule.",
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: "Failed to publish schedule",
          description:
            err.message || "Something went wrong. Please try again later.",
          type: "error",
        });
      },
    });
  };

  const handleDelete = () => {
    remove(schedule.id, {
      onSuccess: (res) => {
        if (!res.success) {
          toast.add({
            title: "Failed to delete schedule",
            description: "Something went wrong. Please try again later.",
            type: "error",
          });
          return;
        }
        toast.add({
          title: "Schedule deleted",
          description: "The schedule has been deleted successfully.",
          type: "success",
        });
        setConfirmDelete(false);
      },
      onError: (err) => {
        toast.add({
          title: "Failed to delete schedule",
          description:
            err.message || "Something went wrong. Please try again later.",
          type: "error",
        });
      },
    });
  };

  if (confirmDelete) {
    return (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmDelete(false)}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deletePending}
        >
          {deletePending ? "Deleting..." : "Confirm"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm" onClick={() => setDetailOpen(true)}>
        View
      </Button>
      {schedule.status === "DRAFT" && (
        <Button
          variant="default"
          size="sm"
          onClick={handlePublish}
          disabled={publishPending}
        >
          {publishPending ? "Publishing..." : "Publish"}
        </Button>
      )}
      {!locked && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setConfirmDelete(true)}
        >
          Delete
        </Button>
      )}
      <ScheduleDetailSheet
        schedule={schedule}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
