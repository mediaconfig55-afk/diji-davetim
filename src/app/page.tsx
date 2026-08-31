import Preloader from "@/components/Preloader";
import FloatingBackground from "@/components/FloatingBackground";
import Hero from "@/components/Hero";
import ParentsSection from "@/components/ParentsSection";
import ProgramSection from "@/components/ProgramSection";
import CountdownSection from "@/components/CountdownSection";
import RsvpSection from "@/components/RsvpSection";
import GuestbookSection from "@/components/GuestbookSection";
import IbanSection from "@/components/IbanSection";
import PhotoSection from "@/components/PhotoSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <FloatingBackground />
      <main className="relative">
        <Hero />
        <ParentsSection />
        <ProgramSection />
        <CountdownSection />
        <RsvpSection />
        <GuestbookSection />
        <IbanSection />
        <PhotoSection />
        <Footer />
      </main>
    </>
  );
}
