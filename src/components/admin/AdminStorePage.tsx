"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { z } from "zod";
import {
  activateOrderLicenseAction,
  addOrderDownloadQuotaAction,
  deleteDigitalCouponAction,
  finalizeStoreVideoUploadAction,
  finalizeStoreZipUploadAction,
  getOrderPaymentProofUrlAction,
  listDigitalCouponsAction,
  listDigitalOrdersAction,
  listDigitalProductsAction,
  listStoreReviewsAction,
  moderateStoreReviewAction,
  prepareStoreVideoUploadAction,
  prepareStoreZipUploadAction,
  publishDigitalProductAction,
  regenerateOrderPinAction,
  saveDigitalCouponAction,
  saveDigitalProductAction,
  setOrderRevokedAction,
  trashDigitalProductAction,
} from "@/actions/admin/store";
import {
  createMediaUploadAction,
  finalizeMediaUploadAction,
  listMediaAction,
} from "@/actions/admin/media";
import { getAdminNavigationRoleAction } from "@/actions/admin/navigation";
import { AdminFrame } from "./AdminFrame";
import { BentoCard, Chip, EmptyState, SearchField, TabFilter, ToolbarButton } from "./AdminUi";
import {
  digitalCouponInputSchema,
  digitalCouponRecordSchema,
  digitalOrderAdminRecordSchema,
  digitalProductInputSchema,
  digitalProductRecordSchema,
  storeReviewAdminRecordSchema,
  type DigitalCouponInput,
  type DigitalCouponRecord,
  type DigitalOrderAdminRecord,
  type DigitalProductInput,
  type DigitalProductRecord,
  type StoreReviewAdminRecord,
} from "@/schemas/store";
import { mediaAssetSchema, type MediaAsset } from "@/schemas/media";
import { dateWib, rupiah } from "@/lib/format";

type Role = "owner" | "editor" | null;

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";
const areaClass =
  "w-full rounded-[10px] bg-[#f0f0f0] p-3 text-xs text-[#18181a] outline-none border border-transparent focus:border-[#18181a] resize-y";

type ProductFilter = "all" | "source_code" | "ui_template" | "trash";
type OrderFilter = "all" | "pending" | "paid" | "revoked";
type Tab = "catalog" | "orders" | "coupons" | "reviews";

function blankProduct(): DigitalProductInput {
  return {
    title: "",
    slug: "",
    productType: "source_code",
    tagline: "",
    summary: "",
    thumbnailMediaId: null,
    gallery: [],
    demoUrl: null,
    videoUrl: null,
    videoKey: null,
    relatedProjectId: null,
    priceSingle: 0,
    priceCommercial: null,
    compareAtPriceSingle: null,
    compareAtPriceCommercial: null,
    setupServicePrice: null,
    packageSizeBytes: null,
    changelog: "",
    techStack: [],
    features: [],
    includedFiles: [],
    version: "1.0.0",
    privateFileId: null,
    githubRepoInfo: null,
    isFeatured: false,
    sortOrder: 0,
  };
}

function inputFromProduct(record: DigitalProductRecord): DigitalProductInput {
  return digitalProductInputSchema.parse({
    title: record.title,
    slug: record.slug,
    productType: record.productType,
    tagline: record.tagline,
    summary: record.summary,
    thumbnailMediaId: record.thumbnailMediaId,
    gallery: record.gallery,
    demoUrl: record.demoUrl,
    videoUrl: record.videoUrl,
    videoKey: null,
    relatedProjectId: record.relatedProjectId,
    priceSingle: record.priceSingle,
    priceCommercial: record.priceCommercial,
    compareAtPriceSingle: record.compareAtPriceSingle,
    compareAtPriceCommercial: record.compareAtPriceCommercial,
    setupServicePrice: record.setupServicePrice,
    packageSizeBytes: record.packageSizeBytes,
    changelog: record.changelog,
    techStack: record.techStack,
    features: record.features,
    includedFiles: record.includedFiles,
    version: record.version,
    privateFileId: record.privateFileId,
    githubRepoInfo: record.githubRepoInfo,
    isFeatured: record.isFeatured,
    sortOrder: record.sortOrder,
  });
}

function blankCoupon(): DigitalCouponInput {
  return {
    code: "",
    description: "",
    discountType: "percent",
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: null,
    maxUses: null,
    productId: null,
    isActive: true,
    expiresAt: null,
  };
}

