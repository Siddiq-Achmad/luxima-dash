import { Booking, Invoice, Payment, Profile, TenantMember, VendorPackage, Vendor } from "./types";

export const DUMMY_PROFILE: Profile = {
    id: "dummy-profile-1",
    full_name: "John Doe",
    email: "john@example.com",
    avatar_url: "https://github.com/shadcn.png"
};

export const DUMMY_VENDOR: Vendor = {
    id: "dummy-vendor-1",
    name: "Luxima Photography",
    tenant_id: "dummy-tenant"
};

export const DUMMY_PACKAGE: VendorPackage = {
    id: "dummy-pkg-1",
    name: "Wedding Gold Package",
    price: 15000000
};

export const DUMMY_PACKAGES: VendorPackage[] = [
    DUMMY_PACKAGE,
    { id: "dummy-pkg-2", name: "Studio Basic", price: 5000000 },
    { id: "dummy-pkg-3", name: "Pre-wedding Outdoor", price: 8000000 }
];

export const DUMMY_BOOKINGS: Booking[] = [
    {
        id: "dummy-booking-1",
        vendor_id: "dummy-vendor-1",
        user_id: "dummy-profile-1",
        event_start: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        event_end: new Date(Date.now() + 90000000).toISOString(),
        status: "confirmed",
        notes: "Outdoor photoshoot",
        vendor_packages: DUMMY_PACKAGE,
        vendors: DUMMY_VENDOR,
        profiles: DUMMY_PROFILE
    },
    {
        id: "dummy-booking-2",
        vendor_id: "dummy-vendor-1",
        user_id: "dummy-profile-1",
        event_start: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        event_end: new Date(Date.now() - 82800000).toISOString(),
        status: "completed",
        notes: "Studio session",
        vendor_packages: { ...DUMMY_PACKAGE, name: "Studio Basic", price: 5000000 },
        vendors: DUMMY_VENDOR,
        profiles: { ...DUMMY_PROFILE, full_name: "Jane Smith" }
    }
];

export const DUMMY_INVOICES: Invoice[] = [
    {
        id: "dummy-inv-1",
        invoice_number: "INV-2024-001",
        amount: 15000000,
        status: "paid",
        due_date: new Date(Date.now() + 86400000 * 7).toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString(),
        profiles: DUMMY_PROFILE,
        subscriptions: { subscription_plans: { name: "Pro Plan" } }
    },
    {
        id: "dummy-inv-2",
        invoice_number: "INV-2024-002",
        amount: 750000,
        status: "pending",
        due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
        created_at: new Date(Date.now()).toISOString(),
        profiles: DUMMY_PROFILE,
        subscriptions: { subscription_plans: { name: "Add-on Service" } }
    }
];

export const DUMMY_PAYMENTS: Payment[] = [
    {
        id: "dummy-pay-1",
        amount: 15000000,
        status: "completed",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        description: "Payment for INV-2024-001"
    },
    {
        id: "dummy-pay-2",
        amount: 5000000,
        status: "pending",
        created_at: new Date().toISOString(),
        description: "Wallet Top-up"
    }
];

export const DUMMY_TEAM: TenantMember[] = [
    {
        id: "dummy-member-1",
        profile_id: "dummy-profile-1",
        role: "owner",
        joined_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        status: "active",
        profiles: DUMMY_PROFILE,
        roles: { name: "Owner", role: "owner" }
    },
    {
        id: "dummy-member-2",
        profile_id: "dummy-profile-2",
        role: "staff",
        joined_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        status: "active",
        profiles: { ...DUMMY_PROFILE, id: "dummy-profile-2", full_name: "Alice Staff", email: "alice@luxima.id" },
        roles: { name: "Staff", role: "staff" }
    }
];

export const DUMMY_ANALYTICS = {
    revenue: [
        { date: "01 Jan", amount: 5000000 },
        { date: "05 Jan", amount: 15000000 },
        { date: "10 Jan", amount: 7500000 },
        { date: "15 Jan", amount: 20000000 },
        { date: "20 Jan", amount: 12000000 },
        { date: "25 Jan", amount: 18000000 },
    ],
    bookings: [
        { date: "01 Jan", count: 2 },
        { date: "05 Jan", count: 5 },
        { date: "10 Jan", count: 3 },
        { date: "15 Jan", count: 8 },
        { date: "20 Jan", count: 4 },
        { date: "25 Jan", count: 6 },
    ],
    topPackages: [
        { name: "Wedding Gold", count: 12 },
        { name: "Pre-wedding Studio", count: 8 },
        { name: "Family Portrait", count: 5 },
        { name: "Event Coverage", count: 3 },
    ]
};

export const DUMMY_UMAMI_DATA = {
    overview: [
        { date: "01 Jan", views: 150, visitors: 80, visits: 100 },
        { date: "05 Jan", views: 230, visitors: 120, visits: 180 },
        { date: "10 Jan", views: 180, visitors: 90, visits: 130 },
        { date: "15 Jan", views: 450, visitors: 250, visits: 320 },
        { date: "20 Jan", views: 320, visitors: 180, visits: 240 },
        { date: "25 Jan", views: 520, visitors: 310, visits: 400 },
        { date: "30 Jan", views: 480, visitors: 280, visits: 380 },
    ],
    pages: [
        { path: "/", views: 1250 },
        { path: "/packages", views: 850 },
        { path: "/gallery", views: 650 },
        { path: "/contact", views: 320 },
        { path: "/booking", views: 180 },
    ],
    browsers: [
        { name: "Chrome", count: 1250, fill: "var(--color-chrome)" },
        { name: "Safari", count: 850, fill: "var(--color-safari)" },
        { name: "Firefox", count: 320, fill: "var(--color-firefox)" },
        { name: "Edge", count: 180, fill: "var(--color-edge)" },
        { name: "Others", count: 120, fill: "var(--color-other)" },
    ],
    os: [
        { name: "Windows", count: 1100, fill: "var(--color-windows)" },
        { name: "iOS", count: 850, fill: "var(--color-ios)" },
        { name: "Mac OS", count: 550, fill: "var(--color-macos)" },
        { name: "Android", count: 320, fill: "var(--color-android)" },
    ],
    devices: [
        { name: "Mobile", count: 1350, fill: "var(--color-mobile)" },
        { name: "Desktop", count: 1100, fill: "var(--color-desktop)" },
        { name: "Tablet", count: 250, fill: "var(--color-tablet)" },
    ],
    countries: [
        { name: "Indonesia", count: 2150 },
        { name: "Singapore", count: 120 },
        { name: "Malaysia", count: 80 },
        { name: "Australia", count: 50 },
        { name: "USA", count: 20 },
    ]
};

export const DUMMY_SETTINGS = {
    name: "Luxima Demo Studio",
    subdomain: "demo",
    billing_email: "billing@luxima.demo",
    description: "This is a demo organization to showcase the dashboard features.",
    logoUrl: "https://github.com/shadcn.png"
};
