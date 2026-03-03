"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BonsaiCanvas } from "@/components/Canvas";
import { UIOverlay } from "@/components/UIOverlay";
import { SideMenu } from "@/components/SideMenu";
import { InfinitySlider } from "@/components/InfinitySlider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Creating() {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [bonsaiName, setBonsaiName] = useState("");
    const router = useRouter();

    const handleSubmit = () => {
        if (!bonsaiName.trim()) return;
        setIsPostModalOpen(false);
        setBonsaiName("");
        router.push("/gallery");
    };

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
                    <button
                        onClick={() => setIsPostModalOpen(true)}
                        className='inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-lg text-lg transition transform hover:scale-105'>
                        📤 投稿する
                    </button>
                </div>
            </section>

            {isPostModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4'>
                    <div className='w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-2xl border border-gray-700'>
                        <h3 className='text-2xl font-bold text-white mb-4 text-center'>
                            投稿内容の確認
                        </h3>

                        <img
                            src='https://picsum.photos/600/600?bonsai-mock'
                            alt='作成した盆栽のモック画像'
                            className='w-full h-56 object-cover rounded-lg mb-4'
                        />

                        <label className='block text-sm text-gray-300 mb-2'>
                            盆栽の名前
                        </label>
                        <input
                            type='text'
                            value={bonsaiName}
                            onChange={(e) => setBonsaiName(e.target.value)}
                            placeholder='作品名を入力してください'
                            className='w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 mb-5'
                        />

                        <div className='flex gap-3'>
                            <button
                                onClick={() => setIsPostModalOpen(false)}
                                className='flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition'>
                                キャンセル
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!bonsaiName.trim()}
                                className='flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:text-gray-300 text-white font-bold rounded-lg transition'>
                                投稿する
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
