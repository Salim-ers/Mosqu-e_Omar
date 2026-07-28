const fmtLong = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const fmtMonthYear = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
});

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : fmtLong.format(d);
}

export function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : fmtMonthYear.format(d);
}

export function isPast(iso: string, now: Date = new Date()): boolean {
  const d = new Date(iso);
  return !Number.isNaN(d.getTime()) && d.getTime() < now.getTime();
}
