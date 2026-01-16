"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Customer } from "@/lib/types";
import { createCustomer, updateCustomer } from "@/lib/actions/customer";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const customerSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    status: z.enum(["active", "inactive", "lead"]),
    source: z.string().optional(),
    notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerDialogProps {
    customer?: Customer;
    onSuccess?: (customer: Customer) => void;
    trigger?: React.ReactNode;
}

export function CustomerDialog({ customer, onSuccess, trigger }: CustomerDialogProps) {
    const [open, setOpen] = useState(false);
    const isEditing = !!customer;

    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            full_name: customer?.full_name || "",
            email: customer?.email || "",
            phone: customer?.phone || "",
            status: (customer?.status as "active" | "inactive" | "lead") || "lead",
            source: customer?.source || "",
            notes: customer?.notes || "",
        },
    });

    const onSubmit = async (data: CustomerFormValues) => {
        try {
            if (isEditing && customer) {
                const result = await updateCustomer(customer.id, data);
                if (result.success && result.data) {
                    toast.success("Customer updated successfully");
                    onSuccess?.(result.data);
                    setOpen(false);
                }
            } else {
                const result = await createCustomer(data);
                if (result.success && result.data) {
                    toast.success("Customer created successfully");
                    onSuccess?.(result.data);
                    setOpen(false);
                    form.reset();
                }
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Customer
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Customer" : "Add Customer"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update customer details." : "Add a new customer to your CRM."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+62 812..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="lead">Lead</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="source"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Instagram, etc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Any notes..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">{isEditing ? "Save Changes" : "Create Customer"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
