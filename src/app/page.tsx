"use client";

import Link from "next/link";
import { AnimatedBonsai } from "@/components/AnimatedBonsai";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
    return (
        <div className='w-full bg-black text-white min-h-screen'>
            <Header />

            <div className='max-w-7xl mx-auto px-6 py-12 text-center'>
                <h1 className='text-5xl font-bold '>🌿 Trie Bonsai</h1>
                <p className='text-gray-400 text-lg mt-4'>
                    文字列から生まれる、美しい盆栽。
                </p>
            </div>

            {/* アニメーション盆栽 */}
            <section className='w-full h-screen flex items-center justify-center relative'>
                <AnimatedBonsai />

                {/* CTA ボタン */}
                <div className='absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10'>
                    <Link
                        href='/creating'
                        className='px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-lg text-lg transition transform hover:scale-105 inline-block shadow-lg'>
                        🌱 盆栽を作成する
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
