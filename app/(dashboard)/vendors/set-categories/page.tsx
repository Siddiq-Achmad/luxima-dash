import { AssignCategories } from "@/components/dashboard/vendors/categories/assign-categories";
import { getCategories } from "@/lib/actions/categories";
import { getVendorCategories } from "@/lib/actions/vendor-categories";
import { DUMMY_VENDOR } from "@/lib/dummy-data";
import { Separator } from "@/components/ui/separator";

export default async function SetVendorCategoriesPage() {
    // In a real app, we would get the vendor ID from the session or URL
    const vendorId = DUMMY_VENDOR.id;

    const allCategories = await getCategories();
    const currentAssignments = await getVendorCategories(vendorId);

    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Set Vendor Categories</h1>
                <p className="text-muted-foreground">
                    Choose which categories your services belong to.
                </p>
            </div>
            <Separator />
            <AssignCategories
                vendorId={vendorId}
                allCategories={allCategories}
                currentAssignments={currentAssignments}
            />
        </div>
    );
}
