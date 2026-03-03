"use client";

import { useState } from "react";
import { useStore } from "@/store/store";

export function UIOverlay() {
    const [currentInput, setCurrentInput] = useState("");
    const inputValue = useStore((state) => state.inputValue);
    const setInputValue = useStore((state) => state.setInputValue);
    const setIsSideMenuOpen = useStore((state) => state.setIsSideMenuOpen);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentInput(e.target.value);
    };

    const handleGenerate = () => {
        if (currentInput.trim()) {
            setInputValue(currentInput);
            setCurrentInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleGenerate();
        }
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    };

    return (
        <div className='absolute inset-0 pointer-events-none'>
            {/* トップバー */}
            <div className='absolute top-0 left-0 right-0 p-6 pointer-events-auto'>
                <div className='max-w-2xl mx-auto'>
                    {/* タイトル */}
                    <h1 className='text-4xl font-bold text-white mb-6 text-center'>
                        🌿 String Bonsai
                    </h1>

                    {/* 入力フォーム */}
                    <div className='bg-gray-800 bg-opacity-80 backdrop-blur rounded-lg p-4 mb-4'>
                        <input
                            type='text'
                            value={currentInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder='文字列を入力してください...'
                            className='w-full px-4 py-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500'
                        />
                    </div>

                    {/* ボタングループ */}
                    <div className='flex gap-3'>
                        <button
                            onClick={handleGenerate}
                            className='flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition'>
                            🌱 生成
                        </button>
                        <button
                            onClick={() => setIsSideMenuOpen(true)}
                            className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition'>
                            ⚙️ 設定
                        </button>
                    </div>
                </div>
            </div>

            {/* 右下スクロールボタン */}
            <div className='absolute bottom-24 right-8 pointer-events-auto'>
                <button
                    onClick={scrollToBottom}
                    className='w-14 h-14 bg-gray-800 bg-opacity-80 backdrop-blur hover:bg-gray-700 text-white rounded-full shadow-lg transition flex items-center justify-center'
                    title='ページ下部へ移動'>
                    <svg
                        className='w-6 h-6'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 14l-7 7m0 0l-7-7m7 7V3'
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
