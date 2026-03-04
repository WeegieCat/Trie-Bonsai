"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BonsaiCanvas } from "@/components/Canvas";
import { UIOverlay } from "@/components/UIOverlay";
import { SideMenu } from "@/components/SideMenu";
import { InfinitySlider } from "@/components/InfinitySlider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PostModal } from "@/components/PostModal";
import { useStore } from "@/store/store";

const DEFAULT_TRIE_INPUT = "もちもちほっぺ もちもちもっちん もちもちもちち";

export default function Creating() {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const router = useRouter();
    const setTreeType = useStore((state) => state.setTreeType);
    const setInputValue = useStore((state) => state.setInputValue);
    const generateBonsai = useStore((state) => state.generateBonsai);

    useEffect(() => {
        setTreeType("trie");
        setInputValue(DEFAULT_TRIE_INPUT);
        generateBonsai(DEFAULT_TRIE_INPUT);
    }, [generateBonsai, setInputValue, setTreeType]);

    const handleSubmit = (name: string) => {
        setIsPostModalOpen(false);
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
                        ギャラリー
                    </h2>
                    <InfinitySlider />
                </div>
            </section>

            {/* 投稿ボタンエリア */}
            <section className='w-full py-12 bg-gray-900'>
                <div className='max-w-7xl mx-auto px-6 text-center'>
                    <h2 className='text-3xl font-bold mb-6'>
                        あなたの盆栽を共有しよう
                    </h2>
                    <button
                        onClick={() => setIsPostModalOpen(true)}
                        className='inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-lg text-lg transition transform hover:scale-105'>
                        投稿
                    </button>
                </div>
            </section>

            <PostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onSubmit={handleSubmit}
            />

            <Footer />
        </div>
    );
}
