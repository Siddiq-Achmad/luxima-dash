"use client";

import { VendorPackage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Check, Package as PackageIcon, MoreVertical, Pencil, Trash2, Loader2, EyeIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { deletePackage, createPackage, updatePackage } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { packageSchema } from "@/lib/schemas";
import { z } from "zod";

interface PackagesListProps {
    initialPackages: VendorPackage[];
}

type PackageFormValues = z.infer<typeof packageSchema>;

export function PackagesList({ initialPackages }: PackagesListProps) {
    const router = useRouter();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<VendorPackage | null>(null);

    const handleDelete = async (id: string) => {
        if (id.startsWith('dummy-')) {
            toast.success("Dummy package deleted (simulation)");
            return;
        }

        const result = await deletePackage(id);
        if (result.success) {
            toast.success("Package deleted successfully");
            router.refresh();
        } else {
            toast.error(`Failed to delete package: ${result.error}`);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Packages</h1>
                    <p className="text-muted-foreground">Manage your service packages and pricing.</p>
                </div>
                <PackageDialog
                    open={isAddOpen}
                    onOpenChange={setIsAddOpen}
                    mode="create"
                >
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Package
                    </Button>
                </PackageDialog>
            </div>

            {editingPackage && (
                <PackageDialog
                    open={!!editingPackage}
                    onOpenChange={(open) => !open && setEditingPackage(null)}
                    mode="edit"
                    pkg={editingPackage}
                />
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {initialPackages.map((pkg) => (
                    <Card key={pkg.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <Link href={`/packages/${pkg.id}`}>
                                        <CardTitle className="flex items-center gap-2">
                                            <PackageIcon className="h-5 w-5 text-primary" />
                                            {pkg.name}
                                        </CardTitle>
                                    </Link>
                                    <CardDescription className="mt-1.5 line-clamp-2">{pkg.description || "No description provided."}</CardDescription>
                                </div>
                                <AlertDialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/packages/${pkg.id}`}>
                                                    <EyeIcon className="mr-2 h-4 w-4" />
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setEditingPackage(pkg)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <AlertDialogTrigger asChild>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </AlertDialogTrigger>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the package
                                                &quot;{pkg.name}&quot;.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(pkg.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-3xl font-bold">{formatCurrency(pkg.price)}</div>
                            <ul className="mt-4 space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <li key={i} className="flex items-center text-sm text-muted-foreground">
                                        <Check className="mr-2 h-4 w-4 text-primary" />
                                        Feature included in this package
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function PackageDialog({
    open,
    onOpenChange,
    mode,
    pkg,
    children
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    pkg?: VendorPackage;
    children?: React.ReactNode;
}) {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            name: pkg?.name || "",
            price: pkg?.price || 0,
            description: pkg?.description || "",
            currency: pkg?.currency || "IDR",
            features: pkg?.features as string[] || [],
            inclusions: pkg?.inclusions as string[] || [],
            exclusions: pkg?.exclusions as string[] || [],
            duration_hours: pkg?.duration_hours || 0,
            max_guests: pkg?.max_guests || 0,
        }
    });

    const onSubmit = async (data: PackageFormValues) => {
        if (mode === "create") {
            const result = await createPackage({ ...data, vendor_id: "current-vendor-id" });
            if (result.success) {
                toast.success("Package created successfully");
                onOpenChange(false);
                reset();
                router.refresh();
            } else {
                toast.error(`Failed to create package: ${result.error}`);
            }
        } else if (mode === "edit" && pkg) {
            const result = await updatePackage(pkg.id, data);
            if (result.success) {
                toast.success("Package updated successfully");
                onOpenChange(false);
                router.refresh();
            } else {
                toast.error(`Failed to update package: ${result.error}`);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[800px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Create New Package" : "Edit Package"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create" ? "Add a new service package." : "Update package details and pricing."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Package Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <span className="text-sm text-destructive">{errors.name.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" type="number" {...register("price")} />
                        {errors.price && <span className="text-sm text-destructive">{errors.price.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register("description")} />
                        {errors.description && <span className="text-sm text-destructive">{errors.description.message}</span>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === "create" ? "Create Package" : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
