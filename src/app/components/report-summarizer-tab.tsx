"use client";

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { summarizeHospitalReport, type SummarizeReportOutput } from "@/ai/flows/summarize-hospital-report";
import { fileToDataURL } from "@/lib/utils";
import { FileText, Loader2, UploadCloud, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportSummarizerTab() {
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportFileName, setReportFileName] = useState<string>('');
  const [summaryResult, setSummaryResult] = useState<SummarizeReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReportFile(file);
      setReportFileName(file.name);
      setSummaryResult(null);
    }
  };

  const handleSummarizeReport = async () => {
    if (!reportFile) {
      toast({ title: "No File Selected", description: "Please upload a hospital report first.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setSummaryResult(null);
    try {
      const reportDataUri = await fileToDataURL(reportFile);
      const result = await summarizeHospitalReport({ reportDataUri });
      setSummaryResult(result);
      toast({ title: "Summarization Complete", description: "Hospital report summarized successfully.", variant: "default" });
    } catch (error) {
      console.error("Report summarization error:", error);
      toast({ title: "Summarization Failed", description: "Could not summarize the report. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-headline">
            <FileText className="h-6 w-6 text-primary" />
            Hospital Report Summarizer
          </CardTitle>
          <CardDescription>Upload a hospital report (e.g., PDF, TXT) to get a concise AI-generated summary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="report-upload" className="text-base">Upload Report File</Label>
            <div className="flex items-center gap-3">
              <Input id="report-upload" type="file" accept=".pdf,.txt,.doc,.docx,image/*" onChange={handleFileChange} className="max-w-xs text-sm" />
               <Button onClick={handleSummarizeReport} disabled={!reportFile || isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                Summarize Report
              </Button>
            </div>
            {reportFileName && <p className="text-sm text-muted-foreground mt-1">Selected file: {reportFileName}</p>}
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Summarizing Report...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      )}

      {summaryResult && !isLoading && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl sm:text-2xl">
               <CheckCircle className="h-6 w-6 text-green-500" />
              Report Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 whitespace-pre-wrap">{summaryResult.summary}</p>
          </CardContent>
        </Card>
      )}

      {!reportFile && !isLoading && !summaryResult && (
        <Card className="shadow-lg border-dashed border-primary/50">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 mx-auto text-primary/70 mb-3" />
            <p className="text-lg font-medium text-muted-foreground">Upload a hospital report to get a summary.</p>
            <p className="text-sm text-muted-foreground">Supported formats: PDF, TXT, DOC, DOCX, images.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
