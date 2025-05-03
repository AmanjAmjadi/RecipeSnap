
"use client";

import type React from 'react';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ImageUploaderProps {
  onAnalyze: (imageDataUri: string) => void;
  isLoading: boolean;
}

export function ImageUploader({ onAnalyze, isLoading }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null); // Clear previous errors
      if (file.size > 4 * 1024 * 1024) { // Check file size (e.g., 4MB limit)
          setError("Image size exceeds 4MB limit.");
          setImagePreview(null);
          setImageDataUri(null);
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageDataUri(result);
      };
      reader.onerror = () => {
          setError("Failed to read the image file.");
          setImagePreview(null);
          setImageDataUri(null);
      };
      reader.readAsDataURL(file);
    } else {
        setImagePreview(null);
        setImageDataUri(null);
    }
  }, []);

  const handleAnalyzeClick = () => {
    if (imageDataUri) {
      onAnalyze(imageDataUri);
    } else {
        setError("Please upload an image first.");
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
           <Camera className="text-primary" /> Snap Your Ingredients
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="picture" className="font-medium">Upload Photo</Label>
           <div className="flex items-center gap-2">
             <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-grow file:text-primary file:font-semibold hover:file:bg-primary/10"
                disabled={isLoading}
             />
            <Button variant="ghost" size="icon" onClick={() => document.getElementById('picture')?.click()} disabled={isLoading}>
                 <Upload className="h-5 w-5 text-primary" />
            </Button>
           </div>
           {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>

        {imagePreview && (
          <div className="mt-4 p-2 border rounded-md bg-muted aspect-video relative overflow-hidden">
            <Image
              src={imagePreview}
              alt="Ingredient preview"
              layout="fill"
              objectFit="contain"
              className="rounded-md"
              data-ai-hint="food ingredients"
            />
          </div>
        )}
         {!imagePreview && !isLoading && (
          <div className="mt-4 p-4 border border-dashed rounded-md bg-muted aspect-video flex flex-col items-center justify-center text-muted-foreground">
              <Camera size={48} className="mb-2"/>
              <p>Image preview will appear here</p>
          </div>
        )}
        {isLoading && (
           <div className="mt-4 p-4 border border-dashed rounded-md bg-muted aspect-video flex flex-col items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-2"></div>
             <p className="text-muted-foreground">Analyzing...</p>
           </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAnalyzeClick}
          disabled={!imageDataUri || isLoading}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? 'Analyzing...' : 'Find Recipes'}
        </Button>
      </CardFooter>
    </Card>
  );
}
