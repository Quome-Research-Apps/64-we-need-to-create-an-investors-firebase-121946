"use client";

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { usePortfolio } from "@/contexts/portfolio-context";

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function PerformanceChart() {
  const { assets } = usePortfolio();

  const totalInitialValue = useMemo(() => 
    assets.reduce((sum, asset) => sum + asset.costBasis, 0),
  [assets]);

  const chartData = useMemo(() => {
    const data = [];
    const days = 365;
    let currentValue = totalInitialValue;

    if (totalInitialValue === 0) {
      return [];
    }
    
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Simulate some volatility
        const randomFactor = (Math.random() - 0.49) * 0.03; // Daily fluctuation
        const growthFactor = 1 + (i / days) * 0.2; // Gradual growth over the year
        
        currentValue *= (1 + randomFactor);
        
        let displayValue = totalInitialValue * growthFactor * (1 + randomFactor);
        if (i === days) displayValue = totalInitialValue;

        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: date.toISOString().split('T')[0],
            value: Math.max(0, displayValue), // Ensure value doesn't drop below zero
        });
    }

    // Adjust the last point to be the current total value
    const currentTotalValue = assets.reduce((sum, asset) => sum + (asset.currentMarketValue ?? asset.costBasis), 0);
    if(data.length > 0) {
        data[data.length - 1].value = currentTotalValue;
    }

    return data;
  }, [totalInitialValue, assets]);

  if (assets.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Historical Performance</CardTitle>
          <CardDescription>Your portfolio's value over the last year.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Add assets to see your performance history.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Performance</CardTitle>
        <CardDescription>Your portfolio's value over the last year.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value, index) => {
                if(chartData.length > 0 && (index === 0 || index === chartData.length-1 || index % Math.floor(chartData.length/5) === 0)) {
                    return value;
                }
                return "";
              }}
            />
             <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
            />
            <Tooltip
              cursor
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name, props) => (
                    <div>
                        <p className="font-bold text-foreground">{`$${Number(value).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</p>
                        <p className="text-sm text-muted-foreground">{new Date(props.payload.fullDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  )}
                />
              }
            />
            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillValue)"
              stroke="var(--color-value)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
