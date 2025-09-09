"use client";
import { useEffect, useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { usePortfolio } from "@/contexts/portfolio-context";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export function OverviewCards() {
  const { assets } = usePortfolio();
  const [simulatedDayChange, setSimulatedDayChange] = useState(0);
  const [simulatedDayChangePercent, setSimulatedDayChangePercent] = useState(0);

  const portfolioMetrics = useMemo(() => {
    let totalValue = 0;
    let totalCostBasis = 0;
    
    assets.forEach(asset => {
      // Use current market value if available, otherwise use cost basis for calculation
      const value = asset.currentMarketValue ?? asset.costBasis;
      totalValue += value;
      totalCostBasis += asset.costBasis;
    });

    const totalGainLoss = totalValue - totalCostBasis;
    const totalGainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

    return { totalValue, totalCostBasis, totalGainLoss, totalGainLossPercent };
  }, [assets]);

  useEffect(() => {
    // Simulate a 24-hour change. This runs only on the client.
    const randomFactor = (Math.random() - 0.5) * 0.05; // between -2.5% and +2.5%
    const change = portfolioMetrics.totalValue * randomFactor;
    const changePercent = randomFactor * 100;
    setSimulatedDayChange(change);
    setSimulatedDayChangePercent(changePercent);
  }, [portfolioMetrics.totalValue]);


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  const DayChangeIcon = simulatedDayChange > 0 ? ArrowUpRight : simulatedDayChange < 0 ? ArrowDownRight : Minus;
  const dayChangeColor = simulatedDayChange > 0 ? 'text-green-600' : simulatedDayChange < 0 ? 'text-red-600' : 'text-muted-foreground';

  const TotalGainLossIcon = portfolioMetrics.totalGainLoss > 0 ? ArrowUpRight : portfolioMetrics.totalGainLoss < 0 ? ArrowDownRight : Minus;
  const totalGainLossColor = portfolioMetrics.totalGainLoss > 0 ? 'text-green-600' : portfolioMetrics.totalGainLoss < 0 ? 'text-red-600' : 'text-muted-foreground';


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(portfolioMetrics.totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            Total value of all your assets
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gain / Loss</CardTitle>
           <TotalGainLossIcon className={`h-4 w-4 ${totalGainLossColor}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalGainLossColor}`}>{formatCurrency(portfolioMetrics.totalGainLoss)}</div>
          <p className="text-xs text-muted-foreground">
            {portfolioMetrics.totalGainLossPercent.toFixed(2)}% all-time return
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Performance</CardTitle>
          <DayChangeIcon className={`h-4 w-4 ${dayChangeColor}`} />
        </CardHeader>
        <CardContent>
           <div className={`text-2xl font-bold ${dayChangeColor}`}>{formatCurrency(simulatedDayChange)}</div>
          <p className="text-xs text-muted-foreground">
            {simulatedDayChangePercent.toFixed(2)}% in the last 24 hours
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
