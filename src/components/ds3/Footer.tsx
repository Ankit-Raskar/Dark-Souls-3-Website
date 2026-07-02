import { Flame, Github, Twitter, Youtube, Mail, Shield, Heart } from "lucide-react";

/**
 * Footer — sticky to bottom, social links, official game links, credits,
 * legal disclaimer, privacy, contact, GitHub. Server-renderable.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto relative z-10 border-t border-gold/15 bg-soot/80 backdrop-blur-sm">
      {/* Top ember line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-ember/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-ember animate-flicker" />
              <span className="font-display text-sm tracking-[0.25em] text-gold-bright">
                DARK SOULS III
              </span>
            </div>
            <p className="mt-4 font-serif text-sm leading-relaxed text-ash/60">
              An unofficial, fan-made companion compendium celebrating the world,
              lore, and challenge of FromSoftware&apos;s Dark Souls III.
            </p>
            <p className="mt-4 font-serif text-xs italic text-muted-foreground">
              &ldquo;Don&apos;t you dare go hollow.&rdquo;
            </p>
          </div>

          {/* Compendium links */}
          <FooterCol
            title="Compendium"
            links={[
              ["Story", "#story"],
              ["Lore", "#lore"],
              ["Bosses", "#bosses"],
              ["Weapons", "#weapons"],
              ["Interactive Map", "#map"],
              ["Build Calculator", "#build"],
            ]}
          />

          {/* Official */}
          <FooterCol
            title="Official"
            links={[
              ["FromSoftware", "https://www.fromsoftware.jp"],
              ["Bandai Namco", "https://www.bandainamcoent.com"],
              ["Dark Souls III", "https://www.bandainamcoent.com/dark-souls-iii"],
              ["Ashes of Ariandel", "#dlc"],
              ["The Ringed City", "#dlc"],
              ["Press Kit", "#"],
            ]}
            external
          />

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-display text-xs tracking-[0.25em] text-gold-bright uppercase">
              Legal &amp; Contact
            </h4>
            <ul className="space-y-2 font-serif text-sm text-ash/60">
              <li>
                <a href="#" className="transition-colors hover:text-ember">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-ember">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-ember">
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  className="flex items-center gap-2 transition-colors hover:text-ember"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:ashen@compendium"
                  className="flex items-center gap-2 transition-colors hover:text-ember"
                >
                  <Mail className="h-4 w-4" /> Email
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <SocialIcon icon={Twitter} label="X" />
              <SocialIcon icon={Youtube} label="YouTube" />
              <SocialIcon icon={Github} label="GitHub" />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 rounded-sm border border-gold/10 bg-black/40 p-5">
          <p className="flex items-start gap-2 font-serif text-xs leading-relaxed text-muted-foreground">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-gold/60" />
            <span>
              <strong className="text-ash/70">Disclaimer:</strong> Dark Souls III and all related
              names, characters, imagery, and audio are trademarks and copyrights of FromSoftware,
              Inc. and Bandai Namco Entertainment Inc. This is an unofficial, non-commercial fan
              project created for educational and informational purposes only. No copyrighted
              images or audio are bundled with this site; all artwork is procedurally generated and
              all media placeholders await the owner&apos;s licensed assets. Official trailers are
              embedded from authorized video platforms.
            </span>
          </p>
        </div>

        {/* Credits */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gold/10 pt-6 sm:flex-row">
          <p className="flex items-center gap-1.5 font-serif text-xs text-muted-foreground">
            Forged with <Heart className="h-3 w-3 text-blood-bright" /> by the Ashen One · {year}
          </p>
          <p className="font-serif text-xs text-muted-foreground">
            Built with Next.js · Tailwind · Framer Motion · Lucide
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  external,
}: {
  title: string;
  links: [string, string][];
  external?: boolean;
}) {
  return (
    <div>
      <h4 className="mb-4 font-display text-xs tracking-[0.25em] text-gold-bright uppercase">
        {title}
      </h4>
      <ul className="space-y-2 font-serif text-sm text-ash/60">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="transition-colors hover:text-ember"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon: Icon, label }: { icon: typeof Flame; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-gold/20 text-ash/60 transition-all hover:border-ember hover:text-ember"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

export default Footer;
