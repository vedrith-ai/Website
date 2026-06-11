import Header       from '@/components/layout/Header'
import Footer       from '@/components/layout/Footer'
import HeroSection     from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import AboutSection    from '@/components/sections/AboutSection'
import RoadmapSection  from '@/components/sections/RoadmapSection'
import FAQSection      from '@/components/sections/FAQSection'
import ContactSection  from '@/components/sections/ContactSection'

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <RoadmapSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
