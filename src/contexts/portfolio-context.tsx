"use client";

import { assessHoldings } from "@/ai/flows/appraisal-projection";
import type { Asset, AssessmentResults } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

// Mock data for initial state
const initialAssets: Asset[] = [
  {
    id: "1",
    assetName: "Apple Inc.",
    assetType: "Stock",
    quantity: 150,
    costBasis: 15000,
    currentMarketValue: 28500,
  },
  {
    id: "2",
    assetName: "Vanguard S&P 500 ETF",
    assetType: "Mutual Fund",
    quantity: 50,
    costBasis: 20000,
    currentMarketValue: 25000,
  },
  {
    id: "3",
    assetName: "US Treasury Bond",
    assetType: "Bond",
    quantity: 10,
    costBasis: 9800,
    currentMarketValue: 10200,
  },
  {
    id: "4",
    assetName: "Rental Property",
    assetType: "Real Estate",
    quantity: 1,
    costBasis: 250000,
  },
  {
    id: "5",
    assetName: "Bitcoin",
    assetType: "Crypto",
    quantity: 0.5,
    costBasis: 15000,
    currentMarketValue: 32500,
  },
];

interface PortfolioContextType {
  assets: Asset[];
  assessment: AssessmentResults | null;
  addAsset: (asset: Omit<Asset, "id">) => Promise<void>;
  isAssessing: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [assessment, setAssessment] = useState<AssessmentResults | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const { toast } = useToast();

  const addAsset = useCallback(
    async (assetData: Omit<Asset, "id">) => {
      const newAsset: Asset = { ...assetData, id: crypto.randomUUID() };
      const updatedAssets = [...assets, newAsset];
      setAssets(updatedAssets);
      
      setIsAssessing(true);
      try {
        const holdingsForAI = updatedAssets.map(
          ({ assetName, assetType, quantity, costBasis, currentMarketValue }) => ({
            assetName,
            assetType,
            quantity,
            costBasis,
            currentMarketValue,
          })
        );
        const newAssessment = await assessHoldings(holdingsForAI);
        setAssessment(newAssessment);
        toast({
          title: "Asset Added",
          description: "Your new asset has been added and your portfolio re-assessed.",
        });
      } catch (error) {
        console.error("Failed to assess holdings:", error);
        toast({
          variant: "destructive",
          title: "Assessment Failed",
          description: "Could not get an AI assessment for your updated portfolio.",
        });
      } finally {
        setIsAssessing(false);
      }
    },
    [assets, toast]
  );
  
  const value = useMemo(() => ({ assets, assessment, addAsset, isAssessing }), [assets, assessment, addAsset, isAssessing]);

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
