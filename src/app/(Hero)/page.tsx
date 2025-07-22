

import IpadSection from "./(components)/ipadSection";
import ContactUs from "./(components)/ContactUs";
import Hero from "./(components)/Hero";
import Footer from "./(components)/footer";

import CardsSection from "./(components)/CardsSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <CardsSection />
      <IpadSection />
      <ContactUs />
      <Footer />
    </div>
  );
}
