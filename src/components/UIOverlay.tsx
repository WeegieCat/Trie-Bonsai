"use client";

import { useState } from "react";
import { useStore } from "@/store/store";

const BONSAI_TITLES = {
    trie: "🌳 Prefix Bonsai",
    patricia: "🌲 Patricia Bonsai",
    suffix: "🍂 Suffix Bonsai",
} as const;

export function UIOverlay() {
    const [currentInput, setCurrentInput] = useState("");
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isDownloadModalAnimating, setIsDownloadModalAnimating] =
        useState(false);
    const [downloadPreviewImage, setDownloadPreviewImage] = useState("");
    const [isOverlayHidden, setIsOverlayHidden] = useState(false);
    const setInputValue = useStore((state) => state.setInputValue);
    const generateBonsai = useStore((state) => state.generateBonsai);
    const treeType = useStore((state) => state.treeType);
    const setIsSideMenuOpen = useStore((state) => state.setIsSideMenuOpen);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentInput(e.target.value);
    };

    const handleGenerate = () => {
        const trimmedInput = currentInput.trim();
        if (trimmedInput) {
            setInputValue(trimmedInput);
            generateBonsai(trimmedInput);
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

    const resetCameraToDefault = useStore(
        (state) => state.resetCameraToDefault,
    );

    const captureCanvasScreenshot = () => {
        const canvas = document.querySelector("canvas");
        if (!canvas) {
            return "";
        }

        return canvas.toDataURL("image/png");
    };

    const handleDownloadImage = async () => {
        const canvas = document.querySelector("canvas");
        if (!canvas) {
            return;
        }

        // カメラをデフォルト位置にリセット
        if (resetCameraToDefault) {
            resetCameraToDefault();
            // レンダリングが完了するまで少し待機
            await new Promise((resolve) => setTimeout(resolve, 300));
        }

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `bonsai-${Date.now()}.png`;
        link.click();
    };

    const handleOpenDownloadModal = () => {
        setDownloadPreviewImage(captureCanvasScreenshot());
        setIsDownloadModalAnimating(true);
        setIsDownloadModalOpen(true);
    };

    const handleCloseDownloadModal = () => {
        setIsDownloadModalAnimating(false);
        setTimeout(() => {
            setIsDownloadModalOpen(false);
        }, 300);
    };

    const handleConfirmDownload = () => {
        handleDownloadImage();
        handleCloseDownloadModal();
    };

    return (
        <>
            <div className='absolute inset-0 pointer-events-none'>
                {/* トップバー */}
                <div
                    className={`absolute top-0 left-0 right-0 p-6 transition-all duration-500 ease-in-out ${
                        isOverlayHidden
                            ? "-translate-y-10 opacity-0 pointer-events-none"
                            : "translate-y-0 opacity-100 pointer-events-auto"
                    }`}>
                    <div className='max-w-2xl mx-auto'>
                        {/* タイトル */}
                        <h1 className='text-4xl font-bold text-white mb-6 text-center'>
                            {BONSAI_TITLES[treeType]}
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

                {/* 右下ボタングループ */}
                <div className='absolute bottom-24 right-8 pointer-events-auto flex items-center gap-3'>
                    <button
                        onClick={() => setIsOverlayHidden((prev) => !prev)}
                        className='px-4 h-14 bg-gray-800 bg-opacity-80 backdrop-blur hover:bg-gray-700 text-white rounded-full shadow-lg transition flex items-center justify-center font-bold'
                        title={
                            isOverlayHidden
                                ? "UIOverlayを元に戻す"
                                : "全体像を確認"
                        }>
                        {isOverlayHidden ? "戻す" : "全体像"}
                    </button>

                    <div
                        className={`flex items-center gap-3 transition-all duration-500 ease-in-out ${
                            isOverlayHidden
                                ? "translate-x-6 opacity-0 pointer-events-none"
                                : "translate-x-0 opacity-100"
                        }`}>
                        <button
                            onClick={handleOpenDownloadModal}
                            className='w-14 h-14 bg-gray-800 bg-opacity-80 backdrop-blur hover:bg-gray-700 text-white rounded-full shadow-lg transition flex items-center justify-center'
                            title='盆栽を画像保存'>
                            <svg
                                className='w-6 h-6'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 16V4m0 12l-4-4m4 4l4-4M5 20h14'
                                />
                            </svg>
                        </button>
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
            </div>

            {isDownloadModalOpen && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 transition-opacity duration-300 ${
                        isDownloadModalAnimating ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={handleCloseDownloadModal}>
                    <div
                        className={`w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-2xl border border-gray-700 transform transition-all duration-300 ease-out ${
                            isDownloadModalAnimating
                                ? "translate-y-0 opacity-100"
                                : "-translate-y-12 opacity-0"
                        }`}
                        onClick={(e) => e.stopPropagation()}>
                        <h3 className='text-2xl font-bold text-white mb-3 text-center'>
                            画像を保存しますか？
                        </h3>

                        {downloadPreviewImage ? (
                            <img
                                src={downloadPreviewImage}
                                alt='作成した盆栽のプレビュー画像'
                                className='w-full h-56 object-cover rounded-lg mb-4'
                            />
                        ) : (
                            <div className='w-full h-56 rounded-lg mb-4 bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 text-sm'>
                                プレビューを取得できませんでした
                            </div>
                        )}

                        <p className='text-gray-300 text-sm text-center mb-6'>
                            現在表示中の盆栽をPNG画像としてダウンロードします。
                        </p>

                        <div className='flex gap-3'>
                            <button
                                onClick={handleCloseDownloadModal}
                                className='flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition'>
                                キャンセル
                            </button>
                            <button
                                onClick={handleConfirmDownload}
                                className='flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition'>
                                保存する
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
