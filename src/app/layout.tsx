import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://erikautenrieth.github.io/my-portfolio"),
  title: "Erik Autenrieth — AI Engineer",
  description:
    "AI Engineer building production LLM systems: LangGraph agents, hybrid RAG, MLOps on Kubernetes. Published researcher. Based in Bonn, Germany.",
  alternates: {
    canonical: "/",
    languages: { en: "/", de: "/de" },
  },
  openGraph: {
    title: "Erik Autenrieth — AI Engineer",
    description:
      "AI Engineer building production LLM systems: LangGraph agents, hybrid RAG, MLOps on Kubernetes. Published researcher. Based in Bonn, Germany.",
    type: "website",
    locale: "en",
    alternateLocale: "de",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
