"use client";

import { useStore } from "@/store/store";
import { TREE_TYPE_LABELS } from "@/lib/trees/common/types";

export function SideMenu() {
    const isSideMenuOpen = useStore((state) => state.isSideMenuOpen);
    const setIsSideMenuOpen = useStore((state) => state.setIsSideMenuOpen);
    const treeType = useStore((state) => state.treeType);
    const setTreeType = useStore((state) => state.setTreeType);
    const config = useStore((state) => state.config);
    const setConfig = useStore((state) => state.setConfig);
    const generateBonsai = useStore((state) => state.generateBonsai);
    const inputValue = useStore((state) => state.inputValue);

    return (
        <>
            {/* オーバーレイ */}
            {isSideMenuOpen && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-20 z-30'
                    onClick={() => setIsSideMenuOpen(false)}
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
                            onClick={() => setIsSideMenuOpen(false)}
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
                                            | "burningSpring",
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
                            </select>
                        </div>

                        {/* ノードサイズ */}
                        <div>
                            <label className='block text-gray-300 text-sm font-medium mb-2'>
                                ノードサイズ: {config.nodeSize.toFixed(2)}
                            </label>
                            <input
                                type='range'
                                min='0.5'
                                max='3'
                                step='0.1'
                                value={config.nodeSize}
                                onChange={(e) =>
                                    setConfig({
                                        nodeSize: parseFloat(e.target.value),
                                    })
                                }
                                className='w-full'
                            />
                        </div>

                        {/* ライト強度 */}
                        <div>
                            <label className='block text-gray-300 text-sm font-medium mb-2'>
                                ライト強度: {config.lightIntensity.toFixed(2)}
                            </label>
                            <input
                                type='range'
                                min='0.5'
                                max='2'
                                step='0.1'
                                value={config.lightIntensity}
                                onChange={(e) =>
                                    setConfig({
                                        lightIntensity: parseFloat(
                                            e.target.value,
                                        ),
                                    })
                                }
                                className='w-full'
                            />
                        </div>

                        {/* 背景色 */}
                        <div>
                            <label className='block text-gray-300 text-sm font-medium mb-2'>
                                背景色
                            </label>
                            <input
                                type='color'
                                value={config.backgroundColor}
                                onChange={(e) =>
                                    setConfig({
                                        backgroundColor: e.target.value,
                                    })
                                }
                                className='w-full h-10 rounded cursor-pointer'
                            />
                            <p className='text-gray-400 text-xs mt-1'>
                                {config.backgroundColor}
                            </p>
                        </div>
                    </div>

                    {/* リセットボタン */}
                    <button
                        onClick={() =>
                            setConfig({
                                nodeSize: 1,
                                lightIntensity: 1,
                                backgroundColor: "#1a1a1a",
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
