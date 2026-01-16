import {
    Booking,
    Invoice,
    Payment,
    Profile,
    TenantMember,
    VendorPackage,
    Vendor,
    Post,
    VendorImage,
    UsageRecord,
    Tenant,
    Task
} from "./types";

export const DUMMY_PROFILE: Profile = {
    id: "dummy-profile-1",
    full_name: "John Doe",
    email: "john@example.com",
    avatar_url: "https://github.com/shadcn.png"
};

export const DUMMY_VENDOR: Vendor = {
    id: "dummy-vendor-1",
    name: "Luxima Photography",
    slug: "luxima-photography",
    tenant_id: "dummy-tenant",
    description: "Professional wedding photography services capturing your most precious moments.",
    short_description: "Premium Wedding Photography",
    logo_url: "https://github.com/shadcn.png",
    cover_image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
    email: "contact@luxima.demo",
    phone: "+62 812 3456 7890",
    website: "https://luxima.demo",
    address: "Jl. Photography No. 123",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    postal_code: "12345",
    rating: 4.8,
    review_count: 124,
    price_range: "$$$",
    status: "active",
    featured: true,
    verified: true,
    created_at: new Date(Date.now() - 86400000 * 365).toISOString(),
    updated_at: new Date().toISOString()
};

export const DUMMY_PACKAGE: VendorPackage = {
    id: "dummy-pkg-1",
    vendor_id: "dummy-vendor-1",
    name: "Wedding Basic",
    description: "Basic wedding package with essential coverage.",
    price: 5000000,
    currency: "IDR",
    features: ["8 Hours Coverage", "1 Photographer", "100 Edited Photos", "Online Gallery"],
    inclusions: ["Transportation within city", "High-res files"],
    exclusions: ["Prints", "Album", "Out of town fees"],
    duration_hours: 8,
    max_guests: 0,
    status: "active",
    created_at: new Date().toISOString()
};

export const DUMMY_PACKAGES: VendorPackage[] = [
    {
        id: "pkg-1",
        vendor_id: "dummy-vendor-1",
        name: "Wedding Basic",
        description: "Essential wedding photography coverage for your special day.",
        price: 5000000,
        currency: "IDR",
        features: ["8 Hours Coverage", "1 Photographer", "100 Edited Photos"],
        duration_hours: 8,
        status: "active",
        created_at: new Date(Date.now() - 86400000 * 30).toISOString()
    },
    {
        id: "dummy-pkg-2",
        vendor_id: "dummy-vendor-1",
        name: "Studio Basic",
        description: "Professional studio session with 5 edited photos.",
        price: 1500000,
        currency: "IDR",
        features: ["1 Hour Session", "1 Background", "5 Edited Photos"],
        duration_hours: 1,
        status: "active",
        created_at: new Date(Date.now() - 86400000 * 20).toISOString()
    },
    {
        id: "dummy-pkg-3",
        vendor_id: "dummy-vendor-1",
        name: "Pre-wedding Outdoor",
        description: "Outdoor pre-wedding shoot at your favorite location.",
        price: 8000000,
        currency: "IDR",
        features: ["4 Hours Coverage", "2 Locations", "30 Edited Photos", "Makeup Included"],
        duration_hours: 4,
        status: "active",
        created_at: new Date(Date.now() - 86400000 * 10).toISOString()
    }
];

export const DUMMY_BOOKINGS: Booking[] = [
    {
        id: "dummy-booking-1",
        vendor_id: "dummy-vendor-1",
        user_id: "dummy-profile-1",
        tenant_id: "dummy-tenant",
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
        tenant_id: "dummy-tenant",
        event_start: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        event_end: new Date(Date.now() - 82800000).toISOString(),
        status: "completed",
        notes: "Studio session",
        vendor_packages: { ...DUMMY_PACKAGE, name: "Studio Basic", price: 1500000 },
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
        profiles: DUMMY_PROFILE
    },
    {
        id: "dummy-inv-2",
        invoice_number: "INV-2024-002",
        amount: 750000,
        status: "pending",
        due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
        created_at: new Date(Date.now()).toISOString(),
        profiles: DUMMY_PROFILE
    }
];

