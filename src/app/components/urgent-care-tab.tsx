"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Hospital, AlertTriangle } from 'lucide-react';
import Image from "next/image";

export default function UrgentCareTab() {
  const { toast } = useToast();

  const handleFindHospitals = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Real-time hospital routing is under development. Please check back later.",
      variant: "default",
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-headline">
            <MapPin className="h-6 w-6 text-primary" />
            Urgent Care Route
          </CardTitle>
          <CardDescription>Find nearby hospitals and get directions in case of an emergency.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Image 
              src="https://placehold.co/600x300.png" 
              alt="Map placeholder" 
              width={600} 
              height={300} 
              className="rounded-lg shadow-md mx-auto mb-6"
              data-ai-hint="map navigation"
            />
            <Button onClick={handleFindHospitals} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Hospital className="mr-2 h-5 w-5" />
              Find Nearby Hospitals
            </Button>
            <p className="text-sm text-muted-foreground mt-3">This feature will use your location to find the nearest medical facilities.</p>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-700/50 dark:text-yellow-300">
            <AlertTriangle className="h-6 w-6 shrink-0"/>
            <div>
              <h4 className="font-semibold">Important Notice</h4>
              <p className="text-sm">This feature is currently illustrative. In a real emergency, please call your local emergency services immediately.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
