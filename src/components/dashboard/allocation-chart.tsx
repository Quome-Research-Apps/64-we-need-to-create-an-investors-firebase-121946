"use client";

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { usePortfolio } from "@/contexts/portfolio-context";
import { TrendingUp, FileText, Home, Layers, Bitcoin, HelpCircle } from 'lucide-react';

const ASSET_TYPE_STYLES = {
  "Stock": { color: "hsl(var(--chart-1))", icon: TrendingUp },
  "Bond": { color: "hsl(var(--chart-2))", icon: FileText },
  "Mutual Fund": { color: "hsl(var(--chart-3))", icon: Layers },
  "Real Estate": { color: "hsl(var(--chart-4))", icon: Home },
  "Crypto": { color: "hsl(var(--chart-5))", icon: Bitcoin },
  "Other": { color: "hsl(var(--muted))", icon: HelpCircle },
};

export function AllocationChart() {
  const { assets } = usePortfolio();

  const { chartData, chartConfig } = useMemo(() => {
    const allocation: { [key: string]: number } = {};
    let totalValue = 0;

    assets.forEach(asset => {
      const value = asset.currentMarketValue ?? asset.costBasis;
      if (!allocation[asset.assetType]) {
        allocation[asset.assetType] = 0;
      }
      allocation[asset.assetType] += value;
      totalValue += value;
    });

    const chartData = Object.entries(allocation).map(([assetType, value]) => ({
      assetType,
      value,
      fill: ASSET_TYPE_STYLES[assetType as keyof typeof ASSET_TYPE_STYLES]?.color || ASSET_TYPE_STYLES["Other"].color,
    }));
    
    const chartConfig: ChartConfig = chartData.reduce((acc, { assetType }) => {
        const style = ASSET_TYPE_STYLES[assetType as keyof typeof ASSET_TYPE_STYLES] || ASSET_TYPE_STYLES["Other"];
        acc[assetType] = {
            label: assetType,
            color: style.color,
            icon: style.icon,
        };
        return acc;
    }, {} as ChartConfig);

    return { chartData, chartConfig };
  }, [assets]);

  if (assets.length === 0) {
    return (
       <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
          <CardDescription>Distribution of your investments by type.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Add assets to see your allocation.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Distribution of your investments by type.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
             <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel indicator="dot" />}
            />
            <Pie data={chartData} dataKey="value" nameKey="assetType" innerRadius="60%" labelLine={false} label>
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.assetType}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