export const DUMMY_PAYMENTS: Payment[] = [
    {
        id: "dummy-pay-1",
        invoice_id: "dummy-inv-1",
        amount: 15000000,
        status: "completed",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        description: "Payment for INV-2024-001",
        method_id: "method-1"
    },
    {
        id: "dummy-pay-2",
        amount: 5000000,
        status: "pending",
        created_at: new Date().toISOString(),
        description: "Wallet Top-up",
        method_id: "method-2"
    }
];

export const DUMMY_TASKS: Task[] = [
    {
        id: "task-1",
        title: "Review new vendor application",
        description: "Check the documents submitted by Vendor XYZ.",
        status: "todo",
        priority: "high",
        due_date: new Date(Date.now() + 86400000).toISOString(),
        created_at: new Date().toISOString(),
        assignee_id: "user-1",
        profiles: DUMMY_PROFILE
    },
    {
        id: "task-2",
        title: "Update marketing assets",
        description: "Refresh the homepage banner images.",
        status: "in_progress",
        priority: "medium",
        due_date: new Date(Date.now() + 172800000).toISOString(),
        created_at: new Date().toISOString(),
        assignee_id: "user-1",
        profiles: DUMMY_PROFILE
    },
    {
        id: "task-3",
        title: "Monthly financial report",
        description: "Compile invoices and payments for July.",
        status: "done",
        priority: "low",
        due_date: new Date(Date.now() - 86400000).toISOString(),
        created_at: new Date().toISOString(),
        assignee_id: "user-1",
        profiles: DUMMY_PROFILE
    },
    {
        id: "task-4",
        title: "Client meeting preparation",
        description: "Prepare slides for the Luxima presentation.",
        status: "review",
        priority: "high",
        due_date: new Date(Date.now() + 43200000).toISOString(),
        created_at: new Date().toISOString(),
        assignee_id: "user-1",
        profiles: DUMMY_PROFILE
    }
];

