import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "🌿 String Bonsai - Create & Share 3D Text Trees",
    description: "Generate beautiful 3D bonsai trees from text strings",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='ja'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
                {children}
            </body>
        </html>
    );
}
