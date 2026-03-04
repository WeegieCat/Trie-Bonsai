"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/store";
import { TREE_TYPE_LABELS } from "@/lib/trees/common/types";
import { getGradientStartColor } from "@/lib/gradients";
import { HelpModal } from "./HelpModal";

type HelpTopic = "treeType" | "gradient" | null;

export function SideMenu() {
    const isSideMenuOpen = useStore((state) => state.isSideMenuOpen);
    const setIsSideMenuOpen = useStore((state) => state.setIsSideMenuOpen);
    const treeType = useStore((state) => state.treeType);
    const setTreeType = useStore((state) => state.setTreeType);
    const config = useStore((state) => state.config);
    const setConfig = useStore((state) => state.setConfig);
    const generateBonsai = useStore((state) => state.generateBonsai);
    const inputValue = useStore((state) => state.inputValue);
    const [helpTopic, setHelpTopic] = useState<HelpTopic>(null);
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const hideHelpTimerRef = useRef<number | null>(null);

    const openHelp = (topic: Exclude<HelpTopic, null>) => {
        if (hideHelpTimerRef.current) {
            window.clearTimeout(hideHelpTimerRef.current);
            hideHelpTimerRef.current = null;
        }
        setHelpTopic(topic);
        requestAnimationFrame(() => setIsHelpVisible(true));
    };

    const closeHelp = () => {
        setIsHelpVisible(false);
        hideHelpTimerRef.current = window.setTimeout(() => {
            setHelpTopic(null);
            hideHelpTimerRef.current = null;
        }, 240);
    };

    useEffect(() => {
        return () => {
            if (hideHelpTimerRef.current) {
                window.clearTimeout(hideHelpTimerRef.current);
            }
        };
    }, []);

    return (
        <>
            {/* オーバーレイ */}
            {isSideMenuOpen && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-20 z-30'
                    onClick={() => {
                        setIsSideMenuOpen(false);
                        closeHelp();
                    }}
                />
            )}

            {/* 左側説明パネル */}
            {isSideMenuOpen && (
                <HelpModal
                    topic={helpTopic}
                    isVisible={isHelpVisible}
                    onClose={closeHelp}
                />
            )}

            {/* サイドメニュー */}
            <div
                className={`fixed top-0 right-0 h-screen w-80 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${
                    isSideMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}>
                <div className='p-6'>
                    {/* ヘッダー */}
                    <div className='flex justify-between items-center mb-8'>
                        <h2 className='text-2xl font-bold text-white'>設定</h2>
                        <button
                            onClick={() => {
                                setIsSideMenuOpen(false);
                                closeHelp();
                            }}
                            className='text-gray-400 hover:text-white text-2xl'>
                            ✕
                        </button>
                    </div>

                    {/* 設定項目 */}
                    <div className='space-y-6'>
                        {/* 木の種類選択 */}
                        <div>
                            <label className='block text-gray-300 text-sm font-medium mb-2'>
                                🌳 木の種類
                            </label>
                            <select
                                value={treeType}
                                onChange={(e) => {
                                    const newType = e.target.value as
                                        | "trie"
                                        | "patricia"
                                        | "suffix";
                                    setTreeType(newType);
                                    // 木タイプを変更したら、現在の入力で再生成
                                    if (inputValue) {
                                        generateBonsai(inputValue);
                                    }
                                }}
                                className='w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                <option value='trie'>
                                    プレフィックス木(接頭辞木)
                                </option>
                                <option value='patricia'>
                                    パトリシア木(基数木)
                                </option>
                                <option value='suffix'>
                                    サフィックス木(接尾辞木)
                                </option>
                            </select>
                            <p className='text-gray-400 text-xs mt-2'>
                                {TREE_TYPE_LABELS[treeType]}
                            </p>
                            <button
                                onClick={() => openHelp("treeType")}
                                className='text-green-300 hover:text-green-200 text-xs mt-1'>
                                木の種類についての解説
                            </button>
                        </div>

                        {/* ノードグラデーション */}
                        <div>
                            <label className='block text-gray-300 text-sm font-medium mb-2'>
                                ノードグラデーション
                            </label>
                            <select
                                value={config.nodeGradientPreset}
                                onChange={(e) =>
                                    setConfig({
                                        nodeGradientPreset: e.target.value as
                                            | "dustyGrass"
                                            | "newLife"
                                            | "blessing"
                                            | "lemonGate"
                                            | "oldHat"
                                            | "wideMatrix"
                                            | "burningSpring"
                                            | "mochiHoppe",
                                    })
                                }
                                className='w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                <option value='dustyGrass'>Dusty Grass</option>
                                <option value='newLife'>New Life</option>
                                <option value='blessing'>Blessing</option>
                                <option value='lemonGate'>Lemon Gate</option>
                                <option value='oldHat'>Old Hat</option>
                                <option value='wideMatrix'>Wide Matrix</option>
                                <option value='burningSpring'>
                                    Burning Spring
                                </option>
                                <option value='mochiHoppe'>Mochi Hoppe</option>
                            </select>
                            <button
                                onClick={() => openHelp("gradient")}
                                className='text-xs mt-2 hover:opacity-80 transition-opacity'
                                style={{
                                    color: getGradientStartColor(
                                        config.nodeGradientPreset as
                                            | "dustyGrass"
                                            | "newLife"
                                            | "blessing"
                                            | "lemonGate"
                                            | "oldHat"
                                            | "wideMatrix"
                                            | "burningSpring"
                                            | "mochiHoppe",
                                    ),
                                }}>
                                ノードグラデーションの種類における解説
                            </button>
                        </div>

                        {/* 背景タイプ */}
                        <div>
                            <label className='block text-gray-300 text-sm font-medium mb-2'>
                                背景タイプ
                            </label>
                            <div className='flex gap-2'>
                                <button
                                    onClick={() =>
                                        setConfig({ backgroundType: "stars" })
                                    }
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                        config.backgroundType === "stars"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}>
                                    ❄ 雪
                                </button>
                                <button
                                    onClick={() =>
                                        setConfig({ backgroundType: "dawn" })
                                    }
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                        config.backgroundType === "dawn"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}>
                                    🌅 夜明け
                                </button>
                                <button
                                    onClick={() =>
                                        setConfig({ backgroundType: "solid" })
                                    }
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                        config.backgroundType === "solid"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}>
                                    ⬛ 単色
                                </button>
                            </div>
                            <p className='text-gray-400 text-xs mt-2'>
                                {config.backgroundType === "stars"
                                    ? "❄️ 移動する雪の背景"
                                    : config.backgroundType === "dawn"
                                      ? "🌅 夜明けのグラデーション背景"
                                      : "⬛ 単色の背景"}
                            </p>
                        </div>
                    </div>

                    {/* リセットボタン */}
                    <button
                        onClick={() =>
                            setConfig({
                                backgroundType: "stars",
                                nodeGradientPreset: "dustyGrass",
                            })
                        }
                        className='w-full mt-8 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition'>
                        🔄 リセット
                    </button>
                </div>
            </div>
        </>
    );
}
