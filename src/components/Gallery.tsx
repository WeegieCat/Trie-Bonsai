"use client";

import { useEffect, useState } from "react";

interface BonsaiItem {
    id: string;
    imageUrl: string;
    title: string;
    author: string;
}

export function InfinitySlider() {
    const [items, setItems] = useState<BonsaiItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // モックデータ（実際にはAPIから取得）
        const mockBonsais: BonsaiItem[] = Array.from(
            { length: 10 },
            (_, i) => ({
                id: `bonsai-${i}`,
                imageUrl: `https://picsum.photos/300/300?random=${i}`,
                title: `盆栽 #${i + 1}`,
                author: `ユーザー${i + 1}`,
            }),
        );

        setItems(mockBonsais);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className='w-full h-80 flex items-center justify-center'>
                <p className='text-gray-400'>読み込み中...</p>
            </div>
        );
    }

    return (
        <div className='w-full overflow-hidden bg-gray-900 py-8'>
            <div className='inline-flex animate-scroll gap-6 px-6'>
                {/* 元のアイテム */}
                {items.map((item) => (
                    <div
                        key={`original-${item.id}`}
                        className='flex-shrink-0 w-80 bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer'>
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className='w-full h-64 object-cover'
                        />
                        <div className='p-4'>
                            <h3 className='text-white font-bold text-lg'>
                                {item.title}
                            </h3>
                            <p className='text-gray-400 text-sm'>
                                作者: {item.author}
                            </p>
                        </div>
                    </div>
                ))}

                {/* 無限ループ用にコピー */}
                {items.map((item) => (
                    <div
                        key={`copy-${item.id}`}
                        className='flex-shrink-0 w-80 bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer'>
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className='w-full h-64 object-cover'
                        />
                        <div className='p-4'>
                            <h3 className='text-white font-bold text-lg'>
                                {item.title}
                            </h3>
                            <p className='text-gray-400 text-sm'>
                                作者: {item.author}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
