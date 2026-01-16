import { Email } from "@/lib/types";

const now = new Date();

export const emails: Email[] = [
    {
        id: "e1",
        sender: {
            name: "System Notification",
            email: "noreply@luxima.com",
            avatar_url: ""
        },
        subject: "Welcome to Luxima Dashboard",
        preview: "Get started with your new dashboard by setting up your profile...",
        content: `
            <p>Hi there,</p>
            <p>Welcome to <strong>Luxima Dashboard</strong>! We're excited to have you on board.</p>
            <p>To get started, please complete your profile setup and explore the features we have to offer.</p>
            <br/>
            <p>Best regards,</p>
            <p>The Luxima Team</p>
        `,
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
        is_read: false,
        labels: ["inbox", "important"]
    },
    {
        id: "e2",
        sender: {
            name: "GitHub",
            email: "notifications@github.com",
            avatar_url: "https://github.com/github.png"
        },
        subject: "Security alert for your repository",
        preview: "We found a potential security vulnerability in your dependencies...",
        content: `
            <p>Hello,</p>
            <p>We found a potential security vulnerability in one of your dependencies.</p>
            <p>Repository: <strong>luxima-dash</strong></p>
            <p>Severity: <strong>High</strong></p>
            <p>Please review the alert and update the package as soon as possible.</p>
        `,
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
        is_read: true,
        labels: ["inbox", "updates"]
    },
    {
        id: "e3",
        sender: {
            name: "Stripe",
            email: "support@stripe.com",
            avatar_url: "https://stripe.com/img/cookie-settings/icon-stripe.png"
        },
        subject: "Your monthly invoice is available",
        preview: "Your invoice for January 2026 is now available for download...",
        content: `
            <p>Hi,</p>
            <p>Your invoice for <strong>January 2026</strong> is now available.</p>
            <p>Amount: <strong>$29.00</strong></p>
            <p>You can download it from your dashboard.</p>
        `,
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString(),
        is_read: true,
        labels: ["inbox", "billing"]
    },
    {
        id: "e4",
        sender: {
            name: "Jane Smith",
            email: "jane@client.com",
            avatar_url: ""
        },
        subject: "Project Update: Q1 Roadmap",
        preview: "I've attached the proposed roadmap for Q1. Let me know what you think...",
        content: `
            <p>Hi Team,</p>
            <p>I've attached the proposed roadmap for Q1. Please review it and let me know if you have any feedback.</p>
            <p>We're looking to finalize this by Friday.</p>
            <p>Thanks,</p>
            <p>Jane</p>
        `,
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 72).toISOString(),
        is_read: false,
        labels: ["inbox", "work"]
    }
];
