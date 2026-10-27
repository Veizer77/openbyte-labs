import { describe, expect, it } from 'vitest'
import {
  containsUnpublishedPlaceholder,
  collectRichText,
  selectRenderableBlocks,
} from '../../src/lib/content/blocks'
import { formatRupiah, formatTanggalJamWib, formatTanggalWib } from '../../src/lib/format'
import { resolvePrice, secondsUntil } from '../../src/lib/content/pricing'

describe('pemilihan blok page builder', () => {
  it('mempertahankan urutan CMS dan membuang blok isVisible=false', () => {
    const result = selectRenderableBlocks([
      { blockType: 'hero', isVisible: true },
      { blockType: 'faq', isVisible: false },
      { blockType: 'pricing' },
      { blockType: 'richText', isVisible: true },
    ])

    expect(result.blocks.map((block) => block.blockType)).toEqual(['hero', 'pricing', 'richText'])
    expect(result.hiddenCount).toBe(1)
    expect(result.unknownTypes).toEqual([])
  })

  it('melaporkan blok tak dikenal tanpa menjatuhkan halaman', () => {
    const result = selectRenderableBlocks([
      { blockType: 'hero' },
      { blockType: 'carouselMasaDepan' },
      { blockType: '' },
    ])

    expect(result.blocks.map((block) => block.blockType)).toEqual(['hero'])
    expect(result.unknownTypes).toEqual(['carouselMasaDepan'])
  })

  it('menangani nilai kosong', () => {
    expect(selectRenderableBlocks(null)).toEqual({ blocks: [], unknownTypes: [], hiddenCount: 0 })
    expect(selectRenderableBlocks(undefined)).toEqual({
      blocks: [],
      unknownTypes: [],
      hiddenCount: 0,
    })
  })
})

describe('penanda konten belum terbit', () => {
  it('mendeteksi [ISI] dan placeholder setara', () => {
    expect(containsUnpublishedPlaceholder('Kebijakan [ISI] privasi')).toBe(true)
    expect(containsUnpublishedPlaceholder('TODO: isi nanti')).toBe(true)
    expect(containsUnpublishedPlaceholder('Kebijakan privasi final')).toBe(false)
    expect(containsUnpublishedPlaceholder(null)).toBe(false)
  })

  it('mengumpulkan teks dari rich text Lexical', () => {
    const value = {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: '[ISI] Profil studio' }],
          },
        ],
      },
    }

    expect(collectRichText(value)).toContain('[ISI] Profil studio')
  })
})

describe('harga paket dan diskon', () => {
  const now = new Date('2026-10-27T00:00:00.000Z')

  it('memakai harga normal bila tidak ada diskon', () => {
    expect(resolvePrice({ price: 1_000_000 }, now)).toEqual({
      price: 1_000_000,
      originalPrice: null,
      isDiscounted: false,
      discountEndsAt: null,
    })
  })

  it('memakai harga diskon selama belum berakhir', () => {
    const result = resolvePrice(
      {
        price: 1_000_000,
        discountPrice: 800_000,
        discountEndsAt: '2026-11-30T00:00:00.000Z',
      },
      now,
    )

    expect(result).toEqual({
      price: 800_000,
      originalPrice: 1_000_000,
      isDiscounted: true,
      discountEndsAt: '2026-11-30T00:00:00.000Z',
    })
  })

  it('kembali ke harga normal setelah discountEndsAt lewat (tanpa scheduler)', () => {
    const result = resolvePrice(
      {
        price: 1_000_000,
        discountPrice: 800_000,
        discountEndsAt: '2026-10-26T23:59:59.000Z',
      },
      now,
    )

    expect(result.price).toBe(1_000_000)
    expect(result.isDiscounted).toBe(false)
  })

  it('mengabaikan diskon tidak masuk akal', () => {
    expect(resolvePrice({ price: 1_000_000, discountPrice: 1_000_000 }, now).isDiscounted).toBe(
      false,
    )
    expect(resolvePrice({ price: 1_000_000, discountPrice: 1_200_000 }, now).isDiscounted).toBe(
      false,
    )
    expect(resolvePrice({ price: 1_000_000, discountPrice: -1 }, now).isDiscounted).toBe(false)
    expect(resolvePrice({ price: 1_000_000, discountPrice: 500_000.5 }, now).isDiscounted).toBe(
      false,
    )
  })

  it('menghitung sisa detik menuju akhir diskon', () => {
    expect(secondsUntil('2026-10-27T00:01:00.000Z', now)).toBe(60)
    expect(secondsUntil('2026-10-26T23:00:00.000Z', now)).toBe(0)
    expect(secondsUntil(null, now)).toBeNull()
    expect(secondsUntil('bukan-tanggal', now)).toBeNull()
  })
})

describe('format tampilan Indonesia', () => {
  it('memformat Rupiah tanpa desimal', () => {
    expect(formatRupiah(1_500_000)).toContain('1.500.000')
    expect(formatRupiah(1_500_000)).not.toContain(',00')
    expect(formatRupiah(0)).toContain('0')
  })

  it('menampilkan tanggal dan jam dalam WIB apa pun zona waktu proses', () => {
    // 03:00 UTC = 10:00 WIB
    expect(formatTanggalWib('2026-10-19T03:00:00.000Z')).toBe('19 Oktober 2026')
    expect(formatTanggalJamWib('2026-10-19T03:00:00.000Z')).toBe('19 Oktober 2026, 10.00 WIB')
    // 18:30 UTC tanggal 18 = 01:30 WIB tanggal 19
    expect(formatTanggalWib('2026-10-18T18:30:00.000Z')).toBe('19 Oktober 2026')
  })
})
