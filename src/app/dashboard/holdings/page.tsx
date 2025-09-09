import { HoldingsTable } from "@/components/dashboard/holdings-table";
import { AddAssetSheet } from "@/components/dashboard/add-asset-sheet";

export default function HoldingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Your Holdings</h1>
        <AddAssetSheet />
      </div>
      <HoldingsTable />
    </div>
  );
}
