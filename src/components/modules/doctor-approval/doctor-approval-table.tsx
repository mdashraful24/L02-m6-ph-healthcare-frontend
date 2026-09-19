"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSuspenseGetAllDoctors } from "@/hooks";
import { IDoctorParams } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface IProps extends IDoctorParams {
  handleReview: Dispatch<SetStateAction<string>>;
}

export default function DoctorApprovalTable({
  handleReview,
  ...params
}: IProps) {
  const { data } = useSuspenseGetAllDoctors(params);

  const doctors = data?.data || [];

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact No.</TableHead>
            <TableHead>License No.</TableHead>
            <TableHead>Experience (Years)</TableHead>
            <TableHead>Verification Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor, index) => (
            <TableRow key={doctor.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{doctor.name}</TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell>
                {doctor.contactNumber ? doctor.contactNumber : "N/A"}
              </TableCell>
              <TableCell>{doctor.licenseNumber}</TableCell>
              <TableCell>{doctor.experienceYears}</TableCell>
              <TableCell>
                {doctor.verificationStatus.charAt(0).toUpperCase() +
                  doctor.verificationStatus.slice(1).toLowerCase()}
              </TableCell>
              <TableCell className="text-right">
                {doctor.user.emailVerified ? <Button
                  variant="outline"
                  onClick={() => handleReview(doctor.id)}
                  disabled={doctor.verificationStatus !== "PENDING"}
                >
                  {doctor.verificationStatus === "PENDING" ? "Review" : "Reviewed"}
                </Button> : <Button variant="outline" disabled>Not Verified</Button>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
