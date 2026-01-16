"use client";

import { Post } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MoreVertical, Pencil, Trash2, Loader2, EyeIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

import { deletePost, createPost, updatePost } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "@/lib/schemas";
import { z } from "zod";

interface PostsListProps {
    initialPosts: Post[];
}

type PostFormValues = z.infer<typeof postSchema>;

export function PostsList({ initialPosts }: PostsListProps) {
    const router = useRouter();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    const handleDelete = async (id: string) => {
        if (id.startsWith('post-')) {
            toast.success("Dummy post deleted (simulation)");
            return;
        }

        const result = await deletePost(id);
        if (result.success) {
            toast.success("Post deleted successfully");
            router.refresh();
        } else {
            toast.error(`Failed to delete post: ${result.error}`);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
                    <p className="text-muted-foreground">Manage your blog posts and articles.</p>
                </div>

                <PostDialog
                    open={isAddOpen}
                    onOpenChange={setIsAddOpen}
                    mode="create"
                >
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Post
                    </Button>
                </PostDialog>
            </div>

            {editingPost && (
                <PostDialog
                    open={!!editingPost}
                    onOpenChange={(open) => !open && setEditingPost(null)}
                    mode="edit"
                    post={editingPost}
                />
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {initialPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden pt-0">
                        <div className="relative aspect-video w-full">
                            {post.cover_image ? (
                                <Link href={`/posts/${post.slug}`}>
                                    <Image
                                        src={post.cover_image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-all hover:scale-105"
                                    />
                                </Link>
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <span className="text-muted-foreground">No Image </span>
                                </div>
                            )}
                        </div>
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant={post.published ? "default" : "secondary"}>
                                    {post.published ? "Published" : "Draft"}
                                </Badge>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                    <AlertDialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>

                                                    <Link href={`/posts/${post.slug}`}>
                                                        <EyeIcon className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setEditingPost(post)}>
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
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the post
                                                    &quot;{post.title}&quot;.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                            <Link href={`/posts/${post.slug}`} className="hover:underline">
                                <CardTitle className="line-clamp-1 text-lg">{post.title}</CardTitle>
                            </Link>
                            <CardDescription className="line-clamp-2">
                                {post.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function PostDialog({
    open,
    onOpenChange,
    mode,
    post,
    children
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    post?: Post;
    children?: React.ReactNode;
}) {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: post?.title || "",
            description: post?.description || "",
            content: post?.content || "",
            image_url: post?.image_url || "",
            cover_image: post?.cover_image || "",
            published: post?.published ?? false,
            slug: post?.slug || "",
            category_id: post?.category_id || "",
            tags: post?.tags as string[] || [],
        }
    });

    const onSubmit = async (data: PostFormValues) => {
        if (mode === "create") {
            const result = await createPost({ ...data, author_id: "current-user-id" }); // TODO: Get actual user ID
            if (result.success) {
                toast.success("Post created successfully");
                onOpenChange(false);
                reset();
                router.refresh();
            } else {
                toast.error(`Failed to create post: ${result.error}`);
            }
        } else if (mode === "edit" && post) {
            const result = await updatePost(post.id, data);
            if (result.success) {
                toast.success("Post updated successfully");
                onOpenChange(false);
                router.refresh();
            } else {
                toast.error(`Failed to update post: ${result.error}`);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[800px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Create New Post" : "Edit Post"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create" ? "Add a new blog post to your site." : "Update existing post details."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title")} />
                        {errors.title && <span className="text-sm text-destructive">{errors.title.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" {...register("slug")} />
                        {errors.slug && <span className="text-sm text-destructive">{errors.slug.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="category_id">Category ID</Label>
                        <Input id="category_id" {...register("category_id")} placeholder="UUID" />
                        {errors.category_id && <span className="text-sm text-destructive">{errors.category_id.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register("description")} />
                        {errors.description && <span className="text-sm text-destructive">{errors.description.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea id="content" className="h-32" {...register("content")} />
                        {errors.content && <span className="text-sm text-destructive">{errors.content.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cover_image">Cover Image URL</Label>
                        <Input id="cover_image" {...register("cover_image")} placeholder="https://..." />
                        {errors.cover_image && <span className="text-sm text-destructive">{errors.cover_image.message}</span>}
                    </div>
                    {/* Kept for backward compatibility if needed, else hide or remove */}
                    <div className="grid gap-2">
                        <Label htmlFor="image_url">Legacy Image URL</Label>
                        <Input id="image_url" {...register("image_url")} placeholder="https://..." />
                        {errors.image_url && <span className="text-sm text-destructive">{errors.image_url.message}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="published">Published</Label>
                        <input type="checkbox" id="published" className="h-4 w-4" {...register("published")} />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === "create" ? "Create" : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
