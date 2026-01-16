import { Suspense } from "react";
import { getCustomers } from "@/lib/actions/customer";
import { CustomerList } from "@/components/dashboard/customers/customer-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default async function CustomersPage() {
    const customers = await getCustomers();

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                <p className="text-muted-foreground">
                    Manage your relationships, leads, and client details.
                </p>
            </div>


            <Suspense fallback={<div>Loading customers...</div>}>
                <CustomerList initialData={customers} />
            </Suspense>

        </div>
    );
}
