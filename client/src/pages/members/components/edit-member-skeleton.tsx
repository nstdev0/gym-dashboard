import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EditMemberSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-6xl border-border/60">
      <CardHeader className="border-b py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-60" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-9 col-span-1" />
              <Skeleton className="h-9 col-span-2" />
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-4 w-24" />
            <div className="space-y-3">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
