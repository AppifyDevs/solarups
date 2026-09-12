import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solor — Solar & UPS Power Calculator",
  description:
    "Work out your real power load, then size the inverter, battery bank and solar array to match. Built for homes that run through load-shedding.",
  keywords: [
    "solar calculator",
    "UPS calculator",
    "inverter sizing",
    "battery bank",
    "load shedding",
    "solar panel",
  ],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${body.variable} ${display.variable} ${mono.variable}`}
    >
      <body className="relative min-h-[100dvh] antialiased" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('solor.theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-ink" />
          <div
            className="animate-drift absolute -top-[32%] -left-[14%] h-[72vmax] w-[72vmax] rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle at center, var(--glow-1a), var(--glow-1b) 42%, transparent 68%)",
            }}
          />
          <div
            className="animate-drift absolute -right-[18%] bottom-[-28%] h-[62vmax] w-[62vmax] rounded-full opacity-60 [animation-delay:-9s]"
            style={{
              background: "radial-gradient(circle at center, var(--glow-2a), transparent 66%)",
            }}
          />
          <div className="techgrid absolute inset-x-0 top-0 h-[120vh]" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-ink/60 to-ink" />
          <div className="grain absolute inset-0" />
        </div>

        <a
          href="#load-editor"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-solar focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ink"
        >
          Skip to the calculator
        </a>

        {children}
      </body>
    </html>
  );
}
