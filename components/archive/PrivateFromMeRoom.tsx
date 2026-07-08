import { LockKeyhole } from "lucide-react";

type PrivateFromMeRoomProps = {
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
};

const fallbackSections = [
  {
    title: "Why I built this",
    body: "I built this because I wanted you to have something you could return to - not just on your birthday, but on days when you need to remember that your presence matters.",
  },
  {
    title: "What I admire about you",
    body: "I admire the way you carry softness without losing strength, the way you keep becoming, and the way your presence can make ordinary moments feel more considered.",
  },
  {
    title: "What I hope this reminds you of",
    body: "I hope this reminds you that your life is not small, your story is not invisible, and people see more beauty in you than you may always pause long enough to receive.",
  },
  {
    title: "A final birthday note",
    body: "May this new year meet you with peace, clear doors, brave joy, and the kind of success that still lets your heart feel at home.",
  },
];

export function PrivateFromMeRoom({ title, subtitle, body }: PrivateFromMeRoomProps) {
  const customBody = body?.trim();

  return (
    <div
      data-archive-card
      className="rounded-[2rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-lg)]"
    >
      <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] border border-lilac-border/65 bg-[linear-gradient(135deg,rgba(255,250,243,0.93),rgba(241,232,250,0.62))] p-7 sm:p-10 lg:p-12">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 size-56 rounded-full bg-lilac-primary/18 blur-3xl"
        />
        <div className="relative">
          <span className="flex size-12 items-center justify-center rounded-full bg-porcelain text-deep-lilac shadow-[var(--shadow-beautiful-sm)]">
            <LockKeyhole aria-hidden="true" className="size-5" strokeWidth={1.35} />
          </span>
          <p className="mt-7 text-sm font-bold uppercase tracking-[0.22em] text-deep-lilac/72">
            This room is a little more personal.
          </p>
          <h2 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-espresso sm:text-5xl">
            {title || "Private From Me Room"}
          </h2>
          {subtitle ? <p className="mt-4 max-w-2xl text-base leading-8 text-espresso/62">{subtitle}</p> : null}

          {customBody ? (
            <p className="mt-9 max-w-4xl whitespace-pre-wrap font-serif text-2xl leading-relaxed text-espresso sm:text-3xl">
              {customBody}
            </p>
          ) : (
            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {fallbackSections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-[1.35rem] border border-porcelain/80 bg-porcelain/68 p-5 shadow-[var(--shadow-beautiful-sm)]"
                >
                  <h3 className="font-serif text-2xl font-semibold text-espresso">{section.title}</h3>
                  <p className="mt-3 text-base leading-8 text-espresso/66">{section.body}</p>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

