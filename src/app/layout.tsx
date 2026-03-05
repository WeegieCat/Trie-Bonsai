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

const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://trie-bonsai.weegiecat.com";

export const metadata: Metadata = {
    title: "Trie Bonsai",
    description: "トライ木から美しい3D盆栽を生成するアプリ",
    metadataBase: new URL(baseUrl),
    openGraph: {
        title: "Trie Bonsai",
        description: "トライ木から美しい3D盆栽を生成するアプリ",
        url: baseUrl,
        siteName: "Trie Bonsai",
        locale: "ja_JP",
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Trie Bonsai",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Trie Bonsai",
        description: "トライ木から美しい3D盆栽を生成するアプリ",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: baseUrl,
    },
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
