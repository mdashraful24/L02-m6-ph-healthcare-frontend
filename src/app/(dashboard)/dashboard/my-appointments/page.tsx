import AppointmentLists from "@/components/modules/my-appointments/appointment-list";

export default function MyAppointments() {
    return (
        <div className="p-10">
            <h1>My Appointments</h1>
            <AppointmentLists />
        </div>
    );
}