import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectCard } from '@/components/public/project-card'
import { publicFaqs, publicProjects, solutionCards } from '@/lib/public-content'

export const metadata: Metadata = {
  title: 'OpenByte Labs: Website, Aplikasi Mobile & Sistem Informasi',
  description:
    'Software house personal untuk website bisnis, aplikasi mobile Flutter, sistem informasi, dan undangan digital.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'OpenByte Labs: Website, Aplikasi Mobile & Sistem Informasi',
    description:
      'Sistem informasi, aplikasi mobile, website bisnis, dan undangan digital untuk instansi, UMKM, dan komunitas.',
    type: 'website',
  },
}

export default function HomePage() {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OpenByte Labs',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    description:
      'Software house personal untuk website bisnis, aplikasi mobile Flutter, sistem informasi, dan undangan digital.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero__copy">
          <div className="status-pill">
            <span /> OpenByte • Digital Systems
          </div>
          <h1 id="hero-title">Bangun sistem, aplikasi, dan website yang benar-benar dipakai.</h1>
          <p>
            OpenByte Labs membuat sistem informasi, aplikasi mobile Flutter, website bisnis, dan
            undangan digital untuk instansi, UMKM, dan komunitas.
          </p>
          <div className="hero__actions">
            <Link className="button button--dark" href="/proyek">
              Lihat portofolio{' '}
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
            <Link className="button button--light" href="/kalkulator">
              Hitung estimasi{' '}
              <span className="material-symbols-outlined" aria-hidden="true">
                north_east
              </span>
            </Link>
          </div>
          <div className="hero__facts" aria-label="Ringkasan OpenByte Labs">
            <div>
              <strong>6</strong>
              <span>Proyek di portofolio</span>
            </div>
            <div>
              <strong>4</strong>
              <span>Kategori solusi</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Paket dengan harga jelas</span>
            </div>
          </div>
        </div>
        <div className="hero-visual" aria-label="Cuplikan proyek SINDUKSADATI">
          <div className="hero-visual__topline">
            <span>
              <span className="material-symbols-outlined" aria-hidden="true">
                data_object
              </span>{' '}
              Project showcase
            </span>
            <span className="live-dot">Portfolio</span>
          </div>
          <Link
            className="hero-visual__image"
            href="/proyek/sinduksadati"
            aria-label="Lihat proyek SINDUKSADATI"
          >
            <Image
              src="/images/e55781324f767410.jpg"
              alt="Pratinjau antarmuka proyek SINDUKSADATI"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 48vw"
            />
            <span className="hero-visual__image-label">SINDUKSADATI · Sistem Informasi</span>
          </Link>
          <div className="hero-visual__bottom">
            <div>
              <span className="eyebrow">Satu data wilayah RW</span>
              <strong>Teknologi untuk kebutuhan nyata.</strong>
            </div>
            <Link href="/proyek/sinduksadati" aria-label="Lihat studi kasus SINDUKSADATI">
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_outward
              </span>
            </Link>
          </div>
          <div className="hero-visual__stamp">
            <span className="material-symbols-outlined" aria-hidden="true">
              verified
            </span>{' '}
            Dibuat untuk dipakai
          </div>
        </div>
      </section>

      <section
        className="services-section section section--subtle"
        id="layanan"
        aria-labelledby="services-title"
      >
        <div className="wrap">
          <div className="section-heading section-heading--split">
            <div>
              <span className="section-kicker">Yang kami kerjakan</span>
              <h2 id="services-title">Solusi digital yang dirancang sesuai konteks.</h2>
            </div>
            <p>
              Mulai dari layanan publik dan kebutuhan komunitas hingga alat digital untuk usaha.
            </p>
          </div>
          <div className="service-grid">
            {solutionCards.map((service, index) => (
              <article className={`service-card service-card--${service.size}`} key={service.title}>
                <div className="service-card__top">
                  <span className="service-card__icon material-symbols-outlined" aria-hidden="true">
                    {service.icon}
                  </span>
                  <span className="service-card__index">0{index + 1}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section portfolio-section"
        id="portofolio"
        aria-labelledby="portfolio-title"
      >
        <div className="wrap">
          <div className="section-heading section-heading--split">
            <div>
              <span className="section-kicker">Pilihan proyek</span>
              <h2 id="portfolio-title">Pekerjaan yang menjawab kebutuhan nyata.</h2>
            </div>
            <Link className="text-link" href="/proyek">
              Lihat semua proyek{' '}
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="project-grid project-grid--featured">
            {publicProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="section about-strip">
        <div className="wrap about-strip__inner">
          <div className="about-strip__mark">
            <Image
              src="/brand/openbyte-labs-square-icon-1-1-logo-only.svg"
              alt=""
              width={56}
              height={56}
            />
          </div>
          <div>
            <span className="section-kicker">Pendekatan kami</span>
            <h2>Teknologi yang berangkat dari kebutuhan lapangan.</h2>
          </div>
          <p>
            Sistem informasi, aplikasi mobile, dan website dibuat dengan alur yang jelas, harga
            transparan, serta komunikasi yang mudah dipahami.
          </p>
        </div>
      </section>

      <section className="section faq-section" aria-labelledby="faq-title">
        <div className="wrap faq-layout">
          <div className="faq-intro">
            <span className="section-kicker">Pertanyaan umum</span>
            <h2 id="faq-title">Sebelum kita mulai.</h2>
            <p>Informasi singkat untuk membantu Anda memahami proses kerja.</p>
            <Link className="text-link" href="/kebijakan-privasi">
              Baca kebijakan privasi{' '}
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="faq-list">
            {publicFaqs.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>
                  {faq.question}
                  <span className="material-symbols-outlined" aria-hidden="true">
                    add
                  </span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-cta wrap" aria-labelledby="closing-title">
        <div>
          <span className="section-kicker">Mulai dari percakapan</span>
          <h2 id="closing-title">Punya kebutuhan sistem atau aplikasi?</h2>
          <p>Ceritakan kebutuhan Anda. Kita mulai dengan memahami masalahnya.</p>
        </div>
        <Link className="button button--lime" href="/konsultasi">
          Jadwalkan konsultasi{' '}
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_forward
          </span>
        </Link>
      </section>
    </>
  )
}
