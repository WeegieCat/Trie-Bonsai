"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/store";

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; imageDataUrl: string }) => void;
    isSubmitting?: boolean;
}

export function PostModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
}: PostModalProps) {
    const [bonsaiName, setBonsaiName] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const config = useStore((state) => state.config);
    const setConfig = useStore((state) => state.setConfig);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);

            let isCanceled = false;
            const captureScreenshot = async () => {
                // 背景が雪や夜明の場合、一時的に単色に変更
                const originalBackgroundType = config.backgroundType;
                const needsBackgroundChange =
                    originalBackgroundType === "stars" ||
                    originalBackgroundType === "dawn";

                if (needsBackgroundChange) {
                    setConfig({ backgroundType: "solid" });
                    // 背景変更の反映を待つ
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }

                await new Promise((resolve) => requestAnimationFrame(resolve));
                const canvas = document.querySelector("canvas");

                if (!canvas || isCanceled) {
                    if (!isCanceled) {
                        setPreviewImage("");
                    }
                    // 背景を元に戻す
                    if (needsBackgroundChange) {
                        setConfig({ backgroundType: originalBackgroundType });
                    }
                    return;
                }

                setPreviewImage(canvas.toDataURL("image/png"));

                // 背景を元に戻す
                if (needsBackgroundChange) {
                    setConfig({ backgroundType: originalBackgroundType });
                }
            };

            captureScreenshot();

            return () => {
                isCanceled = true;
            };
        }
    }, [isOpen, config.backgroundType, setConfig]);

    const handleSubmit = () => {
        if (!bonsaiName.trim() || !previewImage) return;
        onSubmit({ name: bonsaiName, imageDataUrl: previewImage });
        setBonsaiName("");
    };

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setBonsaiName("");
            setPreviewImage("");
            onClose();
        }, 500); // アニメーション時間と同期
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 transition-opacity duration-500 ${
                isAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}>
            <div
                className={`w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-2xl border border-gray-700 transform transition-all duration-500 ease-in-out ${
                    isAnimating
                        ? "translate-y-0 opacity-100 scale-100"
                        : "-translate-y-32 opacity-0 scale-95"
                }`}
                onClick={(e) => e.stopPropagation()}>
                <h3 className='text-2xl font-bold text-white mb-4 text-center'>
                    投稿内容の確認
                </h3>

                {previewImage ? (
                    <img
                        src={previewImage}
                        alt='作成した盆栽のプレビュー画像'
                        className='w-full h-56 object-cover rounded-lg mb-4'
                    />
                ) : (
                    <div className='w-full h-56 rounded-lg mb-4 bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 text-sm'>
                        プレビューを取得できませんでした
                    </div>
                )}

                <label className='block text-sm text-gray-300 mb-2'>
                    盆栽の名前
                </label>
                <input
                    type='text'
                    value={bonsaiName}
                    onChange={(e) => setBonsaiName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder='作品名を入力してください'
                    className='w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 mb-5'
                />

                <div className='flex gap-3'>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className='flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-lg transition'>
                        キャンセル
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!bonsaiName.trim() || isSubmitting}
                        className='flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition'>
                        {isSubmitting ? "投稿中..." : "投稿する"}
                    </button>
                </div>
            </div>
        </div>
    );
}
