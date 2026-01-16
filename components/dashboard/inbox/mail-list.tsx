"use client";

import { Email } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MailListProps {
    emails: Email[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export function MailList({ emails, selectedId, onSelect }: MailListProps) {
    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {emails.map((email) => (
                <button
                    key={email.id}
                    onClick={() => onSelect(email.id)}
                    className={cn(
                        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent w-full",
                        selectedId === email.id && "bg-accent"
                    )}
                >
                    <div className="flex w-full flex-col gap-1">
                        <div className="flex items-center">
                            <div className="flex items-center gap-2">
                                <div className="font-semibold">{email.sender.name}</div>
                                {!email.is_read && (
                                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                )}
                            </div>
                            <div
                                className={cn(
                                    "ml-auto text-xs",
                                    selectedId === email.id
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {formatDistanceToNow(new Date(email.created_at), {
                                    addSuffix: true,
                                })}
                            </div>
                        </div>
                        <div className="text-xs font-medium">{email.subject}</div>
                    </div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                        {email.preview}
                    </div>
                    {email.labels.length ? (
                        <div className="flex items-center gap-2">
                            {email.labels.map((label) => (
                                <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                                    {label}
                                </Badge>
                            ))}
                        </div>
                    ) : null}
                </button>
            ))}
        </div>
    );
}

function getBadgeVariantFromLabel(label: string): "default" | "secondary" | "outline" | "destructive" {
    if (["work"].includes(label.toLowerCase())) {
        return "default";
    }
    if (["important"].includes(label.toLowerCase())) {
        return "destructive"; // Use destructive color for important
    }
    return "secondary";
}
