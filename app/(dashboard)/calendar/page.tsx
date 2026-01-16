
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/calendar/calendar";
import { CalendarSkeleton } from "@/components/calendar/skeletons/calendar-skeleton";
import { Suspense } from "react";
import { Calendar1Icon } from "lucide-react";

export default function CalendarPage() {
    return (


        <Suspense fallback={<CalendarSkeleton />}>
            <Calendar />
        </Suspense>


    );
}
