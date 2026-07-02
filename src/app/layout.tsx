import type { Metadata, Viewport } from "next";
import { Cinzel, Cinzel_Decorative, EB_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-display-deco",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dark Souls III — Prepare to Die Once More",
  description:
    "An immersive AAA companion experience for Dark Souls III. Explore the lore of Lothric, the Lords of Cinder, every boss, weapon, spell, and secret of the fading flame.",
  keywords: [
    "Dark Souls III",
    "Dark Souls 3",
    "Lothric",
    "Lords of Cinder",
    "FromSoftware",
    "Ashen One",
    "bosses",
    "lore",
    "wiki",
  ],
  authors: [{ name: "The Ashen One" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Dark Souls III — Prepare to Die Once More",
    description:
      "An immersive companion experience for Dark Souls III. Lore, bosses, weapons, and the fading flame.",
    siteName: "Dark Souls III Compendium",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dark Souls III — Prepare to Die Once More",
    description: "An immersive companion experience for Dark Souls III.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050403",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${cinzel.variable} ${cinzelDecorative.variable} ${garamond.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
