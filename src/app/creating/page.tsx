"use client";

import { BonsaiCanvas } from "@/components/Canvas";
import { UIOverlay } from "@/components/UIOverlay";
import { SideMenu } from "@/components/SideMenu";
import { InfinitySlider } from "@/components/Gallery";

export default function Creating() {
    return (
        <div className='w-full bg-black text-white'>
            {/* メイン Canvas エリア */}
            <section className='w-full h-screen flex items-center justify-center relative'>
                <BonsaiCanvas />
                <UIOverlay />
                <SideMenu />
            </section>

            {/* ギャラリーセクション */}
            <section className='w-full py-12'>
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
                    <button className='px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-lg text-lg transition transform hover:scale-105'>
                        📤 投稿する
                    </button>
                </div>
            </section>

            {/* フッター */}
            <footer className='w-full py-8 border-t border-gray-700 text-center text-gray-400'>
                <p>© 2026 String Bonsai - Made with ❤️</p>
            </footer>
        </div>
    );
}
