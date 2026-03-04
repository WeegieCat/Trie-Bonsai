/**
 * パトリシア木（Radix Tree）のノードクラス
 *
 * パトリシア木の特徴：
 * - エッジにラベル（文字列）を持つ
 * - 分岐のないパスを圧縮してメモリ効率を向上
 */
export class PatriciaNode {
    /**
     * このノードに至るエッジのラベル（圧縮された文字列）
     * ルートノードの場合は空文字列
     */
    edgeLabel: string;

    /**
     * 子ノード（エッジラベルの最初の文字でインデックス）
     */
    children: Map<string, PatriciaNode>;

    /**
     * 単語の終端を示すフラグ
     */
    isEndOfWord: boolean;

    /**
     * 3D可視化用の一意なID
     */
    id: string;

    constructor(edgeLabel: string, id: string) {
        this.edgeLabel = edgeLabel;
        this.children = new Map();
        this.isEndOfWord = false;
        this.id = id;
    }

    /**
     * ルートノードかどうかを判定
     */
    get isRoot(): boolean {
        return this.edgeLabel === "";
    }
}
