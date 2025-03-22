import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google"
import "@/app/dashboard/globals.css"
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";



const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LLM Market",
  description: "Fine-tune and deploy language models",
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
