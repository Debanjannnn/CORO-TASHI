
import { CardHoverEffectDemo } from "@/components/CardHover";
import { CoreStrengths } from "@/components/CoreStrengths";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { HeroScrollDemo } from "@/components/HeroScroll";
import FloatingNavDemo from "@/components/Navbar";
import Typeform from "@/components/Typeform";
import { FeaturesSection } from "@/components/VoFeatures";


export default function Home() {
  return (
    <div >
       <FloatingNavDemo/>
       <HeroScrollDemo/>
       <CoreStrengths/>
       <FeaturesSection/>
       {/* <Features/> */}
       <Typeform/>
       <Footer/>
    </div>
   
  )}