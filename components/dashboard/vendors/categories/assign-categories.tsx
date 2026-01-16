"use client";

import { Category, VendorCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { updateVendorCategories } from "@/lib/actions/vendor-categories";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

interface AssignCategoriesProps {
    vendorId: string;
    allCategories: Category[];
    currentAssignments: VendorCategory[];
}

export function AssignCategories({ vendorId, allCategories, currentAssignments }: AssignCategoriesProps) {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<string[]>(
        currentAssignments.map(vc => vc.category_id)
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = (categoryId: string) => {
        setSelectedIds(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateVendorCategories(vendorId, selectedIds);
            toast.success("Categories updated successfully");
            router.refresh();
        } catch {
            toast.error("Failed to update categories");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Vendor Categories</CardTitle>
                <CardDescription>Select the categories that apply to this vendor.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allCategories.map((category) => (
                        <div key={category.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer" onClick={() => handleToggle(category.id)}>
                            <Checkbox
                                id={category.id}
                                checked={selectedIds.includes(category.id)}
                                onCheckedChange={() => handleToggle(category.id)}
                            />
                            <div className="grid gap-1.5 leading-none pointer-events-none">
                                <Label htmlFor={category.id} className="font-medium cursor-pointer">
                                    {category.name}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {category.description || category.slug}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
                <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </CardFooter>
        </Card>
    );
}
