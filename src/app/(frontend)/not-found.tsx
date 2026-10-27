import Link from 'next/link'

export default function FrontendNotFound() {
  return (
    <section className="not-found wrap" aria-labelledby="not-found-title">
      <span className="not-found__code">404</span>
      <div className="not-found__orb" aria-hidden="true">
        <span className="material-symbols-outlined">travel_explore</span>
      </div>
      <span className="section-kicker">Halaman tidak ditemukan</span>
      <h1 id="not-found-title">Sepertinya halaman ini berpindah.</h1>
      <p>Alamat yang Anda buka tidak tersedia. Kembali ke beranda atau jelajahi proyek kami.</p>
      <div className="hero__actions">
        <Link className="button button--dark" href="/">
          Kembali ke beranda
        </Link>
        <Link className="button button--light" href="/proyek">
          Lihat portofolio
        </Link>
      </div>
    </section>
  )
}
