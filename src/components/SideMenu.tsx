"use client";

import { useStore } from "@/store/store";

export function SideMenu() {
    const isSideMenuOpen = useStore((state) => state.isSideMenuOpen);
    const setIsSideMenuOpen = useStore((state) => state.setIsSideMenuOpen);
    const config = useStore((state) => state.config);
    const setConfig = useStore((state) => state.setConfig);

    return (
        <>
            {/* オーバーレイ */}
            {isSideMenuOpen && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 z-30'
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
                        {/* ノード色 */}
                        <div>
                            <label className='block text-gray-300 text-sm font-medium mb-2'>
                                ノード色
                            </label>
                            <input
                                type='color'
                                value={config.nodeColor}
                                onChange={(e) =>
                                    setConfig({ nodeColor: e.target.value })
                                }
                                className='w-full h-10 rounded cursor-pointer'
                            />
                            <p className='text-gray-400 text-xs mt-1'>
                                {config.nodeColor}
                            </p>
                        </div>

                        {/* エッジ色 */}
                        <div>
                            <label className='block text-gray-300 text-sm font-medium mb-2'>
                                エッジ色
                            </label>
                            <input
                                type='color'
                                value={config.edgeColor}
                                onChange={(e) =>
                                    setConfig({ edgeColor: e.target.value })
                                }
                                className='w-full h-10 rounded cursor-pointer'
                            />
                            <p className='text-gray-400 text-xs mt-1'>
                                {config.edgeColor}
                            </p>
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
                                nodeColor: "#4CAF50",
                                edgeColor: "#8B7355",
                                nodeSize: 1,
                                lightIntensity: 1,
                                backgroundColor: "#1a1a1a",
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
