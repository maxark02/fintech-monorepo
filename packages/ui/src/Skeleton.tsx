type SkeletonProps = {
  className?: String;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-[#252530] rounded-lg ${className}`}></div>
  );
}
