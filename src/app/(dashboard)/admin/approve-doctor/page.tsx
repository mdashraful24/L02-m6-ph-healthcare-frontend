"use client";

import DoctorApprovalTabs from "@/components/modules/doctor-approval/doctor-approval-tabs";

export default function ApproveDoctorPage() {
  return (
    <section className="p-5">
      <div>
        <h1>Approve Doctor</h1>
        <p>
          Please review the doctor's information and approve or reject their
          application.
        </p>
      </div>

      <DoctorApprovalTabs />
    </section>
  );
}
