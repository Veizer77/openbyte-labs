export function normalizeWhatsapp(input: string): string | null {
  if (!/^[+\d\s()\-]+$/.test(input.trim())) return null;
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("8")) digits = `62${digits}`;
  return /^628\d{8,11}$/.test(digits) ? digits : null;
}

export function whatsappUrl(message: string, number: string): string {
  const normalized = normalizeWhatsapp(number);
  if (!normalized) throw new Error("Nomor WhatsApp tidak valid.");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_PLACEHOLDERS = [
  "nama",
  "referensi",
  "platform",
  "rincian",
  "estimasi_harga",
  "estimasi_durasi",
  "tanggal",
  "jam",
  "meeting_url",
  "kode_tracking",
  "link_tracking",
  "nama_proyek",
  "judul_revisi",
  "sisa_kuota",
] as const;
const allowedPlaceholders: ReadonlySet<string> = new Set(WHATSAPP_PLACEHOLDERS);

export type WhatsappPlaceholder = (typeof WHATSAPP_PLACEHOLDERS)[number];
export const WHATSAPP_TEMPLATE_FIELDS = {
  tplCalculator: [
    "nama",
    "referensi",
    "platform",
    "rincian",
    "estimasi_harga",
    "estimasi_durasi",
  ],
  tplPackageOrder: ["nama", "referensi", "platform", "rincian"],
  tplBookingConfirm: ["nama", "referensi", "tanggal", "jam", "meeting_url"],
  tplTrackingLink: ["nama", "nama_proyek", "kode_tracking", "link_tracking"],
  tplRevisionNotice: [
    "nama",
    "nama_proyek",
    "judul_revisi",
    "sisa_kuota",
    "link_tracking",
  ],
} as const satisfies Record<string, readonly WhatsappPlaceholder[]>;

/** Braces always delimit a placeholder; unmatched or nested braces are invalid. */
export function templatePlaceholders(template: string): string[] {
  const names: string[] = [];
  for (let index = 0; index < template.length; index++) {
    if (template[index] === "}")
      throw new Error("Sintaks placeholder tidak valid.");
    if (template[index] !== "{") continue;
    const end = template.indexOf("}", index + 1);
    if (end === -1) throw new Error("Sintaks placeholder tidak valid.");
    const name = template.slice(index + 1, end);
    if (!/^[a-z_]+$/.test(name))
      throw new Error("Sintaks placeholder tidak valid.");
    names.push(name);
    index = end;
  }
  return names;
}

export function validateWhatsappTemplate(
  template: string,
  allowed: readonly string[] = WHATSAPP_PLACEHOLDERS,
): boolean {
  try {
    const permitted = new Set(allowed);
    return templatePlaceholders(template).every((name) => permitted.has(name));
  } catch {
    return false;
  }
}

export function unknownPlaceholders(template: string): string[] {
  return [
    ...new Set(
      templatePlaceholders(template).filter(
        (name) => !allowedPlaceholders.has(name),
      ),
    ),
  ];
}

export function renderWhatsappTemplate(
  template: string,
  values: Partial<Record<(typeof WHATSAPP_PLACEHOLDERS)[number], string>>,
): string {
  if (!validateWhatsappTemplate(template))
    throw new Error("Template memuat placeholder yang tidak dikenal.");
  return template.replace(
    /\{([^{}]*)\}/g,
    (_, name: (typeof WHATSAPP_PLACEHOLDERS)[number]) => {
      const value = values[name];
      if (value === undefined)
        throw new Error(`Nilai placeholder ${name} belum tersedia.`);
      return value;
    },
  );
}
