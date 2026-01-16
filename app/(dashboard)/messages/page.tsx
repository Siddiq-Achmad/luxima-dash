import { ChatClient } from "@/components/dashboard/messages/chat-client";
import { Suspense } from "react";

export default function MessagesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatClient />
        </Suspense>
    );
}
