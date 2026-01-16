import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole } from "lucide-react";

export default function ForbiddenPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-warning/10 p-3">
                            <LockKeyhole className="h-10 w-10 text-orange-500" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">403 Forbidden</CardTitle>
                    <CardDescription>
                        You have authenticated, but you do not have permission to access this resource.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-sm text-muted-foreground">
                        If you believe this is a mistake, please contact your workspace administrator.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center gap-2">
                    <Button asChild variant="outline">
                        <Link href="/">Go Back</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/organization">Check Permissions</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
