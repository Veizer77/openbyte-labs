/** One-time HTML AST -> editable React source migration. Never runs in the app or build. */
import { parse } from "parse5";
import { mkdir, readFile, writeFile, readdir, cp } from "node:fs/promises";
import { join } from "node:path";
import { format } from "prettier";

const source = "prototype/stitch";
const target = "src/components/screens";
const writeTsx = async (path, content) =>
  writeFile(
    path,
    await format(content, { parser: "typescript", printWidth: 100 }),
  );
const attrs = (node) =>
  Object.fromEntries((node?.attrs ?? []).map((a) => [a.name, a.value]));
const elements = (node) => (node.childNodes ?? []).filter((n) => n.tagName);
const text = (node) =>
  node.nodeName === "#text"
    ? node.value.replace(/\s+/g, " ")
    : (node.childNodes ?? []).map(text).join("");
const label = (node) => text(node).trim();
const name = (node) => attrs(node)["data-pencil-name"] ?? "";
const cls = (node) => attrs(node).class ?? "";
const q = (value) => `{${JSON.stringify(value)}}`;
const find = (node, predicate) =>
  predicate(node)
    ? node
    : (node.childNodes ?? []).map((n) => find(n, predicate)).find(Boolean);
const isIcon = (node) => cls(node).includes("Material_Symbols");
const cleanLabel = (node) =>
  isIcon(node)
    ? ""
    : node.nodeName === "#text"
      ? node.value
      : (node.childNodes ?? []).map(cleanLabel).join(" ");
const displayLabel = (node) => cleanLabel(node).replace(/\s+/g, " ").trim();
const pascal = (value) =>
  value
    .split(/[^a-z0-9]/i)
    .filter(Boolean)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");
const descendantWidth = (node) =>
  Math.max(
    Number(cls(node).match(/\bw-\[([\d.]+)px\]/)?.[1] ?? 0),
    ...elements(node).map(descendantWidth),
    0,
  );
const inTable = (node) =>
  node &&
  (["table", "thead", "tbody", "tr", "td", "th"].includes(name(node)) ||
    /Table Container|Table Card|Table Header|Rows Container|Invoice Row|Staff Row/.test(
      name(node),
    ) ||
    inTable(node.parentNode));
