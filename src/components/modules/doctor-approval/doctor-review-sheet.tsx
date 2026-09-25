"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { ExternalLinkIcon } from "lucide-react";
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

  const { data, isPending: isLoading } = useGetAllDoctors(params);
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
          description:
            res.message || "Doctor verification status updated successfully.",
          type: "success",
        });
        handleClose();
      },
      onError: (err) => {
        toast.add({
          title: "Error",
          description:
            err.message || "An error occurred while verifying the doctor.",
          type: "destructive",
        });
      },
    });
  };

  if (!selectedId) return null;

  return (
    <Sheet open={!!selectedId} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Review and take action</SheetTitle>
          <SheetDescription>This action cannot be undone.</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : !selectedDoctor ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Doctor data not found. The doctor may no longer be available.
          </p>
        ) : (
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-heading text-base font-medium text-foreground">
                {selectedDoctor.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedDoctor.email}
              </p>
            </div>

            <dl className="grid gap-3 text-sm">
              <InfoRow
                label="Specialization"
                value={selectedDoctor.specialization || "N/A"}
              />
              <InfoRow
                label="License No."
                value={selectedDoctor.licenseNumber || "N/A"}
              />
              <InfoRow
                label="Qualifications"
                value={selectedDoctor.qualifications || "N/A"}
              />
              <InfoRow
                label="Experience"
                value={`${selectedDoctor.experienceYears} years`}
              />
              <InfoRow
                label="Contact No."
                value={selectedDoctor.contactNumber || "N/A"}
              />
              <InfoRow
                label="Address"
                value={selectedDoctor.address || "N/A"}
              />
              <InfoRow
                label="Consultation Fee"
                value={
                  selectedDoctor.consultationFee
                    ? `$${selectedDoctor.consultationFee}`
                    : "N/A"
                }
              />
              <InfoRow
                label="Verification Status"
                value={
                  selectedDoctor.verificationStatus.charAt(0).toUpperCase() +
                  selectedDoctor.verificationStatus.slice(1).toLowerCase()
                }
              />
            </dl>

            {selectedDoctor.resume && (
              <div>
                <p className="text-sm font-medium text-foreground">
                  Resume / CV
                </p>
                <a
                  href={selectedDoctor.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                >
                  View resume
                  <ExternalLinkIcon className="size-3.5" />
                </a>
              </div>
            )}

            {selectedDoctor.additionalDocuments &&
              selectedDoctor.additionalDocuments.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Additional Documents
                  </p>
                  <ul className="mt-1 space-y-1">
                    {selectedDoctor.additionalDocuments.map((doc, index) => (
                      <li key={doc.url}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                        >
                          Document {index + 1}
                          <ExternalLinkIcon className="size-3.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {selectedDoctor.bio && (
              <div>
                <p className="text-sm font-medium text-foreground">Bio</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {selectedDoctor.bio}
                </p>
              </div>
            )}

            {selectedDoctor.rejectionReason && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
                <p className="text-sm font-medium text-destructive">
                  Rejection Reason
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {selectedDoctor.rejectionReason}
                </p>
              </div>
            )}
          </div>
        )}

        <Separator />

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

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
