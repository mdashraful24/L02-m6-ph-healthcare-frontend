const prefix = "/admin";

export const adminRoutes = [
    {
        title: "Administration",
        items: [
            {
                title: "Overview",
                url: `${prefix}`,
            },
            {
                title: "Doctor Approval",
                url: `${prefix}/approve-doctor`,
            },
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