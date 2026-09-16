const prefix = "/patient";

export const patientRoutes = [
    {
        title: "Bookings",
        items: [
            {
                title: "Overview",
                url: `${prefix}`,
            },
            {
                title: "Create Booking",
                url: `${prefix}/create-booking`,
            },
            {
                title: "View Bookings",
                url: `${prefix}/view-bookings`,
            },
            {
                title: "Payment History",
                url: `${prefix}/payment-history`,
            }
        ],
    },
    {
        title: "App Settings",
        items: [
            {
                title: "Routing",
                url: "#",
            },
            {
                title: "Data Fetching",
                url: "#",
            },
            {
                title: "Rendering",
                url: "#",
            },
        ],
    },
];