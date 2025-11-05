
import ThemeToggle from "@/components/ThemeToggle";
import AmbientGlow from "@/components/ui/main/AmbientGlow";
import FeaturesSection from "@/components/ui/main/FeaturesSection";
import Footer from "@/components/ui/main/Footer";
import HeroSection from "@/components/ui/main/HeroSection";


export default function Home() {
  return (
     <main className="min-h-screen bg-bg text-text transition-colors duration-300 flex flex-col">
        <AmbientGlow />
        <HeroSection />
        <FeaturesSection />
        <Footer />
     </main>
  );
}
