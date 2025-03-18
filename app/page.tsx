
import { CardHoverEffectDemo } from "@/components/CardHover";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { HeroScrollDemo } from "@/components/HeroScroll";
import FloatingNavDemo from "@/components/Navbar";
import { FeaturesSection } from "@/components/VoFeatures";


export default function Home() {
  return (
    <div className="bg-black">
       <FloatingNavDemo/>
       <HeroScrollDemo/>
       {/* < CardHoverEffectDemo/> */}
       <FeaturesSection/>
       {/* <Features/> */}
       <Footer/>
    </div>
   
  )}