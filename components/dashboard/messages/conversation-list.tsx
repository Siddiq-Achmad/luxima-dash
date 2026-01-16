"use client";

import { Conversation, Profile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ConversationListProps {
    conversations: Conversation[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    currentUser: Profile;
}

export function ConversationList({ conversations, selectedId, onSelect, currentUser }: ConversationListProps) {
    return (
        <div className="flex flex-col h-full border-r">
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-8" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => {
                    const otherParticipant = conv.participants.find(p => p.id !== currentUser.id) || conv.participants[0];
                    const isSelected = selectedId === conv.id;

                    return (
                        <div
                            key={conv.id}
                            onClick={() => onSelect(conv.id)}
                            className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${isSelected ? "bg-muted" : ""
                                }`}
                        >
                            <Avatar>
                                <AvatarImage src={otherParticipant.avatar_url || undefined} />
                                <AvatarFallback>{otherParticipant.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold truncate">{otherParticipant.full_name}</span>
                                    {conv.last_message && (
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {formatDistanceToNow(new Date(conv.last_message.created_at), { addSuffix: true })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground truncate pr-2">
                                        {conv.last_message?.sender_id === currentUser.id ? "You: " : ""}
                                        {conv.last_message?.content || "No messages yet"}
                                    </p>
                                    {conv.unread_count > 0 && (
                                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-[10px] text-primary-foreground font-medium">
                                            {conv.unread_count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
