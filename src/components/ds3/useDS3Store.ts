import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Global DS3 companion state.
 *
 * Only `musicEnabled` and `sfxEnabled` are persisted to localStorage (so the
 * user's audio preferences survive navigation / reload). `introSeen` is
 * session-scoped (handled in the CinematicIntro component via sessionStorage)
 * and the rest is ephemeral UI state.
 */
export type DS3Page =
  | "home"
  | "story"
  | "lore"
  | "characters"
  | "bosses"
  | "areas"
  | "weapons"
  | "armor"
  | "rings"
  | "magic"
  | "npcs"
  | "covenants"
  | "enemies"
  | "dlc"
  | "gallery"
  | "videos"
  | "map"
  | "timeline"
  | "build"
  | "news"
  | "community";

export interface DS3State {
  /** Whether the cinematic intro has played this session. */
  introSeen: boolean;
  setIntroSeen: (seen: boolean) => void;

  /** Global music on/off (navbar toggle). */
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;

  /** Global SFX on/off (navbar toggle). Default OFF. */
  sfxEnabled: boolean;
  setSfxEnabled: (enabled: boolean) => void;

  /** Currently active "page" (client-side multi-page navigation). */
  page: DS3Page;
  setPage: (page: DS3Page) => void;

  /**
   * Incremented to signal the MusicPlayer to attempt playback (used by the
   * cinematic intro's ENTER button — that click is the user gesture that
   * unlocks browser audio autoplay).
   */
  musicStartSignal: number;
  bumpMusicStart: () => void;

  /** Command-palette / search overlay open state. */
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const useDS3Store = create<DS3State>()(
  persist(
    (set) => ({
      introSeen: false,
      setIntroSeen: (introSeen) => set({ introSeen }),

      musicEnabled: true,
      setMusicEnabled: (musicEnabled) => set({ musicEnabled }),

      sfxEnabled: false,
      setSfxEnabled: (sfxEnabled) => set({ sfxEnabled }),

      page: "home",
      setPage: (page) => {
        set({ page });
        // Scroll to top on page change
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      },

      musicStartSignal: 0,
      bumpMusicStart: () => set((s) => ({ musicStartSignal: s.musicStartSignal + 1 })),

      searchOpen: false,
      setSearchOpen: (searchOpen) => set({ searchOpen }),
    }),
    {
      name: "ds3-store",
      storage: createJSONStorage(() => localStorage),
      // Persist ONLY the audio-preference flags — everything else is ephemeral.
      partialize: (state) => ({
        musicEnabled: state.musicEnabled,
        sfxEnabled: state.sfxEnabled,
      }),
    }
  )
);

export default useDS3Store;
