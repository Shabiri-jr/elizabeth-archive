export function ArchiveLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24">
      <div className="rounded-[2rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]">
        <div className="rounded-[calc(2rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-8">
          <div className="h-4 w-36 animate-pulse rounded-full bg-pale-lilac" />
          <div className="mt-8 h-12 max-w-lg animate-pulse rounded-full bg-espresso/8" />
          <div className="mt-5 h-4 max-w-2xl animate-pulse rounded-full bg-espresso/8" />
          <div className="mt-3 h-4 max-w-xl animate-pulse rounded-full bg-espresso/8" />
        </div>
      </div>
    </div>
  );
}
