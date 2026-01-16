"use client";

import { Email } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
    MoreVertical,
    Reply,
    ReplyAll,
    Forward,
    Trash2,
    Archive,
    Star,
    AlertCircle
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface MailDisplayProps {
    email: Email | null;
}

export function MailDisplay({ email }: MailDisplayProps) {
    if (!email) {
        return (
            <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-muted p-4">
                        <Archive className="h-8 w-8 opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium">No message selected</h3>
                    <p className="text-sm">Select a message from the list to view it details.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="Archive" aria-label="Archive">
                        <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Report Spam" aria-label="Report Spam">
                        <AlertCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="mx-2 h-6" />
                    <Button variant="ghost" size="icon" title="Mark as unread" aria-label="Mark as unread">
                        <Star className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" aria-label="Reply">
                        <Reply className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Reply All">
                        <ReplyAll className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Forward">
                        <Forward className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="More options">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Print</DropdownMenuItem>
                            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                            <DropdownMenuItem>Filter messages like this</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Content server-side simulated safe HTML rendering if needed, but here simple div */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={email.sender.avatar_url} />
                            <AvatarFallback>{email.sender.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold mb-1">{email.subject}</h2>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">{email.sender.name}</span>
                                <span className="text-muted-foreground">{`<${email.sender.email}>`}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                to me
                            </div>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {format(new Date(email.created_at), "PPP p")}
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: email.content }} />
                </div>
            </div>
            <div className="p-4 border-t bg-muted/10">
                <div className="flex gap-4">
                    <Button variant="outline" className="gap-2">
                        <Reply className="h-4 w-4" />
                        Reply
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Forward className="h-4 w-4" />
                        Forward
                    </Button>
                </div>
            </div>
        </div>
    );
}
