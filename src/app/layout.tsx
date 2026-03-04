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
    process.env.NEXT_PUBLIC_BASE_URL || "https://triebonsai.pages.dev";

export const metadata: Metadata = {
    title: "🌿 String Bonsai - Create & Share 3D Text Trees",
    description:
        "Generate beautiful 3D bonsai trees from text strings. Plant your words as digital bonsai art.",
    metadataBase: new URL(baseUrl),
    openGraph: {
        title: "🌿 String Bonsai - Create & Share 3D Text Trees",
        description:
            "Generate beautiful 3D bonsai trees from text strings. Plant your words as digital bonsai art.",
        url: baseUrl,
        siteName: "String Bonsai",
        locale: "ja_JP",
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "String Bonsai - 3D Text Trees",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "🌿 String Bonsai - Create & Share 3D Text Trees",
        description: "Generate beautiful 3D bonsai trees from text strings.",
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
