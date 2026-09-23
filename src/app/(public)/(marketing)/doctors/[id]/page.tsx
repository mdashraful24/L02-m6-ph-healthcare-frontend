import { getAllPublicDoctors } from "@/api";

export async function generateStaticParams() {
    const limit = 100;
    const first = await getAllPublicDoctors({ page: 1, limit });

    const totalPages = first?.meta?.totalPages || 1;

    const all = [...(first.data ?? [])];

    for (let page = 2; page <= totalPages; page++) {
        const response = await getAllPublicDoctors({ page, limit });
        all.push(...(response.data ?? []));
    }

    return all.map((doctor)=>({ id: doctor.id }));
}

export default function DoctorDetailsPage() {
    return <div>Doctor Details page</div>;
}
