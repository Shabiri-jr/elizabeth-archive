import { birthdayLabel } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-espresso/10 pt-8 text-sm text-espresso/62 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-serif text-lg text-espresso">A private birthday archive.</p>
        <p>Prepared for Elizabeth. Reveal date: {birthdayLabel}.</p>
        <p>This archive is private and was made only for Elizabeth. Please keep the link safe.</p>
      </div>
    </footer>
  );
}
