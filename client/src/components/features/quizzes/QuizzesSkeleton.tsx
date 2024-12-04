import { Skeleton } from "@/components/ui/skeleton";
import MaxWidthWrapper from "@/components/utils/MaxWidthWrapper";

const QuizzesSkeleton: React.FC = () => (
  <MaxWidthWrapper className="space-y-4 w-full">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="border rounded-lg space-y-2 shadow-sm w-full">
        <div className="p-4">
          <Skeleton className="w-1/2 h-[28px]" />
        </div>
        <div className="p-4 pt-0 flex justify-between items-center">
          <Skeleton className="w-[80px] h-[20px]" />
          <Skeleton className="w-[140px] h-[40px]" />
        </div>
      </div>
    ))}
  </MaxWidthWrapper>
);

export default QuizzesSkeleton;
