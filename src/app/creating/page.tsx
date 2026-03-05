"use client";

import { useEffect, useState } from "react";
import { BonsaiCanvas } from "@/components/Canvas";
import { UIOverlay } from "@/components/UIOverlay";
import { SideMenu } from "@/components/SideMenu";
import { InfinitySlider } from "@/components/InfinitySlider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PostModal } from "@/components/PostModal";
import { DEFAULT_TRIE_INPUT } from "@/lib/constants/defaultTrieInput";
import { useStore } from "@/store/store";
import { submitBonsai } from "@/lib/api/bonsai";

export default function Creating() {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setTreeType = useStore((state) => state.setTreeType);
    const setInputValue = useStore((state) => state.setInputValue);
    const generateBonsai = useStore((state) => state.generateBonsai);
    const bonsaiData = useStore((state) => state.bonsaiData);
    const config = useStore((state) => state.config);

    useEffect(() => {
        setTreeType("trie");
        setInputValue(DEFAULT_TRIE_INPUT);
        generateBonsai(DEFAULT_TRIE_INPUT);
    }, [generateBonsai, setInputValue, setTreeType]);

    const handleSubmit = async (data: {
        name: string;
        imageDataUrl: string;
    }) => {
        setIsSubmitting(true);
        try {
            const response = await submitBonsai({
                title: data.name,
                imageDataUrl: data.imageDataUrl,
                treeData: bonsaiData,
                configData: config,
            });

            if (response.success) {
                // 静的エクスポート（output: "export"）の場合、
                // router.push()ではなくwindow.location.hrefを使用
                const galleryUrl = response.url || "/gallery/";
                const normalizedUrl = galleryUrl.endsWith("/")
                    ? galleryUrl
                    : `${galleryUrl}/`;
                
                // モーダルを閉じてからページ遷移
                setIsPostModalOpen(false);
                
                // 静的サイトでは window.location.href が確実
                window.location.href = normalizedUrl;
            } else {
                console.error("投稿に失敗しました:", response.error);
                alert(`投稿に失敗しました: ${response.error || "不明なエラー"}`);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("投稿処理でエラーが発生しました:", error);
            alert(
                `投稿処理でエラーが発生しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
            );
            setIsSubmitting(false);
        }
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
                isSubmitting={isSubmitting}
            />

            <Footer />
        </div>
    );
}
