import { Analytics } from '@vercel/analytics/react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Education } from './components/Education'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { MobileBusinessCard } from './components/MobileBusinessCard'
import { Portfolio } from './components/Portfolio'
import { Services } from './components/Services'
import { WhyChoose } from './components/WhyChoose'
import './index.css'

function App() {
    return (
        <>
            <MobileBusinessCard />
            <main className="hidden overflow-hidden text-[#191714] md:block">
                <Hero />
                <WhyChoose />
                <About />
                <Services />
                <Portfolio />
                <Education />
                <Contact />
            </main>
            <div className="hidden md:block">
                <Footer />
            </div>
            <FloatingWhatsApp />
            <Analytics />
        </>
    )
}

export default App