function toLines(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toChips(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AdminStorePage() {
  const [tab, setTab] = useState<Tab>("catalog");
  const [role, setRole] = useState<Role>(null);

  const [products, setProducts] = useState<DigitalProductRecord[]>([]);
  const [filter, setFilter] = useState<ProductFilter>("all");
  const [query, setQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [value, setValue] = useState<DigitalProductInput>(blankProduct);
  const [techText, setTechText] = useState("");
  const [featureText, setFeatureText] = useState("");
  const [includedText, setIncludedText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [zipState, setZipState] = useState("");

  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null);
  const [mediaQuery, setMediaQuery] = useState("");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  const [orders, setOrders] = useState<DigitalOrderAdminRecord[]>([]);
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [activation, setActivation] = useState<{
    orderCode: string;
    rawPin: string;
    whatsappDeliveryUrl: string | null;
  } | null>(null);

  const [coupons, setCoupons] = useState<DigitalCouponRecord[]>([]);
  const [couponId, setCouponId] = useState<string | null>(null);
  const [couponValue, setCouponValue] = useState<DigitalCouponInput>(blankCoupon);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  const [reviews, setReviews] = useState<StoreReviewAdminRecord[]>([]);
  const [reviewReplies, setReviewReplies] = useState<Record<string, string>>({});
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const [imageState, setImageState] = useState("");
  const [videoState, setVideoState] = useState("");

  useEffect(() => {
    let active = true;
    void getAdminNavigationRoleAction().then((result) => {
      if (active && result.ok) setRole(result.data.role);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const options = {
          limit: 100,
          offset: 0,
          ...(filter === "source_code" || filter === "ui_template"
            ? { productType: filter }
            : {}),
          ...(filter === "trash" ? { trashOnly: true } : {}),
          ...(query.trim() ? { query: query.trim() } : {}),
        };
        const result = await listDigitalProductsAction(options);
        if (!active) return;
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setProducts(z.array(digitalProductRecordSchema).parse(result.data));
      } catch {
        if (active) setError("Daftar produk digital tidak dapat dimuat.");
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [filter, query, reloadKey]);

  useEffect(() => {
    if (tab !== "orders" || role !== "owner") return;
    let active = true;
    async function load() {
      setIsLoadingOrders(true);
      setError("");
      try {
        const options = {
          limit: 100,
          offset: 0,
          ...(orderFilter === "paid"
            ? { paymentStatus: "paid" as const }
            : orderFilter === "pending"
              ? { paymentStatus: "pending" as const }
              : {}),
          ...(orderFilter === "revoked" ? { revoked: true } : {}),
        };
        const result = await listDigitalOrdersAction(options);
        if (!active) return;
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setOrders(z.array(digitalOrderAdminRecordSchema).parse(result.data));
      } catch {
        if (active) setError("Daftar pesanan digital tidak dapat dimuat.");
      } finally {
        if (active) setIsLoadingOrders(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [tab, orderFilter, role, reloadKey]);

  useEffect(() => {
    if (tab !== "coupons" || role !== "owner") return;
    let active = true;
    async function load() {
      setIsLoadingCoupons(true);
      setError("");
      try {
        const result = await listDigitalCouponsAction();
        if (!active) return;
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setCoupons(z.array(digitalCouponRecordSchema).parse(result.data));
      } catch {
        if (active) setError("Daftar kupon tidak dapat dimuat.");
      } finally {
        if (active) setIsLoadingCoupons(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [tab, role, reloadKey]);

  useEffect(() => {
    if (tab !== "reviews" || role === null) return;
    let active = true;
    async function load() {
      setIsLoadingReviews(true);
      setError("");
      try {
        const result = await listStoreReviewsAction();
        if (!active) return;
        if (!result.ok) {
          setError(result.message);
          return;
        }
        const rows = z.array(storeReviewAdminRecordSchema).parse(result.data);
        setReviews(rows);
        setReviewReplies(
          Object.fromEntries(rows.map((row) => [row.id, row.adminReply ?? ""])),
        );
      } catch {
        if (active) setError("Daftar ulasan tidak dapat dimuat.");
      } finally {
        if (active) setIsLoadingReviews(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [tab, role, reloadKey]);

  function startNew() {
    setEditingId(null);
    setValue(blankProduct());
    setTechText("");
    setFeatureText("");
    setIncludedText("");
    setSelectedMedia(null);
    setZipState("");
    setImageState("");
    setVideoState("");
    setError("");
    setStatus("");
  }

  function editProduct(record: DigitalProductRecord) {
    setEditingId(record.id);
    setValue(inputFromProduct(record));
    setTechText(record.techStack.join(", "));
    setFeatureText(record.features.join("\n"));
    setIncludedText(record.includedFiles.join("\n"));
    setSelectedMedia(null);
    setZipState("");
    setError("");
    setStatus("");
  }

  async function loadMedia(search: string) {
    if (isLoadingMedia) return;
    setIsLoadingMedia(true);
    try {
      const result = await listMediaAction({
        query: search.trim() || undefined,
        limit: 30,
        offset: 0,
      });
      if (result.ok) setMediaAssets(z.array(mediaAssetSchema).parse(result.data));
      else setError(result.message);
    } catch {
      setError("Daftar media tidak dapat dimuat.");
    } finally {
      setIsLoadingMedia(false);
    }
  }

  function productPayload(): DigitalProductInput | null {
    const parsed = digitalProductInputSchema.safeParse({
      ...value,
      techStack: toChips(techText),
      features: toLines(featureText),
      includedFiles: toLines(includedText),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa kembali data produk.");
      return null;
    }
    return parsed.data;
  }

  async function save(publish: boolean) {
    if (isSubmitting) return;
    const payload = productPayload();
    if (!payload) return;
    setIsSubmitting(true);
    setError("");
    setStatus("");
    try {
      const saved = await saveDigitalProductAction({ id: editingId, value: payload });
      if (!saved.ok) {
        setError(saved.message);
        return;
      }
      if (publish) {
        const published = await publishDigitalProductAction({
          id: saved.data,
          published: true,
        });
        if (!published.ok) {
          setError(published.message);
          setEditingId(saved.data);
          setReloadKey((c) => c + 1);
          return;
        }
      }
      setStatus(
        publish
          ? "Produk digital disimpan dan diterbitkan."
          : "Produk digital disimpan sebagai draft.",
      );
      setEditingId(saved.data);
      setReloadKey((c) => c + 1);
    } catch {
      setError("Produk digital tidak dapat disimpan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void save(false);
  }

  async function togglePublish(record: DigitalProductRecord) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    setStatus("");
    try {
      const next = record.status !== "published";
      const result = await publishDigitalProductAction({ id: record.id, published: next });
      if (!result.ok) setError(result.message);
      else {
        setStatus(next ? "Produk diterbitkan." : "Produk ditarik ke draft.");
        setReloadKey((c) => c + 1);
      }
    } catch {
      setError("Status produk tidak dapat diperbarui.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function setTrash(record: DigitalProductRecord, trashed: boolean) {
    const prompt = trashed
      ? `Pindahkan “${record.title}” ke Trash?`
      : `Pulihkan “${record.title}” dari Trash sebagai draft?`;
    if (isSubmitting || !window.confirm(prompt)) return;
    setIsSubmitting(true);
    setError("");
    setStatus("");
    try {
      const result = await trashDigitalProductAction({ id: record.id, trashed });
      if (!result.ok) setError(result.message);
      else {
        if (editingId === record.id) startNew();
        setStatus(trashed ? "Produk dipindahkan ke Trash." : "Produk dipulihkan.");
        setReloadKey((c) => c + 1);
      }
    } catch {
      setError("Status Trash tidak dapat diperbarui.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function uploadZip(file: File) {
    if (!editingId) {
      setError("Simpan produk terlebih dahulu sebelum mengunggah paket .zip.");
      return;
    }
    setZipState("Meminta tautan unggah...");
    setError("");
    try {
      const prepared = await prepareStoreZipUploadAction({
        productId: editingId,
        filename: file.name,
      });
      if (!prepared.ok) {
        setError(prepared.message);
        setZipState("");
        return;
      }
      setZipState("Mengunggah arsip ke penyimpanan privat...");
      const put = await fetch(prepared.data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/zip" },
        body: file,
      });
      if (!put.ok) {
        setError("Unggah berkas .zip ke penyimpanan privat gagal.");
        setZipState("");
        return;
      }
      setZipState("Memverifikasi arsip ZIP...");
      const finalized = await finalizeStoreZipUploadAction({
        productId: editingId,
        key: prepared.data.key,
        filename: file.name,
      });
      if (!finalized.ok) {
        setError(finalized.message);
        setZipState("");
        return;
      }
      setStatus(`Paket .zip terpasang: ${finalized.data.filename}`);
      setZipState("");
      setReloadKey((c) => c + 1);
    } catch {
      setError("Paket .zip tidak dapat diunggah.");
      setZipState("");
    }
  }

  async function uploadImageFile(file: File, alt: string): Promise<string | null> {
    const prepared = await createMediaUploadAction({
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    });
    if (!prepared.ok) {
      setError(prepared.message);
      return null;
    }
    const put = await fetch(prepared.data.uploadUrl, {
      method: "PUT",
      headers: prepared.data.headers,
      body: file,
    });
    if (!put.ok) {
      setError("Unggah gambar ke penyimpanan media gagal.");
      return null;
    }
    const finalized = await finalizeMediaUploadAction({
      id: prepared.data.id,
      alt,
    });
    if (!finalized.ok) {
      setError(finalized.message);
      return null;
    }
    return finalized.data.id;
  }

  async function uploadThumbnail(file: File) {
    setImageState("Mengunggah gambar sampul...");
    setError("");
    try {
      const id = await uploadImageFile(file, value.title || "Sampul produk");
      if (id) {
        setValue((c) => ({ ...c, thumbnailMediaId: id }));
        setSelectedMedia(null);
        setStatus("Gambar sampul terpasang.");
      }
    } catch {
      setError("Gambar sampul tidak dapat diunggah.");
    } finally {
      setImageState("");
    }
  }

  async function uploadGallery(files: FileList) {
    setImageState("Mengunggah galeri...");
    setError("");
    try {
      const next = [...value.gallery];
      for (const file of Array.from(files)) {
        const id = await uploadImageFile(file, value.title || "Galeri produk");
        if (!id) break;
        next.push({ mediaId: id });
      }
      setValue((c) => ({ ...c, gallery: next }));
      if (next.length > value.gallery.length) setStatus("Galeri produk diperbarui.");
    } catch {
      setError("Galeri produk tidak dapat diunggah.");
    } finally {
      setImageState("");
    }
  }

  function moveGallery(index: number, direction: -1 | 1) {
    setValue((c) => {
      const next = [...c.gallery];
      const target = index + direction;
      if (target < 0 || target >= next.length) return c;
      const current = next[index];
      const swap = next[target];
      if (!current || !swap) return c;
      next[index] = swap;
      next[target] = current;
      return { ...c, gallery: next };
    });
  }

  async function uploadVideo(file: File) {
    if (!editingId) {
      setError("Simpan produk terlebih dahulu sebelum mengunggah video.");
      return;
    }
    setVideoState("Meminta tautan unggah video...");
    setError("");
    try {
      const prepared = await prepareStoreVideoUploadAction({
        productId: editingId,
        filename: file.name,
        mimeType: file.type as "video/mp4" | "video/webm",
      });
      if (!prepared.ok) {
        setError(prepared.message);
        setVideoState("");
        return;
      }
      setVideoState("Mengunggah video...");
      const put = await fetch(prepared.data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) {
        setError("Unggah video ke penyimpanan publik gagal.");
        setVideoState("");
        return;
      }
      setVideoState("Memverifikasi video...");
      const finalized = await finalizeStoreVideoUploadAction({
        productId: editingId,
        key: prepared.data.key,
      });
      if (!finalized.ok) {
        setError(finalized.message);
        setVideoState("");
        return;
      }
      setValue((c) => ({ ...c, videoUrl: finalized.data.url }));
      setStatus("Video demo terpasang.");
      setVideoState("");
    } catch {
      setError("Video demo tidak dapat diunggah.");
      setVideoState("");
    }
  }

  async function saveCoupon() {
    if (isSubmitting) return;
    const parsed = digitalCouponInputSchema.safeParse(couponValue);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa kembali data kupon.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setStatus("");
    try {
      const result = await saveDigitalCouponAction({
        ...parsed.data,
        id: couponId,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus("Kupon disimpan.");
      setCouponId(result.data.id);
      setReloadKey((c) => c + 1);
    } catch {
      setError("Kupon tidak dapat disimpan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeCoupon(id: string) {
    if (isSubmitting || !window.confirm("Hapus kupon ini?")) return;
    setIsSubmitting(true);
    setError("");
    setStatus("");
    try {
      const result = await deleteDigitalCouponAction({ id });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus("Kupon dihapus.");
      if (couponId === id) {
        setCouponId(null);
        setCouponValue(blankCoupon());
      }
      setReloadKey((c) => c + 1);
    } catch {
      setError("Kupon tidak dapat dihapus.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function moderate(
    record: StoreReviewAdminRecord,
    patch: { status?: "approved" | "hidden"; adminReply?: string | null },
  ) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    setStatus("");
    try {
      const result = await moderateStoreReviewAction({ id: record.id, ...patch });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus("Ulasan diperbarui.");
      setReloadKey((c) => c + 1);
    } catch {
      setError("Ulasan tidak dapat diperbarui.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function runOrderAction(
    run: () => Promise<
      { ok: true; data: unknown } | { ok: false; message: string }
    >,
    successMessage: string,
  ) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    setStatus("");
    try {
      const result = await run();
      if (!result.ok) setError(result.message);
      else {
        setStatus(successMessage);
        setReloadKey((c) => c + 1);
      }
    } catch {
      setError("Aksi lisensi tidak dapat dijalankan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function activate(record: DigitalOrderAdminRecord) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    setStatus("");
    try {
      const result = await activateOrderLicenseAction({ id: record.id });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setActivation(result.data);
      setStatus("Lisensi diaktifkan. Kirim PIN ke pembeli via WhatsApp.");
      setReloadKey((c) => c + 1);
    } catch {
      setError("Lisensi tidak dapat diaktifkan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resetPin(record: DigitalOrderAdminRecord) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    setStatus("");
    try {
      const result = await regenerateOrderPinAction({ id: record.id });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setActivation(result.data);
      setStatus("PIN lisensi baru dibuat.");
      setReloadKey((c) => c + 1);
    } catch {
      setError("PIN lisensi tidak dapat dibuat ulang.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const adminTabs: Array<{ id: Tab; label: string }> = [
    { id: "catalog", label: "Katalog" },
    { id: "orders", label: "Pesanan" },
    ...(role === "owner"
      ? [{ id: "coupons" as const, label: "Kupon" }]
      : []),
    { id: "reviews", label: "Ulasan" },
  ];

  return (
    <AdminFrame
      title="Digital Store"
      description="Katalog source code & template UI/UX dengan paket .zip di bucket privat R2, kode lisensi, dan kuota unduhan terkendali."
      screenKey="cms/digital-store"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <TabFilter
            tabs={adminTabs}
            active={tab}
            onChange={(next) => setTab(next)}
          />
          {tab === "catalog" ? (
            <>
              <ToolbarButton href="/store" variant="light" icon="open_in_new">
                Lihat Publik
              </ToolbarButton>
              <ToolbarButton variant="dark" icon="add" onClick={startNew}>
                Tambah Produk
              </ToolbarButton>
            </>
          ) : null}
        </div>
      }
    >
      {error ? (
        <div className="mb-4 flex items-center gap-2 rounded-[12px] border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
          <span className="symbol text-base">error</span>
          <span>{error}</span>
        </div>
      ) : null}
      {status ? (
        <div className="mb-4 flex items-center gap-2 rounded-[12px] border border-green-200 bg-green-50 p-3.5 text-xs text-green-900">
          <span className="symbol text-base">check_circle</span>
          <span>{status}</span>
        </div>
      ) : null}

      {tab === "catalog" ? (
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.3fr_1fr]">
          <BentoCard>
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="m-0 text-base font-semibold text-[#18181a]">
                  Katalog Produk Digital
                </h2>
                <p className="mt-0.5 text-xs text-[#71717a]">
                  Source code proyek & template UI/UX HTML
                </p>
              </div>
              <ToolbarButton
                variant="light"
                icon="sync"
                onClick={() => setReloadKey((c) => c + 1)}
                disabled={isLoading || isSubmitting}
              >
                Refresh
              </ToolbarButton>
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="w-full sm:w-64">
                <SearchField
                  value={query}
                  onChange={setQuery}
                  placeholder="Cari judul, tagline..."
                />
              </div>
              <TabFilter
                tabs={[
                  { id: "all", label: "Semua" },
                  { id: "source_code", label: "Source Code" },
                  { id: "ui_template", label: "Template UI/UX" },
                  { id: "trash", label: "Trash" },
                ]}
                active={filter}
                onChange={(next) => setFilter(next)}
              />
            </div>

            {isLoading ? (
              <p className="py-8 text-center text-xs text-[#71717a]">Memuat produk...</p>
            ) : products.length === 0 ? (
              <EmptyState
                icon="shopping_bag"
                title="Belum ada produk digital"
                description="Tambahkan produk pertama untuk mulai menjual source code atau template UI/UX."
              />
            ) : (
              <div className="grid gap-2.5">
                {products.map((record) => (
                  <div
                    key={record.id}
                    className={`rounded-[12px] border p-3.5 transition-all ${
                      editingId === record.id
                        ? "border-[#18181a] bg-[#fafafa] shadow-sm ring-1 ring-[#18181a]"
                        : "border-[#eaeaea] bg-white hover:bg-[#fcfcfc]"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="m-0 text-sm font-semibold text-[#18181a]">
                            {record.title}
                          </h3>
                          <Chip
                            variant={
                              record.deletedAt
                                ? "neutral"
                                : record.status === "published"
                                  ? "lime"
                                  : "warning"
                            }
                            size="sm"
                          >
                            {record.deletedAt
                              ? "Trash"
                              : record.status === "published"
                                ? "Published"
                                : "Draft"}
                          </Chip>
                          <Chip variant="neutral" size="sm">
                            {record.productType === "ui_template"
                              ? "HTML UI/UX"
                              : "Source Code"}
                          </Chip>
                          <Chip
                            variant={record.privateFileId ? "success" : "danger"}
                            size="sm"
                          >
                            {record.privateFileId ? "ZIP Siap" : "Belum Ada ZIP"}
                          </Chip>
                          {record.isFeatured ? (
                            <Chip variant="dark" size="sm">
                              Unggulan
                            </Chip>
                          ) : null}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-mono text-[#71717a]">
                          <span>/store/{record.slug}</span>
                          <span>· v{record.version}</span>
                          <span>· Single {rupiah(record.priceSingle)}</span>
                          {record.priceCommercial !== null ? (
                            <span>· Commercial {rupiah(record.priceCommercial)}</span>
                          ) : null}
                        </div>
                        {record.tagline ? (
                          <p className="m-0 mt-1.5 line-clamp-2 text-xs text-[#52525b]">
                            {record.tagline}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-1.5 self-end sm:self-start">
                        {record.deletedAt ? (
                          <ToolbarButton
                            variant="light"
                            disabled={isSubmitting}
                            onClick={() => void setTrash(record, false)}
                          >
                            Pulihkan
                          </ToolbarButton>
                        ) : (
                          <>
                            <ToolbarButton
                              variant="light"
                              disabled={isSubmitting}
                              onClick={() => editProduct(record)}
                            >
                              Ubah
                            </ToolbarButton>
                            <ToolbarButton
                              variant="light"
                              disabled={isSubmitting}
                              onClick={() => void togglePublish(record)}
                            >
                              {record.status === "published" ? "Tarik" : "Terbitkan"}
                            </ToolbarButton>
                            <ToolbarButton
                              variant="danger"
                              disabled={isSubmitting}
                              onClick={() => void setTrash(record, true)}
                            >
                              Trash
                            </ToolbarButton>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>

          <BentoCard className="sticky top-20">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#eaeaea] pb-3">
              <div>
                <h2 className="m-0 text-base font-semibold text-[#18181a]">
                  {editingId ? "Ubah Produk" : "Buat Produk Baru"}
                </h2>
                <p className="mt-0.5 text-xs text-[#71717a]">
                  Simpan draft atau terbitkan langsung ke /store
                </p>
              </div>
              {editingId ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={startNew}
                  className="text-xs font-medium text-[#71717a] underline hover:text-[#18181a]"
                >
                  Batal Edit
                </button>
              ) : null}
            </div>

            <form onSubmit={submitForm} className="grid gap-3.5">
              <fieldset disabled={isSubmitting} className="m-0 grid gap-3 border-0 p-0">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Judul Produk
                  <input
                    required
                    maxLength={250}
                    value={value.title}
                    onChange={(e) => setValue((c) => ({ ...c, title: e.target.value }))}
                    className={inputClass}
                    placeholder="Nama source code / template"
                  />
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Slug URL
                    <input
                      required
                      maxLength={120}
                      value={value.slug}
                      onChange={(e) => setValue((c) => ({ ...c, slug: e.target.value }))}
                      className={inputClass}
                      placeholder="kebab-case-slug"
                    />
                  </label>
                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Versi
                    <input
                      maxLength={40}
                      value={value.version}
                      onChange={(e) => setValue((c) => ({ ...c, version: e.target.value }))}
                      className={inputClass}
                      placeholder="1.0.0"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Tipe Produk
                    <select
                      value={value.productType}
                      onChange={(e) =>
                        setValue((c) => ({
                          ...c,
                          productType: e.target.value as DigitalProductInput["productType"],
                        }))
                      }
                      className={inputClass}
                    >
                      <option value="source_code">Source Code Proyek</option>
                      <option value="ui_template">Template UI/UX HTML</option>
                    </select>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 pt-6 text-xs font-medium text-[#18181a]">
                    <input
                      type="checkbox"
                      checked={value.isFeatured}
                      onChange={(e) =>
                        setValue((c) => ({ ...c, isFeatured: e.target.checked }))
                      }
                      className="rounded border-[#d4d4d8]"
                    />
                    Tandai Produk Unggulan
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Harga Single License (Rp)
                    <input
                      type="number"
                      min={0}
                      value={value.priceSingle}
                      onChange={(e) =>
                        setValue((c) => ({ ...c, priceSingle: Number(e.target.value || 0) }))
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Harga Commercial License (Rp, opsional)
                    <input
                      type="number"
                      min={0}
                      value={value.priceCommercial ?? ""}
                      onChange={(e) =>
                        setValue((c) => ({
                          ...c,
                          priceCommercial: e.target.value ? Number(e.target.value) : null,
                        }))
                      }
                      className={inputClass}
                      placeholder="Kosongkan bila tidak tersedia"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Harga Coret Single License (Rp, opsional)
                    <input
                      type="number"
                      min={0}
                      value={value.compareAtPriceSingle ?? ""}
                      onChange={(e) =>
                        setValue((c) => ({
                          ...c,
                          compareAtPriceSingle: e.target.value
                            ? Number(e.target.value)
                            : null,
                        }))
                      }
                      className={inputClass}
                      placeholder="Harga sebelum diskon"
                    />
                  </label>
                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Harga Coret Commercial (Rp, opsional)
                    <input
                      type="number"
                      min={0}
                      value={value.compareAtPriceCommercial ?? ""}
                      onChange={(e) =>
                        setValue((c) => ({
                          ...c,
                          compareAtPriceCommercial: e.target.value
                            ? Number(e.target.value)
                            : null,
                        }))
                      }
                      className={inputClass}
                      placeholder="Harga sebelum diskon"
                    />
                  </label>
                </div>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Biaya Add-On Jasa Instalasi &amp; Deploy (Rp, opsional)
                  <input
                    type="number"
                    min={0}
                    value={value.setupServicePrice ?? ""}
                    onChange={(e) =>
                      setValue((c) => ({
                        ...c,
                        setupServicePrice: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                    className={inputClass}
                    placeholder="Kosongkan bila tidak menawarkan add-on"
                  />
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Changelog / Catatan Rilis Versi
                  <textarea
                    rows={4}
                    maxLength={10000}
                    value={value.changelog}
                    onChange={(e) =>
                      setValue((c) => ({ ...c, changelog: e.target.value }))
                    }
                    className={areaClass}
                    placeholder="v1.1.0 — Menambahkan modul pembayaran&#10;v1.0.0 — Rilis awal"
                  />
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Tagline
                  <input
                    maxLength={500}
                    value={value.tagline}
                    onChange={(e) => setValue((c) => ({ ...c, tagline: e.target.value }))}
                    className={inputClass}
                    placeholder="Satu kalimat penjelas utama"
                  />
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Deskripsi / Ringkasan
                  <textarea
                    rows={4}
                    maxLength={10000}
                    value={value.summary}
                    onChange={(e) => setValue((c) => ({ ...c, summary: e.target.value }))}
                    className={areaClass}
                    placeholder="Penjelasan lengkap produk..."
                  />
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Tech Stack (pisahkan dengan koma atau baris)
                  <textarea
                    rows={2}
                    value={techText}
                    onChange={(e) => setTechText(e.target.value)}
                    className={areaClass}
                    placeholder="Next.js, Drizzle, PostgreSQL"
                  />
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Fitur / Deliverables (1 per baris)
                  <textarea
                    rows={3}
                    value={featureText}
                    onChange={(e) => setFeatureText(e.target.value)}
                    className={areaClass}
                    placeholder="Autentikasi & RBAC&#10;Dashboard admin"
                  />
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Isi File Paket .ZIP (1 per baris)
                  <textarea
                    rows={3}
                    value={includedText}
                    onChange={(e) => setIncludedText(e.target.value)}
                    className={areaClass}
                    placeholder="Source code lengkap&#10;Panduan instalasi.pdf"
                  />
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    URL Live Demo (opsional)
                    <input
                      value={value.demoUrl ?? ""}
                      onChange={(e) =>
                        setValue((c) => ({ ...c, demoUrl: e.target.value || null }))
                      }
                      className={inputClass}
                      placeholder="https://demo..."
                    />
                  </label>
                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Info Repo GitHub (opsional)
                    <input
                      maxLength={250}
                      value={value.githubRepoInfo ?? ""}
                      onChange={(e) =>
                        setValue((c) => ({ ...c, githubRepoInfo: e.target.value || null }))
                      }
                      className={inputClass}
                      placeholder="openbytelabs/nama-repo"
                    />
                  </label>
                </div>

                {/* Thumbnail picker */}
                <div className="rounded-[12px] border border-[#eaeaea] bg-[#f9f9f9] p-3">
                  <span className="mb-2 block text-xs font-medium text-[#18181a]">
                    Gambar Sampul (Thumbnail)
                  </span>
                  {selectedMedia ? (
                    <div className="flex items-center gap-3 rounded-[8px] border border-[#eaeaea] bg-white p-2">
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-[6px] bg-[#f0f0f0]">
                        <Image
                          src={selectedMedia.urls.thumb}
                          alt={selectedMedia.alt || selectedMedia.filename}
                          fill
                          unoptimized
                          sizes="48px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-xs font-medium text-[#18181a]">
                        {selectedMedia.filename}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMedia(null);
                          setValue((c) => ({ ...c, thumbnailMediaId: null }));
                        }}
                        className="text-xs text-[#ba1a1a] hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  ) : (
                    <p className="m-0 text-xs text-[#71717a]">
                      {value.thumbnailMediaId
                        ? `ID Media: ${value.thumbnailMediaId}`
                        : "Belum ada gambar sampul dipilih."}
                    </p>
                  )}
                  <div className="mt-2.5">
                    <ToolbarButton
                      variant="light"
                      icon="image"
                      disabled={isSubmitting || isLoadingMedia}
                      onClick={() => {
                        const next = !isMediaPickerOpen;
                        setIsMediaPickerOpen(next);
                        if (next) void loadMedia(mediaQuery);
                      }}
                    >
                      {isMediaPickerOpen ? "Tutup Pilihan Media" : "Pilih dari Media Library"}
                    </ToolbarButton>
                  </div>
                  {isMediaPickerOpen ? (
                    <div className="mt-3 rounded-[10px] border border-[#eaeaea] bg-white p-3">
                      <div className="mb-2 flex gap-2">
                        <input
                          type="search"
                          value={mediaQuery}
                          onChange={(e) => setMediaQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void loadMedia(mediaQuery);
                            }
                          }}
                          placeholder="Cari berkas..."
                          className="h-8 flex-1 rounded-[6px] bg-[#f0f0f0] px-2.5 text-xs outline-none"
                        />
                        <ToolbarButton variant="light" onClick={() => void loadMedia(mediaQuery)}>
                          Cari
                        </ToolbarButton>
                      </div>
                      {mediaAssets.length ? (
                        <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto p-1">
                          {mediaAssets.map((asset) => (
                            <button
                              key={asset.id}
                              type="button"
                              onClick={() => {
                                setSelectedMedia(asset);
                                setValue((c) => ({ ...c, thumbnailMediaId: asset.id }));
                                setIsMediaPickerOpen(false);
                              }}
                              className="flex items-center gap-2 rounded-[6px] border border-[#eaeaea] p-1.5 text-left hover:border-[#18181a]"
                            >
                              <span className="relative size-8 shrink-0 overflow-hidden rounded bg-[#f0f0f0]">
                                <Image
                                  src={asset.urls.thumb}
                                  alt=""
                                  fill
                                  unoptimized
                                  sizes="32px"
                                  className="object-cover"
                                />
                              </span>
                              <span className="truncate text-[11px] font-medium text-[#18181a]">
                                {asset.filename}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#71717a]">Belum ada aset media.</p>
                      )}
                    </div>
                  ) : null}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-[12px] border border-[#eaeaea] bg-white px-3 py-2 text-[12px] font-medium text-[#18181a] hover:bg-[#f0f0f0]">
                      <span className="symbol text-[16px]" aria-hidden="true">
                        upload
                      </span>
                      Upload Gambar Sampul dari Komputer
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        disabled={isSubmitting}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = "";
                          if (file) void uploadThumbnail(file);
                        }}
                      />
                    </label>
                    {imageState ? (
                      <span className="text-[11px] text-[#52525b]">{imageState}</span>
                    ) : null}
                  </div>
                </div>

                {/* Gallery multi-image uploader */}
                <div className="rounded-[12px] border border-[#eaeaea] bg-[#f9f9f9] p-3">
                  <span className="mb-2 block text-xs font-medium text-[#18181a]">
                    Galeri Screenshot Produk (Multi-Gambar)
                  </span>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-[12px] border border-[#eaeaea] bg-white px-3 py-2 text-[12px] font-medium text-[#18181a] hover:bg-[#f0f0f0]">
                    <span className="symbol text-[16px]" aria-hidden="true">
                      add_photo_alternate
                    </span>
                    Tambah Banyak Gambar dari Komputer
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      className="hidden"
                      disabled={isSubmitting}
                      onChange={(e) => {
                        const files = e.target.files;
                        e.target.value = "";
                        if (files && files.length) void uploadGallery(files);
                      }}
                    />
                  </label>
                  {value.gallery.length ? (
                    <div className="mt-3 grid gap-2">
                      {value.gallery.map((item, index) => (
                        <div
                          key={`${item.mediaId}-${index}`}
                          className="flex items-center gap-2 rounded-[8px] border border-[#eaeaea] bg-white p-2"
                        >
                          <span className="rounded-[4px] bg-[#f0f0f0] px-2 py-0.5 font-mono text-[10px] text-[#52525b]">
                            #{index + 1}
                          </span>
                          <input
                            value={item.caption ?? ""}
                            maxLength={200}
                            placeholder="Caption opsional"
                            onChange={(e) =>
                              setValue((c) => ({
                                ...c,
                                gallery: c.gallery.map((entry, position) =>
                                  position === index
                                    ? {
                                        ...entry,
                                        ...(e.target.value
                                          ? { caption: e.target.value }
                                          : {}),
                                      }
                                    : entry,
                                ),
                              }))
                            }
                            className="h-8 min-w-0 flex-1 rounded-[6px] bg-[#f0f0f0] px-2 text-[11px] outline-none"
                          />
                          <button
                            type="button"
                            aria-label="Naikkan urutan"
                            disabled={index === 0}
                            onClick={() => moveGallery(index, -1)}
                            className="size-7 rounded-[6px] border border-[#eaeaea] text-[11px] disabled:opacity-40"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            aria-label="Turunkan urutan"
                            disabled={index === value.gallery.length - 1}
                            onClick={() => moveGallery(index, 1)}
                            className="size-7 rounded-[6px] border border-[#eaeaea] text-[11px] disabled:opacity-40"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setValue((c) => ({
                                ...c,
                                gallery: c.gallery.filter(
                                  (_, position) => position !== index,
                                ),
                              }))
                            }
                            className="text-[11px] text-[#ba1a1a] hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-[11px] text-[#71717a]">
                      Belum ada gambar galeri.
                    </p>
                  )}
                </div>

                {/* Video showcase uploader */}
                <div className="rounded-[12px] border border-[#eaeaea] bg-[#f9f9f9] p-3">
                  <span className="mb-1 block text-xs font-medium text-[#18181a]">
                    Video Demo / Screen Recording Produk (.MP4 / .WebM)
                  </span>
                  {value.videoUrl ? (
                    <div className="mb-2 grid gap-2">
                      <video
                        src={value.videoUrl}
                        controls
                        preload="metadata"
                        className="w-full rounded-[8px]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setValue((c) => ({ ...c, videoUrl: null, videoKey: null }))
                        }
                        className="justify-self-start text-[11px] text-[#ba1a1a] hover:underline"
                      >
                        Hapus Video
                      </button>
                    </div>
                  ) : (
                    <p className="m-0 mb-2 text-[11px] text-[#71717a]">
                      Belum ada video demo. Maksimal 100 MB.
                    </p>
                  )}
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-[12px] border border-[#eaeaea] bg-white px-3 py-2 text-[12px] font-medium text-[#18181a] hover:bg-[#f0f0f0]">
                    <span className="symbol text-[16px]" aria-hidden="true">
                      video_file
                    </span>
                    Upload Video dari Komputer
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      className="hidden"
                      disabled={isSubmitting || !editingId}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        if (file) void uploadVideo(file);
                      }}
                    />
                  </label>
                  {!editingId ? (
                    <p className="mt-1 text-[11px] text-[#c2410c]">
                      Simpan produk terlebih dahulu untuk mengaktifkan unggahan video.
                    </p>
                  ) : null}
                  {videoState ? (
                    <p className="mt-1 text-[11px] text-[#52525b]">{videoState}</p>
                  ) : null}
                </div>
              </fieldset>

              {/* Private ZIP uploader */}
              <div className="rounded-[12px] border border-[#eaeaea] bg-[#fcfcfc] p-3">
                <span className="mb-1 block text-xs font-semibold text-[#18181a]">
                  Uploader Paket .ZIP Terproteksi (R2 Private)
                </span>
                <p className="m-0 mb-2 text-[11px] text-[#71717a]">
                  Maksimal 200 MB. Berkas disimpan di bucket privat dan hanya dapat
                  diunduh melalui tautan berlisensi 60 detik.
                </p>
                <input
                  type="file"
                  accept=".zip,application/zip"
                  disabled={isSubmitting || !editingId}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) void uploadZip(file);
                  }}
                  className="block w-full text-xs text-[#52525b]"
                />
                {!editingId ? (
                  <p className="mt-1 text-[11px] text-[#c2410c]">
                    Simpan produk terlebih dahulu untuk mengaktifkan unggahan.
                  </p>
                ) : null}
                {zipState ? (
                  <p className="mt-1 text-[11px] text-[#52525b]">{zipState}</p>
                ) : null}
                {editingId && value.privateFileId ? (
                  <p className="mt-1 font-mono text-[11px] text-[#457c1d]">
                    Paket terpasang · fileId {value.privateFileId}
                  </p>
                ) : null}
              </div>

              <div className="flex gap-2 pt-2">
                <ToolbarButton
                  type="submit"
                  variant="light"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Draft"}
                </ToolbarButton>
                <ToolbarButton
                  type="button"
                  variant="dark"
                  disabled={isSubmitting}
                  onClick={() => void save(true)}
                  className="flex-1"
                >
                  Simpan &amp; Terbitkan
                </ToolbarButton>
              </div>
            </form>
          </BentoCard>
        </div>
      ) : tab === "orders" ? (
        <div className="grid gap-5">
          {activation ? (
            <BentoCard dark>
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e2e89d]">
                  PIN Lisensi Baru — tampil satu kali
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-3xl font-semibold tracking-[0.3em] text-white">
                    {activation.rawPin}
                  </span>
                  <Chip variant="lime" size="sm">
                    {activation.orderCode}
                  </Chip>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {activation.whatsappDeliveryUrl ? (
                    <a
                      href={activation.whatsappDeliveryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-[34px] items-center gap-1.5 rounded-[12px] bg-[#e2e89d] px-3.5 text-[13px] font-semibold text-[#454a10]"
                    >
                      <span className="symbol text-[18px]" aria-hidden="true">
                        chat
                      </span>
                      Kirim Kode &amp; PIN ke WhatsApp Pembeli
                    </a>
                  ) : (
                    <span className="text-xs text-[#a8a8ad]">
                      Nomor WhatsApp pembeli tidak valid — salin PIN secara manual.
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setActivation(null)}
                    className="text-xs font-medium text-[#a8a8ad] underline hover:text-white"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </BentoCard>
          ) : null}

          <BentoCard>
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="m-0 text-base font-semibold text-[#18181a]">
                  Pesanan &amp; Lisensi Pembeli
                </h2>
                <p className="mt-0.5 text-xs text-[#71717a]">
                  Aktivasi lisensi, reset PIN, kuota unduhan, dan kill-switch (khusus Owner)
                </p>
              </div>
              <TabFilter
                tabs={[
                  { id: "all", label: "Semua" },
                  { id: "pending", label: "Pending" },
                  { id: "paid", label: "Paid / Aktif" },
                  { id: "revoked", label: "Revoked" },
                ]}
                active={orderFilter}
                onChange={(next) => setOrderFilter(next)}
              />
            </div>

            {role !== "owner" ? (
              <EmptyState
                icon="lock"
                title="Akses terbatas"
                description="Hanya Owner yang dapat mengelola lisensi dan kuota unduhan."
              />
            ) : isLoadingOrders ? (
              <p className="py-8 text-center text-xs text-[#71717a]">Memuat pesanan...</p>
            ) : orders.length === 0 ? (
              <EmptyState
                icon="receipt_long"
                title="Belum ada pesanan"
                description="Pesanan Digital Store akan muncul di sini setelah pembeli checkout."
              />
            ) : (
              <div className="grid gap-2.5">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[12px] border border-[#eaeaea] bg-white p-3.5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-[#18181a]">
                            {order.orderCode}
                          </span>
                          <Chip
                            variant={
                              order.isRevoked
                                ? "danger"
                                : order.paymentStatus === "paid"
                                  ? "success"
                                  : order.paymentStatus === "pending"
                                    ? "warning"
                                    : "neutral"
                            }
                            size="sm"
                          >
                            {order.isRevoked ? "Revoked" : order.paymentStatus}
                          </Chip>
                          <Chip variant="neutral" size="sm">
                            {order.licenseTier === "commercial" ? "Commercial" : "Single"}
                          </Chip>
                          <Chip
                            variant={order.zipFilename ? "success" : "warning"}
                            size="sm"
                          >
                            {order.zipFilename ? "ZIP Siap" : "Belum Ada ZIP"}
                          </Chip>
                          {order.paymentProofFileId ? (
                            <Chip variant="lime" size="sm">
                              Bukti Bayar Tersedia
                            </Chip>
                          ) : null}
                        </div>
                        <p className="m-0 mt-1.5 text-sm font-medium text-[#18181a]">
                          {order.productTitle}{" "}
                          <span className="text-xs font-normal text-[#71717a]">
                            v{order.productVersion}
                          </span>
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#52525b]">
                          <span>{order.buyerName}</span>
                          <span>· {order.buyerWhatsapp}</span>
                          <span>· {order.buyerEmail}</span>
                          {order.buyerGithub ? <span>· @{order.buyerGithub}</span> : null}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#71717a]">
                          <span>Lisensi {rupiah(order.baseAmount)}</span>
                          {order.setupFeeAmount > 0 ? (
                            <span>· Jasa Instalasi {rupiah(order.setupFeeAmount)}</span>
                          ) : null}
                          {order.discountAmount > 0 ? (
                            <span className="text-[#457c1d]">
                              · Kupon {order.couponCode} −{rupiah(order.discountAmount)}
                            </span>
                          ) : null}
                          <span className="font-semibold text-[#18181a]">
                            · Total {rupiah(order.amount)}
                          </span>
                          <span>
                            · Kuota {order.downloadCount}/{order.maxDownloads}
                          </span>
                          {order.expiresAt ? (
                            <span>· Berlaku s.d. {dateWib(order.expiresAt)}</span>
                          ) : null}
                          <span>· Dibuat {dateWib(order.createdAt)}</span>
                        </div>
                        {order.revokedReason ? (
                          <p className="m-0 mt-1 text-[11px] text-[#991b1b]">
                            Alasan cabut: {order.revokedReason}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-1.5 self-end sm:self-start">
                        {order.paymentProofFileId ? (
                          <ToolbarButton
                            variant="light"
                            icon="receipt"
                            disabled={isSubmitting}
                            onClick={() =>
                              void runOrderAction(async () => {
                                const result = await getOrderPaymentProofUrlAction({
                                  id: order.id,
                                });
                                if (result.ok) window.open(result.data.url, "_blank", "noopener,noreferrer");
                                return result;
                              }, "Bukti transfer dibuka di tab baru.")
                            }
                          >
                            Lihat Bukti Transfer
                          </ToolbarButton>
                        ) : null}
                        <ToolbarButton
                          variant="dark"
                          disabled={isSubmitting}
                          onClick={() => void activate(order)}
                        >
                          {order.paymentStatus === "paid"
                            ? "Aktifkan Ulang"
                            : "Aktifkan Lisensi (Lunas)"}
                        </ToolbarButton>
                        <ToolbarButton
                          variant="light"
                          disabled={isSubmitting}
                          onClick={() => void resetPin(order)}
                        >
                          Reset PIN
                        </ToolbarButton>
                        <ToolbarButton
                          variant="light"
                          disabled={isSubmitting}
                          onClick={() =>
                            void runOrderAction(
                              () => addOrderDownloadQuotaAction({ id: order.id }),
                              "Kuota unduhan ditambah 3x.",
                            )
                          }
                        >
                          +3 Kuota Unduh
                        </ToolbarButton>
                        {order.isRevoked ? (
                          <ToolbarButton
                            variant="light"
                            disabled={isSubmitting}
                            onClick={() =>
                              void runOrderAction(
                                () =>
                                  setOrderRevokedAction({ id: order.id, revoked: false }),
                                "Lisensi dipulihkan.",
                              )
                            }
                          >
                            Pulihkan Lisensi
                          </ToolbarButton>
                        ) : (
                          <ToolbarButton
                            variant="danger"
                            disabled={isSubmitting}
                            onClick={() =>
                              void runOrderAction(
                                () =>
                                  setOrderRevokedAction({
                                    id: order.id,
                                    revoked: true,
                                    reason: "Pelanggaran ketentuan distribusi.",
                                  }),
                                "Lisensi dicabut (kill-switch).",
                              )
                            }
                          >
                            Cabut Lisensi
                          </ToolbarButton>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>
        </div>
      ) : tab === "coupons" ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <BentoCard>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="m-0 text-base font-semibold text-[#18181a]">
                  Kupon &amp; Promo Diskon
                </h2>
                <p className="mt-0.5 text-xs text-[#71717a]">
                  Khusus Owner. Berlaku untuk semua produk atau produk tertentu.
                </p>
              </div>
              <ToolbarButton
                variant="light"
                icon="add"
                onClick={() => {
                  setCouponId(null);
                  setCouponValue(blankCoupon());
                  setError("");
                  setStatus("");
                }}
              >
                Kupon Baru
              </ToolbarButton>
            </div>

            {role !== "owner" ? (
              <EmptyState
                icon="lock"
                title="Akses terbatas"
                description="Hanya Owner yang dapat mengelola kupon."
              />
            ) : isLoadingCoupons ? (
              <p className="py-8 text-center text-xs text-[#71717a]">Memuat kupon...</p>
            ) : coupons.length === 0 ? (
              <EmptyState
                icon="sell"
                title="Belum ada kupon"
                description="Buat kupon promo pertama untuk meningkatkan penjualan."
              />
            ) : (
              <div className="grid gap-2">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="flex flex-col gap-2 rounded-[12px] border border-[#eaeaea] bg-white p-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-[#18181a]">
                        {coupon.code}
                      </span>
                      <Chip variant={coupon.isActive ? "success" : "neutral"} size="sm">
                        {coupon.isActive ? "Aktif" : "Nonaktif"}
                      </Chip>
                      <Chip variant="neutral" size="sm">
                        {coupon.discountType === "percent"
                          ? `${coupon.discountValue}%`
                          : rupiah(coupon.discountValue)}
                      </Chip>
                    </div>
                    <p className="m-0 text-xs text-[#52525b]">
                      Pemakaian {coupon.usedCount}
                      {coupon.maxUses !== null ? ` / ${coupon.maxUses}` : " (tanpa batas)"}
                      {coupon.expiresAt ? ` · s.d. ${dateWib(coupon.expiresAt)}` : ""}
                    </p>
                    <div className="flex gap-2">
                      <ToolbarButton
                        variant="light"
                        disabled={isSubmitting}
                        onClick={() => {
                          setCouponId(coupon.id);
                          setCouponValue({
                            code: coupon.code,
                            description: coupon.description,
                            discountType: coupon.discountType,
                            discountValue: coupon.discountValue,
                            minOrderAmount: coupon.minOrderAmount,
                            maxDiscountAmount: coupon.maxDiscountAmount,
                            maxUses: coupon.maxUses,
                            productId: coupon.productId,
                            isActive: coupon.isActive,
                            expiresAt: coupon.expiresAt,
                          });
                        }}
                      >
                        Ubah
                      </ToolbarButton>
                      <ToolbarButton
                        variant="danger"
                        disabled={isSubmitting}
                        onClick={() => void removeCoupon(coupon.id)}
                      >
                        Hapus
                      </ToolbarButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>

          <BentoCard>
            <h2 className="m-0 mb-3 text-base font-semibold text-[#18181a]">
              {couponId ? "Ubah Kupon" : "Buat Kupon Baru"}
            </h2>
            <div className="grid gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Kode Kupon
                  <input
                    value={couponValue.code}
                    onChange={(e) =>
                      setCouponValue((c) => ({
                        ...c,
                        code: e.target.value.toUpperCase(),
                      }))
                    }
                    className={inputClass}
                    placeholder="LAUNCH30"
                  />
                </label>
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Tipe Diskon
                  <select
                    value={couponValue.discountType}
                    onChange={(e) =>
                      setCouponValue((c) => ({
                        ...c,
                        discountType: e.target.value as DigitalCouponInput["discountType"],
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="percent">Persentase (%)</option>
                    <option value="fixed">Nominal Tetap (Rp)</option>
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Nilai Diskon
                  <input
                    type="number"
                    min={1}
                    value={couponValue.discountValue}
                    onChange={(e) =>
                      setCouponValue((c) => ({
                        ...c,
                        discountValue: Number(e.target.value || 0),
                      }))
                    }
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Minimal Pembelian (Rp)
                  <input
                    type="number"
                    min={0}
                    value={couponValue.minOrderAmount}
                    onChange={(e) =>
                      setCouponValue((c) => ({
                        ...c,
                        minOrderAmount: Number(e.target.value || 0),
                      }))
                    }
                    className={inputClass}
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Maksimal Potongan (Rp, opsional)
                  <input
                    type="number"
                    min={0}
                    value={couponValue.maxDiscountAmount ?? ""}
                    onChange={(e) =>
                      setCouponValue((c) => ({
                        ...c,
                        maxDiscountAmount: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Kuota Pemakaian (opsional)
                  <input
                    type="number"
                    min={1}
                    value={couponValue.maxUses ?? ""}
                    onChange={(e) =>
                      setCouponValue((c) => ({
                        ...c,
                        maxUses: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    className={inputClass}
                    placeholder="Tanpa batas"
                  />
                </label>
              </div>
              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Berlaku untuk Produk
                <select
                  value={couponValue.productId ?? ""}
                  onChange={(e) =>
                    setCouponValue((c) => ({
                      ...c,
                      productId: e.target.value || null,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">Semua Produk</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Deskripsi (opsional)
                <input
                  maxLength={500}
                  value={couponValue.description}
                  onChange={(e) =>
                    setCouponValue((c) => ({ ...c, description: e.target.value }))
                  }
                  className={inputClass}
                />
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-[#18181a]">
                <input
                  type="checkbox"
                  checked={couponValue.isActive}
                  onChange={(e) =>
                    setCouponValue((c) => ({ ...c, isActive: e.target.checked }))
                  }
                  className="rounded border-[#d4d4d8]"
                />
                Kupon Aktif
              </label>
              <div className="flex gap-2">
                <ToolbarButton
                  variant="dark"
                  disabled={isSubmitting}
                  className="flex-1"
                  onClick={() => void saveCoupon()}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Kupon"}
                </ToolbarButton>
                {couponId ? (
                  <ToolbarButton
                    variant="light"
                    disabled={isSubmitting}
                    onClick={() => {
                      setCouponId(null);
                      setCouponValue(blankCoupon());
                    }}
                  >
                    Batal Edit
                  </ToolbarButton>
                ) : null}
              </div>
            </div>
          </BentoCard>
        </div>
      ) : (
        <BentoCard>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                Ulasan &amp; Rating Pembeli
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Moderasi, balasan resmi, dan preview media ulasan.
              </p>
            </div>
            <ToolbarButton
              variant="light"
              icon="sync"
              disabled={isLoadingReviews}
              onClick={() => setReloadKey((c) => c + 1)}
            >
              Refresh
            </ToolbarButton>
          </div>

          {isLoadingReviews ? (
            <p className="py-8 text-center text-xs text-[#71717a]">Memuat ulasan...</p>
          ) : reviews.length === 0 ? (
            <EmptyState
              icon="star"
              title="Belum ada ulasan"
              description="Ulasan dari pembeli terverifikasi akan muncul di sini."
            />
          ) : (
            <div className="grid gap-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="grid gap-2 rounded-[12px] border border-[#eaeaea] bg-white p-3.5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-[#18181a]">
                      {review.buyerName}
                    </span>
                    <Chip variant="neutral" size="sm">
                      {review.licenseTier === "commercial" ? "Commercial" : "Single"}
                    </Chip>
                    <Chip variant="warning" size="sm">
                      {"★".repeat(review.rating)}
                    </Chip>
                    <Chip
                      variant={review.status === "approved" ? "success" : "neutral"}
                      size="sm"
                    >
                      {review.status === "approved" ? "Tampil" : "Disembunyikan"}
                    </Chip>
                  </div>
                  <p className="m-0 text-xs text-[#71717a]">
                    {review.productTitle} · v{review.productVersion} ·{" "}
                    {dateWib(review.createdAt)}
                  </p>
                  <p className="m-0 whitespace-pre-line text-xs text-[#52525b]">
                    {review.comment}
                  </p>
                  {review.mediaItems.length ? (
                    <div className="flex flex-wrap gap-2">
                      {review.mediaItems.map((media, index) =>
                        media.kind === "video" ? (
                          <video
                            key={`${media.url}-${index}`}
                            src={media.url}
                            controls
                            preload="metadata"
                            className="h-28 w-40 rounded-[8px] bg-black object-cover"
                          />
                        ) : (
                          <a
                            key={`${media.url}-${index}`}
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative h-20 w-20 overflow-hidden rounded-[8px] bg-[#f0f0f0]"
                          >
                            <Image
                              src={media.url}
                              alt={media.caption ?? "Foto ulasan"}
                              fill
                              unoptimized
                              sizes="80px"
                              className="object-cover"
                            />
                          </a>
                        ),
                      )}
                    </div>
                  ) : null}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      value={reviewReplies[review.id] ?? ""}
                      maxLength={1000}
                      placeholder="Balasan resmi OpenByte Labs..."
                      onChange={(e) =>
                        setReviewReplies((c) => ({ ...c, [review.id]: e.target.value }))
                      }
                      className={inputClass}
                    />
                    <div className="flex shrink-0 gap-2">
                      <ToolbarButton
                        variant="light"
                        disabled={isSubmitting}
                        onClick={() =>
                          void moderate(review, {
                            adminReply: (reviewReplies[review.id] ?? "").trim() || null,
                          })
                        }
                      >
                        Simpan Balasan
                      </ToolbarButton>
                      <ToolbarButton
                        variant={review.status === "approved" ? "danger" : "dark"}
                        disabled={isSubmitting}
                        onClick={() =>
                          void moderate(review, {
                            status:
                              review.status === "approved" ? "hidden" : "approved",
                          })
                        }
                      >
                        {review.status === "approved" ? "Sembunyikan" : "Tampilkan"}
                      </ToolbarButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </BentoCard>
      )}
    </AdminFrame>
  );
}
