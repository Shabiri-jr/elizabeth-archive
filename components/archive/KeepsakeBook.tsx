/* eslint-disable @next/next/no-img-element -- Keepsake images use short-lived signed Supabase URLs. */
import { PrintButton } from "@/components/archive/PrintButton";
import { Button } from "@/components/ui/Button";
import { formatBirthdayDate } from "@/lib/archive/formatters";
import type { ArchiveData } from "@/lib/archive/queries";

type KeepsakeBookProps = {
  data: ArchiveData;
  isAdminPreview: boolean;
};

function finalLetterBody(data: ArchiveData) {
  return (
    data.chapters.find((chapter) => chapter.slug === "from-me")?.body?.trim() ||
    "I built this so you can always come back and remember that your life is not small, your presence is not ordinary, and the people around you see more in you than you sometimes admit."
  );
}

export function KeepsakeBook({ data, isAdminPreview }: KeepsakeBookProps) {
  const selectedImages = data.images.slice(0, 8);

  return (
    <section className="keepsake-page px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="print-hide mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6c5392]">Keepsake mode</p>
            <p className="mt-2 text-sm leading-7 text-espresso/62">
              A simplified memory-book view for printing or saving as PDF.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrintButton />
            <Button href="/archive" variant="secondary" showArrow={false}>
              Back to Archive
            </Button>
          </div>
        </div>

        <article className="rounded-[2rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-lg)] print:rounded-none print:bg-transparent print:p-0 print:shadow-none print:ring-0">
          <div className="rounded-[calc(2rem-0.375rem)] border border-porcelain/80 bg-porcelain/86 p-7 sm:p-10 lg:p-14 print:rounded-none print:border-0 print:bg-white print:p-0">
            <header className="print-card border-b border-espresso/12 pb-10">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#6c5392]">
                {isAdminPreview ? "Admin preview / " : ""}Private memory book
              </p>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-none text-espresso sm:text-6xl">
                A Story Called Elizabeth
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-9 text-espresso/66">
                A printable keepsake gathered for {formatBirthdayDate(data.settings?.birthday_date)}.
              </p>
            </header>

            <section className="print-card py-10">
              <h2 className="font-serif text-4xl font-semibold text-espresso">Messages From Your People</h2>
              <div className="mt-6 grid gap-5">
                {data.messages.length ? (
                  data.messages.map((message) => (
                    <div key={message.id} className="rounded-2xl border border-lilac-border/45 bg-ivory/58 p-5">
                      <p className="font-serif text-2xl font-semibold text-espresso">{message.name}</p>
                      <p className="mt-1 text-sm font-semibold text-[#6c5392]">{message.relationship}</p>
                      <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-espresso/72">
                        {message.birthdayMessage}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-base leading-8 text-espresso/62">The messages are still being gathered.</p>
                )}
              </div>
            </section>

            <section className="print-card border-t border-espresso/10 py-10">
              <h2 className="font-serif text-4xl font-semibold text-espresso">Memories With You</h2>
              <div className="mt-6 grid gap-5">
                {data.memories.length ? (
                  data.memories.map((memory) => (
                    <div key={memory.id} className="rounded-2xl border border-espresso/10 bg-porcelain/70 p-5">
                      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#6c5392]">
                        {memory.name} / {memory.relationship}
                      </p>
                      <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-espresso/72">{memory.memory}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-base leading-8 text-espresso/62">Memories will appear here once they are approved.</p>
                )}
              </div>
            </section>

            {selectedImages.length ? (
              <section className="print-card border-t border-espresso/10 py-10">
                <h2 className="font-serif text-4xl font-semibold text-espresso">Selected Keepsakes</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {selectedImages.map((image) => (
                    <figure key={image.id} className="rounded-2xl bg-ivory p-3 ring-1 ring-espresso/8">
                      <img
                        src={image.url ?? ""}
                        alt={image.caption ?? `Photo keepsake from ${image.contributorName}`}
                        width={1200}
                        height={900}
                        className="aspect-[4/3] w-full rounded-xl object-cover"
                      />
                      <figcaption className="px-1 pt-3 text-sm leading-6 text-espresso/68">
                        {image.caption ?? `${image.contributorName} / ${image.relationship}`}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="print-card border-t border-espresso/10 py-10">
              <h2 className="font-serif text-4xl font-semibold text-espresso">The Future We See For You</h2>
              <div className="mt-6 grid gap-5">
                {data.futureWishes.length ? (
                  data.futureWishes.map((wish) => (
                    <div key={wish.id} className="rounded-2xl border border-lilac-border/45 bg-pale-lilac/24 p-5">
                      <p className="font-serif text-2xl font-semibold text-espresso">{wish.name}</p>
                      <p className="mt-1 text-sm font-semibold text-[#6c5392]">{wish.relationship}</p>
                      <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-espresso/72">{wish.futureWish}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-base leading-8 text-espresso/62">Blessings for the year ahead will appear here.</p>
                )}
              </div>
            </section>

            <section className="print-card border-t border-espresso/10 pt-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6c5392]">Final Chapter</p>
              <h2 className="mt-4 font-serif text-4xl font-semibold text-espresso">From Me</h2>
              <p className="mt-6 whitespace-pre-wrap font-serif text-3xl leading-tight text-espresso">
                {finalLetterBody(data)}
              </p>
              <p className="mt-8 text-base leading-8 text-espresso/66">
                This archive is private and was made only for Elizabeth. Please keep the link safe.
              </p>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}

