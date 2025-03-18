
import { HeroScrollDemo } from "@/components/HeroScroll";
import FloatingNavDemo from "@/components/Navbar";
import { WavyBackground } from "@/components/ui/wavy-background";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-black">
       <FloatingNavDemo/>
       <HeroScrollDemo/>
    </div>
   
  )}