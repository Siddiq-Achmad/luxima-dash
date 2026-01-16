
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tablesToCheck = [
    "posts",
    "categories",
    "tags",
    "vendors",
    "vendor_categories",
    "vendor_images",
    "vendor_packages",
    "profiles",
    "bookings",
    "tenants",
    "tenant_members",
    "invoices",
    "payments",
    "payment_methods",
    "payment_transactions",
    "usage_records"
];

async function inspectTable(tableName: string) {
    console.log(`\n--- Inspecting ${tableName} ---`);
    const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(1);

    if (error) {
        console.log(`Error accessing '${tableName}': ${error.message} (Code: ${error.code})`);

        // Try singular if plural failed
        if (tableName.endsWith('s')) {
            const singular = tableName.slice(0, -1);
            console.log(`  > Retrying with singular '${singular}'...`);
            const { data: sData, error: sError } = await supabase.from(singular).select("*").limit(1);
            if (!sError) {
                console.log(`  > Success with '${singular}'!`);
                if (sData && sData.length > 0) {
                    // Print columns and their types
                    const row = sData[0];
                    const columns = Object.keys(row);
                    console.log(`  Columns: ${columns.join(", ")}`);
                    const types = columns.map(col => `${col}: ${typeof row[col]}`).join(", ");
                    console.log(`  Types: ${types}`);
                } else {
                    console.log(`  Table '${singular}' exists but is empty.`);
                }
                return;
            }
        }
        return;
    }

    if (data && data.length > 0) {
        const row = data[0];
        const columns = Object.keys(row);
        console.log(`  Columns: ${columns.join(", ")}`);
        const types = columns.map(col => `${col}: ${typeof row[col]}`).join(", ");
        console.log(`  Types: ${types}`);
    } else {
        console.log(`  Table '${tableName}' exists but is empty. Cannot infer columns.`);
    }
}

async function main() {
    console.log("Starting Full Schema Inspection...");
    for (const table of tablesToCheck) {
        await inspectTable(table);
    }
}

main();
