import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DUMMY_POSTS } from "@/lib/dummy-data";
import { getPostBySlug } from "@/lib/actions";
import { Calendar, ChevronLeft, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    // Try to get from DB first, then dummy
    const post = await getPostBySlug(slug) || DUMMY_POSTS.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: post.title,
        description: post.description,
        openGraph: {
            images: post.cover_image ? [post.cover_image] : [],
        },
    };
}

export default async function PostDetailPage({ params }: PageProps) {
    const { slug } = await params;

    // Try to get from DB first
    let post = await getPostBySlug(slug);

    // If not found, check dummy data
    if (!post) {
        post = DUMMY_POSTS.find((p) => p.slug === slug) || null;
    }

    if (!post) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/posts">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Post Details</h1>
                    <p className="text-muted-foreground">{post.slug}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                    {post.cover_image || post.image_url ? (
                        <Image
                            src={post.cover_image || post.image_url || ""}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <span className="text-muted-foreground">No Image Available</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            {new Date(post.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <User className="mr-1 h-4 w-4" />
                            Author ID: {post.author_id}
                        </div>
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        {post.title}
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {post.description}
                    </p>

                    <div className="prose prose-gray dark:prose-invert max-w-none">
                        <p>{post.content}</p>
                        {/* In a real app, this would be a Markdown renderer or HTML content */}
                    </div>
                </div>
            </div>
        </div>
    );
}
