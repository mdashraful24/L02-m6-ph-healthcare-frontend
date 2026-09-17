"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useApproveDoctor, useGetAllDoctors } from "@/hooks";
import { IApproveDoctorPayload, IDoctorParams } from "@/types";

interface IProps extends IDoctorParams {
  selectedId: string;
  onClose: () => void;
}

export default function DoctorReviewSheet({
  selectedId,
  onClose,
  ...params
}: IProps) {
  const [confirmRejection, setConfirmRejection] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // console.log(rejectionReason);

  const { data } = useGetAllDoctors(params);
  const { mutate: verifyDoctor, isPending } = useApproveDoctor();

  const selectedDoctor = data?.data?.find((doctor) => doctor.id === selectedId);

  const handleClose = () => {
    setConfirmRejection(false);
    setRejectionReason("");
    onClose();
  };

  const handleReviewAction = (status: "VERIFIED" | "REJECTED") => {
    const reviewData: IApproveDoctorPayload = {
      doctorId: selectedId,
      verificationStatus: status,
      rejectionReason: rejectionReason,
    };

    // console.log("Review Data:", reviewData);

    verifyDoctor(reviewData, {
      onSuccess: (res) => {
        console.log("Doctor verification response:", res);
        toast.add({
          title: "Success",
          description: res.message || "Doctor verification status updated successfully.",
          type: "success",
        });
        handleClose();
      },
      onError: (err) => {
        toast.add({
          title: "Error",
          description: err.message || "An error occurred while verifying the doctor.",
          type: "destructive",
        });
      },
    });
  };

  if (!selectedDoctor) return null;

  // console.log(selectedDoctor);

  return (
    <Sheet open={!!selectedId} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Review and take action</SheetTitle>
          <SheetDescription>This action cannot be undone.</SheetDescription>
        </SheetHeader>
        <p>Doctor ID: {selectedDoctor.name}</p>
        <SheetFooter>
          {confirmRejection ? (
            <div className="w-full flex flex-col gap-4">
              <Textarea
                value={rejectionReason}
                placeholder="Enter rejection reason..."
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleReviewAction("REJECTED")}
                  className="flex-1"
                  disabled={!rejectionReason.trim()}
                >
                  {isPending ? (
                    <>
                      <Spinner />
                      Confirming...
                    </>
                  ) : (
                    "Confirm Rejection"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="lg"
                className="flex-1"
                onClick={() => setConfirmRejection(true)}
              >
                Reject
              </Button>
              <Button
                variant="default"
                size="lg"
                className="flex-1"
                onClick={() => handleReviewAction("VERIFIED")}
              >
                {isPending ? (
                  <>
                    <Spinner />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
