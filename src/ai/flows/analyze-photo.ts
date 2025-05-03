'use server';

/**
 * @fileOverview Analyzes a photo of ingredients and suggests potential recipes.
 *
 * - analyzePhoto - A function that takes a photo of ingredients and returns a list of potential recipes.
 * - AnalyzePhotoInput - The input type for the analyzePhoto function.
 * - AnalyzePhotoOutput - The return type for the analyzePhoto function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzePhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of ingredients, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePhotoInput = z.infer<typeof AnalyzePhotoInputSchema>;

const AnalyzePhotoOutputSchema = z.object({
  recipes: z
    .array(z.string())
    .describe('A list of potential recipes that can be made with the ingredients in the photo.'),
});
export type AnalyzePhotoOutput = z.infer<typeof AnalyzePhotoOutputSchema>;

export async function analyzePhoto(input: AnalyzePhotoInput): Promise<AnalyzePhotoOutput> {
  return analyzePhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePhotoPrompt',
  input: {
    schema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo of ingredients, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  output: {
    schema: z.object({
      recipes: z
        .array(z.string())
        .describe('A list of potential recipes that can be made with the ingredients in the photo.'),
    }),
  },
  prompt: `You are a recipe expert. Given a photo of ingredients, suggest a list of potential recipes that can be made with those ingredients.\n\nHere is the photo: {{media url=photoDataUri}}\n\nRecipes:`,
});

const analyzePhotoFlow = ai.defineFlow<
  typeof AnalyzePhotoInputSchema,
  typeof AnalyzePhotoOutputSchema
>(
  {
    name: 'analyzePhotoFlow',
    inputSchema: AnalyzePhotoInputSchema,
    outputSchema: AnalyzePhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
