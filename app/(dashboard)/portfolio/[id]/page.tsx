import { DUMMY_PORTFOLIO } from "@/lib/dummy-data";
import { getPortfolioById } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, Layers, MoveVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const item = await getPortfolioById(id) || DUMMY_PORTFOLIO.find((p) => p.id === id);

    if (!item) {
        return {
            title: "Portfolio Not Found",
        };
    }

    return {
        title: item.caption || "Portfolio Item",
        description: item.alt_text || "Portfolio detail",
        openGraph: {
            images: [item.image_url],
        },
    };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
    const { id } = await params;

    // Try DB first
    let item = await getPortfolioById(id);

    // Fallback to dummy
    if (!item) {
        item = DUMMY_PORTFOLIO.find((p) => p.id === id) || null;
    }

    if (!item) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto h-auto">
            <div className="flex items-center gap-4 flex-none">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/portfolio">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Portfolio Details</h1>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
                <div className="relative flex-1 rounded-lg border bg-transparent shadow-lg overflow-hidden min-h-[400px]">
                    <Image
                        src={item.image_url}
                        alt={item.alt_text || item.caption || "Portfolio Image"}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="lg:w-80 space-y-6 flex-none overflow-y-auto">
                    <div>
                        <h2 className="text-2xl font-bold">{item.caption}</h2>
                        {item.album_name && (
                            <p className="text-muted-foreground mt-1 flex items-center gap-2">
                                <Layers className="h-4 w-4" /> {item.album_name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Date Uploaded:</span>
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                        {item.sort_order !== undefined && (
                            <div className="flex items-center gap-2 text-sm">
                                <MoveVertical className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Sort Order:</span>
                                <span>{item.sort_order}</span>
                            </div>
                        )}
                        {item.alt_text && (
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="font-medium text-muted-foreground">Alt Text:</span>
                                <span>{item.alt_text}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Description</h3>
                        <p className="text-sm text-muted-foreground">
                            {item.caption || "No description provided."}
                        </p>
                    </div>

                    <div className="pt-4 border-t">
                        <Button className="w-full">Edit Image Details</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
