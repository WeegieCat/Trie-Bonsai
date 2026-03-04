"use client";

import { useState, useEffect } from "react";

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
}

export function PostModal({ isOpen, onClose, onSubmit }: PostModalProps) {
    const [bonsaiName, setBonsaiName] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);

            let isCanceled = false;
            const captureScreenshot = async () => {
                await new Promise((resolve) => requestAnimationFrame(resolve));
                const canvas = document.querySelector("canvas");

                if (!canvas || isCanceled) {
                    if (!isCanceled) {
                        setPreviewImage("");
                    }
                    return;
                }

                setPreviewImage(canvas.toDataURL("image/png"));
            };

            captureScreenshot();

            return () => {
                isCanceled = true;
            };
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!bonsaiName.trim()) return;
        onSubmit(bonsaiName);
        setBonsaiName("");
    };

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setBonsaiName("");
            setPreviewImage("");
            onClose();
        }, 300); // アニメーション時間と同期
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 transition-opacity duration-300 ${
                isAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}>
            <div
                className={`w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-2xl border border-gray-700 transform transition-all duration-300 ease-out ${
                    isAnimating
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-12 opacity-0"
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
                        className='flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition'>
                        キャンセル
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!bonsaiName.trim()}
                        className='flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:text-gray-300 text-white font-bold rounded-lg transition'>
                        投稿する
                    </button>
                </div>
            </div>
        </div>
    );
}
