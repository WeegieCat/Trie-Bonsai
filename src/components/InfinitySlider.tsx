"use client";

import { useEffect, useState } from "react";

interface BonsaiItem {
    id: string;
    imageUrl: string;
    title: string;
}

export function InfinitySlider() {
    const [items, setItems] = useState<BonsaiItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // ギャラリー画像データ
        const mockBonsais: BonsaiItem[] = [
            {
                id: "bonsai-1",
                imageUrl: "/gallery/bonsai-1.png",
                title: "独坐孤峰",
            },
            {
                id: "bonsai-2",
                imageUrl: "/gallery/bonsai-2.png",
                title: "断崖雲湧",
            },
            {
                id: "bonsai-3",
                imageUrl: "/gallery/bonsai-3.png",
                title: "翠嵐一息",
            },
            {
                id: "bonsai-4",
                imageUrl: "/gallery/bonsai-4.png",
                title: "古潭月影",
            },
            {
                id: "bonsai-5",
                imageUrl: "/gallery/bonsai-5.png",
                title: "千歳凍解",
            },
            {
                id: "bonsai-6",
                imageUrl: "/gallery/bonsai-6.png",
                title: "万象帰一",
            },
            {
                id: "bonsai-7",
                imageUrl: "/gallery/bonsai-7.png",
                title: "悠遠残響",
            },
            {
                id: "bonsai-8",
                imageUrl: "/gallery/bonsai-8.png",
                title: "虚空寂滅",
            },
        ];

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
                        className='flex-shrink-0 w-80 bg-black rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer border border-gray-800'>
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className='w-full h-64 object-contain bg-black'
                        />
                        <div className='p-4 bg-gray-800'>
                            <h3 className='text-white font-bold text-lg'>
                                {item.title}
                            </h3>
                        </div>
                    </div>
                ))}

                {/* 無限ループ用にコピー */}
                {items.map((item) => (
                    <div
                        key={`copy-${item.id}`}
                        className='flex-shrink-0 w-80 bg-black rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer border border-gray-800'>
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className='w-full h-64 object-contain bg-black'
                        />
                        <div className='p-4 bg-gray-800'>
                            <h3 className='text-white font-bold text-lg'>
                                {item.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
