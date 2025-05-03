
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
         <p className="text-muted-foreground">Loading Recipe Snap...</p>
      </div>

    </div>
  )
}
