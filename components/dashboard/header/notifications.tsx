"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function Notifications() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Toggle notifications</span>
                    {/* Example notification dot */}
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border border-background"></span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="grid gap-4">
                    <h4 className="font-medium leading-none">Notifications</h4>
                    <div className="text-sm text-muted-foreground">
                        No new notifications.
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
