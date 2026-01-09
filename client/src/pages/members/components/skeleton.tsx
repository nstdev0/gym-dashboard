import { Skeleton } from "@/components/ui/skeleton";

export default function MembersTableSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-4">
        {/* Header row simulation */}
        <div className="flex items-center justify-between pb-4 border-b">
          <Skeleton className="h-6 w-50" />
          <Skeleton className="h-6 w-25" />
        </div>
        {/* Rows simulation */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-37.5" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-4 w-25 hidden sm:block" />
            <Skeleton className="h-4 w-25 hidden md:block" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
