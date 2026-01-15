export type Profile = {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
};

export type VendorPackage = {
    id: string;
    name: string;
    price: number;
};

export type Vendor = {
    id: string;
    name: string;
    tenant_id: string;
};

export type Booking = {
    id: string;
    vendor_id: string;
    user_id: string;
    package_id?: string;
    event_start: string;
    event_end: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    notes?: string;
    vendor_packages?: VendorPackage;
    vendors?: Vendor;
    profiles?: Profile;
};

export type TenantMember = {
    id: string;
    profile_id: string;
    role: string | { name: string; role: string }; // Handle join messiness
    joined_at: string;
    status: string;
    profiles?: Profile;
    roles?: { name: string; role: string };
};

export type Invoice = {
    id: string;
    invoice_number: string;
    amount: number;
    status: string;
    due_date: string;
    created_at: string;
    profiles?: Profile;
    subscriptions?: {
        subscription_plans?: {
            name: string;
        }
    };
};

export type Payment = {
    id: string;
    amount: number;
    status: string;
    created_at: string;
    description: string;
};
