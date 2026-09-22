import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://saas-analytics-platform-six.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alisson Aguiar | Desenvolvedor Full Stack · AnalyticsPro",
    template: "%s | Alisson Aguiar",
  },
  description:
    "Portfólio de Alisson Aguiar, desenvolvedor Full Stack especializado em Next.js, TypeScript e Supabase. Conheça o AnalyticsPro, uma plataforma SaaS de análise de dados com dashboard em tempo real, relatórios, webhooks e integrações.",
  keywords: [
    "Alisson Aguiar",
    "desenvolvedor full stack",
    "Next.js",
    "React",
    "TypeScript",
    "Supabase",
    "SaaS",
    "analytics",
    "dashboards",
    "portfólio de programador",
    "desenvolvedor júnior",
    "desenvolvedor pleno",
  ],
  authors: [{ name: "Alisson Aguiar", url: "https://github.com/Alisson-aguiar" }],
  creator: "Alisson Aguiar",
  publisher: "Alisson Aguiar",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "AnalyticsPro · Alisson Aguiar",
    title: "Alisson Aguiar | Desenvolvedor Full Stack · AnalyticsPro",
    description:
      "Plataforma SaaS completa de análise de dados — dashboards em tempo real, relatórios personalizáveis, integrações e webhooks. Um projeto real, do zero ao deploy.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "AnalyticsPro - Painel de Análise de Dados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alisson Aguiar | Desenvolvedor Full Stack",
    description:
      "Conheça o AnalyticsPro: plataforma SaaS de análise de dados construída com Next.js, TypeScript e Supabase.",
    images: ["/twitter-image.png"],
    creator: "@alissonaguiar",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // google: "SEU_CODIGO_DE_VERIFICACAO",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alisson Aguiar",
    jobTitle: "Desenvolvedor Full Stack",
    url: siteUrl,
    email: "mailto:alissonaguiars2k10@gmail.com",
    sameAs: [
      "https://github.com/Alisson-aguiar",
      "https://www.linkedin.com/in/alisson-aguiars2k/",
    ],
    knowsAbout: ["Next.js", "React", "TypeScript", "Supabase", "Node.js", "PostgreSQL"],
  };

  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}