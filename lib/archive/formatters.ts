export const REVEAL_TIME_ZONE = "Africa/Lagos";

export function getTodayInRevealTimeZone() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: REVEAL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isOnOrAfterRevealDate(revealDate: string) {
  return getTodayInRevealTimeZone() >= revealDate;
}

export function formatArchiveDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatBirthdayDate(value: string | null | undefined) {
  if (!value) return "August 19";

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00Z`));
}

export function getCountdownToDate(value: string | null | undefined) {
  const revealDate = value ?? "2026-08-19";
  const today = new Date(`${getTodayInRevealTimeZone()}T00:00:00Z`);
  const target = new Date(`${revealDate}T00:00:00Z`);
  const day = 1000 * 60 * 60 * 24;
  const days = Math.max(0, Math.ceil((target.getTime() - today.getTime()) / day));

  return {
    days,
    label: days === 0 ? "Reveal day" : `${days} days to the reveal`,
  };
}

export function chapterLabel(index: number, slug: string) {
  if (slug === "from-me") return "Final Chapter";
  return `Chapter ${String(index + 1).padStart(2, "0")}`;
}
