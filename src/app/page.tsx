
"use client";

import type React from 'react';
import { useState, useCallback } from 'react';
import { ImageUploader } from '@/components/recipe-snap/ImageUploader';
import { RecipeDisplay } from '@/components/recipe-snap/RecipeDisplay';
import { ManualInput } from '@/components/recipe-snap/ManualInput';
import { analyzePhoto } from '@/ai/flows/analyze-photo';
import type { AnalyzePhotoOutput } from '@/ai/flows/analyze-photo'; // Import types
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { Button } from '@/components/ui/button'; // Import Button
import { ArrowLeft, ChefHat } from 'lucide-react'; // Import icons

export default function Home() {
  const [recipes, setRecipes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [view, setView] = useState<'upload' | 'manual'>('upload'); // Control view: upload or manual input
  const { toast } = useToast(); // Initialize toast

  const handleAnalyzePhoto = useCallback(async (imageDataUri: string) => {
    setIsLoading(true);
    setRecipes([]); // Clear previous recipes

    try {
      console.log("Sending to analyzePhoto flow...");
      const result: AnalyzePhotoOutput = await analyzePhoto({ photoDataUri: imageDataUri });
      console.log("Received from analyzePhoto flow:", result);

      if (result && result.recipes) {
        setRecipes(result.recipes);
        if(result.recipes.length === 0){
             toast({
                title: "No Recipes Found",
                description: "We couldn't find recipes for the ingredients in the photo. Try adding manually.",
                variant: "destructive",
             });
        } else {
             toast({
                title: "Recipes Found!",
                description: "Check out the suggestions below.",
             });
        }
         setView('manual'); // Switch to manual view to show results and allow editing
      } else {
        throw new Error("Invalid response structure from AI.");
      }
    } catch (error) {
      console.error("Error analyzing photo:", error);
      let errorMessage = "Failed to analyze photo. Please try again.";
      if (error instanceof Error) {
          errorMessage = error.message.includes('4MB') ? "Image size exceeds 4MB limit." : errorMessage;
      }
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive",
      });
      setRecipes([]); // Ensure recipes are cleared on error
      setView('upload'); // Stay on upload view on error
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Placeholder for generating recipes from manual list (could call another AI flow or use the same one with text input)
 const handleGenerateFromManual = useCallback(async (ingredients: string[]) => {
    setIsLoading(true);
    setRecipes([]); // Clear previous recipes displayed from photo

    toast({
        title: "Generating Recipes...",
        description: "Hold on while we whip up some ideas!",
    });

    // Simulate AI call or integrate actual logic here
    // For now, we'll just re-display the input list as "recipes"
    // In a real app, you'd call an AI flow here, passing the `ingredients` array.
    // e.g., const result = await generateRecipesFromList({ ingredients });
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    // Example: create dummy recipes based on input
    const generatedRecipes = ingredients.map(ing => `${ing} Delight`);
    if (ingredients.length > 0) {
        generatedRecipes.push(`Simple ${ingredients[0]} and ${ingredients[1] || 'Vegetable'} Stir-fry`);
        generatedRecipes.push(`Baked ${ingredients[0] || 'Item'}`);
    }


    setRecipes(generatedRecipes.slice(0, 5)); // Limit dummy recipes

     toast({
        title: "Recipes Generated!",
        description: "Check the new suggestions based on your list.",
     });


    setIsLoading(false);
 }, [toast]);

  const handleBackToUpload = () => {
      setView('upload');
      setRecipes([]); // Clear recipes when going back
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-gradient-to-br from-background to-secondary/40">
      <div className="w-full max-w-md flex flex-col items-center space-y-6">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center justify-center gap-2">
            <ChefHat size={36} /> Recipe Snap
          </h1>
          <p className="text-lg text-muted-foreground mt-1">Turn your food photos into delicious meals!</p>
        </div>

        {view === 'upload' && (
          <ImageUploader onAnalyze={handleAnalyzePhoto} isLoading={isLoading} />
        )}

        {view === 'manual' && (
            <>
              <Button onClick={handleBackToUpload} variant="outline" className="self-start">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Upload
              </Button>
              {/* Display recipes suggested from the photo first */}
              <RecipeDisplay recipes={recipes} />
               {/* Allow manual addition/removal and regeneration */}
              <ManualInput
                 // Pass photo-based recipes if needed, or start fresh
                 // initialIngredients={recipes} // If you want to pre-fill based on photo analysis recipes (might not be ideal)
                 onGenerateRecipes={handleGenerateFromManual}
                 isLoading={isLoading}
              />

            </>
        )}

        {/* Conditionally render RecipeDisplay ONLY when not in upload view AND recipes exist */}
        {/* This is now handled within the 'manual' view block */}
        {/* {view !== 'upload' && recipes.length > 0 && <RecipeDisplay recipes={recipes} />} */}

      </div>
    </main>
  );
}
