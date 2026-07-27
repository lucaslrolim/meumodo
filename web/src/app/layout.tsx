import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Nunito } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { PwaRegister } from "@/components/layout/pwa-register";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jbmono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meu Modo",
  description: "Seu material vira prática pra sua prova.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Meu Modo",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fafaf8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${nunito.variable} ${inter.variable} ${jbmono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-mm-canvas text-mm-ink">
        <TooltipProvider delay={200}>
          {children}
          <Toaster position="bottom-center" />
          <PwaRegister />
        </TooltipProvider>
      </body>
    </html>
  );
}
