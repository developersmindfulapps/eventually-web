import { cn } from "@/lib/cn";

export function CenteredCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div
        className={cn(
          "mx-auto max-w-lg rounded-2xl border border-border bg-surface p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}


