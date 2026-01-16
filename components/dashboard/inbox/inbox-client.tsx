"use client";

import { useState } from "react";
import { Email } from "@/lib/types";
import { MailList } from "./mail-list";
import { MailDisplay } from "./mail-display";
import { emails as initialEmails } from "@/lib/data/emails";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Inbox as InboxIcon, Send, File, Archive, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Nav } from "./nav";


export function InboxClient() {
    const [emails, setEmails] = useState<Email[]>(initialEmails);
    const [selectedId, setSelectedId] = useState<string | null>(initialEmails[0]?.id || null);
    const [isMobileListVisible, setIsMobileListVisible] = useState(true);

    const selectedEmail = emails.find(e => e.id === selectedId) || null;

    const handleSelectEmail = (id: string) => {
        setSelectedId(id);
        setIsMobileListVisible(false);
        // Mark read logic
        setEmails(prev => prev.map(e => e.id === id ? { ...e, is_read: true } : e));
    };

    return (
        <div className="h-[calc(100vh-8rem)] w-full max-w-[1600px] mx-auto p-4">
            <Card className="flex flex-row h-full overflow-hidden border shadow-sm bg-background">
                {/* Sidebar Navigation - Collapsible on small screens could be better, but fixed for now */}
                <div className="hidden md:flex w-[200px] flex-col border-r p-2 bg-muted/10">
                    <div className="p-2 mb-2">
                        <h2 className="text-xl font-bold tracking-tight">Inbox</h2>
                    </div>
                    <Nav
                        links={[
                            {
                                title: "Inbox",
                                label: "128",
                                icon: InboxIcon,
                                variant: "default",
                            },
                            {
                                title: "Sent",
                                label: "9",
                                icon: Send,
                                variant: "ghost",
                            },
                            {
                                title: "Drafts",
                                label: "",
                                icon: File,
                                variant: "ghost",
                            },
                            {
                                title: "Archive",
                                label: "23",
                                icon: Archive,
                                variant: "ghost",
                            },
                            {
                                title: "Trash",
                                label: "",
                                icon: Trash2,
                                variant: "ghost",
                            },
                        ]}
                    />
                    <Separator className="my-4" />
                    <Nav
                        links={[
                            {
                                title: "Social",
                                label: "972",
                                icon: InboxIcon, // Use generic for now or specific
                                variant: "ghost",
                            },
                            {
                                title: "Updates",
                                label: "342",
                                icon: InboxIcon,
                                variant: "ghost",
                            },
                            {
                                title: "Forums",
                                label: "128",
                                icon: InboxIcon,
                                variant: "ghost",
                            },
                        ]}
                    />
                </div>

                {/* Mail List */}
                <div className={`${isMobileListVisible ? 'flex' : 'hidden'} md:flex w-full md:w-[320px] lg:w-[380px] flex-col border-r`}>
                    <div className="p-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search" className="pl-8" />
                        </div>
                    </div>
                    <Tabs defaultValue="all" className="flex-1 flex flex-col">
                        <div className="px-4 py-2">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="all">All Mail</TabsTrigger>
                                <TabsTrigger value="unread">Unread</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="all" className="flex-1 mt-0">
                            <MailList
                                emails={emails}
                                selectedId={selectedId}
                                onSelect={handleSelectEmail}
                            />
                        </TabsContent>
                        <TabsContent value="unread" className="flex-1 mt-0">
                            <MailList
                                emails={emails.filter(e => !e.is_read)}
                                selectedId={selectedId}
                                onSelect={handleSelectEmail}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Mail Display / Detail */}
                <div className={`${!isMobileListVisible ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
                    {selectedEmail && !isMobileListVisible && (
                        <div className="md:hidden p-2 border-b bg-muted/20">
                            <button onClick={() => setIsMobileListVisible(true)} className="text-sm text-primary flex items-center gap-1">
                                &larr; Back to list
                            </button>
                        </div>
                    )}
                    <MailDisplay email={selectedEmail} />
                </div>
            </Card>
        </div>
    );
}
