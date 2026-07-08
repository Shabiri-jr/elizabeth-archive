import { ArchiveEmptyState } from "@/components/archive/ArchiveEmptyState";

type WordWallProps = {
  words: string[];
};

type WordEntry = {
  label: string;
  count: number;
};

function titleCaseWord(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function buildWordEntries(words: string[]): WordEntry[] {
  const counts = new Map<string, WordEntry>();

  words.forEach((word) => {
    const cleaned = titleCaseWord(word).replace(/[^\w\s'-]/g, "").trim();
    if (!cleaned || cleaned.length > 30) return;

    const key = cleaned.toLowerCase();
    const current = counts.get(key);

    if (current) {
      current.count += 1;
      return;
    }

    counts.set(key, { label: cleaned, count: 1 });
  });

  return Array.from(counts.values()).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function WordWall({ words }: WordWallProps) {
  const entries = buildWordEntries(words);

  if (!entries.length) {
    return (
      <ArchiveEmptyState
        title="The words are still being gathered."
        body="Approved one-word descriptions will gather here like little signatures from the people who know Elizabeth."
      />
    );
  }

  return (
    <div
      data-archive-card
      className="relative overflow-hidden rounded-[2rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
    >
      <div className="rounded-[calc(2rem-0.375rem)] border border-porcelain/80 bg-porcelain/72 p-6 sm:p-8 lg:p-10">
        <p className="mx-auto mb-8 max-w-2xl text-center font-serif text-2xl leading-tight text-espresso sm:text-3xl">
          Some words kept coming up whenever people described you.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {entries.map((entry, index) => (
            <span
              key={entry.label}
              data-archive-word
              className="archive-word inline-flex items-baseline gap-2 rounded-full border border-lilac-border/70 bg-pale-lilac/68 px-4 py-2 font-serif font-semibold text-deep-lilac shadow-[var(--shadow-beautiful-sm)] sm:px-5 sm:py-3"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <span className={entry.count > 2 ? "text-3xl sm:text-5xl" : entry.count > 1 ? "text-2xl sm:text-4xl" : "text-xl sm:text-3xl"}>
                {entry.label}
              </span>
              {entry.count > 1 ? (
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-champagne">x{entry.count}</span>
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
