"use client";

import { useMemo, useState, useEffect } from "react";
import { usePortfolio } from "@/contexts/portfolio-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, FileText, Home, Layers, Bitcoin, HelpCircle, ArrowUp, ArrowDown } from "lucide-react";
import type { Asset } from "@/lib/types";

const ASSET_TYPE_ICONS: { [key: string]: React.ElementType } = {
  Stock: TrendingUp,
  Bond: FileText,
  "Mutual Fund": Layers,
  "Real Estate": Home,
  Crypto: Bitcoin,
  Other: HelpCircle,
};

function SimulatedMarketValue({ asset }: { asset: Asset }) {
    const [simulatedValue, setSimulatedValue] = useState(asset.currentMarketValue ?? asset.costBasis);
  
    useEffect(() => {
      // Simulate market fluctuations only on the client
      if (asset.currentMarketValue === undefined) {
        const randomFactor = 0.8 + Math.random() * 0.4; // between 0.8 and 1.2
        setSimulatedValue(asset.costBasis * randomFactor);
      } else {
        setSimulatedValue(asset.currentMarketValue);
      }
    }, [asset]);
  
    const gainLoss = simulatedValue - asset.costBasis;
    const gainLossPercent = asset.costBasis > 0 ? (gainLoss / asset.costBasis) * 100 : 0;
    const isGain = gainLoss > 0;
    const isLoss = gainLoss < 0;
  
    return (
      <>
        <TableCell className="text-right font-medium">{formatCurrency(simulatedValue)}</TableCell>
        <TableCell className="text-right">
          <div className={`flex items-center justify-end gap-1 font-medium ${isGain ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-muted-foreground'}`}>
            {isGain && <ArrowUp className="h-3 w-3" />}
            {isLoss && <ArrowDown className="h-3 w-3" />}
            <span>{formatCurrency(gainLoss)}</span>
          </div>
          <div className="text-xs text-muted-foreground">{gainLossPercent.toFixed(2)}%</div>
        </TableCell>
      </>
    );
  }

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
};
  

export function HoldingsTable() {
  const { assets } = usePortfolio();

  const sortedAssets = useMemo(() => {
    return [...assets].sort((a, b) => (b.currentMarketValue ?? b.costBasis) - (a.currentMarketValue ?? a.costBasis));
  }, [assets]);

  if (assets.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Holdings</CardTitle>
                <CardDescription>A detailed summary of your investment holdings.</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">You have no assets. Add one to get started.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
        <CardDescription>A detailed summary of your investment holdings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Cost Basis</TableHead>
              <TableHead className="text-right">Current Value</TableHead>
              <TableHead className="text-right">Total Gain/Loss</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAssets.map((asset) => {
              const Icon = ASSET_TYPE_ICONS[asset.assetType] || HelpCircle;
              return (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.assetName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="flex items-center gap-2 w-fit">
                      <Icon className="h-3 w-3" />
                      <span>{asset.assetType}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{asset.quantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{formatCurrency(asset.costBasis)}</TableCell>
                  <SimulatedMarketValue asset={asset} />
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
