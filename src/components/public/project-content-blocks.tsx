import type { ProjectBlockDto } from '@/lib/content/types'
import { ContentImage, MediaPlaceholder } from './media-image'
import { RichText } from './rich-text'

/** Blok konten detail proyek (F3-03). Semua node dirender sebagai React. */
export function ProjectContentBlocks({ blocks }: { blocks: ProjectBlockDto[] }) {
  if (!blocks.length) return null

  return (
    <div className="project-content">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`
        switch (block.type) {
          case 'richText':
            return <RichText key={key} value={block.content} />

          case 'image':
            return (
              <figure className="project-content__figure" key={key}>
                <div className="project-content__image">
                  {block.image ? (
                    <ContentImage
                      image={block.image}
                      variant="hero"
                      sizes="(max-width: 900px) 100vw, 900px"
                    />
                  ) : (
                    <MediaPlaceholder label={block.alt} />
                  )}
                </div>
                {block.caption ? <figcaption>{block.caption}</figcaption> : null}
              </figure>
            )

          case 'gallery':
            return (
              <div className="project-content__gallery" key={key}>
                {block.images.map((entry, imageIndex) => (
                  <div className="project-content__image" key={`${key}-${imageIndex}`}>
                    {entry.image ? (
                      <ContentImage
                        image={entry.image}
                        variant="card"
                        sizes="(max-width: 700px) 100vw, 45vw"
                      />
                    ) : (
                      <MediaPlaceholder label={entry.alt} />
                    )}
                  </div>
                ))}
              </div>
            )

          case 'video':
            return (
              <p key={key}>
                <a className="text-link" href={block.url} rel="noopener noreferrer" target="_blank">
                  Tonton video proyek{' '}
                  <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_outward
                  </span>
                </a>
              </p>
            )

          case 'stats':
            return (
              <dl className="project-content__stats" key={key}>
                {block.items.map((item, itemIndex) => (
                  <div key={`${key}-${itemIndex}`}>
                    {item.value ? <dt>{item.value}</dt> : null}
                    {item.label ? <dd>{item.label}</dd> : null}
                  </div>
                ))}
              </dl>
            )

          case 'quote':
            return (
              <blockquote className="project-content__quote" key={key}>
                {block.quote}
                {block.attribution ? <cite>{block.attribution}</cite> : null}
              </blockquote>
            )

          case 'bullets':
            return (
              <ul key={key}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )

          case 'problemSolutionImpact':
            return (
              <div className="project-content__psi" key={key}>
                <section>
                  <h2>Masalah</h2>
                  <RichText value={block.problem} />
                </section>
                <section>
                  <h2>Solusi</h2>
                  <RichText value={block.solution} />
                </section>
                <section>
                  <h2>Dampak</h2>
                  <RichText value={block.impact} />
                </section>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
