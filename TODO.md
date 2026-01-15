# Project Roadmap & TODOs

Document ini melacak status penyelesaian fitur dan rencana pengembangan selanjutnya untuk `luxima-dash` (Tenant Dashboard).

---

## ✅ Completed (Phase 5: Tenant Dashboard)

- [x] **Project Setup**: Next.js 16, TypeScript, Shadcn UI, Bun setup.
- [x] **Core UI Layout**: Sidebar navigation, responsive layout, App Router structure.
- [x] **Features Implementation**:
    - [x] **Overview**: Dashboard stats card & revenue summary.
    - [x] **Analytics**: Full analytics page dengan overview chart, device stats, dan top pages (Umami-style).
    - [x] **Bookings**: List bookings, status filtering, details dialog.
    - [x] **Team**: Member management tables & role assignment.
    - [x] **Organization**: Profile editing form.
    - [x] **Payments**: Transaction history view.
- [x] **Best Practices**:
    - [x] **Charts Refactor**: Migrasi ke Shadcn `ChartContainer` untuk konsistensi theme.
    - [x] **Theme Sync**: Sinkronisasi warna global (TweakCN) dengan charts dan components.
    - [x] **Dummy Data Fallback**: Mekanisme fallback otomatis jika database kosong.
- [x] **Production Readiness**:
    - [x] `bun run build` passed.
    - [x] Linting error fix (unused vars, imports).
    - [x] Font & Metadata optimization.

---

## 📝 Upcoming Tasks (Phase 6 & Beyond)

### 1. Advanced Analytics
- [ ] **Export Reports**: Fitur export data booking/revenue ke CSV/PDF.
- [ ] **Date Range Filter**: Filter global date range untuk semua chart analytics.
- [ ] **Conversion Goals**: Tracking simple conversion (misal: "Click Contact" button).

### 2. Feature Enhancements
- [ ] **Booking Calendar View**: Tampilan kalender (FullCalendar) selain list view.
- [ ] **Invoicing PDF**: Generate PDF invoice resmi yang bisa di-download/kirim email.
- [ ] **Notification Center**: In-app notifications untuk booking baru atau payment success.

### 3. Integration & Deployment
- [ ] **Coolify Deployment**: Setup Dockerfile/Nixpacks untuk deployment ke Coolify PaaS.
- [ ] **Real-time Updates**: Implementasi Supabase Realtime untuk status booking tanpa refresh.
- [ ] **Email Notifications**: Trigger email transactional via Resend/SendGrid.

### 4. System Maintenance
- [ ] **Testing**: Tambahkan unit testing (Jest) atau E2E testing (Playwright) untuk flow kritis (Booking).
- [ ] **Accessibility Audit**: Audit mendalam menggunakan Lighthouse/Axe devtools.

---

*Last Updated: 2026-01-15*
