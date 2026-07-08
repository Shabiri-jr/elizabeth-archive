import { birthdayLabel } from "@/lib/constants";

function getDaysUntilBirthday() {
  const now = new Date();
  const birthdayThisYear = new Date(now.getFullYear(), 7, 19);
  const target =
    birthdayThisYear < new Date(now.getFullYear(), now.getMonth(), now.getDate())
      ? new Date(now.getFullYear() + 1, 7, 19)
      : birthdayThisYear;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / day));
}

export function CountdownBadge() {
  const days = getDaysUntilBirthday();
  const label = days === 0 ? "Reveal day" : `${days} days to the reveal`;

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-lilac-border/70 bg-pale-lilac/72 px-3 py-2 text-sm text-espresso shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
      <span className="size-2 rounded-full bg-deep-lilac" aria-hidden="true" />
      <span className="font-semibold">{birthdayLabel}</span>
      <span className="h-4 w-px bg-espresso/14" aria-hidden="true" />
      <span className="text-espresso/64">{label}</span>
    </div>
  );
}
