import { getPortfolio } from "@/lib/actions";
import { DUMMY_PORTFOLIO } from "@/lib/dummy-data";
import { PortfolioList } from "@/components/dashboard/portfolio/portfolio-list";

export default async function PortfolioPage() {
    const items = await getPortfolio();
    const displayItems = items && items.length > 0 ? items : DUMMY_PORTFOLIO;

    return <PortfolioList initialItems={displayItems} />;
}
