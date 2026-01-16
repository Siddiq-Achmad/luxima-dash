// --- Database Types (Reflecting Schema) ---

export type Profile = {
    id: string;
    username?: string;
    full_name: string | null;
    email?: string | null; // Note: email often comes from auth.users, but might be here too
    avatar_url: string | null;
    website?: string | null;
    status?: string;
    system_role?: string;
    created_at?: string;
    updated_at?: string;
};

export type Tenant = {
    id: string;
    name: string;
    slug: string;
    domain?: string;
    subdomain?: string;
    logo_url?: string;
    description?: string;
    settings?: Record<string, unknown>;
    status?: string;
    billing_email?: string;
    created_at?: string;
    updated_at?: string;
};

export type Category = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    parent_id?: string;
    sort_order?: number;
    status?: string;
    image?: string;
    created_at?: string;
};

export type VendorCategory = {
    vendor_id: string;
    category_id: string;
    categories?: Category;
    vendors?: Vendor;
};

export type Tag = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    created_at?: string;
};

export type Vendor = {
    id: string;
    tenant_id: string;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    logo_url?: string;
    cover_image_url?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
    rating?: number;
    review_count?: number;
    price_range?: string;
    status?: string;
    featured?: boolean;
    verified?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type VendorImage = {
    id: string;
    vendor_id: string;
    image_url: string;
    alt_text?: string;
    caption?: string;
    album_name?: string;
    sort_order?: number;
    created_at: string;
};

export type VendorPackage = {
    id: string;
    vendor_id: string;
    name: string;
    description?: string;
    price: number;
    currency?: string;
    features?: string[] | Record<string, unknown>; // JSON in DB
    inclusions?: string[] | Record<string, unknown>;
    exclusions?: string[] | Record<string, unknown>;
    duration_hours?: number;
    max_guests?: number;
    status?: string;
    created_at?: string;
};

export type Post = {
    id: string;
    author_id: string;
    title: string;
    slug: string;
    description?: string;
    content: string;
    cover_image?: string; // Was image_url in old type
    image_url?: string; // Backwards compatibility for UI code or map to cover_image
    published: boolean; // Infer from 'status' or missing column? DB has no 'published' col. Introspection showed: id, title, slug, category_id, tags, cover_image, description, content, reading_time_minutes, created_at, updated_at, author_id.
    // Assuming 'published' needs to be derived or added. For now I'll keep it logic-side or mapped.
    category_id?: string;
    tags?: string[] | Record<string, unknown>;
    reading_time_minutes?: number;
    created_at: string;
    updated_at?: string;
};

export type Booking = {
    id: string;
    tenant_id?: string; // Appears to be used in queries, likely exists or should exist
    vendor_id: string;
    user_id: string;
    package_id?: string;
    event_start: string;
    event_end: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    notes?: string;
    // Relationships
    vendor_packages?: VendorPackage;
    vendors?: Vendor;
    profiles?: Profile;
};

// Tenant type moved to top of file to avoid duplication

export type DatabaseRole = {
    name: string;
    role: string;
};

export type TenantMember = {
    id: string;
    tenant_id?: string;
    profile_id: string;
    role: string; // Used for UI display, normalized from relationship
    role_id?: string; // Foreign key
    joined_at: string;
    status: string;
    profiles?: Profile;
    roles?: DatabaseRole; // Relation to roles table
};

export type Invoice = {
    id: string;
    invoice_number: string;
    amount: number;
    status: string;
    due_date: string;
    created_at: string;
    user_id?: string;
    profiles?: Profile;
    subscriptions?: {
        subscription_plans?: {
            name: string;
        };
    };
};

export type PaymentMethod = {
    id: string;
    name: string;
    slug: string;
    gateway_id?: string;
    method_type?: string;
    status?: string;
    config?: Record<string, unknown>; // Json
    fees?: Record<string, unknown>; // Json
    sort_order?: number;
    created_at?: string;
};

export type Payment = {
    id: string;
    invoice_id?: string;
    tenant_id?: string;
    amount: number;
    status: string;
    method_id?: string; // legacy or relation id
    payment_method?: string; // name or code from transaction
    created_at: string;
    description?: string;
};

export type UsageRecord = {
    id: string;
    tenant_id?: string;
    resource_name: string;
    usage_value: number;
    limit_value: number;
    unit: string;
    period_start: string;
    period_end: string;
    status: "normal" | "warning" | "critical";
};

export type Customer = {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    status: "active" | "inactive" | "lead";
    source?: string;
    tags?: string[];
    created_at: string;
    last_contacted_at?: string;
    notes?: string;
};

export type Task = {
    id: string;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "review" | "done";
    priority: "low" | "medium" | "high";
    due_date?: string;
    assignee_id?: string;
    created_at: string;
    updated_at?: string;
    profiles?: Profile; // Assignee
};

export type Message = {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    is_read: boolean;
    sender?: Profile;
};

export type Conversation = {
    id: string;
    participants: Profile[];
    last_message?: Message;
    unread_count: number;
    updated_at: string;
};

export type Email = {
    id: string;
    sender: {
        name: string;
        email: string;
        avatar_url?: string;
    };
    subject: string;
    preview: string;
    content: string; // HTML or markdown
    created_at: string;
    is_read: boolean;
    labels: string[]; // e.g., "inbox", "work", "important"
};
