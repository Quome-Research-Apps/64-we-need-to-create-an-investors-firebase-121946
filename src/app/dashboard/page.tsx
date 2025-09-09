import { OverviewCards } from "@/components/dashboard/overview-cards";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { AllocationChart } from "@/components/dashboard/allocation-chart";
import { AppraisalView } from "@/components/dashboard/appraisal-view";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-3">
            <OverviewCards />
        </div>
        <div className="lg:col-span-2">
            <PerformanceChart />
        </div>
        <div className="lg:col-span-1">
            <AllocationChart />
        </div>
         <div className="lg:col-span-3">
            <AppraisalView />
        </div>
    </div>
  );
}
