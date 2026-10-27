import Link from 'next/link'
import type { PageBlockDto } from '@/lib/content/types'

type CalculatorBlock = Extract<PageBlockDto, { type: 'calculator' }>

/**
 * Blok kalkulator (F3-02). Fungsi hitung dan pengiriman quote baru aktif pada
 * Fase 4, jadi blok ini menampilkan keadaan nonaktif yang jujur: tidak ada
 * tombol yang menjanjikan transaksi, tidak ada estimasi yang dikarang.
 */
export function CalculatorTeaser({ block }: { block: CalculatorBlock }) {
  return (
    <section className="section calculator-teaser" aria-labelledby="calculator-title">
      <div className="wrap calculator-teaser__inner">
        <div>
          <span className="section-kicker">Estimasi biaya</span>
          <h2 id="calculator-title">{block.title ?? 'Kalkulator estimasi biaya'}</h2>
          {block.description ? <p>{block.description}</p> : null}
          {block.disclaimer ? (
            <p className="calculator-teaser__note">{block.disclaimer}</p>
          ) : null}
        </div>
        <div className="calculator-teaser__panel" role="status">
          <span className="material-symbols-outlined" aria-hidden="true">
            calculate
          </span>
          <p>Kalkulator interaktif belum diaktifkan.</p>
          <Link className="text-link" href="/kalkulator">
            Lihat halaman kalkulator{' '}
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