const isDataRow = (node) =>
  /^(tr|Row - |Invoice Row|Staff Row)/.test(name(node)) ||
  (/\[border-width:/.test(cls(node)) &&
    Number(cls(node).match(/\bw-\[([\d.]+)px\]/)?.[1] ?? 0) > 1000);

const navRoutes = {
  Beranda: "/",
  "Beranda Agensi": "/",
  "Proyek Portofolio": "/proyek",
  "Portofolio & Studi Kasus": "/proyek",
  "Paket Layanan": "/paket",
  "Paket & Spesifikasi Teknis": "/paket",
  "Estimasi Biaya": "/kalkulator",
  "Kalkulator Estimasi Biaya": "/kalkulator",
  Konsultasi: "/konsultasi",
  "Tentang Kami": "/tentang-kami",
  "Privacy Policy": "/kebijakan-privasi",
  "Service Level Agreement": "/ketentuan-layanan",
};
const optionIds = [
  ["Web Saja", "web"],
  ["Android Saja", "android"],
  ["Web + Android", "webandr"],
  ["Landing Page Profil", "landing"],
  ["Katalog & Toko WA", "katalog"],
  ["Sistem Informasi / Web App", "sidb"],
  ["Undangan Digital", "undangan"],
  ["Multi-User RBAC", "rbac"],
  ["Peta & Geolocation", "gis"],
  ["Export Dokumen", "laporan"],
  ["Notifikasi Otomatis", "wa"],
  ["Integrasi Payment", "pay"],
];
const projectPatterns = [
  [/SINDUKSADATI/, "sinduksadati"],
  [/SIPANDU/, "sipandu"],
  [/HIPPAM/, "hippam"],
  [/UMKM-KU/, "umkm-ku"],
  [/Terapis/, "terapis-jogoroto"],
  [/Prewed|Undangan Digital Eksklusif/, "prewed"],
];
function nearbyProject(node) {
  for (let ancestor = node; ancestor; ancestor = ancestor.parentNode) {
    const matches = projectPatterns.filter(([pattern]) =>
      pattern.test(label(ancestor)),
    );
    if (matches.length === 1) return matches[0][1];
    if (matches.length > 1) return "sinduksadati";
  }
  return "sinduksadati";
}
const copyCorrections = new Map([
  ["MoveIQ Platform © 2025", "OpenByte Labs © 2026"],
  [
    "FILAMENT CMS ENGINE v3.2 • PRODUCTION SECURED",
    "OPENBYTE LABS • ADMIN PREVIEW",
  ],
  ["ENTERPRISE CMS PLATFORM", "DASHBOARD ADMIN CUSTOM"],
  ["Filament Engine v3.4", "Next.js App Router"],
  ["Engine: Laravel 13 / Filament", "Next.js / React / TypeScript"],
  ["PRODUCTION (Docker / Render)", "PREVIEW FRONTEND"],
  ["CMS SUPERADMIN", "ADMIN OWNER"],
  ["Masuk ke CMS Admin", "Masuk ke Admin"],
  ["Masuk ke Dashboard CMS", "Masuk ke Dashboard"],
  ["Standard Garansi Bug 60 Hari", "Standard Garansi Bug 30 Hari"],
]);

let screenKey = "";
let rawHeader = false;
let headingUsed = false;

function render(node, parent, insideControl = false) {
  if (node.nodeName === "#text") {
    const value = node.value.replace(/\s+/g, " ").trim();
    return value ? q(copyCorrections.get(value) ?? value) : "";
  }
  if (
    !node.tagName ||
    ["script", "style", "link", "meta"].includes(node.tagName)
  )
    return "";
  const n = name(node),
    a = attrs(node),
    children = elements(node),
    t = label(node),
    plain = displayLabel(node);
  let c = cls(node)
    .replaceAll("../assets/img/", "/images/")
    .replaceAll("../brand/", "/brand/")
    .replaceAll(
      "font-[Inter,system-ui,sans-serif]",
      "font-[var(--font-inter),system-ui,sans-serif]",
    );
  if (!rawHeader && n === "header")
    return screenKey.startsWith("cms/")
      ? "<AdminHeader />"
      : "<PublicHeader />";
  if (!rawHeader && n === "aside") return "<AdminSidebar />";
  if (
    !(rawHeader && name(parent) === "nav" && plain === "Tracking Klien") &&
    ["Tracking Klien", "Live Client Portal Tracking", "Portal Klien"].includes(
      plain,
    ) &&
    (navRoutes[n] || ["a", "li"].includes(n) || name(parent) === "nav")
  )
    return plain === "Portal Klien"
      ? `<span aria-hidden="true" className=${q(c)} />`
      : "";

  const root =
    /^(Public|CMS)\s*\//.test(n) ||
    (screenKey.startsWith("system/") && parent?.tagName === "body");
  const isLeaf = children.length === 0;
  const w = Number(c.match(/\bw-\[([\d.]+)px\]/)?.[1] ?? 0);
  const h = Number(c.match(/\bh-\[([\d.]+)px\]/)?.[1] ?? 0);
  let extra = "";
  if (root) {
    c += ` screen ${screenKey.startsWith("cms/") ? "admin-screen" : "public-screen"}${screenKey === "cms/login-admin" ? " login-screen" : ""}`;
    extra += ` data-screen=${q(screenKey)} id="konten" tabIndex={-1}`;
  }
  if (w >= 1440 && !root) extra += ' data-layout="canvas-content"';
  if (isLeaf && t) extra += ' data-text="true"';
  const absLayout =
    !root &&
    w < 1440 &&
    children.some(
      (child) =>
        /\babsolute\b/.test(cls(child)) &&
        Number(cls(child).match(/\bw-\[([\d.]+)px\]/)?.[1] ?? 0) >= 400 &&
        elements(child).length > 1,
    );
  const row =
    c.includes("flex-row") &&
    !rawHeader &&
    !insideControl &&
    !inTable(node) &&
    children.filter((child) => !isIcon(child)).length > 1 &&
    (children.some(
      (child) =>
        /\[flex:1_1_0\]/.test(cls(child)) || descendantWidth(child) >= 300,
    ) ||
      plain.length > 64);
  if (!inTable(node)) {
    if (absLayout) extra += ' data-responsive="absolute-layout"';
    else if (row && !["nav", "header"].includes(n))
      extra += ' data-responsive="row"';
    else if (w > 80 && !c.includes("bg-[url("))
      extra += ' data-responsive="fixed"';
    else if (h > 50 && !isLeaf && !c.includes("bg-[url("))
      extra += ' data-responsive="flow"';
    if ((w > 80 || row || absLayout) && h > 50 && !isLeaf)
      c += " mobile-auto-height";
  }
  if (/p-\[(?:20|24)px/.test(c)) extra += ' data-section-padding="true"';
  if (children.some((child) => name(child) === "table"))
    extra += ' data-table-scroll="true"';
  if (n === "table") extra += ' role="table"';
  if (
    /Table Container|Table Card|Rows Container/.test(n) &&
    children.some(isDataRow)
  )
    extra += ' data-custom-table="true"';
  if (screenKey === "site/booking-konsultasi" && h === 888)
    extra += ' data-booking-layout="true"';
  if (c.includes("Material_Symbols")) {
    c += " symbol";
    extra += ' aria-hidden="true"';
  }
  if (c.includes("rounded-[50%]") && !isLeaf) c += " selection-mark";
  const imageSource = c.match(/bg-\[url\('([^']+)'\)\]/)?.[1];
  const imageAlt = /Logo|5f9e|e72160/.test(c)
    ? "OpenByte Labs"
    : w >= 200
      ? "Tangkapan layar proyek pada prototype"
      : "Foto referensi prototype";
  if (imageSource) c = c.replace(/bg-\[url\('[^']+'\)\]/, "");
  let tag = "div";
  if (
    ["main", "section", "article", "header", "aside", "footer", "nav"].includes(
      n,
    )
  )
    tag = n;
  if (rawHeader && n === "header") {
    c += " public-header";
  }
  if (
    rawHeader &&
    parent &&
    name(parent) === "header" &&
    children.length >= 3
  ) {
    const last = children[children.length - 1];
    if (last)
      last.attrs = [
        ...(last.attrs ?? []),
        { name: "data-header-actions", value: "true" },
      ];
  }
  if (a["data-header-actions"]) c += " header-actions";
  if (
    isLeaf &&
    !isIcon(node) &&
    /text-\[(?:26|28|32|34|40)px\]/.test(c) &&
    plain.length > 12 &&
    !/^[\dRp .,-]+$/.test(plain)
  ) {
    tag = headingUsed ? "h2" : "h1";
    headingUsed = true;
    c += " m-0";
    extra += ' data-heading="true"';
  }
  const props = ` className=${q(c)}${n ? ` data-pencil-name=${q(n)}` : ""}${extra}`;
  const body = (control = false) =>
    (node.childNodes ?? [])
      .map((child) => render(child, node, insideControl || control))
      .filter(Boolean)
      .join("\n");

  if (screenKey === "cms/login-admin" && n === "Login Auth Card")
    return `<LoginForm${props} />`;
  if (
    screenKey === "site/beranda" &&
    children.length === 1 &&
    label(children[0]).includes("expand_more") &&
    /^(Bagaimana|Apakah|Berapa)/.test(plain) &&
    c.includes("bg-[#f0f0f0]")
  ) {
    const answer = plain.startsWith("Berapa")
      ? "Garansi bug awal mengikuti PRD: 30 hari setelah serah terima. Kuota revisi mengikuti paket dan tidak mencakup perubahan scope."
      : plain.startsWith("Apakah")
        ? "Bisa. Hosting aplikasi dan database dapat memakai layanan cloud. Biaya layanan pihak ketiga disepakati terpisah."
        : plain.includes("progres")
          ? "Komunikasi proyek dilakukan melalui WhatsApp. Portal tracking akan tersedia pada Rilis 2 setelah autentikasi dan isolasi data siap."
          : "Penyerahan source code, hak akses, dan kepemilikan hasil kerja disepakati dalam kontrak. Keamanan dan scope ditinjau sesuai kebutuhan proyek.";
    return `<FaqItem answer=${q(answer)}${props}>${body()}</FaqItem>`;
  }
  if (screenKey === "site/booking-konsultasi") {
    if (n === "form") return `<ContactForm kind="booking"${props} />`;
    if (
      t.includes("PILIH TANGGAL") &&
      t.includes("Akhir Pekan (Tutup)") &&
      !children.some(
        (child) =>
          label(child).includes("PILIH TANGGAL") &&
          label(child).includes("Akhir Pekan (Tutup)"),
      )
    )
      return `<BookingCalendar${props} />`;
    if (
      t.includes("SLOT WAKTU SESI") &&
      t.includes("MODE KONSULTASI") &&
      !children.some(
        (child) =>
          label(child).includes("SLOT WAKTU SESI") &&
          label(child).includes("MODE KONSULTASI"),
      )
    )
      return `<BookingSlots${props} />`;
    if (
      isLeaf &&
      ["18 Mei 2026", "09:00 - 11:00 WIB", "Google Meet"].includes(t) &&
      c.includes("text-[#ffffff]")
    )
      return `<BookingValue kind=${q(t === "18 Mei 2026" ? "date" : t.includes("WIB") ? "time" : "mode")}${props} />`;
  }
  if (screenKey === "site/kalkulator-estimasi-biaya") {
    if (isLeaf && !isIcon(node) && /^[+\d]/.test(t) && /Hari/.test(t)) {
      let option = parent;
      while (option && name(option) !== "label") option = option.parentNode;
      const match =
        option && optionIds.find(([value]) => label(option).includes(value));
      if (match) return `<CalculatorItemDays itemId=${q(match[1])}${props} />`;
    }
    if (n === "label") {
      const match = optionIds.find(([value]) => t.includes(value));
      if (match)
        return `<CalculatorOption itemId=${q(match[1])}${props}>${body(true)}</CalculatorOption>`;
    }
    if (isLeaf && t === "2.500.000 - 4.000.000")
      return `<CalculatorValue kind="price"${props} />`;
    if (isLeaf && t === "14 - 21 Hari Kerja")
      return `<CalculatorValue kind="days"${props} />`;
    if (isLeaf && t === "1 Komponen")
      return `<CalculatorValue kind="count"${props} />`;
    if (
      t.includes("RINCIAN KOMPONEN TERPILIH") &&
      t.includes("Sistem Informasi Database") &&
      !children.some(
        (child) =>
          label(child).includes("RINCIAN KOMPONEN TERPILIH") &&
          label(child).includes("Sistem Informasi Database"),
      )
    )
      return `<CalculatorBreakdown${props} />`;
    if (
      t.includes("Nama / Perusahaan") &&
      t.includes("Nomor WhatsApp") &&
      !children.some(
        (child) =>
          label(child).includes("Nama / Perusahaan") &&
          label(child).includes("Nomor WhatsApp"),
      )
    )
      return `<CalculatorContact${props} />`;
    if (n === "button" && t.includes("Kirim Rincian Estimasi"))
      return `<CalculatorSend${props}>${body(true)}</CalculatorSend>`;
    if (
      t.includes("Jumlah Halaman Kustom") &&
      t.includes("20 Halaman (Maks)") &&
      !children.some(
        (child) =>
          label(child).includes("Jumlah Halaman Kustom") &&
          label(child).includes("20 Halaman (Maks)"),
      )
    )
      return `<CalculatorUnits${props} />`;
  }

  if (
    !insideControl &&
    ((rawHeader && name(parent) === "nav") ||
      [
        "Beranda Agensi",
        "Portofolio & Studi Kasus",
        "Paket & Spesifikasi Teknis",
        "Kalkulator Estimasi Biaya",
        "Privacy Policy",
        "Service Level Agreement",
      ].includes(n))
  ) {
    if (rawHeader && plain === "Tracking Klien")
      return `<NavLink href="/tracking"${props}>${body(true)}</NavLink>`;
    const href = navRoutes[plain] ?? navRoutes[n];
    if (href) return `<NavLink href=${q(href)}${props}>${body(true)}</NavLink>`;
  }
  if (rawHeader && n === "img" && /193px/.test(c))
    return `<Link href="/" aria-label="OpenByte Labs, beranda"><ReferenceImage src=${q(imageSource)} alt="OpenByte Labs" contain${props} /></Link>`;
  if (imageSource)
    return `<ReferenceImage src=${q(imageSource)} alt=${q(imageAlt)} contain={${c.includes("bg-contain")}}${props} />`;
  if (
    !insideControl &&
    n === "article" &&
    screenKey === "site/daftar-portofolio"
  )
    return `<FilterItem text=${q(t)}${props}>${body()}</FilterItem>`;
  if (!insideControl && n === "tbody")
    return `<DataRows texts={${JSON.stringify(children.map(label))}}${props}>${body()}</DataRows>`;
  if (
    !insideControl &&
    /Table Container|Table Card|Rows Container/.test(n) &&
    children.some(isDataRow)
  )
    return `<DataRows texts={${JSON.stringify(children.map(label))}} rowFlags={${JSON.stringify(children.map(isDataRow))}}${props}>${body()}</DataRows>`;
  if (
    !insideControl &&
    /^(Switch Track|Toggle Track|Checkbox Checked|Checkbox Unchecked)$/i.test(n)
  )
    return `<ToggleControl label=${q(displayLabel(parent).slice(0, 100) || "Aktifkan opsi")} initialChecked={${!/Unchecked/i.test(n)}}${props}>${body(true)}</ToggleControl>`;
  if (!insideControl && isLeaf && n === "input" && w > 0 && w <= 24)
    return `<ToggleControl label=${q(displayLabel(parent).slice(0, 100) || "Pilih data")}${props} />`;
  if (
    !insideControl &&
    /^(Tab - |Tab Active$|Tab Disetujui$|Tab Ditolak$|Tab Semua$)/.test(n)
  )
    return `<FilterButton value=${q(plain.replace(/\s*\(\d+\)$/, ""))}${props}>${body(true)}</FilterButton>`;

  if (
    !insideControl &&
    isLeaf &&
    /^(Cari |Filter judul|Filter nama|Cari\.\.\.)/i.test(t)
  )
    return `<SearchField label=${q(t)}${props} />`;
  if (
    !insideControl &&
    isLeaf &&
    (n === "input" ||
      n === "textarea" ||
      /^(cth\.|08[x\d]*x|Bpk\/Ibu|Jelaskan gambaran)/i.test(t))
  )
    return `<EditableField label=${q(t || "Isian formulir")} multiline={${n === "textarea"}}${props} />`;
  if (
    !insideControl &&
    screenKey === "cms/site-settings" &&
    c.includes("bg-[#f0f0f0]") &&
    h >= 32 &&
    h <= 120 &&
    plain.length > 0 &&
    children.length <= 1 &&
    !isIcon(node)
  )
    return `<EditableField label=${q(displayLabel(parent).slice(0, 100))} initialValue=${q(plain)}${props} />`;
  if (
    !insideControl &&
    n === "button" &&
    /Semua (Kategori|Status|Sumber)/i.test(plain)
  )
    return `<FilterDropdown label=${q(plain)}${props}>${body(true)}</FilterDropdown>`;
  if (
    !insideControl &&
    n === "button" &&
    /^(Semua|Published|Draft|Trash|Aktif|Nonaktif|Instansi|Aplikasi Mobile|Bisnis|Undangan|Baru|New|Pending|Confirmed|Completed|Cancelled|Contacted|Converted|Dropped)\b/i.test(
      plain,
    ) &&
    !/Tambah|Buat/.test(plain)
  )
    return `<FilterButton value=${q(plain.replace(/\s+\d+$/, ""))}${props}>${body(true)}</FilterButton>`;

  const namedAction =
    n !== "div" &&
    children.length <= 1 &&
    h > 20 &&
    h <= 56 &&
    /^(Tambah|Buat |Simpan|Hapus|Edit |Ubah |Tolak|Terima|Tandai|Upload|Ganti |Lihat Detail|Buka |Reset|Regenerasi|Salin|Unduh|Export|Ekspor|Kirim |Konfirmasi|Cetak|Jadikan|Pulihkan|Duplikat)/i.test(
      plain,
    ) &&
    c.includes("rounded-");
  const namedButton =
    /button|cta/i.test(n) &&
    !/label|text|icon|row|column|container|group|wrap/i.test(n) &&
    children.length > 0;
  if (
    !insideControl &&
    ([
      "a",
      "button",
      "Submit Button",
      "Forgot Link",
      "Hardware Key / Passkey Button",
    ].includes(n) ||
      namedAction ||
      namedButton ||
      (/^(edit|delete|more_vert|visibility|download|logout)$/.test(t) &&
        isIcon(node)))
  ) {
    let href = null;
    if (/WhatsApp|Chat via|Hubungi via|Request Sandbox/.test(plain))
      href = "https://wa.me/62895386011371";
    else if (
      /Konsultasi|Discovery Call|Jadwalkan|Booking Sesi/.test(plain) &&
      !screenKey.startsWith("cms/")
    )
      href = "/konsultasi";
    else if (
      /Kalkulator|Hitung Estimasi/.test(plain) &&
      !screenKey.startsWith("cms/")
    )
      href = "/kalkulator";
    else if (/Kembali ke Beranda|Website Publik/.test(plain)) href = "/";
    else if (
      /Semua Proyek|Lihat Semua Portofolio|Eksplorasi Portofolio|Buka Semua Studi Kasus/.test(
        plain,
      )
    )
      href = screenKey.startsWith("cms/") ? "/admin/showcase" : "/proyek";
    else if (/Studi Kasus|Detail Proyek|Lihat Solusi HIPPAM/.test(plain))
      href = `/proyek/${nearbyProject(node)}`;
    else if (/Pelajari Solusi|Detail Layanan/.test(plain))
      href = "/layanan/sistem-informasi";
    else if (/Pilih Paket|Pesan Paket|Mulai Proyek|Pesan Sekarang/.test(plain))
      href = `/pesan?paket=${/Mobile|Flutter/.test(label(parent)) ? "mobile-flutter" : /Informasi|Instansi/.test(label(parent)) ? "sistem-informasi" : "starter-umkm"}`;
    if (href) return `<Link href=${q(href)}${props}>${body(true)}</Link>`;
    return `<UiAction label=${q(plain || t || "Opsi")}${props}>${body(true)}</UiAction>`;
  }
  if (n === "details") return `<FaqItem${props}>${body()}</FaqItem>`;
  if (
    !insideControl &&
    isLeaf &&
    ["site/beranda", "site/daftar-portofolio"].includes(screenKey) &&
    projectPatterns.some(([pattern]) => pattern.test(t)) &&
    /text-\[(?:16|18|20)px\]/.test(c)
  )
    return `<Link href=${q(`/proyek/${nearbyProject(node)}`)}${props}>${body(true)}</Link>`;
  return `<${tag}${props}>${body()}</${tag}>`;
}

await mkdir(target, { recursive: true });
await mkdir("public", { recursive: true });
await cp(join(source, "assets/fonts"), "public/fonts", { recursive: true });
await cp(join(source, "assets/img"), "public/images", { recursive: true });
await cp("prototype/brand", "public/brand", { recursive: true });

const imports = `import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { ReferenceImage } from "@/components/public/ReferenceImage";
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import { UiAction, EditableField, SearchField, FilterButton, FilterDropdown, FilterItem, DataRows, FaqItem, NavLink, ScreenState, ToggleControl } from "@/components/preview/Controls";
import { LoginForm } from "@/components/admin/LoginForm";
import { ContactForm } from "@/components/public/ContactForm";
import { CalculatorProvider, CalculatorOption, CalculatorValue, CalculatorItemDays, CalculatorUnits, CalculatorBreakdown, CalculatorContact, CalculatorSend } from "@/components/public/Calculator";
import { BookingProvider, BookingCalendar, BookingSlots, BookingValue } from "@/components/public/Booking";\n`;
let count = 0;
for (const area of ["site", "cms", "system"]) {
  await mkdir(join(target, area), { recursive: true });
  for (const file of (await readdir(join(source, area)))
    .filter((f) => f.endsWith(".html"))
    .sort()) {
    screenKey = `${area}/${file.slice(0, -5)}`;
    const document = parse(await readFile(join(source, area, file), "utf8"));
    const bodyNode = find(document, (n) => n.tagName === "body");
    headingUsed = false;
    const component = `${pascal(area)}${pascal(file.slice(0, -5))}`;
    let jsx = elements(bodyNode)
      .map((node) => render(node, bodyNode))
      .join("\n");
    if (screenKey === "site/kalkulator-estimasi-biaya")
      jsx = `<CalculatorProvider>${jsx}</CalculatorProvider>`;
    if (screenKey === "site/booking-konsultasi")
      jsx = `<BookingProvider initialNow={new Date().toISOString()}>${jsx}</BookingProvider>`;
    const usedImports = imports
      .split("\n")
      .filter((line) => {
        if (!line) return false;
        const names = line
          .match(/import\s+{([^}]+)}/)?.[1]
          ?.split(",")
          .map((s) => s.trim());
        if (names) {
          const used = names.filter(
            (n) => new RegExp(`<${n}[\\s/>]`).test(jsx) || n === "ScreenState",
          );
          if (!used.length) return false;
          return true;
        }
        return /<Link\b/.test(jsx);
      })
      .map((line) =>
        line.replace(
          /{([^}]+)}/,
          (_, list) =>
            `{ ${list
              .split(",")
              .map((s) => s.trim())
              .filter(
                (n) =>
                  new RegExp(`<${n}[\\s/>]`).test(jsx) || n === "ScreenState",
              )
              .join(", ")} }`,
        ),
      )
      .join("\n");
    await writeTsx(
      join(target, area, `${file.slice(0, -5)}.tsx`),
      `// Ported from ${source}/${area}/${file}. Prototype remains read-only.\n${usedImports}\nexport default function ${component}() {\nreturn <ScreenState screen=${q(screenKey)}>${jsx}</ScreenState>;\n}\n`,
    );
    count++;
  }
}

// A shared header uses the same markup, type scale, and measurements as the original home.
screenKey = "site/beranda";
const home = parse(await readFile(join(source, "site/beranda.html"), "utf8"));
rawHeader = true;
headingUsed = true;
const headerJsx = render(
  find(home, (n) => name(n) === "header"),
  null,
);
await writeTsx(
  "src/components/public/PublicHeader.tsx",
  `import Link from "next/link";\nimport { NavLink } from "@/components/preview/Controls";\nimport { ReferenceImage } from "./ReferenceImage";\nexport function PublicHeader() { return (${headerJsx}); }\n`,
);

console.log(
  `Migrated ${count} screens into standalone React TSX. No prototype runtime dependency.`,
);
