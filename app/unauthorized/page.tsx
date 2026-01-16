import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { baseUrl } from "@/lib/constants";

export default function UnauthorizedPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-destructive/10 p-3">
                            <ShieldAlert className="h-10 w-10 text-destructive" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">401 Unauthorized</CardTitle>
                    <CardDescription>
                        You do not have permission to access this page. Please log in to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Optional content or illustration could go here */}
                </CardContent>
                <CardFooter className="flex justify-center gap-2">
                    <Button asChild variant="outline">
                        <Link href="/">Go Home</Link>
                    </Button>
                    <Button asChild>
                        <Link href={`https://auth.luxima.id/?redirect=${baseUrl}`} >Log In</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
