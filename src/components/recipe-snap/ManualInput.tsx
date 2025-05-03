
"use client";

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Text, ListPlus, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface ManualInputProps {
  initialIngredients?: string[]; // Optional initial ingredients from photo analysis
  onGenerateRecipes: (ingredients: string[]) => void; // Callback to generate recipes
  isLoading: boolean;
}

export function ManualInput({ initialIngredients = [], onGenerateRecipes, isLoading }: ManualInputProps) {
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients);
  const [newIngredient, setNewIngredient] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Initialize state correctly with the prop.
  // If the prop needs to dynamically update the state later,
  // a more robust solution (like using a key prop on ManualInput in the parent) might be needed.


  const handleAddIngredient = useCallback(() => {
    const trimmedIngredient = newIngredient.trim();
    if (trimmedIngredient && !ingredients.includes(trimmedIngredient)) {
      setIngredients((prev) => [...prev, trimmedIngredient]);
      setNewIngredient('');
      setError(null);
    } else if (!trimmedIngredient) {
      setError("Ingredient cannot be empty.");
    } else {
       setError("Ingredient already added.");
    }
  }, [newIngredient, ingredients]);

   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       setNewIngredient(event.target.value);
       if(error) setError(null); // Clear error on typing
   }

  const handleRemoveIngredient = useCallback((ingredientToRemove: string) => {
    setIngredients((prev) => prev.filter((ing) => ing !== ingredientToRemove));
  }, []);

  // Stable handler for remove button clicks using data attribute
  const handleRemoveClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      const ingredientToRemove = event.currentTarget.dataset.ingredient;
      if (ingredientToRemove) {
          handleRemoveIngredient(ingredientToRemove);
      }
  }, [handleRemoveIngredient]); // Depends on the memoized handleRemoveIngredient


  const handleGenerateClick = () => {
    if (ingredients.length > 0) {
      onGenerateRecipes(ingredients);
      setError(null);
    } else {
      setError("Please add at least one ingredient.");
    }
  };

   const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission if wrapped in a form
            handleAddIngredient();
        }
    };


  return (
    <Card className="w-full max-w-md mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Text className="text-primary" /> Add Ingredients Manually
        </CardTitle>
        <CardDescription>
          Refine the list or add ingredients the AI might have missed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
           <div className="flex-grow grid w-full items-center gap-1.5">
            <Label htmlFor="ingredient-input" className="font-medium">New Ingredient</Label>
             <Input
                id="ingredient-input"
                type="text"
                value={newIngredient}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Tomatoes, Flour, Chicken"
                className="flex-grow"
                disabled={isLoading}
                aria-describedby="ingredient-error"
             />
           </div>
          <Button onClick={handleAddIngredient} size="icon" variant="outline" disabled={isLoading}>
            <ListPlus className="h-5 w-5 text-primary" />
            <span className="sr-only">Add Ingredient</span>
          </Button>
        </div>
         {error && <p id="ingredient-error" className="text-sm text-destructive mt-1">{error}</p>}

        <Label className="font-medium block mb-2">Your Ingredients:</Label>
        <ScrollArea className="h-40 w-full rounded-md border p-3 bg-secondary/30">
          {ingredients.length > 0 ? (
            <ul className="space-y-2">
              {ingredients.map((ingredient) => (
                <li
                  key={ingredient}
                  className="flex items-center justify-between p-2 bg-card rounded-md shadow-sm text-sm"
                >
                  <span className="text-card-foreground">{ingredient}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-ingredient={ingredient} // Use data attribute
                    onClick={handleRemoveClick} // Use stable handler
                    disabled={isLoading}
                    className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove {ingredient}</span>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-4">No ingredients added yet.</p>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerateClick}
          disabled={ingredients.length === 0 || isLoading}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? 'Generating...' : 'Generate Recipes from List'}
        </Button>
      </CardFooter>
    </Card>
  );
}
