import ScheduleList from "@/components/modules/doctor-schedule/schedule-list";

export default function CreateDoctorSchedule() {
    return (
        <section className="p-5">
            <div>
                <h1 className="text-2xl">
                    My Schedule
                </h1>
                <p>Create and manage your doctor's schedule</p>
            </div>

            <ScheduleList />
        </section>
    );
}