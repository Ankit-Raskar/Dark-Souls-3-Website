import { EmberCursor } from "@/components/ds3/EmberCursor";
import { AshField } from "@/components/ds3/AshField";
import { FogLayer } from "@/components/ds3/FogLayer";
import { CinematicIntro } from "@/components/ds3/CinematicIntro";
import { MusicPlayer } from "@/components/ds3/MusicPlayer";
import { SoundProvider } from "@/components/ds3/SoundManager";
import { SearchModal } from "@/components/ds3/SearchModal";
import { Navbar } from "@/components/ds3/Navbar";
import { PageRouter } from "@/components/ds3/PageRouter";
import { Footer } from "@/components/ds3/Footer";

export default function Home() {
  return (
    <SoundProvider>
      {/* Global atmosphere (fixed) */}
      <EmberCursor />
      <CinematicIntro />
      <SearchModal />
      <MusicPlayer />

      {/* Fixed background layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AshField density={1} variant="mixed" className="absolute inset-0" />
        <FogLayer intensity="subtle" className="absolute inset-0" />
      </div>
      <div className="grain" aria-hidden />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <PageRouter />
        </main>
        <Footer />
      </div>
    </SoundProvider>
  );
}
