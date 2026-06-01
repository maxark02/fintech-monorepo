type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <span
      className={`inline-block animate-customPulse bg-white/20 rounded-lg ${className}`}
    ></span>
  );
}
