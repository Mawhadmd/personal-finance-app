

import IpadSection from "./(components)/ipadSection";
import ContactUs from "./(components)/ContactUs";
import Hero from "./(components)/Hero";
import Footer from "./(components)/footer";

import CardsSection from "./(components)/CardsSection";
import TestimonialSection from "./(components)/TestimonialSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <CardsSection />
      <IpadSection />
      {/* <TestimonialSection /> Doesn't look good */}
      <ContactUs />
      <Footer />
    </div>
  );
}
