import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Home Power Calculator — IPS, Battery & Solar Sizing",
  description:
    "Find the right IPS, battery and solar size for your home. Add your appliances, choose your backup time, and get a recommendation in minutes. No electrical knowledge needed.",
  applicationName: "Home Power Calculator",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    title: "Home Power Calculator — IPS, Battery & Solar Sizing",
    description:
      "Add your appliances, choose your backup time, and get a battery, IPS and solar recommendation in minutes.",
    type: "website",
    locale: "en_US",
    alternateLocale: "bn_BD",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-[4px] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-900"
        >
          Skip to content
        </a>
        <I18nProvider>
          {children}
          <Toaster position="bottom-right" toastOptions={{ style: { borderRadius: "4px" } }} richColors />
        </I18nProvider>
      </body>
    </html>
  );
}