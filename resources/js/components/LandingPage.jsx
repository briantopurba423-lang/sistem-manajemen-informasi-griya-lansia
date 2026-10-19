import React, { useState, useEffect } from 'react';
import Navbar from './landing/Navbar';
import Hero from './landing/Hero';
import Stats from './landing/Stats';
import Services from './landing/Services';
import Facilities from './landing/Facilities';
import WhyUs from './landing/WhyUs';
import Testimonials from './landing/Testimonials';
import CTA from './landing/CTA';
import Footer from './landing/Footer';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="font-sans antialiased text-gray-800 bg-white">
            <Navbar scrolled={scrolled} />
            <Hero />
            <Stats />
            <Services />
            <Facilities />
            <WhyUs />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
}
