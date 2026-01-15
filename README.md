# Luxima Dashboard (Tenant)

**Domain:** `dash.luxima.id` / `dash.awedz.id` / `[subdomain].awedz.id`  
**Internal Port:** `3004`

`luxima-dash` adalah dashboard utama untuk **Tenant** (Vendor/Organization) dalam ekosistem Luxima. Aplikasi ini memungkinkan tenant untuk mengelola profile, layanan, booking, team members, dan melihat analytics performa bisnis mereka.

---

## 🚀 Features Supported

### 1. Dashboard Overview
- **Quick Stats**: Total Revenue, Active Bookings, Total Customers.
- **Visual Analytics**: Grafik performa views/visitors (Umami-style) dan revenue.
- **Recent Activity**: Daftar booking terbaru.

### 2. Analytics
- **Traffic Insights**: Page views, unique visitors, bounce rate.
- **Audience Metrics**: Breakdown by Device, OS, Browser, dan Country.
- **Top Pages**: Halaman layanan yang paling banyak dikunjungi.
- **Business Stats**: Grafik Revenue dan Booking bulanan (chart visual baru).

### 3. Management Modules
- **Bookings**: CRUD dan status management untuk pesanan client.
- **Invoices**: Daftar tagihan dan status pembayaran (integrated with Midtrans/Xendit logic).
- **Payments**: Wallet balance, transaction history, dan withdrawal request.
- **Organization**: Edit profil bisnis, logo, dan deskripsi layanan.
- **Team**: Invite member baru, assign role (Admin/Member), dan remove access.
- **Settings**: Konfigurasi tier langganan dan preferensi akun.

### 4. Technical Highlights
- **Architecture**: Next.js 16 (App Router) + Turbopack.
- **Styling**: Tailwind CSS v4 + Shadcn UI (TweakCN Theme Synchronized).
- **Charts**: Recharts dikemas ulang dengan `ChartContainer` Shadcn untuk visualisasi modern dan konsisten.
- **Data Layer**: Direct Supabase integration dengan RLS (Row Level Security) enforcement via `proxy.ts`.
- **Optimization**: Fully typed (TypeScript), configured metadata SEO, font optimization.
- **Resilience**: Global Dummy Data Fallback jika database kosong atau error.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/) via Shadcn Charts
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Package Manager**: [Bun](https://bun.sh/)

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ or Bun 1.x
- Supabase Project Credentials

### Installation

1.  **Clone Repository**
    ```bash
    git clone https://github.com/Siddiq-Achmad/luxima-dash.git
    cd luxima-dash
    ```

2.  **Install Dependencies**
    ```bash
    bun install
    ```

3.  **Environment Variables**
    Buat file `.env` berdasarkan `.env.example`:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**
    ```bash
    bun dev --port 3004
    ```
    Access via `http://localhost:3004`.

---

## 🧪 Verification

- **Linting**:
    ```bash
    bun run lint
    ```
- **Type Checking**:
    ```bash
    bun run tsc --noEmit
    ```
- **Produciton Build**:
    ```bash
    bun run build
    ```

---

## 📂 Project Structure

```
luxima-dash/
├── app/                  # App Router pages
│   ├── (dashboard)/      # Main authenticated layout
│   │   ├── analytics/    # Analytics page w/ charts
│   │   ├── bookings/     # Booking management
│   │   └── ...
│   ├── layout.tsx        # Root layout (fonts, metadata)
│   └── globals.css       # Global styles & theme variables
├── components/           # React components
│   ├── dashboard/        # Dashboard-specific blocks (charts, tables)
│   └── ui/               # Generic Shadcn UI components
├── lib/                  # Utilities
│   ├── data/             # Data Access Layer (Server Actions/Fetchers)
│   └── dummy-data.ts     # Fallback data dictionary
├── next.config.ts        # Next.js configuration
└── proxy.ts              # Middleware replacement for Multi-tenancy
```
