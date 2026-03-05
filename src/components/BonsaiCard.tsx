"use client";

interface BonsaiCardProps {
    id: string;
    title: string;
    imageUrl: string;
    onDetailClick: () => void;
}

export function BonsaiCard({
    id,
    title,
    imageUrl,
    onDetailClick,
}: BonsaiCardProps) {

    return (
        <div className='bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 group'>
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
                <h3 className='text-lg font-bold text-white mb-3 line-clamp-1'>
                    {title}
                </h3>

                <button
                    onClick={onDetailClick}
                    className='w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition'>
                    詳細を見る
                </button>
            </div>
        </div>
    );
}
