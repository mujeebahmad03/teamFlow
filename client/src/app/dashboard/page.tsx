import { dashboardRoutes } from "@/config";
import { DashboardLayoutContent } from "@/dashboard/components/layout";
import { DashboardPage } from "@/dashboard/page";

const crumbs = [{ label: "Home", href: dashboardRoutes.dashboard }];

export default function Page() {
  return (
    <DashboardLayoutContent breadcrumbs={crumbs} currentPage="Overview">
      <DashboardPage />
    </DashboardLayoutContent>
  );
}
