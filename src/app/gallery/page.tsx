"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BonsaiCard } from "@/components/BonsaiCard";

interface BonsaiItem {
    id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
    likes: number;
}

export default function Gallery() {
    const [bonsais, setBonsais] = useState<BonsaiItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // モックデータ（実際にはAPIから取得）
        const mockData: BonsaiItem[] = Array.from({ length: 24 }, (_, i) => ({
            id: `bonsai-${i}`,
            title: `盆栽作品 #${i + 1}`,
            imageUrl: `https://picsum.photos/400/400?random=${i}`,
            createdAt: new Date(
                Date.now() - Math.random() * 10000000000,
            ).toLocaleDateString("ja-JP"),
            likes: Math.floor(Math.random() * 500),
        }));

        // ソート処理
        const sorted = [...mockData].sort((a, b) => {
            if (sortBy === "popular") {
                return b.likes - a.likes;
            }
            return 0;
        });

        setBonsais(sorted);
        setIsLoading(false);
    }, [sortBy]);

    const filteredBonsais = bonsais.filter((bonsai) =>
        bonsai.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className='w-full bg-black text-white min-h-screen'>
            <Header />

            <main className='max-w-7xl mx-auto px-6 py-12'>
                {/* ヘッダー */}
                <div className='mb-12 text-center'>
                    <h1 className='text-5xl font-bold mb-4'>🎨 ギャラリー</h1>
                    <p className='text-gray-400 text-lg'>
                        みんなが作成した美しい盆栽作品を探索しよう
                    </p>
                </div>

                {/* フィルター＆検索バー */}
                <div className='mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between'>
                    {/* 検索 */}
                    <div className='w-full sm:w-96'>
                        <input
                            type='text'
                            placeholder='作品名で検索...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500'
                        />
                    </div>

                    {/* ソート */}
                    <div className='flex gap-3'>
                        <button
                            onClick={() => setSortBy("recent")}
                            className={`px-6 py-3 rounded-lg font-medium transition ${
                                sortBy === "recent"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                            }`}>
                            🕒 最新順
                        </button>
                        <button
                            onClick={() => setSortBy("popular")}
                            className={`px-6 py-3 rounded-lg font-medium transition ${
                                sortBy === "popular"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                            }`}>
                            🔥 人気順
                        </button>
                    </div>
                </div>

                {/* 作品数表示 */}
                <div className='mb-6 text-gray-400'>
                    {filteredBonsais.length} 件の作品を表示中
                </div>

                {/* ギャラリーグリッド */}
                {isLoading ? (
                    <div className='text-center py-20'>
                        <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
                        <p className='text-gray-400 mt-4'>読み込み中...</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {filteredBonsais.map((bonsai) => (
                            <BonsaiCard key={bonsai.id} {...bonsai} />
                        ))}
                    </div>
                )}

                {/* 検索結果が0の場合 */}
                {!isLoading && filteredBonsais.length === 0 && (
                    <div className='text-center py-20'>
                        <p className='text-gray-400 text-lg'>
                            該当する作品が見つかりませんでした
                        </p>
                    </div>
                )}

                {/* ページネーション（今後実装） */}
                <div className='mt-12 flex justify-center'>
                    <div className='flex gap-2'>
                        <button className='px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition'>
                            前へ
                        </button>
                        <button className='px-4 py-2 bg-green-600 text-white rounded-lg'>
                            1
                        </button>
                        <button className='px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition'>
                            2
                        </button>
                        <button className='px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition'>
                            3
                        </button>
                        <button className='px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition'>
                            次へ
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
