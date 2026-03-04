"use client";

type HelpTopic = "treeType" | "gradient" | null;

interface HelpModalProps {
    topic: HelpTopic;
    isVisible: boolean;
    onClose: () => void;
}

const GRADIENT_SHOWCASE = [
    {
        name: "Dusty Grass",
        colors: "linear-gradient(90deg, #d4fc79 0%, #96e6a1 100%)",
        description:
            "黄緑色から優しいグリーンへ移行する、自然で落ち着いた配色。草原のような穏やかさを感じさせます。",
    },
    {
        name: "New Life",
        colors: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
        description:
            "生命感のあるグリーンからシアン色へ移る、清涼感の高い配色。新しい始まりを表現します。",
    },
    {
        name: "Blessing",
        colors: "linear-gradient(90deg, #fddb92 0%, #d1fdff 100%)",
        description:
            "温かいオレンジから冷たいシアンブルーへ、昼と夜の光を表現する穏やかなグラデーション。",
    },
    {
        name: "Lemon Gate",
        colors: "linear-gradient(90deg, #96fbc4 0%, #f9f586 100%)",
        description:
            "爽やかなミント緑から明るいレモンイエローへ変化する、活発で元気な印象の配色です。",
    },
    {
        name: "Old Hat",
        colors: "linear-gradient(90deg, #e4afcb 0%, #b8cbb8 25%, #e2c58b 50%, #c2ce9c 75%, #7edbdc 100%)",
        description:
            "くすみ系の5色グラデーション。懐かしく上品な雰囲気で、複雑な階層構造を繊細に表現します。",
    },
    {
        name: "Wide Matrix",
        colors: "linear-gradient(90deg, #fcc5e4 0%, #fda34b 16.67%, #ff7882 33.33%, #c8699e 50%, #7046aa 66.67%, #0c1db8 83.33%, #020f75 100%)",
        description:
            "ピンクから深紫へ至る7色の大胆なグラデーション。色の多様性により深い階層をはっきりと区別できます。",
    },
    {
        name: "Burning Spring",
        colors: "linear-gradient(90deg, #4fb576 0%, #44c489 14.29%, #28a9ae 28.57%, #28a2b7 42.86%, #4c7788 57.14%, #6c4f63 71.43%, #432c39 100%)",
        description:
            "緑から暗い藍色へ移行する7色グラデーション。季節の変化を表現し、根から葉への成長過程が直感的に伝わります。",
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
