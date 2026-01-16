"use client";

import { useEffect, useState } from "react";
import { Conversation, Message, Profile } from "@/lib/types";
import { ConversationList } from "./conversation-list";
import { ChatWindow } from "./chat-window";
import { conversations as initialConversations, messages as initialMessages } from "@/lib/data/messages";
import { Card } from "@/components/ui/card";

// Dummy current user
const currentUser: Profile = {
    id: "me",
    full_name: "Me",
    email: "me@example.com",
    avatar_url: null
};

export function ChatClient() {
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(initialMessages);
    const [selectedId, setSelectedId] = useState<string | null>(initialConversations[0]?.id || null);
    const [isMobileListVisible, setIsMobileListVisible] = useState(true);

    const selectedConversation = conversations.find(c => c.id === selectedId);
    const currentMessages = selectedId ? messagesMap[selectedId] : [];

    const handleSendMessage = (content: string) => {
        if (!selectedId) return;

        const newMessage: Message = {
            id: `m${Date.now()}`,
            conversation_id: selectedId,
            sender_id: currentUser.id,
            content,
            created_at: new Date().toISOString(),
            is_read: true,
            sender: currentUser
        };

        // Update messages
        setMessagesMap(prev => ({
            ...prev,
            [selectedId]: [...(prev[selectedId] || []), newMessage]
        }));

        // Update conversation last message and move to top
        setConversations(prev => {
            const updated = prev.map(c => {
                if (c.id === selectedId) {
                    return {
                        ...c,
                        last_message: newMessage,
                        updated_at: newMessage.created_at
                    };
                }
                return c;
            });
            return updated.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        });
    };

    const handleSelectConversation = (id: string) => {
        setSelectedId(id);
        setIsMobileListVisible(false); // On mobile, hide list after selection to show chat

        // Mark as read logic would go here
        setConversations(prev => prev.map(c => c.id === id ? { ...c, unread_count: 0 } : c));
    };

    return (
        <div className="h-[calc(100vh-8rem)] w-full max-w-[1600px] mx-auto p-4">
            <Card className="flex flex-row h-full overflow-hidden border shadow-sm">
                <div className={`${isMobileListVisible ? 'flex' : 'hidden'} md:flex w-full md:w-[350px] flex-col`}>
                    <ConversationList
                        conversations={conversations}
                        selectedId={selectedId}
                        onSelect={handleSelectConversation}
                        currentUser={currentUser}
                    />
                </div>
                <div className={`${!isMobileListVisible ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
                    {selectedConversation ? (
                        <>
                            {/* Mobile back button */}
                            <div className="md:hidden p-2 border-b bg-muted/20">
                                <button onClick={() => setIsMobileListVisible(true)} className="text-sm text-primary flex items-center gap-1">
                                    &larr; Back to messages
                                </button>
                            </div>
                            <ChatWindow
                                conversation={selectedConversation}
                                messages={currentMessages}
                                currentUser={currentUser}
                                onSendMessage={handleSendMessage}
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            Select a conversation to start messaging
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
