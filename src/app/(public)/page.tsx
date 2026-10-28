import { Hero } from '../../components/public/Hero'
import { ServicesGrid } from '../../components/public/ServicesGrid'
import { PortfolioShowcase } from '../../components/public/PortfolioShowcase'
import { EstimatorBanner } from '../../components/public/EstimatorBanner'
import { TestimonialsAndFaq } from '../../components/public/TestimonialsAndFaq'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <Hero />
      <ServicesGrid />
      <PortfolioShowcase />
      <EstimatorBanner />
      <TestimonialsAndFaq />
    </div>
  )
}