export const DUMMY_TEAM: TenantMember[] = [
    {
        id: "dummy-member-1",
        profile_id: "dummy-profile-1",
        role: "owner",
        joined_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        status: "active",
        profiles: DUMMY_PROFILE
    },
    {
        id: "dummy-member-2",
        profile_id: "dummy-profile-2",
        role: "staff",
        joined_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        status: "active",
        profiles: { ...DUMMY_PROFILE, id: "dummy-profile-2", full_name: "Alice Staff", email: "alice@luxima.id" }
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

export const DUMMY_SETTINGS: Tenant = {
    id: "dummy-tenant",
    name: "Luxima Demo Studio",
    slug: "luxima-demo",
    subdomain: "demo",
    billing_email: "billing@luxima.demo",
    description: "This is a demo organization to showcase the dashboard features.",
    logo_url: "https://github.com/shadcn.png",
    status: "active",
    created_at: new Date(Date.now() - 86400000 * 365).toISOString(),
    updated_at: new Date().toISOString()
};

export const DUMMY_POSTS: Post[] = [
    {
        id: "post-1",
        title: "Top 10 Wedding Photography Tips",
        description: "Capture the perfect moments on your big day with these essential photography tips.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        published: true,
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
        author_id: "dummy-profile-1",
        slug: "top-10-wedding-photography-tips"
    },
    {
        id: "post-2",
        title: "Why You Need a Pre-wedding Shoot",
        description: "Discover the benefits of having a pre-wedding photo session before your actual wedding day.",
        content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        published: true,
        created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
        image_url: "https://images.unsplash.com/photo-1692167912825-40b5afccecdf?q=80&w=2912&auto=format&fit=crop",
        author_id: "dummy-profile-1",
        slug: "why-you-need-a-pre-wedding-shoot"
    },
    {
        id: "post-3",
        title: "Choosing the Right Venue",
        description: "A comprehensive guide to selecting the perfect venue for your dream wedding.",
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        published: false,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
        author_id: "dummy-profile-1",
        slug: "choosing-the-right-venue"
    }
];

export const DUMMY_PORTFOLIO: VendorImage[] = [
    {
        id: "img-1",
        vendor_id: "dummy-vendor-1",
        image_url: "https://images.unsplash.com/photo-1692167912825-40b5afccecdf?q=80&w=2912&auto=format&fit=crop",
        caption: "Sunset Romance",
        album_name: "Pre-wedding 2024",
        created_at: new Date(Date.now() - 86400000 * 20).toISOString()
    },
    {
        id: "img-2",
        vendor_id: "dummy-vendor-1",
        image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
        caption: "The Vow",
        album_name: "Wedding Highlights",
        created_at: new Date(Date.now() - 86400000 * 15).toISOString()
    },
    {
        id: "img-3",
        vendor_id: "dummy-vendor-1",
        image_url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070&auto=format&fit=crop",
        caption: "Detail Shot",
        album_name: "Wedding Highlights",
        created_at: new Date(Date.now() - 86400000 * 10).toISOString()
    },
    {
        id: "img-4",
        vendor_id: "dummy-vendor-1",
        image_url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop",
        caption: "Bridal Portrait",
        album_name: "Portraits",
        created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    }
];

export const DUMMY_USAGE_RECORDS: UsageRecord[] = [
    {
        id: "usage-1",
        resource_name: "Storage",
        usage_value: 4.5,
        limit_value: 10,
        unit: "GB",
        period_start: new Date(Date.now() - 86400000 * 30).toISOString(),
        period_end: new Date(Date.now()).toISOString(),
        status: "normal"
    },
    {
        id: "usage-2",
        resource_name: "Bandwidth",
        usage_value: 85,
        limit_value: 100,
        unit: "GB",
        period_start: new Date(Date.now() - 86400000 * 30).toISOString(),
        period_end: new Date(Date.now()).toISOString(),
        status: "warning"
    },
    {
        id: "usage-3",
        resource_name: "Active Listings",
        usage_value: 12,
        limit_value: 50,
        unit: "Listings",
        period_start: new Date(Date.now() - 86400000 * 30).toISOString(),
        period_end: new Date(Date.now()).toISOString(),
        status: "normal"
    },
    {
        id: "usage-4",
        resource_name: "API Calls",
        usage_value: 9500,
        limit_value: 10000,
        unit: "Calls/mo",
        period_start: new Date(Date.now() - 86400000 * 30).toISOString(),
        period_end: new Date(Date.now()).toISOString(),
        status: "critical"
    }
];

export const DUMMY_CUSTOMERS: import("./types").Customer[] = [
    {
        id: "cust-1",
        full_name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+62 812 3456 7891",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        status: "active",
        source: "Instagram",
        tags: ["Wedding", "Premium"],
        created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
        last_contacted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        notes: "Interested in the Gold package."
    },
    {
        id: "cust-2",
        full_name: "Bob Smith",
        email: "bob@example.com",
        phone: "+62 813 9876 5432",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        status: "lead",
        source: "Referral",
        tags: ["Pre-wedding"],
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        last_contacted_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        notes: "Budget query."
    },
    {
        id: "cust-3",
        full_name: "Charlie Brown",
        email: "charlie@example.com",
        phone: "+62 811 1122 3344",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
        status: "inactive",
        source: "Website",
        tags: ["Family"],
        created_at: new Date(Date.now() - 86400000 * 120).toISOString(),
        last_contacted_at: new Date(Date.now() - 86400000 * 90).toISOString(),
        notes: "Past client."
    },
    {
        id: "cust-4",
        full_name: "Diana Prince",
        email: "diana@example.com",
        phone: "+62 815 5566 7788",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
        status: "active",
        source: "Facebook Ads",
        tags: ["Wedding", "VVIP"],
        created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
        last_contacted_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        notes: "Urgent booking requested."
    },
    {
        id: "cust-5",
        full_name: "Evan Wright",
        email: "evan@example.com",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Evan",
        status: "lead",
        source: "Walk-in",
        tags: [],
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        last_contacted_at: new Date(Date.now()).toISOString(),
    }
];
