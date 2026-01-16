import { getPackages } from "@/lib/actions";
import { DUMMY_PACKAGES } from "@/lib/dummy-data";
import { PackagesList } from "@/components/dashboard/packages/packages-list";

export default async function PackagesPage() {
    const packages = await getPackages();
    const displayPackages = packages && packages.length > 0 ? packages : DUMMY_PACKAGES;

    return <PackagesList initialPackages={displayPackages} />;
}
