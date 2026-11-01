import "server-only";

/** Builds a Calendar link; it does not create a meeting or contact Google. */
export function googleCalendarUrl(
  start: Date,
  end: Date,
  reference: string,
): string {
  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    start >= end ||
    !/^BKG-\d{4}-[A-HJ-NP-Z2-9]{4}$/.test(reference)
  )
    throw new Error("Data kalender tidak valid.");
  const utc = (value: Date) =>
    value
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", "Konsultasi OpenByte Labs");
  url.searchParams.set("dates", `${utc(start)}/${utc(end)}`);
  url.searchParams.set("details", `Referensi: ${reference}`);
  return url.toString();
}
