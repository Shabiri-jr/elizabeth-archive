import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: PageIntroProps) {
  return (
    <div className={cn("motion-reveal", align === "center" && "mx-auto max-w-4xl text-center", className)}>
      {eyebrow ? (
        <p className="mb-4 inline-flex rounded-full border border-lilac-border/70 bg-pale-lilac/68 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-deep-lilac">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-serif text-5xl font-semibold leading-[0.95] tracking-normal text-espresso sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      {description ? (
        <p className={cn("mt-5 max-w-2xl text-base leading-8 text-espresso/68 sm:text-lg", align === "center" && "mx-auto")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
