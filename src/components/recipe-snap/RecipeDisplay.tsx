
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed } from 'lucide-react'; // Using utensils icon

interface RecipeDisplayProps {
  recipes: string[];
}

export function RecipeDisplay({ recipes }: RecipeDisplayProps) {
  if (!recipes || recipes.length === 0) {
    return null; // Don't render anything if there are no recipes
  }

  return (
    <Card className="w-full max-w-md mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <UtensilsCrossed className="text-primary" /> Recipe Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-60 w-full rounded-md border p-4 bg-secondary/30">
          {recipes.length > 0 ? (
            <ul className="space-y-3">
              {recipes.map((recipe, index) => (
                <li key={index} className="p-3 bg-card rounded-md shadow-sm hover:bg-muted transition-colors">
                  <Badge variant="secondary" className="mr-2 mb-1 bg-primary/10 text-primary-foreground">{index + 1}</Badge>
                  <span className="font-medium text-card-foreground">{recipe}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground">No recipes found for the ingredients.</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
