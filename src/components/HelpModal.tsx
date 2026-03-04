"use client";

type HelpTopic = "treeType" | "gradient" | null;

interface HelpModalProps {
    topic: HelpTopic;
    isVisible: boolean;
    onClose: () => void;
}

const GRADIENT_SHOWCASE = [
    {
        name: "Lemon Gate",
        colors: "linear-gradient(90deg, #8ee3a1 0%, #8ec5fc 50%, #ffde7a 100%)",
        description:
            "爽やかなミントグリーンから柔らかいブルーを経て、明るいレモンイエローへ変化します。",
    },
    {
        name: "New Life",
        colors: "linear-gradient(90deg, #2af598 0%, #009efd 100%)",
        description:
            "生命感のあるグリーンからクリアなブルーへ移る、清涼感の高い配色です。",
    },
    {
        name: "Burning Spring",
        colors: "linear-gradient(90deg, #ff6a88 0%, #ff99ac 45%, #f9d423 100%)",
        description:
            "暖色系で構成された力強いグラデーションで、ノードの深さを印象的に表現します。",
    },
];

export function HelpModal({ topic, isVisible, onClose }: HelpModalProps) {
    if (!topic) return null;

    return (
        <div className='fixed inset-y-0 left-0 right-80 z-50 pointer-events-none flex items-center justify-center px-6'>
            <div
                className={`pointer-events-auto w-full max-w-3xl bg-slate-700/95 border border-slate-500 rounded-xl shadow-2xl backdrop-blur-sm transition-all duration-300 ease-out ${
                    isVisible
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-2 scale-95"
                }`}>
                <div className='flex items-center justify-between px-6 py-4 border-b border-slate-500'>
                    <h3 className='text-white text-4 font-bold'>
                        {topic === "treeType"
                            ? "木の種類について"
                            : "ノードグラデーションについて"}
                    </h3>
                    <button
                        onClick={onClose}
                        className='text-gray-300 hover:text-white text-2xl leading-none'>
                        ×
                    </button>
                </div>

                <div className='px-6 py-5 text-gray-200 text-sm leading-7 max-h-[70vh] overflow-y-auto space-y-5'>
                    {topic === "treeType" ? (
                        <>
                            <div>
                                <p className='text-cyan-300 font-bold text-lg'>
                                    プレフィックス木（接頭辞木）
                                </p>
                                <p>
                                    文字列の先頭から順に枝分かれして保存する基本的な木構造です。共通の接頭辞をまとめるため、検索候補の絞り込みに向いています。
                                </p>
                            </div>
                            <div>
                                <p className='text-emerald-300 font-bold text-lg'>
                                    パトリシア木（基数木）
                                </p>
                                <p>
                                    1文字ずつの中間ノードを圧縮し、連続した文字列を1本のエッジとして保持します。Trieよりノード数が少なくなりやすく、メモリ効率が高い構造です。
                                </p>
                            </div>
                            <div>
                                <p className='text-amber-300 font-bold text-lg'>
                                    サフィックス木（接尾辞木）
                                </p>
                                <p>
                                    文字列のすべての接尾辞を格納する構造です。部分一致の探索に強く、特定パターンが含まれるかを高速に確認できます。
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p>
                                ノードグラデーションは、木構造の階層を視覚的に表現するための配色機能です。根ノードから葉ノードへ向かって色が段階的に変化します。
                            </p>

                            {GRADIENT_SHOWCASE.map((preset) => (
                                <div key={preset.name}>
                                    <p className='text-yellow-300 font-bold text-lg mb-1'>
                                        {preset.name}
                                    </p>
                                    <div
                                        className='w-full h-11 rounded-md border border-slate-400/50'
                                        style={{
                                            background: preset.colors,
                                        }}
                                    />
                                    <p className='mt-2 text-gray-200'>
                                        {preset.description}
                                    </p>
                                </div>
                            ))}

                            <div className='bg-slate-600/50 border border-slate-500 rounded-md px-4 py-3'>
                                <p className='text-yellow-200 font-semibold mb-1'>
                                    💡 使い方のヒント
                                </p>
                                <p className='text-gray-200 text-xs leading-6'>
                                    グラデーションは木の深さレベルに応じて自動で割り当てられます。根に近いノードと葉に近いノードの色差が大きいほど、階層が把握しやすくなります。
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
