import Image from 'next/image'
import type { MediaImage } from '@/lib/content/types'

type MediaImageProps = {
  image: MediaImage
  /** Ukuran turunan yang dipakai lebih dulu (WebP dari Payload). */
  variant?: 'thumb' | 'card' | 'hero' | 'og'
  sizes: string
  priority?: boolean
  className?: string
}

/**
 * Gambar konten CMS (F3-03). Memakai ukuran turunan WebP Payload bila ada,
 * `sizes` eksplisit agar srcset tidak mengunduh ukuran berlebih, dan lazy
 * loading kecuali gambar di atas lipatan (`priority`).
 */
export function ContentImage({
  image,
  variant = 'card',
  sizes,
  priority = false,
  className,
}: MediaImageProps) {
  const src = image.sizes[variant] ?? image.url

  return (
    <Image
      src={src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      // Dimensi asli tidak selalu tersedia untuk ukuran turunan.
      unoptimized={false}
    />
  )
}

/**
 * Keadaan tanpa gambar. Tidak memakai gambar stok atau ilustrasi rekaan;
 * hanya bidang netral agar tata letak tidak rusak.
 */
export function MediaPlaceholder({ label }: { label?: string }) {
  return (
    <div className="media-placeholder" role="img" aria-label={label ?? 'Gambar belum tersedia'}>
      <span className="material-symbols-outlined" aria-hidden="true">
        image
      </span>
    </div>
  )
}
