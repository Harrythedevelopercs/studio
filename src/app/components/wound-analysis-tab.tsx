
"use client";

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { analyzeWoundImage, type AnalyzeWoundImageOutput } from "@/ai/flows/analyze-wound-image";
import { suggestMedicine, type SuggestMedicineOutput } from "@/ai/flows/suggest-medicine";
import { fileToDataURL } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, Loader2, Mic, ScanLine, Pill, UploadCloud } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function WoundAnalysisTab() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeWoundImageOutput | null>(null);
  const [medicineSuggestion, setMedicineSuggestion] = useState<SuggestMedicineOutput | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingMedicine, setIsLoadingMedicine] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysisResult(null);
      setMedicineSuggestion(null);
    }
  };

  const handleAnalyzeWound = async () => {
    if (!imageFile) {
      toast({ title: "No Image Selected", description: "Please upload an image first.", variant: "destructive" });
      return;
    }

    setIsLoadingAnalysis(true);
    setAnalysisResult(null);
    setMedicineSuggestion(null);

    try {
      const photoDataUri = await fileToDataURL(imageFile);
      const result = await analyzeWoundImage({ photoDataUri });
      setAnalysisResult(result);
      toast({ title: "Analysis Complete", description: "Wound analysis successful.", variant: "default" });
      
      // Automatically fetch medicine suggestions after successful analysis
      await handleSuggestMedicine(result.woundDescription);

    } catch (error) {
      console.error("Wound analysis error:", error);
      toast({ title: "Analysis Failed", description: "Could not analyze the wound image. Please try again.", variant: "destructive" });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleSuggestMedicine = async (woundDescription: string) => {
    if (!woundDescription) return;

    setIsLoadingMedicine(true);
    try {
      const result = await suggestMedicine({ woundDescription });
      setMedicineSuggestion(result);
      toast({ title: "Medicine Suggestion Ready", description: "Medicine suggestions generated.", variant: "default" });
    } catch (error) {
      console.error("Medicine suggestion error:", error);
      toast({ title: "Suggestion Failed", description: "Could not suggest medicines. Please try again.", variant: "destructive" });
    } finally {
      setIsLoadingMedicine(false);
    }
  };

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-headline">
            <ScanLine className="h-6 w-6 text-primary" />
            Wound Image Analysis
          </CardTitle>
          <CardDescription>Upload an image of the wound for AI-powered analysis and care suggestions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="wound-image-upload" className="text-base">Upload Wound Image</Label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Input id="wound-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="w-full sm:max-w-xs text-sm" />
              <Button onClick={handleAnalyzeWound} disabled={!imageFile || isLoadingAnalysis} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoadingAnalysis ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                Analyze Wound
              </Button>
            </div>
          </div>

          {imagePreview && (
            <div className="mt-4 p-4 border border-dashed rounded-lg bg-muted/30">
              <p className="text-sm font-medium mb-2 text-foreground">Image Preview:</p>
              <Image src={imagePreview} alt="Wound preview" width={300} height={300} className="rounded-md object-contain shadow-md max-h-[300px] w-auto" data-ai-hint="wound medical" />
            </div>
          )}
          
          <div className="mt-4">
            <Button variant="outline" onClick={() => toast({ title: "Feature Coming Soon", description: "Voice recording in Urdu/Roman English will be available soon."})}>
              <Mic className="mr-2 h-4 w-4" />
              Record Observations (Urdu/Roman English)
            </Button>
            <p className="text-xs text-muted-foreground mt-1">Optionally, record voice notes about the wound (feature coming soon).</p>
          </div>
        </CardContent>
      </Card>

      {isLoadingAnalysis && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Analyzing Wound...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Separator className="my-4"/>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      )}

      {analysisResult && !isLoadingAnalysis && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl sm:text-2xl">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Wound Description</h3>
              <p className="text-foreground/90 whitespace-pre-wrap">{analysisResult.woundDescription}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-1">Severity Assessment</h3>
              <p className="text-foreground/90 font-medium">{analysisResult.severity}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-1">Care Recommendations</h3>
              <p className="text-foreground/90 whitespace-pre-wrap">{analysisResult.recommendations}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {isLoadingMedicine && analysisResult && (
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Generating Medicine Suggestions...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      )}

      {medicineSuggestion && !isLoadingMedicine && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl sm:text-2xl">
              <Pill className="h-6 w-6 text-accent" />
              Medicine Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {medicineSuggestion.medicines.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-foreground/90">
                {medicineSuggestion.medicines.map((med, index) => (
                  <li key={index}>{med}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No specific medicines suggested based on the current analysis.</p>
            )}
            <Separator />
            <div className="flex items-start gap-2 text-sm text-muted-foreground p-3 bg-muted/30 rounded-md border border-dashed">
              <Info className="h-5 w-5 mt-0.5 shrink-0" />
              <p><span className="font-semibold">Disclaimer:</span> {medicineSuggestion.disclaimer}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {!imageFile && !isLoadingAnalysis && !analysisResult && (
        <Card className="shadow-lg border-dashed border-primary/50">
          <CardContent className="p-6 text-center">
            <ScanLine className="h-12 w-12 mx-auto text-primary/70 mb-3" />
            <p className="text-lg font-medium text-muted-foreground">Upload a wound image to begin analysis.</p>
            <p className="text-sm text-muted-foreground">The AI will provide insights and care recommendations.</p>
          </CardContent>
        </Card>
      )}

      {analysisResult && !medicineSuggestion && !isLoadingMedicine && (
         <Card className="shadow-lg border-dashed border-accent/50">
          <CardContent className="p-6 text-center">
            <Pill className="h-12 w-12 mx-auto text-accent/70 mb-3" />
            <p className="text-lg font-medium text-muted-foreground">Medicine suggestions are being processed or were not generated.</p>
             <Button onClick={() => handleSuggestMedicine(analysisResult.woundDescription)} disabled={isLoadingMedicine} className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoadingMedicine ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :  <Pill className="mr-2 h-4 w-4" />}
                Retry Medicine Suggestion
              </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
