"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { usePortfolio } from "@/contexts/portfolio-context";
import { AlertCircle, BrainCircuit, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AppraisalView() {
  const { assessment, isAssessing } = usePortfolio();

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <CardTitle>AI Appraisal Projection</CardTitle>
        </div>
        <CardDescription>An AI-powered assessment of your current holdings.</CardDescription>
      </CardHeader>
      <CardContent>
        {isAssessing && !assessment && (
             <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Assessing your portfolio...</p>
             </div>
        )}

        {!isAssessing && !assessment && (
            <div className="text-center text-muted-foreground h-40 flex items-center justify-center">
                <p>Add a new asset to generate an appraisal.</p>
            </div>
        )}

        {assessment && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Overall Assessment</h3>
              <p className="text-sm text-muted-foreground">{assessment.overallAssessment}</p>
            </div>
            
            {assessment.clarificationNeeded.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Clarification Needed
                </h3>
                <div className="space-y-3">
                  {assessment.clarificationNeeded.map((item, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-semibold">{item.assetName}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Missing details: {item.missingDetails.map(detail => (
                            <Badge key={detail} variant="secondary" className="mr-1">{detail}</Badge>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {assessment.clarificationNeeded.length === 0 && (
                <p className="text-sm text-green-600">All asset details are clear.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
