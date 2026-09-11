import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechPulse Intelligence // Autonomous Daily Tech & Cyber Radar",
  description: "Daily intelligence synthesis featuring frontier AI breakthroughs, high-velocity developer tools, cybersecurity telemetry, and classical editorial dispatch.",
  keywords: ["tech news", "AI research", "cybersecurity", "CVE", "EPSS", "Hugging Face", "GitHub trending", "intelligence"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Oswald:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#ECEAE4] text-[#161518] selection:bg-[#161518] selection:text-stone-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
