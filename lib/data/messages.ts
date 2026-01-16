import { Conversation, Message, Profile } from "@/lib/types";

const now = new Date();

const profiles: Profile[] = [
    {
        id: "p1",
        full_name: "John Doe",
        avatar_url: null,
        email: "john@example.com",
    },
    {
        id: "p2",
        full_name: "Jane Smith",
        avatar_url: null,
        email: "jane@example.com",
    },
    {
        id: "p3",
        full_name: "Robert Johnson",
        avatar_url: null,
        email: "robert@example.com",
    },
    {
        id: "me",
        full_name: "Me",
        avatar_url: null,
        email: "me@example.com",
    }
];

export const conversations: Conversation[] = [
    {
        id: "c1",
        participants: [profiles[0], profiles[3]],
        unread_count: 2,
        updated_at: new Date(now.getTime() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        last_message: {
            id: "m4",
            conversation_id: "c1",
            sender_id: "p1",
            content: "Can you send me the invoice?",
            created_at: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
            is_read: false,
            sender: profiles[0]
        }
    },
    {
        id: "c2",
        participants: [profiles[1], profiles[3]],
        unread_count: 0,
        updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        last_message: {
            id: "m10",
            conversation_id: "c2",
            sender_id: "me",
            content: "Sure, let's meet tomorrow.",
            created_at: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
            is_read: true,
            sender: profiles[3]
        }
    },
    {
        id: "c3",
        participants: [profiles[2], profiles[3]],
        unread_count: 0,
        updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        last_message: {
            id: "m20",
            conversation_id: "c3",
            sender_id: "p3",
            content: "Project looks great!",
            created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
            is_read: true,
            sender: profiles[2]
        }
    }
];

export const messages: Record<string, Message[]> = {
    "c1": [
        {
            id: "m1",
            conversation_id: "c1",
            sender_id: "me",
            content: "Hi John, how is the project going?",
            created_at: new Date(now.getTime() - 1000 * 60 * 60 * 1).toISOString(),
            is_read: true,
            sender: profiles[3]
        },
        {
            id: "m2",
            conversation_id: "c1",
            sender_id: "p1",
            content: "Hey! It's going well. I just finished the initial draft.",
            created_at: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
            is_read: true,
            sender: profiles[0]
        },
        {
            id: "m3",
            conversation_id: "c1",
            sender_id: "me",
            content: "That's great news! When can we review it?",
            created_at: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
            is_read: true,
            sender: profiles[3]
        },
        {
            id: "m4",
            conversation_id: "c1",
            sender_id: "p1",
            content: "Can you send me the invoice?",
            created_at: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
            is_read: false,
            sender: profiles[0]
        }
    ],
    "c2": [
        {
            id: "m5",
            conversation_id: "c2",
            sender_id: "p2",
            content: "Are you available for a quick call?",
            created_at: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(),
            is_read: true,
            sender: profiles[1]
        },
        {
            id: "m6",
            conversation_id: "c2",
            sender_id: "me",
            content: "I'm in a meeting right now. How about in an hour?",
            created_at: new Date(now.getTime() - 1000 * 60 * 60 * 2.8).toISOString(),
            is_read: true,
            sender: profiles[3]
        },
        {
            id: "m10",
            conversation_id: "c2",
            sender_id: "me",
            content: "Sure, let's meet tomorrow.",
            created_at: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
            is_read: true,
            sender: profiles[3]
        }
    ],
    "c3": [
        {
            id: "m20",
            conversation_id: "c3",
            sender_id: "p3",
            content: "Project looks great!",
            created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
            is_read: true,
            sender: profiles[2]
        }
    ]
};
