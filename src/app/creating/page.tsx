"use client";

import Link from "next/link";
import { BonsaiCanvas } from "@/components/Canvas";
import { UIOverlay } from "@/components/UIOverlay";
import { SideMenu } from "@/components/SideMenu";
import { InfinitySlider } from "@/components/InfinitySlider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Creating() {
    return (
        <div className='w-full bg-black text-white'>
            <Header />

            {/* メイン Canvas エリア */}
            <section className='w-full h-screen flex items-center justify-center relative'>
                <BonsaiCanvas />
                <UIOverlay />
            </section>

            {/* サイドメニューはセクション外に配置 */}
            <SideMenu />

            {/* ギャラリーセクション */}
            <section className='w-full py-12' id='gallery'>
                <div className='max-w-7xl mx-auto px-6'>
                    <h2 className='text-3xl font-bold mb-8 text-center'>
                        🎨 ギャラリー
                    </h2>
                    <InfinitySlider />
                </div>
            </section>

            {/* 投稿ボタンエリア */}
            <section className='w-full py-12 bg-gray-900'>
                <div className='max-w-7xl mx-auto px-6 text-center'>
                    <h2 className='text-3xl font-bold mb-6'>
                        あなたの盆栽を投稿してみませんか？
                    </h2>
                    <Link
                        href='/gallery'
                        className='inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-lg text-lg transition transform hover:scale-105'>
                        📤 投稿する
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
