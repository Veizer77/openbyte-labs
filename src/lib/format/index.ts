export const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value);
export const rupiah = (value: number) => `Rp ${formatNumber(value)}`;
export const dateWib = (date: string | Date) =>
  new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
