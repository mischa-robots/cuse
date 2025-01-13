import Navbar from '@/components/nav-bar';
import Hero from '@/components/hero';
import Benefits from '@/components/benefits';
import Features from '@/components/features';
import Footer from '@/components/footer';
import Roadmap from '@/components/roadmap';
import Community from '@/components/community';

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <Navbar />
      <Hero />
      <Features />
      <Benefits />
      <Community />
      <Roadmap />
      <Footer />
    </main>
  );
}
