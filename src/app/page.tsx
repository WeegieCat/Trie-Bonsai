"use client";

import Link from "next/link";
import { AnimatedBonsai } from "@/components/AnimatedBonsai";

export default function Home() {
    return (
        <div className='w-full bg-black text-white min-h-screen'>
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

            {/* フッター */}
            <footer className='w-full py-8 border-t border-gray-700 text-center text-gray-400 bg-gray-900'>
                <p>
                    © 2026 String Bonsai - Make something beautiful with words
                </p>
            </footer>
        </div>
    );
}
