"use client";

import { useState } from "react";

interface BonsaiCardProps {
    id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
    likes: number;
}

export function BonsaiCard({
    id,
    title,
    imageUrl,
    createdAt,
    likes,
}: BonsaiCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);

    const handleLike = () => {
        if (isLiked) {
            setLikeCount((prev) => prev - 1);
        } else {
            setLikeCount((prev) => prev + 1);
        }
        setIsLiked(!isLiked);
    };

    return (
        <div className='bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 group cursor-pointer'>
            {/* 画像 */}
            <div className='relative aspect-square overflow-hidden bg-gray-900'>
                <img
                    src={imageUrl}
                    alt={title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>

            {/* カード情報 */}
            <div className='p-4'>
                <h3 className='text-lg font-bold text-white mb-2 line-clamp-1'>
                    {title}
                </h3>

                <div className='flex items-center justify-end text-sm text-gray-400 mb-3'>
                    <span className='text-xs'>{createdAt}</span>
                </div>

                <div className='flex items-center justify-start'>
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
                            isLiked
                                ? "bg-red-500/20 text-red-400"
                                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                        }`}>
                        {isLiked ? "❤️" : "🤍"} {likeCount}
                    </button>
                </div>
            </div>
        </div>
    );
}
