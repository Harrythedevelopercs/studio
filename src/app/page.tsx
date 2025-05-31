"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WoundAnalysisTab from "./components/wound-analysis-tab";
import ReportSummarizerTab from "./components/report-summarizer-tab";
import UrgentCareTab from "./components/urgent-care-tab";
import { ScanLine, FileText, MapPin, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 bg-background">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary font-headline flex items-center justify-center gap-3">
          <Sparkles className="h-10 w-10 text-accent" />
          WoundAI
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Intelligent Wound Analysis &amp; Care Assistance
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <Tabs defaultValue="wound-analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 mb-6 p-1.5 bg-secondary rounded-lg shadow-sm">
            <TabsTrigger value="wound-analysis" className="text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
              <ScanLine className="h-4 w-4 sm:h-5 sm:w-5" /> Wound Analysis
            </TabsTrigger>
            <TabsTrigger value="report-summarizer" className="text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" /> Report Summarizer
            </TabsTrigger>
            <TabsTrigger value="urgent-care" className="text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" /> Urgent Care
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wound-analysis">
            <WoundAnalysisTab />
          </TabsContent>
          <TabsContent value="report-summarizer">
            <ReportSummarizerTab />
          </TabsContent>
          <TabsContent value="urgent-care">
            <UrgentCareTab />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} WoundAI. All rights reserved.</p>
        <p>This tool is for informational purposes only and not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}
