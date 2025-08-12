import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from 'next/head';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvoiceGen - Professional Invoice Generator",
  description: "Create professional invoices in minutes with our modern invoice generator. Perfect for businesses of all sizes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="InvoiceGen - Professional Invoice Generator" />
        <meta property="og:description" content="Create professional invoices in minutes with our modern invoice generator. Perfect for businesses of all sizes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta property="og:image" content="/public/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="InvoiceGen - Professional Invoice Generator" />
        <meta name="twitter:description" content="Create professional invoices in minutes with our modern invoice generator. Perfect for businesses of all sizes." />
        <meta name="twitter:image" content="/public/og-image.png" />
        <link rel="canonical" href="https://yourdomain.com/" />
        <meta name="robots" content="index, follow" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <header>
          <Header />
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer>
          <Footer className="print:hidden" />
        </footer>
      </body>
    </html>
  );
}
