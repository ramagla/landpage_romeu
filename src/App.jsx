import { Analytics } from '@vercel/analytics/react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Education } from './components/Education'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Portfolio } from './components/Portfolio'
import { Services } from './components/Services'
import { WhyChoose } from './components/WhyChoose'
import './index.css'

function App() {
    return (
        <>
            <main className="overflow-hidden text-[#191714]">
                <Hero />
                <WhyChoose />
                <About />
                <Services />
                <Portfolio />
                <Education />
                <Contact />
            </main>
            <Footer />
            <FloatingWhatsApp />
            <Analytics />
        </>
    )
}

export default App