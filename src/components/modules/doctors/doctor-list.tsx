"use client";

import Link from "next/link";
import { useGetAllPublicDoctors } from "@/hooks";

export default function DoctorList() {
    const { data } = useGetAllPublicDoctors({ page: 1, limit: 100 });

    const doctorList = data?.data || [];

    return (
        <div className="h-full max-w-7xl mx-auto px-4 py-6">
            <div className="flex gap-3">
                {doctorList.map((doctor) => (
                    <Link key={doctor.id} href={`doctors/${doctor.id}`}>
                        {doctor.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}


// "use client";

// import Link from "next/link";
// import { useGetAllPublicDoctors } from "@/hooks";

// export default function DoctorList() {
//     const { data } = useGetAllPublicDoctors({ page: 1, limit: 100 });

//     const doctorList = data?.data || [];

//     return (
//         <div className="h-full max-w-7xl mx-auto px-4 py-6">
//             <div className="flex gap-3">
//                 {doctorList.map((doctor) => {
//                     const params = new URLSearchParams({ id: doctor.id }).toString();

//                     return (
//                         <Link key={doctor.id} href={`doctors/details?${params}`}>
//                             {doctor.name}
//                         </Link>
//                     )
//                 })}
//             </div>
//         </div>
//     );
// }
