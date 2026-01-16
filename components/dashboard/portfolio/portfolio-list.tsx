"use client";

import { VendorImage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Image as ImageIcon, MoreVertical, Pencil, Trash2, Loader2, EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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

import { deletePortfolioItem, createPortfolioItem, updatePortfolioItem } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { portfolioSchema } from "@/lib/schemas";
import { z } from "zod";

interface PortfolioListProps {
    initialItems: VendorImage[];
}

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

export function PortfolioList({ initialItems }: PortfolioListProps) {
    const router = useRouter();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<VendorImage | null>(null);

    const handleDelete = async (id: string) => {
        if (id.startsWith('img-')) {
            toast.success("Dummy item deleted (simulation)");
            return;
        }

        const result = await deletePortfolioItem(id);
        if (result.success) {
            toast.success("Item deleted successfully");
            router.refresh();
        } else {
            toast.error(`Failed to delete item: ${result.error}`);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
                    <p className="text-muted-foreground">Showcase your best work to potential clients.</p>
                </div>
                <PortfolioDialog
                    open={isAddOpen}
                    onOpenChange={setIsAddOpen}
                    mode="create"
                >
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Upload Image
                    </Button>
                </PortfolioDialog>
            </div>

            {editingItem && (
                <PortfolioDialog
                    open={!!editingItem}
                    onOpenChange={(open) => !open && setEditingItem(null)}
                    mode="edit"
                    item={editingItem}
                />
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {initialItems.map((item) => (
                    <Card key={item.id} className="group overflow-hidden pt-0">
                        <div className="relative aspect-square w-full">
                            <Image
                                src={item.image_url}
                                alt={item.caption || "Portfolio image"}
                                fill
                                className="object-cover transition-all group-hover:scale-105"
                            />
                            <Link href={`/portfolio/${item.id}`} className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-all group-hover:opacity-100 group-hover:scale-105">
                                <Button variant="secondary" size="sm" asChild>
                                    <span>
                                        <ImageIcon className="mr-2 h-4 w-4" /> View Details
                                    </span>
                                </Button>
                            </Link>
                        </div>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold line-clamp-1">{item.caption || "Untitled"}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{item.album_name || "Uncategorized"}</p>
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
                                                <Link href={`/portfolio/${item.id}`}>
                                                    <EyeIcon className="mr-2 h-4 w-4" />
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setEditingItem(item)}>
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
                                                This will permanently delete this image from your portfolio.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <span className="text-xs text-muted-foreground mt-2 block">
                                Uploaded on {new Date(item.created_at).toLocaleDateString()}
                            </span>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function PortfolioDialog({
    open,
    onOpenChange,
    mode,
    item,
    children
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    item?: VendorImage;
    children?: React.ReactNode;
}) {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(portfolioSchema),
        defaultValues: {
            image_url: item?.image_url || "",
            caption: item?.caption || "",
            alt_text: item?.alt_text || "",
            sort_order: item?.sort_order || 0,
            album_name: item?.album_name || "",
        }
    });

    const onSubmit = async (data: PortfolioFormValues) => {
        if (mode === "create") {
            const result = await createPortfolioItem({ ...data, vendor_id: "current-vendor-id" });
            if (result.success) {
                toast.success("Image added to portfolio");
                onOpenChange(false);
                reset();
                router.refresh();
            } else {
                toast.error(`Failed to add image: ${result.error}`);
            }
        } else if (mode === "edit" && item) {
            const result = await updatePortfolioItem(item.id, data);
            if (result.success) {
                toast.success("Portfolio item updated");
                onOpenChange(false);
                router.refresh();
            } else {
                toast.error(`Failed to update item: ${result.error}`);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[800px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Add Portfolio Image" : "Edit Image Details"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create" ? "Add a new image to your portfolio." : "Update caption or album."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input id="image_url" {...register("image_url")} placeholder="https://..." />
                        {errors.image_url && <span className="text-sm text-destructive">{errors.image_url.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="caption">Caption</Label>
                        <Input id="caption" {...register("caption")} />
                        {errors.caption && <span className="text-sm text-destructive">{errors.caption.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="alt_text">Alt Text</Label>
                        <Input id="alt_text" {...register("alt_text")} />
                        {errors.alt_text && <span className="text-sm text-destructive">{errors.alt_text.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="album_name">Album Name</Label>
                        <Input id="album_name" {...register("album_name")} />
                        {errors.album_name && <span className="text-sm text-destructive">{errors.album_name.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="sort_order">Sort Order</Label>
                        <Input id="sort_order" type="number" {...register("sort_order", { valueAsNumber: true })} />
                        {errors.sort_order && <span className="text-sm text-destructive">{errors.sort_order.message}</span>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === "create" ? "Add Image" : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
