"use client";

import { Message, Profile, Conversation } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MoreVertical, Phone, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatWindowProps {
    conversation: Conversation;
    messages: Message[];
    currentUser: Profile;
    onSendMessage: (content: string) => void;
}

export function ChatWindow({ conversation, messages, currentUser, onSendMessage }: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id) || conversation.participants[0];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage("");
    };

    return (
        <div className="flex flex-col h-full w-full ">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={otherParticipant.avatar_url || undefined} />
                        <AvatarFallback>{otherParticipant.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold">{otherParticipant.full_name}</div>
                        <div className="text-xs text-muted-foreground">{otherParticipant.email}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Block User</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                <div
                                    className={`px-4 py-2 rounded-2xl text-sm ${isMe
                                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                                        : "bg-muted rounded-tl-sm"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                    {format(new Date(msg.created_at), "HH:mm")}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
